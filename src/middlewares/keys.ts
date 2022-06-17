import * as bcu from 'bigint-crypto-utils';
import * as paillierBigint from 'paillier-bigint';
import bc from 'bigint-conversion';
//if we need to convert
//import * as bigintConversion from 'bigint-conversion';
import {split, combine} from 'shamirs-secret-sharing-ts';
import { RsaPrivateKey } from './rsaprivatekey';
import { RsaPublicKey } from './rsapublickey';
import {Request, Response} from 'express';

// export async function generateRandomKeys (bitlength: number = 3072, simpleVariant: boolean = false): Promise<KeyPair> {
//     let p, q, n, g, lambda, mu
//     // if p and q are bitLength/2 long ->  2**(bitLength - 2) <= n < 2**(bitLength)
//     do {
//       p = await bcu.prime(Math.floor(bitlength / 2) + 1)
//       q = await bcu.prime(Math.floor(bitlength / 2))
//       n = p * q
//     } while (q === p || bcu.bitLength(n) !== bitlength)
// }

const rsaKeyPairPromise = generateKeys(512)
const rsaPaillierKeyPairPromise = paillierBigint.generateRandomKeys(512);

//blind message          
export async function blinding (m: bigint, publicKey: RsaPublicKey): Promise<bigint> {
    let coprimes;
    // k=myRsaPrivateKey.k
    // let k;
    do 
    {
        //mask coef - random number between 0 and n
        publicKey.k = bcu.randBetween(publicKey.n,0n);
        //do the great common divisor
        coprimes= bcu.gcd(publicKey.k, publicKey.n);
    } 
    while (coprimes!==1n);

    //we extract the product (m · k^e)
    // const kPow: bigint=myRsaPrivateKey.k**publicKey.e % publicKey.n;
    // const finalResult: bigint= m*kPow % publicKey.n;
    const blindedMsg = publicKey.encrypt(publicKey.k) * m % publicKey.n;

    //other params: pow=1 & Bob's n 
    return blindedMsg;
}

export async function unblinding (m: bigint, publicKey: RsaPublicKey): Promise<bigint> {
    // k=myRsaPrivateKey.k
    // let k=60n;

    //we calculate modular inverse for r·mod(n)
    if (publicKey.k === undefined) {
        throw new Error("You have to blind before unblind");
    }
    const rInv:bigint= bcu.modInv(publicKey.k, publicKey.n);

    //we extract the product (s' · r^-1)
    const finalResult: bigint= m*rInv % publicKey.n; 

    //other params: pow=1 & Bob's n 
    // return bcu.modPow(finalResult,1n,publicKey.n);
    return finalResult;
}

//a function check paillier
export async function paillierTest () {
    // (asynchronous) creation of a random private, public key pair for the Paillier cryptosystem
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(512)
  
    // Optionally, you can create your public/private keys from known parameters
    // const publicKey = new paillierBigint.PublicKey(n, g)
    // const privateKey = new paillierBigint.PrivateKey(lambda, mu, publicKey)
  
    const m1 = 12345678901234567890n
    const m2 = 5n
  
    // encryption/decryption
    const c1 = publicKey.encrypt(m1)
    console.log(privateKey.decrypt(c1)) // 12345678901234567890n
  
    // homomorphic addition of two ciphertexts (encrypted numbers)
    const c2 = publicKey.encrypt(m2)
    const encryptedSum = publicKey.addition(c1, c2)
    //no addition en principio multiply
    const decryptedSum = privateKey.decrypt(encryptedSum)
    //console.log(privateKey.decrypt(encryptedSum)) // m1 + m2 = 12345678901234567895n
    console.log(decryptedSum)

    //another way to implement Paillier
    // // multiplication by k, this is our k
    // const k = 10n
    // //en principio es potenccia de k a la m2
    // const encryptedMul = publicKey.multiply(c1, k)
    // const decryptedMul = privateKey.decrypt(encryptedMul)
    // //console.log(privateKey.decrypt(encryptedMul)) // k · m1 = 123456789012345678900n
    // console.log(decryptedMul)

    //final check
    if(m1+m2!==decryptedSum){
        console.log("error");
    }
    else{
        console.log("working");
    }

}

