"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"
export async function p2pTranfer(receiver: string, amount: number) {
  const session = await getServerSession(authOptions);
  const sender = session?.user?.id;
  if (!sender) {
    return {
      message: "Sender not login"
    }
  }
  const peerUser = await prisma.user.findFirst({
    where: {
      phoneNumber: receiver
    }
  }
  );
  if (!peerUser) {
    return {
      message: "user not Found"
    }
  }
  await prisma.$transaction(async (txn) => {
    const fromBalance = await txn.balance.findUnique({
      where: { userId: Number(sender) },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }
    await txn.balance.update({
      where: { userId: Number(sender) },
      data: { amount: { decrement: amount } },
    });
    await txn.balance.update({
      where: { userId: peerUser.id },
      data: { amount: { increment: amount } },
    })
  });

}
