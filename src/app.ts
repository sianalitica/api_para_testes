import cors from 'cors';
import express, { Express } from "express";
import routes from './routes';

const app:Express = express()
const cors_options: cors.CorsOptions = {
    origin: "*"
};
app.use(cors(cors_options))
app.use(express.json())
routes(app)

export default app