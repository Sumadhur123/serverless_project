const express = require('express');
const cors = require('cors');
const fileUploader = require('./api/file-upload')
const app = express();
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

const serverPort = process.env.PORT || 3001;

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUploader);

app.use(function (req, res, next) {
  res.status(404).send({
    message: 'Unable find this resource. Please try something else!',
    success: false
  });
});

const server = app.listen(serverPort, function () {
  const host = server.address().address
  const port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})