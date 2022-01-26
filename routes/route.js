const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const {
  validParameters,
  validBalance,
  getBalances,
} = require("../utils/helpers");

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

// GET /api/balance to get the total points of all payers.
router.get("/balance", (req, res) => {
  const balances = getBalances(transactions);
  return res.status(200).json({
    balances,
  });
});

// POST /api/spend to spend the points of a user.
router.post("/spend", (req, res) => {
  let spendingPoints = req.body.points;
  if (spendingPoints <= 0) {
    return res.status(422).json({
      fail: "Cannot spend negative or 0 points.",
    });
  }
  const balances = getBalances(transactions);

  let totalPoints = 0;
  for (payer in balances) {
    totalPoints += balances[payer];
  }

  if (totalPoints < spendingPoints) {
    return res.status(422).json({
      fail: "There is not enough points to spend.",
    });
  }

  // Sort the transactions based on the oldest timestamp
  let tempTransactions = JSON.parse(JSON.stringify(transactions)); // deep copy
  tempTransactions.sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  const usedTransactions = [];
  let currentPoints = 0;
  let index = 0;

  /*
    Loop through the current sorted transactions and begin to subtract the points
    until all the spending points are back to 0.
  */
  while (currentPoints < spendingPoints) {
    let neededPoints = spendingPoints - currentPoints;
    if (tempTransactions[index].points <= neededPoints) {
      usedTransactions.push(tempTransactions[index]);
      spendingPoints -= tempTransactions[index].points;
    } else {
      const newTransaction = tempTransactions[index];
      newTransaction.points = neededPoints;
      usedTransactions.push(newTransaction);
      spendingPoints = 0;
    }
    index += 1;
  }

  // Loop thorugh usedTransactions and see how many points each payer used
  // expected `payers`: { DANNON: 100, UNILEVER: 200, 'MILLER COORS': 4700 }
  const payers = {};
  usedTransactions.forEach((transaction) => {
    let payer = transaction.payer;
    if (payer in payers) {
      payers[payer] += transaction.points;
    } else {
      payers[payer] = transaction.points;
    }
  });

  // Loop thorugh payers, form a new transaction and add to the existing transactions,
  // then send the response back.
  const response = [];
  for (payer in payers) {
    let newPayer = {
      payer,
      points: -payers[payer],
    };
    response.push(newPayer);
    let newTransaction = JSON.parse(JSON.stringify(newPayer));
    newTransaction.timestamp = new Date().toISOString();
    transactions.push(newTransaction);
  }

  return res.status(200).json({
    response,
  });
});

module.exports = router;
