import express from 'express';
import morgan from 'morgan';
import config from './config';
import cors from 'cors';
import indexRouter from './routes/indexRoutes';
//import helmet from 'helmet';
//import compression from 'compression';
//import cors from 'cors';

// import routes
//import indexRoutes from './routes/indexRoutes';
//another commit for fernando

const app = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors({origin: '*'}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api", indexRouter);

export default app;

// Server Class
// class Server {
//     public app: express.Application;

//     constructor() {
//         this.app = express();
//         this.config();
//         //this.routes();
//     }

//     public config(): void {
//         // Settings, our server listen to port 4000
//         this.app.set('port', config.PORT);
//         // middlewares
//         this.app.use(morgan('dev'));
//         //this.app.use(express.json());
//         //this.app.use(express.urlencoded({extended: false}));
//         //this.app.use(helmet());
//         //this.app.use(compression());
//         this.app.use(cors());
//     }

//     public routes(): void {
//         //const router: express.Router = express.Router();

//         //this.app.use('/', indexRouter);
//     }

//     public start(): void {

//         //arrow function
//         this.app.listen(this.app.get('port'), () => {
//             console.log('Server is listenning on port', this.app.get('port'));
//         });
//     }
// }

// export { Server } ;