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

app.use(cors({ origin: '*', credentials: true })); //for development purposes 
// app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/posts',postRoutes)
app.use('/users', userRoutes)

app.get('/', (req,res) => {
    res.send('Welcome to memories API')
})

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(PORT, () => console.log('Server is running on '+ PORT)))
.catch((err) => console.log(err.message) )
