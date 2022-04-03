import * as bcu from 'bigint-crypto-utils';

//RsaPrivateKey interface
interface RsaPrivateKeyInterface {
    d: bigint;
    n: bigint;
    k: bigint;
    decrypt(c: bigint): bigint;
    sign(m: bigint): bigint;
}

//RsaPrivateKey model
class RsaPrivateKey implements RsaPrivateKeyInterface {

    //variables
    d: bigint;
    n: bigint;
    k!: bigint;

    //constuctor
    constructor(d: bigint, n: bigint, k?: bigint){
        if(k){
            this.k=k;
            this.n=n;
            this.d=d;
        }
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