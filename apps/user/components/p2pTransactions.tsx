import { Card } from "@repo/ui/card";


export const P2pTransactions = ({
  transactions
}: {
  transactions: {
    time: Date,
    amount: number,
    to: string,
    toNum: number,
    from: number,
    fromNum: number,
    sessionId: number,
  }[]
}) => {
  if (!transactions.length) {
    return <Card title="Recent Transactions">
      <div className="text-center pb-8 pt-8">
        No Recent Transactions
      </div>
    </Card>
  }
  return <Card title="Recent Transactions">
    <div className="pt-2">
      {transactions.map(t => {
        const isFromUser = t.from === t.sessionId;
        const toUserDisplay = isFromUser ? `Sended To: ${t.toNum}` : `Received From: ${t.fromNum}`;

        return (
          <div className="flex justify-between border-b p-2">
            <div className="flex flex-col justify-center">
              <div className="text-sm">
                {toUserDisplay}
              </div>
              <div className="text-sm text-slate-600">
                <p>{t?.time?.toDateString()}</p>
              </div>
            </div>
            <div>
              {isFromUser ? '-' : '+'} Rs {t.amount}
            </div>

          </div>
        );
      })}
    </div>
  </Card >
}
