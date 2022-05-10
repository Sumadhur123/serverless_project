const express = require("express");
const serverless = require("serverless-http");
const cors = require('cors');
const aws = require("aws-sdk");
const dynamoClient = new aws.DynamoDB.DocumentClient({
  region: "us-east-1",
});
const app = express();
app.use(express.json());
app.use(cors());

app.get("/login/:email", async (req, res) => {
    
    const email = req.params.email;
    const perameters = {
    TableName: "user",
    Key: {
      email: email
    },
  };
  const data = await dynamoClient.get(perameters).promise();
  res.send(data.Item.password)
});

app.post("/register", async (req, res) => {
  const content = JSON.parse(req.apiGateway.event.body);
  const email = content.email;
  const password = content.password;
  const role = content.role;

  const perameters = {
  TableName: "user",
  Item: {
    email: email,
    password: password,
    role:role
  },
};
const data = await dynamoClient.put(perameters).promise();
res.send({
  headers: {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true 
},
  message: "registered"
});
});


app.listen(3001, () => console.log("listen on: 3001"));
module.exports.handler = serverless(app);
