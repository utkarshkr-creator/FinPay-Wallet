import express from "express";
import db from "@repo/db/client"
interface paymentInformationProps {
  token: string,
  userId: string,
  amount: string
}

const app = express();

app.post("/hdfcwebhook", async (req, res) => {
  const paymentInformation: paymentInformationProps = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount
  };
  //update balance in db
  try {
    await db.$transaction([db.balance.updateMany({
      where: {
        userId: Number(paymentInformation.userId)
      },
      data: {
        amount: {
          increment: Number(paymentInformation.amount)
        }
      }
    }),
    db.onRampTransaction.updateMany({
      where: {
        token: paymentInformation.token
      },
      data: {
        status: "Sucess",
      }
    })
    ]);
    res.json({
      message: "Captured"
    })
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "Error while processing webhook"
    })
  }
})
const port = 3003;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
