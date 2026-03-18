// import { Request, Response } from 'express';
// import { prisma } from '../database/prismaClient';
// import { projectExistsChecker } from '../helpers/project/getProjectByProjectName.helper.';
// import { chatIdsCheckerAndNotificationEnque } from '../helpers/project/notificationChannelChatIdsCheckerAndGetter.helper';
// import { errorReturnCall } from '../helpers/returnCall/error.returnCall';
// import { successReturnCall } from '../helpers/returnCall/success.returnCall';
// import { eventCountChecker } from '../helpers/user/eventCountChecker.helper';
// import { onClientIssueType } from '../types/dataTypes';
// import { ErrorCode, HttpStatus } from '../types/errorCodes';

// export const onClientIssueWebhook = async (req: Request, res: Response) => {
//   try {
//     const validateData = onClientIssueType.safeParse(req.body);
//     console.log(req.body);

//     if (!validateData.success) {
//       errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
//       return;
//     }

//     const userId = req.userId!;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         billing: true,
//         project: { include: { contactDetails: true } },
//       },
//     });

//     const normalizedProjectName = validateData.data.projectName.toLowerCase();

//     const projectExists = await projectExistsChecker(req, res, normalizedProjectName, user);

//     if (!projectExists) {
//       errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND);
//       return;
//     }

//     const eventCountExceeds = eventCountChecker(res, user);

//     if (eventCountExceeds) {
//       errorReturnCall(res, HttpStatus.FORBIDDEN, ErrorCode.EVENTS_LIMIT_REACHED);
//       return;
//     }

//     const { discordChatIdsPresent, telegramChatIdsPresent } = await chatIdsCheckerAndNotificationEnque(
//       req,
//       normalizedProjectName,
//       user,
//     );

//     await prisma.issue.create({
//       data: { ...validateData.data, userId, issuePriority: 'Unseen' },
//     });

//     if (!discordChatIdsPresent) {
//       errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.NO_DISCORD_ACCOUNT_LINKED);
//     } else if (!telegramChatIdsPresent) {
//       errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.NO_TELEGRAM_ACCOUNT_LINKED);
//     } else {
//       successReturnCall(res, HttpStatus.OK, null);
//     }

//     return;
//   } catch (error) {
//     errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
//     return;
//   }
// };
