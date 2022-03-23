import * as bcu from 'bigint-crypto-utils';
import { decrypt, encrypt, generateKeys } from './middlewares/keys';
// const decrypt = require('./middlewares/keys');
// const encrypt = require('./middlewares/keys');

//message TX->RX
// const message = 'hello';
// const encrypted = encrypt(message);
// //channel
// console.log('encrypted:' +encrypted);
// //arrives to RX
// const decrypted = decrypt(encrypted);
// console.log('plaintext:' +decrypted)

const bitLength=1024;


const main = async function(){
    const keypair= await generateKeys(bitLength);
    const m= bcu.randBetween(keypair.publicKey.n-1n);
    const c= keypair.publicKey.encrypt(m);
    const d=keypair.privateKey.decrypt(c);
    if(m !==d){
        console.log("error");
    }
    else{
        console.log("working");
    }
}

main();