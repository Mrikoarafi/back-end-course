require('./src/configs/v1/mongoose.js');
const express = require('express');
const app = express();
const env = require('./src/helpers/v1/env');
const PORT = env.PORT || process.env.PORT;
const usersRouter = require('./src/routes/v1/users');
const adminsRouter = require('./src/routes/v1/admin');
const coursesRouter = require('./src/routes/v1/courses');
const bodyParser = require('body-parser');

// socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const qrCode = require('./src/helpers/v1/sendWhatsapp');
qrCode.qrcode(io);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1/admin', adminsRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/users', usersRouter);

server.listen(PORT, () => {
  console.log(`Server connect to server ${PORT}`);
});
