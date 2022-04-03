import * as bcu from 'bigint-crypto-utils';
import { decrypt, encrypt, generateKeys, blinding, unblinding } from './middlewares/keys';
// const decrypt = require('./middlewares/keys');
// const encrypt = require('./middlewares/keys');

//a silly process message TX->RX - Not use!
// const message = 'hello';
// const encrypted = encrypt(message);
// //channel
// console.log('encrypted:' +encrypted);
// //arrives to RX
// const decrypted = decrypt(encrypted);
// console.log('plaintext:' +decrypted)

//we put 1024 or 2048 bits
const bitLength=2048;


const main = async function(){

    //check if encrypt & decrypt works with public & private keys
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

    //2nd - check if blinding & unblinding works with public & private keys
    //we cand send the same message, search randBetween & how bigints work?
    const keypair2= await generateKeys(bitLength);
    const m2= bcu.randBetween(keypair2.publicKey.n-1n);
    const blindmessage=await blinding(m2);
    const signmessage=keypair2.privateKey.sign(blindmessage);
    //we don't know if verifymessage or unblindmessage is the first???
    const verifymessage=keypair2.publicKey.verify(signmessage);
    console.log(signmessage)
    const unblindmessage= await unblinding(verifymessage);
    if(m2 !== unblindmessage){
        console.log("error");
    }
    else{
        console.log("working");
    }

}

main();