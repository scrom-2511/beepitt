import { prisma } from './src/database/prismaClient';

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Project'`;
    console.log('Project table columns:', result);
    
    const contactResult = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'ContactDetails'`;
    console.log('ContactDetails table columns:', contactResult);
  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
