const archiver = require('archiver');
const express = require('express');
const multer = require('multer');
const path = require('path');
const Stream = require('stream');

require('dotenv').config()

const app = express();
const upload = multer();

const PORT = process.env.PORT || 3000;

app.set('views',path.join(__dirname,'/views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.get('/',(req,res) => {
  res.render('index')
});


app.post('/',upload.array('files'),async (req,res) => {
  const { files } = req
  if (!files.length) return res.status(400).send('No file provided.');
  const archive = archiver('zip');
  const stream = new Stream.Transform({
    transform(chunk,enc,cb) {
      this.push(chunk)
      cb()
    }
  });

  const zipFileName = files.length > 1 ? 'files.zip' : `${files[0].originalname}.zip`;
  res.attachment(zipFileName);
  res.setHeader('Content-Type','application/zip');
  res.setHeader('Content-Transfer-Encoding','binary');

  files.forEach((file) => {
    archive.append(file.buffer,{ name: file.originalname });
  });
  await archive.finalize()
  Stream.pipeline(
    archive,
    stream,
    res,
    (err) => {
      if (err) {
        console.log('Error on pipeline: ',err);
        return res.status(500).send(err.message);
      }
    }
  )
});

app.listen(PORT,() => console.log(`Server running on port ${PORT}`));