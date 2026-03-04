import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { prisma } from '../../database/prismaClient';
import { getProjectByProjectName } from '../../helpers/project/getProjectByProjectName.helper.';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { CreateProjectType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const createProjectController = async (req: Request, res: Response) => {
  try {
    // Validate the data
    const validateData = CreateProjectType.safeParse(req.body);

    // Return if validation fails
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    // Get users id
    const userId = req.userId;

    // If id does not exist, return
    if (!userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Generate an identifier key
    const identifierKey = uuidv4();

    // Get user along with billing and project with contact details for each project
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { billing: true, project: { include: { contactDetails: true } } },
    });

    // If user does not exist return
    if (!user) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Get users subscription tier
    const userSubscriptionTier = user.billing?.subscription_tier;

    // Get max projects limit acc to the subscription tier
    const maxProjectsLimit = SUBSCRIPTION_LIMITS[userSubscriptionTier!].maxProjects;

    // If users project length >= max project limits return
    if (user.project.length >= maxProjectsLimit) {
      errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.PROJECT_LIMIT_REACHED_FREE);
      return;
    }

    // Check if a project already exists with the name
    const projectExists = getProjectByProjectName(validateData.data.projectName, user);

    // If project exists, return
    if (projectExists) {
      errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.PROJECT_ALREADY_EXISTS);
      return;
    }

    // Else create a project for the user
    await prisma.project.create({
      data: { identifierKey, projectName: validateData.data.projectName, userId },
    });

    successReturnCall(res, HttpStatus.OK, { message: 'Project created successfully!', identifierKey });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};

// validate data -> check projects length -> check project exists -> create project
