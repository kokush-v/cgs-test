import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import passport from 'passport';

import AppRouter from './routes';
import connectDB from './config/database';
import { corsConfig } from './config/cors.config';

const app = express();
const router = new AppRouter(app);
// Connect to Postgres
connectDB();

// Express configuration

app.use(cors(corsConfig));
app.set('port', process.env.PORT || 4200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

router.init();

const port = app.get('port');
// eslint-disable-next-line no-console
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

export default server;
