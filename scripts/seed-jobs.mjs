// Seed initial job listings from content/jobs/seed.json into the database
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function main() {
  const seedPath = resolve(__dirname, "../content/jobs/seed.json");
  const jobs = JSON.parse(readFileSync(seedPath, "utf-8"));

  let created = 0;
  for (const job of jobs) {
    const existing = await prisma.job.findFirst({
      where: { title: job.title, company: job.company },
    });
    if (!existing) {
      await prisma.job.create({ data: { ...job, skills: job.skills } });
      created++;
    }
  }

  console.log(`Seeded ${created} new jobs (${jobs.length - created} already existed).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
