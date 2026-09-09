import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
const email = 'admin@happypaws.com';
const password = 'Admin123!';

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { fullName: 'Administrador Happy Paws', passwordHash, role: UserRole.ADMIN },
    create: { email, fullName: 'Administrador Happy Paws', passwordHash, role: UserRole.ADMIN }
  });

  console.log(`Usuario administrador listo: ${user.email}`);
}

main()
  .catch((error: unknown) => {
    console.error('No se pudo crear el usuario administrador.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
