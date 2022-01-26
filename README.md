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

### 1. POST /api/payers/add

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

### 2. GET /api/payers/balance

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