export async function shamirSecretSharing(){
    const shamirMessage = 12345678901234567890n;
    const shamirMessageToString = shamirMessage.toString()
    //const shamirMessage = 'secret key';
    //we need pass to string 
    const secret = Buffer.from(shamirMessageToString);
    //the secret is splitted into 10 different guys and oly 4 can open it!
    const shares=split(secret, {shares: 10, threshold: 4});
    //in this case until the guy 3 to guy 6 can open the secret formula!
    const recovered= combine(shares.slice(3, 7));
    const recoveredToString=recovered.toString();

    //final check
    if(shamirMessageToString !==recoveredToString){
        console.log("error");
    }
    else{
        console.log("working");
    }    
}


export async function generateKeys (bitlength: number){

    //be careful with this BiggestInt because the version of the tsconfig.json changes
    const e = 65537n;
    let p, q, n, phi;
    do 
    {
        p = await bcu.prime(bitlength / 2 + 1);
        q = await bcu.prime(bitlength / 2);
        n = p * q;
        phi = (p - 1n) * (q - 1n);
    } 
    while (bcu.bitLength(n) !== bitlength || (phi % e === 0n));
    const publicKey = new RsaPublicKey(e, n);
    const d = bcu.modInv(e, phi);
    const privateKey = new RsaPrivateKey(d, n);
    return { publicKey, privateKey} ;
}

//basic silly encrypt function - Not use!
export const encrypt = function (exemple: string){
    const reverse = exemple.split('').reverse().join('');
    return 'encrypted' + reverse;
}

//basic silly decrypt function - Not use!
export const decrypt = (exemple: string) => {
    const script = exemple.substring(10);
    return script.split('').reverse().join('');
}

//shamir secret sharing function

//requests for the clients

export const apiGenerateKeys = async (req: Request, res: Response) => {
    try{
        const keyPair = await rsaKeyPairPromise;
        res.status(200).send({
            e: keyPair.publicKey.e.toString(),
            n: keyPair.publicKey.n.toString(),
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const apiGeneratePaillierKeys = async (req: Request, res: Response) => {
    try{
        const paillierKeyPair = await rsaPaillierKeyPairPromise;
        res.status(200).send({
            n: paillierKeyPair["publicKey"]["n"].toString(),
            g: paillierKeyPair["publicKey"]["g"].toString(),
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const apiSign = async (req: Request, res: Response) => {
    try{
        const blindMessage=req.body.message;
        console.log("Blind message sent by the client:", blindMessage);
        //necesitamos poder acceder a las claves de RSA
        const signMessage=(await rsaKeyPairPromise).privateKey.sign(BigInt(blindMessage));
        console.log("Blind message sign:", {signMessage: (signMessage).toString()});
        res.status(200).send({
            signMessage: signMessage.toString(),
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const apiDecrypt = async (req: Request, res: Response) => {
    try{
        const encryptMessage=req.body.message;
        console.log("Message encrypted", encryptMessage);
        //necesitamos poder acceder a las claves de RSA
        const originalMessage=(await rsaKeyPairPromise).privateKey.decrypt(BigInt(encryptMessage));
        console.log("Original Message", {originalMessage: originalMessage.toString()});
        res.status(200).send({
            originalMessage: originalMessage.toString(),
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

//not work yet!
export const apiPostPaillier = async (req: Request, res: Response) => {
    try{
        console.log("----------")
        const message=BigInt(req.body.message);
        console.log("Sum encrypted votes:", message);
        //necesitamos poder acceder a las claves de RSA
        const decryptSum=(await rsaPaillierKeyPairPromise).privateKey.decrypt(message);
        const votes= ("00" +decryptSum).slice(-3);
        console.log("Sum messages: ", votes);
        const digits=decryptSum.toString().split("");
        console.log("votes A:" +digits[0]);
        console.log("votes B:" +digits[1]);
        console.log("votes C:" +digits[2]);
        console.log("----------");
        res.status(200).send({message: decryptSum.toString()});
    } catch (error) {
        res.status(500).send(error);
    }
};