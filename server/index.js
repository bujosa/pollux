const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '0434f65563742448d81eb7ceb7b921763030b263093b5e090983cc22e9c541b5dadb761a00865f4a0f16ab63a1b06bb3abf85f3f7d0f5337021433a59df807f5f7': 100,
  '04bc3384c3cf129a95fab2b5fc45c3bfc42c34ade607859c0845f49f4c85b00b648bfcc3a83df792ff82f3d1a71df796ef69bc24f97c8549235d4dab35778479ce': 50,
  '04e3f88a0a31996baf52a4e96654c7d205ceb24d10d672160b3336945a8a6bf8caec843c7004b9e11469af0c2e8d13a8f11d52609ef3351e7eefe2e9d680ab974c': 75,
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
