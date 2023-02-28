import { useState } from 'react';
import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hashMessage(message) {
    const bytes = utf8ToBytes(JSON.stringify(message));
    return keccak256(bytes);
  }

  async function signMessage() {
    const hash_message = hashMessage({
      amount: parseInt(sendAmount),
      recipient,
    });

    return secp.sign(toHex(hash_message), privateKey, {
      recovered: true,
    });
  }

  async function transfer(evt) {
    evt.preventDefault();

    const [sig, recoveryBit] = await signMessage();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        publicKey: address,
        data: {
          amount: parseInt(sendAmount),
          recipient,
        },
        signature: toHex(sig),
        recoveryBit,
      });

      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
