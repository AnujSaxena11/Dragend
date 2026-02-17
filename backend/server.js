const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const indexRoute = require('./routes/index');
const connectDB = require('./models/index');

require('dotenv').config()
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect Database
if (MONGO_URL)
    connectDB(MONGO_URL);
else
    console.log("No URL of Database Fetch");


app.use(cors({
    origin: ['http://localhost:5173',
        'https://dragend-h8cjcqdsfcc8gaex.centralindia-01.azurewebsites.net'
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookieParser());

//Base API
app.use('/api', indexRoute)

//Testing Route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Backendless</h1>")
})

app.listen(PORT, () => { console.log(`Server Running /`) });