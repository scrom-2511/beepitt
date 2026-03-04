import { Prisma } from '../../../generated/prisma/client';

type UserWithOtherDetails = Prisma.UserGetPayload<{
  include: { billing: true; project: true };
}>;

export const projectExistsChecker = (projectName: string, user: UserWithOtherDetails): boolean => {
  const projectExists = user.project.find((project) => project.projectName === projectName.toLowerCase());
  return projectExists ? true : false;
};
