const { expect } = require("chai");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const fs = require("fs");
const path = require("path");
const { getBalances } = require("../utils/helpers");

const url = "http://localhost:5000/api";

chai.should();
chai.use(chaiHTTP);

describe("PAYERS", () => {
  describe("GET /api/balance", () => {
    it("Should successfully retrieve the balances", (done) => {
      const data = fs.readFileSync(
        path.join(__dirname, "../transactions.json"),
        "utf-8"
      );
      let transactions = JSON.parse(data).transactions;
      const balances = getBalances(transactions);
      chai
        .request(url)
        .get("/balance")
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.balances).to.deep.equal(balances);
          done();
        });
    });
  });

  describe("POST /api/add", () => {
    it("Should successfully add a new transaction", (done) => {
      const transaction = {
        payer: "DANNON",
        points: -100,
        timestamp: "2020-12-31T10:00:00Z",
      };
      chai
        .request(url)
        .post("/add")
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(201);
          expect(res.body.transaction).to.deep.equal(transaction);
          done();
        });
    });

    it("Should not successfully add a new transaction if resulting in negative points", (done) => {
      const transaction = {
        payer: "DANNON",
        points: -3000,
        timestamp: "2020-10-31T10:00:00Z",
      };
      chai
        .request(url)
        .post("/add")
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });

    it("Should not successfully add a new transaction if having extra parameters", (done) => {
      const transaction = {
        payer: "DANNON",
        points: -100,
        timestamp: "2020-10-31T10:00:00Z",
        user: "new-user",
      };
      chai
        .request(url)
        .post("/add")
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });

  describe("POST /api/spend", () => {
    it("Should successfully return correct results after spending 5000", (done) => {
      const expectedResponse = [
        { payer: "DANNON", points: -100 },
        { payer: "UNILEVER", points: -200 },
        { payer: "MILLER COORS", points: -4700 },
      ];
      chai
        .request(url)
        .post("/spend")
        .send({ points: 5000 })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.response).to.deep.equal(expectedResponse);
          done();
        });
    });
  });
});
