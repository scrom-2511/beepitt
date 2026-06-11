import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';

export const getIssueByIdController = async (req: Request, res: Response) => {
  const { issueId } = req.params;
  const userId = (req as any).userId;

  if (!issueId) {
    return res.status(400).json({ message: 'Missing issueId' });
  }

  try {
    const issue = await prisma.event.findFirst({
      where: {
        id: parseInt(issueId as string),
        userId: userId,
      },
    });

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found', success: false });
    }

    res.status(200).json({ issue, success: true });
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};
