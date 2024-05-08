require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const morgan = require('morgan');
 
const app = express();

app.use(morgan("dev"))
app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(cookieParser())


//#region // !Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);



io.on('connection', socket => {
    SocketServer(socket);
})

//#endregion

//#region // !Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
//#endregion

app.use("/ping", (req, res) => {
  res.json({msg: "api endpoint working"})
})

// Error handler
app.use((err, req, res, next) => {
  console.log("#".repeat(50))
  console.log("#".repeat(50))
  console.log("Error message: ", err?.message || err?.msg)
  console.log("Error name: ", err?.name)
  console.log("Error Stack:::::: ")
  console.error(err.stack); // Log the error stack trace
  console.log("#".repeat(50))
  console.log("#".repeat(50))
  res.status(500).send('Something broke!');
});


const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}, err => {
    if(err) throw err;
    console.log("Database Connected!!")
})

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log("Listening on ", port);
});