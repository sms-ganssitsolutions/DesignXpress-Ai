import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DesignXpress AI database...');

  // Demo user
  const passwordHash = await bcrypt.hash('demo123456', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@designxpress.ai' },
    update: {},
    create: {
      email: 'demo@designxpress.ai',
      name: 'Alex Rivera',
      passwordHash,
      role: 'user',
    },
  });

  console.log('✓ Created demo user:', demoUser.email);

  // Demo Project
  const demoProject = await prisma.project.create({
    data: {
      title: "Neon Requiem",
      description: "A cinematic AI-generated short film about memory and loss in a cyberpunk future.",
      userId: demoUser.id,
      status: "draft",
      thumbnail: "/uploads/temp/neon-requiem-thumb.jpg",
    },
  });

  console.log('✓ Created demo project:', demoProject.title);

  // Sample Scenes
  await prisma.scene.createMany({
    data: [
      {
        projectId: demoProject.id,
        order: 1,
        title: "Opening - The Rain",
        description: "Neon reflections on wet streets. A hooded figure walks alone.",
        duration: 12,
        startTime: 0,
        script: "In the city that never sleeps, some memories refuse to die.",
      },
      {
        projectId: demoProject.id,
        order: 2,
        title: "The Transmission",
        description: "She receives a mysterious holographic message from her past self.",
        duration: 18,
        startTime: 12,
        script: "I don't know if this will reach you... but you have to remember who you were.",
      },
    ],
  });

  console.log('✓ Created sample scenes');

  // Sample AI Requests
  await prisma.aIRequest.create({
    data: {
      userId: demoUser.id,
      projectId: demoProject.id,
      type: 'story',
      prompt: 'Cyberpunk story about memory and identity',
      status: 'completed',
      result: {
        logline: "A woman in a neon-soaked megacity must decide whether to erase her painful memories or embrace the pain that makes her human.",
      },
    },
  });

  console.log('✓ Created sample AI requests');

  console.log('\n✅ Seeding complete!\n');
  console.log('Demo login:');
  console.log('  Email: demo@designxpress.ai');
  console.log('  Password: demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
