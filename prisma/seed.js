const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@businessmaster.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@businessmaster.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      isVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create Subjects
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Sinhala',
    'Tamil',
    'Science',
    'History',
    'Geography',
    'ICT',
    'Commerce',
    'Accounting',
    'Economics',
    'Business Studies',
  ];

  for (const name of subjects) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name, isActive: true },
    });
  }

  console.log(`✅ Created ${subjects.length} subjects`);

  // Create Grades
  const grades = [
    { name: 'Grade 1', level: 'PRIMARY' },
    { name: 'Grade 2', level: 'PRIMARY' },
    { name: 'Grade 3', level: 'PRIMARY' },
    { name: 'Grade 4', level: 'PRIMARY' },
    { name: 'Grade 5', level: 'PRIMARY' },
    { name: 'Grade 6', level: 'SECONDARY' },
    { name: 'Grade 7', level: 'SECONDARY' },
    { name: 'Grade 8', level: 'SECONDARY' },
    { name: 'Grade 9', level: 'SECONDARY' },
    { name: 'Grade 10', level: 'SECONDARY' },
    { name: 'Grade 11', level: 'SECONDARY' },
    { name: 'O/L', level: 'SECONDARY' },
    { name: 'A/L', level: 'ADVANCED' },
  ];

  for (const grade of grades) {
    await prisma.grade.upsert({
      where: { name: grade.name },
      update: {},
      create: grade,
    });
  }

  console.log(`✅ Created ${grades.length} grades`);

  // Create System Settings
  const settings = [
    { key: 'SESSION_PRICE', value: '4000' },
    { key: 'TUTOR_PERCENTAGE', value: '50' },
    { key: 'PLATFORM_PERCENTAGE', value: '50' },
    { key: 'MIN_PAYOUT_AMOUNT', value: '10000' },
    { key: 'MATCH_REQUEST_EXPIRY_HOURS', value: '24' },
    { key: 'MAX_TUTORS_TO_NOTIFY', value: '10' },
  ];

  for (const setting of settings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log(`✅ Created ${settings.length} system settings`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

