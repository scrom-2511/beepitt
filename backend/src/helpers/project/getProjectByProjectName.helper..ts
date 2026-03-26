import {
  Project,
  ProjectWithContactDetails,
  UserWithBillingConfigurationProject,
  UserWithBillingConfigurationProjectContactDetails,
} from '../../types/prismaTypes';

export const getProjectByProjectName = (
  projectName: string,
  user: UserWithBillingConfigurationProjectContactDetails | UserWithBillingConfigurationProject,
): Project | ProjectWithContactDetails | undefined => {
  // Find the project. If exists return the project, else return undefined
  return user.project.find((project) => project.projectName.toLowerCase() === projectName.toLowerCase());
};
