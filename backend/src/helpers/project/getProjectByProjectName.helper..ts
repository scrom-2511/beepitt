import { Prisma } from '../../../generated/prisma/client';
import { ProjectGetPayload } from '../../../generated/prisma/models';

type UserWithOtherDetails = Prisma.UserGetPayload<{
  include: {
    billing: true;
    project: {
      include: { contactDetails: true };
    };
  };
}>;

type ProjectType = ProjectGetPayload<{ include: { contactDetails: true } }>;

export const getProjectByProjectName = (projectName: string, user: UserWithOtherDetails): ProjectType | undefined => {
  // Find the project. If exists return the project, else return undefined
  return user.project.find((project) => project.projectName.toLowerCase() === projectName.toLowerCase());
};
