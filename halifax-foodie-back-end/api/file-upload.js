const router = require('express').Router();
const Multer = require('multer');
const {format} = require('util');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
})

const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();
const bucket = storage.bucket("recipe-classification-input");

// Process the file upload and upload to Google Cloud Storage.
router.post('/upload', multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

router.get('/get-classification', async (request, response) =>  {
  const outputFile = storage.bucket("recipe-classification-output").file("classified-recipe")
  let similarFileName = ''
  outputFile.createReadStream()
    .on("data", (data) => {
      similarFileName += data
    })
    .on("end", () => {
      const fileName = similarFileName.split(".")[0];
      let recipeName = ''
      for (const name of fileName.split("_")) {
        recipeName += name.charAt(0).toUpperCase() + name.slice(1) + " ";
      }
      return response.status(200).json({
        similarFile: recipeName
      })
    })
    .on("error", () => {
      return response.status(500)
    })
})

module.exports = router