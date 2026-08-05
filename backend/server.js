import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRoute from './routes/index.js';
import connectDB from './models/index.js';
import passport from 'passport';
import dotenv from 'dotenv';
import passportConfig from './config/passport.js';

dotenv.config();
passportConfig(passport);

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB(MONGO_URL);

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://dragend.app',
        'https://www.dragend.app',
        'https://ambitious-desert-0bc9ae400.7.azurestaticapps.net',
        'https://dragend.onrender.com'
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookieParser());
app.use(passport.initialize());

app.disable('x-powered-by');

app.use('/api', indexRoute)

app.get('/health', (req, res) => {
    res.status(200).json({ msg: "Server Online." })
})

app.listen(PORT, () => { console.log(`Server Running at ${PORT}/`) });
