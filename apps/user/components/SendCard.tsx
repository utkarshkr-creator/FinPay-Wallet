"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card"
import { TextInput } from "@repo/ui/input"
import { useState } from "react"
import { p2pTranfer } from "../lib/actions/p2pTransfer";
export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);
  return <Card title="Send Money">
    <TextInput
      onChange={(val) => { setNumber(val) }}
      placeholder="Enter Number to Send Money" label="Number" />
    <TextInput
      onChange={(val) => { setAmount(Number(val) * 100) }}
      placeholder="Enter Amount" label="Amount" />
    <div className="flex  justify-center pt-4">
      <Button onClick={async () => {
        await p2pTranfer(number, amount)
      }} > Send </Button>
    </div>
  </Card>
}
