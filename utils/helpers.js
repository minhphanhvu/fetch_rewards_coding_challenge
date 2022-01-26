/*
function validParameters check three cases:
  - If the points are 0 (can only be negative or positive).
  - If there are missing or extra parameters.
  - If the parameters are of wrong data types.
output:
  - An object:
  {
    valid: bool,
    message: string,
  }
*/
const validParameters = (parameters) => {
  const check = { valid: false, message: "" };

  if (Object.keys(parameters).length !== 3) {
    check.message = "Either missing or extra parameters.";
  } else if (
    !(
      "payer" in parameters &&
      "points" in parameters &&
      "timestamp" in parameters
    )
  ) {
    check.message = "Missing one of the keys in parameters.";
  } else if (!validTypes(parameters)) {
    check.message = "wrong types of parameters.";
  } else if (parameters.points === 0) {
    check.message =
      "Please provide either a negative or positive number except 0.";
  } else {
    check.valid = true;
  }

  return check;
};

/*
function validBalance checks if the transaction makes the payer's points above 0.
input:
  - an array of objects (transactions)
  - string (name of a payer)
  - integer number (the points in the new transaction)
output:
  - boolean
*/
const validBalance = (transactions, payer, points) => {
  const balance = getBalance(transactions, payer);
  // balance always be positive > 0
  if (balance + points < 0) {
    return false;
  }
  return true;
};

/*
function getBalances
input:
  - an array of objects (transactions)
output:
  - An object to represent the total points of each payer.
{
  "balances": {
    "DANNON": 1100,
    "UNILEVER": 200,
    "MILLER COORS": 10000
  }
}
*/
const getBalances = (transactions) => {
  const balances = {};
  for (transaction of transactions) {
    let payer = transaction.payer;
    if (payer in balances) {
      balances[payer] += transaction.points;
    } else {
      balances[payer] = transaction.points;
    }
  }
  return balances;
};

// Additional helper functions

/*
validTypes: check if parameters are the correct data types
  - `payer` must be string "type"
  - `points` must be "number"
  - `timestamp` needs to be valid object `Date`
*/
const validTypes = (parameters) => {
  let { payer, points, timestamp } = { ...parameters };
  timestamp = new Date(timestamp);

  if (
    typeof payer === "string" &&
    typeof points === "number" &&
    timestamp.getTime() > 0
  ) {
    return true;
  }
  return false;
};

/*
function getBalance
input:
  - an array of objects (transactions)
  - a string (name of a payer)
output:
  - return the total points of that payer.
  - type: integer
*/
const getBalance = (transactions, payer) => {
  let balance = 0;
  for (transaction of transactions) {
    if (transaction.payer === payer) {
      balance += transaction.points;
    }
  }
  return balance;
};

module.exports = { validParameters, validBalance, getBalances };
