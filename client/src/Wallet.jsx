import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = secp.getPublicKey(privateKey);
    setAddress(address);

    if (address) {
      console.log('pubkey', address);
      const {
        data: { balance },
      } = await server.get(`balance/${toHex(address)}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input
          placeholder="Input your private key, for example: 0x1"
          value={privateKey}
          onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
