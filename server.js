const express = require('express');
const { limiter } = require('./src/utils/secure_rate');
const https = require('https');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const indexRoutes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');
const usersRoutes = require('./src/routes/users');
const invoicesRoutes = require('./src/routes/invoices');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/upload');

const app = express();

app.use(function (request, response, next) {
  if (!request.secure) 
    return response.redirect('https://' + request.headers.host + request.url);
  next();
});

const corsOptions = {
    origin: "https://locahost:3000",
    credentials: true,
    methods: ['GET', 'POST']
};

app.use(limiter());
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: () => {
    return {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60000
    }
  }
}));

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);

https.createServer({
  key: fs.readFileSync('selfSigned.key'),
  cert: fs.readFileSync('selfSigned.crt')
  }, app)
  .listen(3000, '0.0.0.0', () => {
  console.log('Lynoria API running 0.0.0.0 on port 3000 with HTTPS');
});