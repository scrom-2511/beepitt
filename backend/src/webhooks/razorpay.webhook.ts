import crypto from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
export const razorPayWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.get('x-razorpay-signature')!;
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      res.status(400).json({ success: false });
      return;
    }

    const entity = req.body.payload.payment.entity;

    if (req.body.event === 'payment.failed') {
      await prisma.orders.update({
        where: {
          razorPayOrderId: entity.order_id,
        },
        data: {
          status: 'Failed',
          razorPayPaymentId: entity.id,
        },
      });
      res.json({ success: false });
    }

    if (req.body.event === 'order.paid') {
      await prisma.orders.update({
        where: {
          razorPayOrderId: entity.order_id,
        },
        data: {
          status: 'Successful',
          razorPayPaymentId: entity.id,
        },
      });

      const userData = await prisma.user.findUnique({
        where: { id: Number(entity.notes.userId) },
        include: { billing: true },
      });

      const now = new Date();
      const baseDate = userData?.billing?.validTill! > now ? userData?.billing?.validTill! : now;

      const updatedValidTill = new Date(baseDate);
      updatedValidTill.setUTCDate(updatedValidTill.getUTCDate() + 30);

      await prisma.user.update({
        where: { id: Number(entity.notes.userId) },
        data: {
          billing: {
            update: {
              subscription_tier: 'Starter',
              currentStatus: 'Active',
              validTill: updatedValidTill,
            },
          },
        },
      });
      res.json({ success: true });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
    return;
  }
};

// {
//   "entity": "event",
//   "account_id": "acc_S5d2ICNguMnWni",
//   "event": "payment.captured",
//   "contains":
//     "payment"
//   ],
//   "payload":
//     "payment":
//       "entity":
//         "id": "pay_S5qQ2flZKKheIQ",
//         "entity": "payment",
//         "amount": 45000,
//         "currency": "INR",
//         "status": "captured",
//         "order_id": "order_S5qPlLINN5rCHN",
//         "invoice_id": null,
//         "international": false,
//         "method": "upi",
//         "amount_refunded": 0,
//         "refund_status": null,
//         "captured": true,
//         "description": "Test Transaction",
//         "card_id": null,
//         "bank": null,
//         "wallet": null,
//         "vpa": "success@razorpay",
//         "email": "gaurav.kumar@example.com",
//         "contact": "+919000090000",
//         "notes":
//           "userId": "1",
//           "address": "Razorpay Corporate Office"
//         },
//         "fee": 1062,
//         "tax": 162,
//         "error_code": null,
//         "error_description": null,
//         "error_source": null,
//         "error_step": null,
//         "error_reason": null,
//         "acquirer_data":
//           "rrn": "204725764991",
//           "upi_transaction_id": "4D0C665CB1ADD336609C9AD367EC807E"
//         },
//         "created_at": 1768849127📅 2026-01-19 18:58:47 UTC,
//         "reward": null,
//         "upi":
//           "vpa": "success@razorpay",
//           "flow": "collect"
//         },
//         "base_amount": 45000
//       }
//     }
//   },
//   "created_at": 1768849128📅 2026-01-19 18:58:48 UTC
// }
