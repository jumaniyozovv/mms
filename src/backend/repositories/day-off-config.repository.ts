import { prisma } from "@/backend/lib/prisma";
import type { DayOffConfig } from "@/app/generated/prisma/client";

const SINGLETON_ID = "default";

export async function getConfig(): Promise<DayOffConfig> {
  return prisma.dayOffConfig.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: {
      id: SINGLETON_ID,
      paidDaysOff: 15,
      sickDaysOff: 5,
      personalDaysOff: 10,
    },
  });
}

export async function updateConfig(data: {
  paidDaysOff: number;
  sickDaysOff: number;
  personalDaysOff: number;
}): Promise<DayOffConfig> {
  return prisma.dayOffConfig.upsert({
    where: { id: SINGLETON_ID },
    update: data,
    create: {
      id: SINGLETON_ID,
      ...data,
    },
  });
}
