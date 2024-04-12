"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";

export async function createOnRampTransactions(provider: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unacuthorized request"
    }
  }
  const token = (Math.random() * 10000).toString();
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(session?.use?.id)} FOR UPDATE`;
    const currentBalance = await tx.balance.findUnique({
      where: {
        userId: Number(session?.user?.id)
      }
    })
    if (!currentBalance || currentBalance.amount < amount) {
      await tx.onRampTransaction.create({
        data: {
          provider,
          status: "Failure",
          startTime: new Date(),
          token: token,
          userId: Number(session?.user?.id),
          amount: amount
        }
      })
    } else {
      await tx.onRampTransaction.create({
        data: {
          provider,
          status: "Processing",
          startTime: new Date(),
          token: token,
          userId: Number(session?.user?.id),
          amount: amount
        }
      })
    }
  })
}
