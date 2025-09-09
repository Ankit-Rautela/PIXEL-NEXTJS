import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = 'Password123!';
  const hashed = await hash(password, 10);

  const [manager, user] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'manager@example.com' },
      update: {},
      create: { email: 'manager@example.com', name: 'Manager', role: 'MANAGER', hashedPassword: hashed },
    }),
    prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: { email: 'user@example.com', name: 'User', role: 'USER', hashedPassword: hashed },
    }),
  ]);

  await prisma.workOrder.createMany({
    data: [
      { title: 'Leaking tap', description: 'Room 101', priority: 'MED', status: 'OPEN', createdById: user.id, assignedToId: manager.id },
      { title: 'Broken light', description: 'Hallway', priority: 'LOW', status: 'IN_PROGRESS', createdById: manager.id, assignedToId: manager.id }
    ]
  });

  console.log('Seed complete: test users + sample orders');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => prisma.$disconnect());
