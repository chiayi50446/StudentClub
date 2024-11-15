import config from './config/config.js'
import app from './server/express.js'
import mongoose from 'mongoose'
import eventRoutes from './server/routes/event.routes.js';

app.use('/api', eventRoutes);

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
    dbName: 'StudentClub'
    //useNewUrlParser: true,
    //useCreateIndex: true, 
    //useUnifiedTopology: true 
})

    .then(() => {
        console.log("Connected to the database!");
    })

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`)
})
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Student Club application." });
});
app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
})
