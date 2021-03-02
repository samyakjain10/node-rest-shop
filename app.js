const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user')

mongoose.connect(
    "mongodb+srv://root:"+
     process.env.MONGO_ATLAS_PW +
    "@node-rest-shop.wwu4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false,  useCreateIndex: true }
);

//Morgan used as a middleware logger
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

//Body Parser used as a middleware to parse req body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


//If no route found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//Handle errors other than not found
//Handle db errors etc
app.use((error, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
