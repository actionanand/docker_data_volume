const fs = require('fs').promises;
const exists = require('fs').exists;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use('/feedback', serveIndex('feedback')); // shows you the list of file  present
app.use('/feedback', express.static('feedback')); // serves the actual files present

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;

  const temTitle = title.replace(/[^a-z\d\s]+/gi, ""); // removing special characters
  const adjTitle = temTitle.toLowerCase().slice(0,10);

  const tempFilePath = path.join(__dirname, 'temp', adjTitle + '.txt');
  const finalFilePath = path.join(__dirname, 'feedback', adjTitle + '.txt');

  await fs.writeFile(tempFilePath, content);
  exists(finalFilePath, async (exists) => {
    if (exists) {
      res.redirect('/exists');
    } else {
      // await fs.rename(tempFilePath, finalFilePath); // docker volume throws error
      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath); // removing after copying
      res.redirect('/');
    }
  });
});

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT);
