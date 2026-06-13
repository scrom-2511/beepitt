import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { RazorPayVerifyPaymentType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const razorpayVerifyPaymentController = async (req: Request, res: Response) => {
  try {
    const validateData = RazorPayVerifyPaymentType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = validateData.data;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
      return;
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    // Atomic update: only transition from pending to successful
    const updateResult = await prisma.orders.updateMany({
      where: { razorPayOrderId: razorpay_order_id, status: 'pending' },
      data: {
        razorPayPaymentId: razorpay_payment_id,
        status: 'successful',
      },
    });

    // If result.count is 0, it means the order was already processed (by webhook)
    if (updateResult.count === 1) {
      // Fetch the order with user details for billing update
      const order = await prisma.orders.findUnique({
        where: { razorPayOrderId: razorpay_order_id },
      });

      if (order) {
        // Extract tier from notes
        const notes = JSON.parse(order.note || '{}');
        const tier = notes.tier || 'starter';

        // Update Billing
        const existingBilling = await prisma.billing.findUnique({
          where: { userId: order.userId },
        });

        const now = new Date();
        const baseDate = existingBilling?.validTill && existingBilling.validTill > now 
          ? existingBilling.validTill 
          : now;

        const updatedValidTill = new Date(baseDate);
        updatedValidTill.setDate(updatedValidTill.getDate() + 30);

        await prisma.billing.upsert({
          where: { userId: order.userId },
          update: {
            subscription_tier: tier,
            currentStatus: 'active',
            validTill: updatedValidTill,
          },
          create: {
            userId: order.userId,
            subscription_tier: tier,
            currentStatus: 'active',
            validTill: updatedValidTill,
          },
        });
      }
    }

    successReturnCall(res, HttpStatus.OK, { message: 'Payment verified successfully' });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
