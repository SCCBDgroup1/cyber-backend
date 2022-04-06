import * as bcu from 'bigint-crypto-utils';

//RsaPrivateKey interface
interface RsaPrivateKeyInterface {
    d: bigint;
    n: bigint;
    decrypt(c: bigint): bigint;
    sign(m: bigint): bigint;
}

//RsaPrivateKey model
class RsaPrivateKey implements RsaPrivateKeyInterface {

    //variables
    d: bigint;
    n: bigint;

    //constuctor
    constructor(d: bigint, n: bigint){
        this.d=d;
        this.n=n;
    }

    //functions
    decrypt(c: bigint){
        return bcu.modPow(c, this.d, this.n);
    }

    sign(m: bigint){
        return bcu.modPow(m, this.d, this.n);
    }
}

//now, we export the class
export { RsaPrivateKey } ;