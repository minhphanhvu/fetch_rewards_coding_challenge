# Fetch Rewards Coding Exercise - Backend Software Engineering

An API web service built with Express server that accepts HTTP requests and returns responses based on conditions (background) and assumptions below.

## Background

- Each transaction record contains: `payer` (string), `points` (integer), `timestamp` (date).
- Oldest points of payers will be spent first (based on transaction timestamp, not the order they're received).
- No payer's points will be negative when being spent.
- No database needed. Transactions are stored in memory.

## Assumptions

- Transactions cannot be added if that transaction makes a payer's points below 0.
- Transactions cannot be added if having extra or missing parameters.
- Transactions cannot be added if parameters have the wrong data types.
- When spending, any subtraction from a payer's points will be a new transaction and will be added to the existing transactions.
- Since there is no persistent database, and the trnasactions are stored in memory. The mocha tests are running with a persistent memory without refershing the transactions after each test.
- Cannot spend negative points.

## Getting Started

1. Install [Node](https://nodejs.org/en/).
2. Clone the repository to your local working place.
3. Run `npm install` to install dependencies.
   If you have trouble while installing, it is best to delete the `package-lock.json` file and `node_modules` folder, then run `npm install`. While developing it this web service, the version of node is v16.3.0 and npm 7.15.1.
4. Run `npm run dev` to start the server.
5. Visit your local host at port 5000 `http://localhost:5000`. You should see the message `Your server is running on port 5000`.
6. To run the test, issue command `npm test`.

### 1. POST /api/add

Add a new transaction.

1.1 Expected Payload

Exactly three parameters must be provided: `payer` (string), `points` (integer), and `timestamp` (date).

```json
{
  "payer": "DANNON",
  "points": -100,
  "timestamp": "2020-10-31T10:00:00Z"
}
```

1.2 Successful Response
The new transaction is returned in JSON format with a 201 status code.

```json
{
  "success": "new transaction added.",
  "transaction": {
    "payer": "DANNON",
    "points": -100,
    "timestamp": "2020-10-31T10:00:00Z"
  }
}
```

1.3 Error Response

A JSON is returned with a message and a 422 status code. Errors happen when parameters are either missing or extra, or have wrong data types.
Additionally, then new transaction cannot make the payer's points go below 0.

```json
{
  "fail": "Cannot process. This transaction will make the payer's points be negative."
}
```

### 2. GET /api/balance

2.1 Expected Payload

None

2.2 Successful Response

A JSON is returned with the 200 status code.

```json
{
  "balances": {
    "DANNON": 1100,
    "UNILEVER": 200,
    "MILLER COORS": 10000
  }
}
```

### 3. POST /api/spend

3.1 Expected Payload

One parameter type `interger` is expected with a key `points`.

```json
{
  "points": 5000
}
```

3.2 Successful Response
The new transaction is returned in JSON format with a 200 status code.

```json
{
  "response": [
    {
      "payer": "DANNON",
      "points": -100
    },
    {
      "payer": "UNILEVER",
      "points": -200
    },
    {
      "payer": "MILLER COORS",
      "points": -4700
    }
  ]
}
```

3.3 Error Reponse

A JSON response is returned with a message if spendingPoints are equal or below 0. Status code is 422.

```json
{
  "fail": "Cannot spend negative or 0 points."
}
```

### Manual Test with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Learn how to send simple requests for Postman [here](https://learning.postman.com/docs/getting-started/sending-the-first-request/)
3. After running `npm run dev`. You can begin making requests.
4. If you want to change the initial transactions. Make change to the json file `transactions.json` in the main directory.
