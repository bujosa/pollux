const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');
const secp = require('ethereum-cryptography/secp256k1');

app.use(cors());
app.use(express.json());

const balances = {
  '0490b9c7f33b11e3bf1880941e58318828ea0d7148d9273b85d64eb31823c4c4772acbb2f000efd97e5046f5986ff687363d1a7f64739b2b021ad90b63e970200e': 100,
  '0407ba7aa422f4b772e8ce175f4b3f519cbdf33a5c78a2c42db2114a653c2c3654b22ff000c2e6eb4942a681697bb978d6b852c85b35319a0de54de44340dba483': 50,
  '044bf372c2fd6add5eeb21bc775f3c7a4ef5ad453586f49aa3e92972363003ed6a499bf825fd1b513dae10ddd151d9f9ad5acdf9b9be6628a8a075d522000a7d6a': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  const { publicKey, data, signature, recoveryBit } = req.body;

  const sender = publicKey;
  const { recipient, amount } = data;

  if (await verifySignature(publicKey, data, signature, recoveryBit)) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: 'Not enough funds!' });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: 'Invalid signature!' });
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

function hashMessage(message) {
  const bytes = utf8ToBytes(JSON.stringify(message));
  return keccak256(bytes);
}

async function verifySignature(publicKey, data, signature, recoveryBit) {
  const recoveredPublicKey = await recoverKey(data, signature, recoveryBit);
  return publicKey === toHex(recoveredPublicKey);
}

async function recoverKey(message, signature, recoveryBit) {
  const messageHash = hashMessage(message);

  const correctSignature = new Uint8Array(
    Uint8Array.from(Buffer.from(signature, 'hex'))
  );

  return secp.recoverPublicKey(messageHash, correctSignature, recoveryBit);
}
