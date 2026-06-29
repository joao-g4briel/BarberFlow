import "server-only";

import { DEFAULT_TIMES } from "@/lib/constants";
import { db } from "@/lib/db";

type GetAvailableTimesParams = {
  tenantId: string;
  barberId: string;
  date: Date;
};

export async function getAvailableTimes({
  tenantId,
  barberId,
  date,
}: GetAvailableTimesParams) {
  const appointments = await db.appointment.findMany({
    where: {
      tenantId,
      barberId,
      date,
      status: { not: "CANCELED" },
    },
    select: { time: true },
  });

  const takenTimes = new Set(appointments.map((appointment) => appointment.time));

  return DEFAULT_TIMES.filter((time) => !takenTimes.has(time));
}
