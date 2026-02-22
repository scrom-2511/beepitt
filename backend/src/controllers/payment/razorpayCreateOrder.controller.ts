import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { razorpay } from '../../services/razorpay/razorpayInstance';
import { RazorPayCreateOrderType } from '../../types/dataTypes';
import { ERROR_CODES, HttpStatus } from '../../types/errorCodes';

enum Tier {
  free = 'free',
  premium = 'premium',
}

export const razorpayCreateOrderController = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log(req.userId);
    const validateData = RazorPayCreateOrderType.safeParse(req.body);
    if (!validateData.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_INPUT.code,
          message: ERROR_CODES.INVALID_INPUT.message,
        },
      });
    }

    const variant = validateData.data.id === Tier.free ? 0 : 5;

    const order = await razorpay.orders.create({
      amount: 90 * variant * 100,
      currency: 'INR',
      receipt: `receipt-${Date.now()}`,
      notes: {
        userId: req.userId?.toString() || '',
      },
    });

    const newOrder = await prisma.orders.create({
      data: {
        amount: Number(order.amount),
        note: JSON.stringify(order.notes),
        razorPayOrderId: order.id,
        status: 'Pending',
        userId: req.userId!,
      },
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        currency: order.currency,
        amount: order.amount,
        dbOrderId: newOrder.id,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR.code,
        message: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
      },
    });
    return;
  }
};
