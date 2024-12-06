import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import clubRoutes from './routes/club.routes.js'
import eventRoutes from './routes/event.routes.js'
import path from 'path'

const allowedOrigins = [
    'http://localhost:4173',
    'http://localhost:5173',
    'https://test-firebase-project-5f453.web.app',
]

const app = express()
const CURRENT_WORKING_DIR = process.cwd()
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true) // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'), false) // Block the request
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify the allowed headers
}))

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', clubRoutes)
app.use('/', eventRoutes)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message })
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})


export default app
