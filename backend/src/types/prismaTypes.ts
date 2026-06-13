import { Prisma } from '../../generated/prisma/client';
import { ProjectGetPayload } from '../../generated/prisma/models';

export type UserWithBillingConfigurationProjectContactDetails = Prisma.UserGetPayload<{
  include: {
    billing: true;
    configuration: true;
    project: {
      include: { contactDetails: true };
    };
  };
}>;

export type UserWithBillingConfigurationProject = Prisma.UserGetPayload<{
  include: {
    billing: true;
    configuration: true;
    project: true;
  };
}>;

export type ProjectWithContactDetails = Prisma.ProjectGetPayload<{ include: { contactDetails: true } }>;

export type Project = ProjectGetPayload<{}>;

export type Event = Prisma.EventGetPayload<{}>;
