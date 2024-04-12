import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard"
import prisma from "@repo/db/client"
import { P2pTransactions } from "../../../components/p2pTransactions";
import { authOptions } from "../../../lib/auth";
export default async function Page() {
  const transactions = await getP2pTransactions();
  return (
    <div className="flex md:flex-row flex-col w-full">
      <div className="pt-5 lg:w-1/2 md:w-full m-4 sm:w-full">
        <SendCard />
      </div>
      <div className="pt-4 lg:w-1/2 m-4 md:w-full sm:w-full">
        <P2pTransactions transactions={transactions} />
      </div>
    </div>
  )
}

async function getP2pTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id)
    },
    include: {
      fromUser: true
    }
  });
  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    to: t.fromUser.phoneNumber
  }))
}


