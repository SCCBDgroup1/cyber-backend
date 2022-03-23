//import * as bcu from 'bigint-crypto-utils';
// import { decrypt, encrypt, generateKeys } from './middlewares/keys';
const decrypt = require('./middlewares/keys');
const encrypt = require('./middlewares/keys');

//message TX->RX
const message = 'hello';
const encrypted = encrypt(message);
//channel
console.log('encrypted:' +encrypted);
//arrives to RX
const decrypted = decrypt(encrypted);
console.log('plaintext:' +decrypted)