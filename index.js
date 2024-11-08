import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import dotenv from 'dotenv'

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}))

app.use(cors({ origin: 'https://99c7-94-72-155-139.ngrok-free.app' })); //for development purposes 
// app.use(cors());

app.use((req, res, next) => {
    const allowedOrigins = ['https://99c7-94-72-155-139.ngrok-free.app'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200); // Always respond OK to OPTIONS preflight
    }
    next();
  });

const PORT = process.env.PORT || 5000;

app.use('/posts',postRoutes)
app.use('/users', userRoutes)

app.get('/', (req,res) => {
    res.send('Welcome to memories API')
})

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(PORT, () => console.log('Server is running on '+ PORT)))
.catch((err) => console.log(err.message) )
