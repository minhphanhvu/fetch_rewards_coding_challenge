const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const { validParameters, validBalance } = require("../utils/helpers");

// Read transactions from a local file
const data = fs.readFileSync(
  path.join(__dirname, "../transactions.json"),
  "utf-8"
);
let transactions = JSON.parse(data).transactions;

// Endpoint "/add" to add a new transaction.
router.post("/add", (req, res) => {
  const newTransaction = req.body;
  const check = validParameters(newTransaction);
  if (!check.valid) {
    return res.status(422).json({
      fail: `${check.message}`,
    });
  } // cannot add transactions if total balance will be negative
  else if (
    !validBalance(transactions, newTransaction.payer, newTransaction.points)
  ) {
    return res.status(422).json({
      fail: `Cannot process. This transaction will make the payer's points be negative.`,
    });
  }
  transactions.push(newTransaction);

  return res.status(201).json({
    success: "new transaction added.",
    transaction: newTransaction,
  });
});

module.exports = router;
