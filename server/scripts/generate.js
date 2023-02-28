const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');

const pvKey = secp.utils.randomPrivateKey();

console.log(`Private key ${toHex(pvKey)}`);

const pubKey = secp.getPublicKey(pvKey);

console.log(`Public key ${toHex(pubKey)}`);
