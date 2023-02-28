const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '044bc61441644478da45600d30b4cd595c51cc4f73e74f70d4a42715b0bf9482657c76903747b7c97536338fd095aa7018a515f771ffdf723e8f894453974b0832': 100,
  '044a5dc3cd9ea155d7d2a917a59cdbab825cef6284875f36db8391916c57b25c1d39ef4fd84f46714a11cf3edaa9633beeef30ed5c7203a4d62c547848b1255747': 50,
  '047f85c01c30990ae5a964bf64140c21dc3a48c011fdc744f3c4affba0f7e7f48d28e9c8274fa91ba02ad646a87ec097700ac59520951fbb2f85858fcada2aac8b': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
