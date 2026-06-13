import { prisma } from '../../database/prismaClient';
import {
  Project,
  ProjectWithContactDetails,
  UserWithBillingConfigurationProject,
  UserWithBillingConfigurationProjectContactDetails,
} from '../../types/prismaTypes';

export function hasUserWithProjectContactDetails(
  user: UserWithBillingConfigurationProject | UserWithBillingConfigurationProjectContactDetails,
): user is UserWithBillingConfigurationProjectContactDetails {
  return (
    user.project.length > 0 &&
    'contactDetails' in user.project[0]
  );
}

export function hasProjectContactDetails(
  project: Project | ProjectWithContactDetails,
): project is ProjectWithContactDetails {
  return 'contactDetails' in project;
}

export const getProjectByProjectName = (
  projectName: string,
  user: UserWithBillingConfigurationProjectContactDetails | UserWithBillingConfigurationProject,
): Project | ProjectWithContactDetails | undefined | null => {
  // Find the project. If exists return the project, else return undefined
  if (hasUserWithProjectContactDetails(user)) {
    return user.project.find((project) => project.projectName.toLowerCase() === projectName.toLowerCase()) as ProjectWithContactDetails;
  }
  return user.project.find((project) => project.projectName.toLowerCase() === projectName.toLowerCase()) as Project;
};
