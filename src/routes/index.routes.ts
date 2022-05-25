import { Router } from 'express';
import { decrypt, encrypt, generateKeys, blinding, unblinding, paillierTest } from '../middlewares/keys';
import { RsaPrivateKey } from '../middlewares/rsaprivatekey';
import { RsaPublicKey } from '../middlewares/rsapublickey';

const indexRouter: Router = Router();

//const bitLength=2048;
//const keypair= generateKeys(bitLength);

indexRouter.get('/pub/:bitLength', generateKeys);
//indexRouter.post('/encrypt', keypair.publicKey.encrypt);
//indexRouter.post('/decrypt', keypair.privateKey.decrypt);

//Problems with promise
//indexRouter.post('/sign', keypair.privateKey.sign);
//indexRouter.post('/verify', keypair.privateKey.verify);

//in the indexRouter not put any variable (req.body)
//indexRouter.post('/blinding', blinding);
//indexRouter.post('/unblinding', unblinding);

//indexRouter.post('/paillier', paillierTest);