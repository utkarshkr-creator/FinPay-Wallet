"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card"
import { TextInput } from "@repo/ui/input"
import { useEffect, useState } from "react"
import { p2pTransfer } from "../lib/actions/p2pTransfer";
export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const handleSendClick = async () => {
    if (number === '' || amount <= 0) {
      setError('Enter amount and Number....');
      return; // Exit the function early if there's an error
    }

    setIsSending(true);
    try {
      const res = await p2pTransfer(number, amount);
      setSuccess(res.message)
    } catch (error) {
      console.error('Error during transfer:', error);
      setError('Error during transfer. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  useEffect(() => {
    let timer: any;
    if (isSending) {
      timer = setTimeout(() => {
        setIsSending(false);
      }, 2000); // Change 2000 to the desired time in milliseconds
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isSending]);
  useEffect(() => {
    setTimeout(() => {
      setError("")
    }, 2000)
  }, [error])


  return <Card title="Send Money">
    <TextInput
      onChange={(val) => { setNumber(val) }}
      placeholder="Enter Number to Send Money" label="Number" />
    <TextInput
      onChange={(val) => { setAmount(Number(val) * 100) }}
      placeholder="Enter Amount" label="Amount" />
    <div className="flex justify-center pt-4">
      <Button onClick={handleSendClick} disabled={true}>
        {isSending ? 'Sending...' : 'Send'}
      </Button>
    </div>
    {error && <div className="text-red-900 font-md">
      {error}
    </div>}
    {success && <div className="text-green-900 font-md">
      {success}
    </div>}
  </Card>
}
