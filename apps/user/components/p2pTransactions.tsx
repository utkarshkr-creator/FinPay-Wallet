import { Card } from "@repo/ui/card";


export const P2pTransactions = ({
  transactions
}: {
  transactions: {
    time: Date,
    amount: number,
    to: string
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
      {transactions.map(t =>
        <div className="flex justify-between">
          <div>
            <div className="text-sm">
              SendedTo: {t.to}
            </div>
            <div className="text-slate-600 text-xs">
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div>
              + Rs {t.amount / 100}
            </div>
            <div className="text-sm text-slate-600">
              <p>{t?.time?.toDateString()}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  </Card>
}
