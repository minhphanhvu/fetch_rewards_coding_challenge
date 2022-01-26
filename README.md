# Fetch Rewards Coding Exercise - Backend Software Engineering

An API web service built with Express server that accepts HTTP requests and returns responses based on conditions (background) and assumptions below.

## Background

- Each transaction record contains: `payer` (string), `points` (integer), `timestamp` (date).
- Oldest points of payers will be spent first (based on transaction timestamp, not the order they're received).
- No payer's points will be negative when being spent.
- No database needed. Transactions are stored in memory.
