import { prisma } from '../../database/prismaClient';

export const projectExistsChecker = async (projectName: string, userId: number): Promise<boolean> => {
  const project = await prisma.project.findFirst({
    where: {
      userId,
      projectName: {
        equals: projectName,
        mode: 'insensitive',
      },
    },
  });

  return !!project;
};
