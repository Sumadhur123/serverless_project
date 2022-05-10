const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const database = admin.firestore();

app.post("/register", async (req, res, next) => {
  try {
    const body = req.body;
    const register = await database
      .collection("credentials")
      .doc(body.email)
      .set({
        email: body.email,
        question1: body.question1,
        question2: body.question2,
      });
    res.send({
      status: 200,
      message: "registered",
    });
  } catch (e) {
    next(e);
  }
});

app.get("/login/:email", async (req, res, next) => {
  try {
    const email = req.params.email;
    const securityQuestions = await database
      .collection("credentials")
      .doc(email)
      .get();
    res.send({
      question1: securityQuestions._fieldsProto.question1.stringValue,
      question2: securityQuestions._fieldsProto.question2.stringValue,
    });
  } catch (e) {
    next(e);
  }
});

app.listen(3001, () => console.log("listen on: 3001"));

module.exports = { app };
