import { Prisma } from '../../generated/prisma/client';
import { ProjectGetPayload } from '../../generated/prisma/models';

export type UserWithOtherDetails = Prisma.UserGetPayload<{
  include: {
    billing: true;
    configuration: true;
    project: {
      include: { contactDetails: true };
    };
  };
}>;

export type ProjectType = ProjectGetPayload<{ include: { contactDetails: true } }>;

export type Event = Prisma.EventGetPayload<{}>;
