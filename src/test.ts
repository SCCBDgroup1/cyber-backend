import * as bcu from 'bigint-crypto-utils';
import { decrypt, encrypt, generateKeys, blinding, unblinding, paillierTest, shamirSecretSharing } from './middlewares/keys';
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
    //{}
    //const keypair= await generateKeys(bitLength);
    //const m= bcu.randBetween(keypair.publicKey.n-1n);
    //const c= keypair.publicKey.encrypt(m);
    //const d=keypair.privateKey.decrypt(c);
    // if(m !==d){
    //    console.log("error");
    // }
    // else{
    //     console.log("working");
    // }
    //{}

    //2nd - check if blinding & unblinding works with public & private keys
    //{}
    //const keypair2= await generateKeys(bitLength);
    //const m2= bcu.randBetween(keypair2.publicKey.n-1n);
    //const blindmessage=await blinding(m2, keypair2.publicKey);
    //const signmessage=keypair2.privateKey.sign(blindmessage);
    //now the message is blinded
    //const unblindSignature= await unblinding(signmessage, keypair2.publicKey);
    //const verifySignature=keypair2.publicKey.verify(unblindSignature);
    //{}

    //bob signs the message with his private key - only for check
    // const privateSignMessage=keypair2.privateKey.sign(m2);

    //final check
    //{}
    // if(m2 !==verifySignature){
    //     console.log("error");
    // }
    // else{
    //     console.log("working");
    // }
    //{}

    //check if paillier works
    paillierTest();

    //check if shamir secret sharing works
    //works
    //shamirSecretSharing();
}

main();