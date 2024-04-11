import express, { Application } from "express"
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import bodyParser from "body-parser";
import gptRouter from './router/gptRouter'

const app: Application = express()
const port: number = 8080
const httpsPort: number = 8443
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/gptRouter', gptRouter);

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})
