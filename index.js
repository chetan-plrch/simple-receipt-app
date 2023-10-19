const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { calculatePoints } = require('./util');
const { validateReceipt, validateId } = require('./middlewares');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory storage for receipts
const receipts = {};

// API's
app.post('/receipts/process', validateReceipt, (req, res) => {
  const receipt = req.body;
  const receiptId = uuid.v4();

  receipts[receiptId] = receipt;
  res.json({ id: receiptId });
});

app.get('/receipts/:id/points', validateId, (req, res) => {
  const receiptId = req.params.id;
  const receipt = receipts[receiptId];

  if (!receipt) {
    return res.status(404).json({ error: 'No receipt found for that id' });
  }

  const points = calculatePoints(receipt);

  res.json({ points });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
