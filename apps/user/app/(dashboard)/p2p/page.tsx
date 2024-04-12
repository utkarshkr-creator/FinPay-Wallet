import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard"
import prisma from "@repo/db/client"
import { P2pTransactions } from "../../../components/p2pTransactions";
import { authOptions } from "../../../lib/auth";
export default async function Page() {
  const transactions = await getP2pTransactions();
  return (
    <div className="flex md:flex-row flex-col w-full p-2">
      <div className="pt-5  w-full">
        <SendCard />
      </div>
      <div className="pt-4  w-full">
        <P2pTransactions transactions={transactions} />
      </div>
    </div>
  )
}

async function getP2pTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: Number(session?.user?.id) }, // Filter for fromUserId
        { toUserId: Number(session?.user?.id) }   // Filter for toUserId
      ],
    },
    orderBy: {
      timestamp: 'desc',
    },
    include: {
      fromUser: true,
      toUser: true,
    }
  });
  return txns.map((t: any) => ({
    time: t.timestamp,
    amount: t.amount,
    toNum: t.toUser.phoneNumber,
    fromNum: t.fromUser.phoneNumber,
    from: t.fromUserId,
    sessionId: Number(session?.user?.id),
    to: t.toUserId
  }))
}


