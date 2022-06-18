import { Router } from 'express';
import * as ctrl from '../middlewares/keys';

const indexRouter: Router = Router();

indexRouter.get('/rsa/pubKey', ctrl.apiGenerateKeys);
indexRouter.post('/rsa/sign', ctrl.apiSign);
indexRouter.post('/rsa/decrypt', ctrl.apiDecrypt);
indexRouter.get('/paillier/pubKey', ctrl.apiGeneratePaillierKeys);

//not work yet
indexRouter.post('/paillier/decrypt', ctrl.apiPostPaillier);

export default indexRouter;