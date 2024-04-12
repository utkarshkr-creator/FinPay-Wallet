"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"
export async function p2pTransfer(receiver: string, amount: number) {
  const session = await getServerSession(authOptions);
  const sender = session?.user?.id;
  if (!sender) {
    return {
      message: "Sender not loged In"
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
      message: "User Not Found."
    }
  }
  if (peerUser.id == sender) {
    return {
      message: "You can't send Money to Your Account"
    }
  }
  let TrsnsactionSuccess = true;
  await prisma.$transaction(async (txn) => {
    await txn.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(sender)} FOR UPDATE`;

    const fromBalance = await txn.balance.findUnique({
      where: { userId: Number(sender) },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      TrsnsactionSuccess = false;
      return;
    }
    await txn.balance.update({
      where: { userId: Number(sender) },
      data: { amount: { decrement: amount } },
    });
    await txn.balance.update({
      where: { userId: peerUser.id },
      data: { amount: { increment: amount } },
    })
    await txn.p2pTransfer.create({
      data: {
        amount,
        timestamp: new Date(),
        fromUserId: Number(sender),
        toUserId: peerUser.id
      }
    })

  });
  if (!TrsnsactionSuccess) {
    return {
      message: ("Insufficient funds")
    }
  } else {
    return {
      message: "Sucessfully completed the transaction"
    }
  }
}
