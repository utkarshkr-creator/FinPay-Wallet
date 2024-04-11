"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/input";
import { useState } from "react";
import { createOnRampTransactions } from "../lib/actions/createOnRampTransactions";

const SUPPORT_BANKS = [{
  name: "AXIS BANK",
  redirectUrl: "https://netbanking.axisbank.com"
}, {
  name: "HDFC BANK",
  redirectUrl: "https://www.hdfcbank.com"
}];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(SUPPORT_BANKS[0]?.redirectUrl);
  const [provider, setProvider] = useState(SUPPORT_BANKS[0]?.name || "")
  const [value, setValue] = useState(0);
  return <Card title="Add Money">
    <div className="w-full">
      <TextInput label={"Amount"} placeholder="Amount" onChange={(val) => {
        setValue(Number(val))
      }} />

      <div className="py-4 text-left">Bank</div>
      <Select onSelect={(value) => {
        setRedirectUrl(SUPPORT_BANKS.find(x => x.name === value)?.redirectUrl || "")
        setProvider(SUPPORT_BANKS.find(x => x.name === value)?.name || "")
      }} options={SUPPORT_BANKS.map(x => ({
        key: x.name,
        value: x.name
      }))} />
      <div className="flex justify-center pt-4">
        <Button onClick={async () => {
          await createOnRampTransactions(provider, value * 100)
          window.location.href = redirectUrl || ""
        }}>
          Add Money
        </Button>
      </div>
    </div>
  </Card>
}
