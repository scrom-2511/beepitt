import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { razorpay } from '../../services/razorpay/razorpayInstance';
import { RazorPayCreateOrderType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

enum Tier {
  free = 'free',
  starter = 'starter',
  pro = 'pro',
}

export const razorpayCreateOrderController = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    const validateData = RazorPayCreateOrderType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    let amount = 0;
    if (validateData.data.id === Tier.starter) {
      amount = 450 * 100; // 450 INR
    } else if (validateData.data.id === Tier.pro) {
      amount = 1200 * 100; // 1200 INR (example pro price)
    }

    const order = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt-${Date.now()}`,
      notes: {
        userId: req.userId?.toString() || '',
        tier: validateData.data.id,
      },
    });

    console.log(order);

    const newOrder = await prisma.orders.create({
      data: {
        amount: Number(order.amount),
        note: JSON.stringify(order.notes),
        razorPayOrderId: order.id,
        status: 'pending',
        userId: req.userId!,
      },
    });

    const dataToReturn = {
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      dbOrderId: newOrder.id,
      name: user.username,
      email: user.email,
    };

    successReturnCall(res, HttpStatus.OK, dataToReturn);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
