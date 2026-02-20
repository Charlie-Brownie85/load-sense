import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9, 0, 0, 0);
  return d;
}

const sessions = [
  { date: daysAgo(0), type: "HIIT", duration: 45, rpe: 8, notes: "Tabata intervals, felt strong" },
  { date: daysAgo(1), type: "Strength", duration: 60, rpe: 6, notes: "Upper body focus" },
  { date: daysAgo(2), type: "Cardio", duration: 30, rpe: 3, notes: "Recovery jog" },
  { date: daysAgo(4), type: "Strength", duration: 55, rpe: 7, notes: "Leg day" },
  { date: daysAgo(5), type: "HIIT", duration: 40, rpe: 9, notes: "Sprint intervals" },
  { date: daysAgo(7), type: "Cardio", duration: 45, rpe: 5, notes: "Steady state run" },
  { date: daysAgo(8), type: "Strength", duration: 50, rpe: 6, notes: "Push/pull split" },
  { date: daysAgo(10), type: "HIIT", duration: 35, rpe: 8, notes: "Circuit training" },
  { date: daysAgo(12), type: "Cardio", duration: 60, rpe: 4, notes: "Long easy run" },
  { date: daysAgo(14), type: "Strength", duration: 65, rpe: 7, notes: "Full body" },
  { date: daysAgo(15), type: "HIIT", duration: 30, rpe: 9, notes: "Burpee ladder" },
  { date: daysAgo(17), type: "Cardio", duration: 40, rpe: 5, notes: "Cycling" },
  { date: daysAgo(19), type: "Strength", duration: 55, rpe: 6, notes: "Back and biceps" },
  { date: daysAgo(21), type: "HIIT", duration: 45, rpe: 8, notes: "Metcon WOD" },
  { date: daysAgo(23), type: "Cardio", duration: 35, rpe: 4, notes: "Easy swim" },
  { date: daysAgo(25), type: "Strength", duration: 60, rpe: 7, notes: "Deadlift day" },
  { date: daysAgo(27), type: "HIIT", duration: 40, rpe: 8, notes: "Rowing intervals" },
  { date: daysAgo(29), type: "Cardio", duration: 50, rpe: 5, notes: "Trail run" },
  { date: daysAgo(31), type: "Strength", duration: 55, rpe: 6, notes: "Shoulder press focus" },
];

async function main() {
  await prisma.$connect();
  await prisma.session.deleteMany();

  for (const session of sessions) {
    await prisma.session.create({ data: session });
  }

  console.log(`Seeded ${sessions.length} sessions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
