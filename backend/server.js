const config = require('./config')();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config(); // Ensure environment variables are loaded

const { createProxyMiddleware } = require('http-proxy-middleware'); // Add this line

let cookieParser = require('cookie-parser');
let flash = require('connect-flash');
let session = require('express-session');

const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require('method-override');
const app = express();
app.use(cors());

let api_route = require('./routes/api_route');
let admin_route = require('./routes/admin_route');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/web3-script', express.static(path.join(__dirname, '/node_modules/web3')));

app.use(cookieParser());
app.use(session({
    secret: "1234567890",
    cookie: { maxAge: 2592000000 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-type,Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Proxy middleware configuration
const apiProxy = createProxyMiddleware({
  target: 'https://test.kuverse.app',
  changeOrigin: true,
  pathRewrite: {
    [`^/api`]: ''
  },
  onError: function(err, req, res) {
    res.send('An error occurred: ' + err.message);
  }
});
app.use('/api', apiProxy);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use('/api', api_route);
app.use('/admin-routes', admin_route);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Set up the server and increase the timeout setting
const server = app.listen(config.port || 5001, async function () {
    let d = new Date();
    console.log('[' + d.toLocaleString() + '] ' + 'Server listening on port ' + (config.port || 5001));
});

// Increase the server timeout to 500 seconds
server.setTimeout(500000); // Set timeout to 500 seconds




