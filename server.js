//require npm packages
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const gridFsStorage = require('multer-gridfs-storage');
const grid = require("gridfs-stream");
const Startup = require('./models/startup.js');
const Product = require('./models/product.js')
const dotenv = require('dotenv');//store the secret 

//load in router
const router = require('./routes/admin.js');
const router1 = require('./routes/api.js');
const router2 = require('./routes/entrepreneur.js');
const router3 = require('./routes/investor.js');
const { data } = require('jquery');
//db connection string
const db = "mongodb://db:27017/investrloft"




const stripe = require('stripe')(process.env.StripeSK);

//load in secret variable
dotenv.config({ vaerbose: true });

//port server
const port = 5000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true, useFindAndModify : false, useUnifiedTopology: true, useCreateIndex: true }, function (err) {
  if (err) {
    console.log(err)
  }
});

var conn = mongoose.connection;

var gfs;

conn.once('open', function () {
  console.log('-connection open to database- server');

  // intialize stream
  gfs = grid(mongoose.connection.db, mongoose.mongo)

  gfs.collection('uploads');//collection name

})

mongoose.connection.on('disconnected', function () {
  console.log('succesfully disconnected from ' + db);
});

mongoose.connection.on('error', function () {
  console.log('an error has occured to ' + db);
});

//configure middleware
const app = express();

// Match the raw body to content type application/json
app.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), (request, response) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      request.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    console.log(`âš ï¸  Webhook signature verification failed.`);
    console.log(
      `âš ï¸  Check the env file and enter the correct webhook secret.`
    );
    return response.sendStatus(400);
  }

  // Extract the object from the event.
  const dataObject = event.data.object;

  //store the stripe customer
  const customerId = dataObject.customer

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  switch (event.type) {
    case 'invoice.paid':

      //find startup with this customer id
      Startup.findOne({ stripeCustomerId: customerId }, (err, data) => {
        if (data) {
          data.Subscription = "active"
          data.save();


          //find the startups product and hide it from investors
          Product.find({ Entrepreneur_Email: data.Email })
            .then(data => {

              if (data.length > 0) {
                //loop through the data
                for (var i = 0; i < data.length; i++) {
                  data[i].Public = true;
                  data[i].save();
                }
              }

            })

        }
      })

      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      break;
    case 'invoice.payment_failed':

      //find startup with this customer id
      Startup.findOne({ stripeCustomerId: customerId }, (err, data) => {
        if (data) {
          data.Subscription = "past_due"
          data.save();


          //find the startups product and hide it from investors
          Product.find({ Entrepreneur_Email: data.Email })
            .then(data => {

              if (data.length > 0) {
                //loop through the data
                for (var i = 0; i < data.length; i++) {
                  data[i].Public = false;
                  data[i].save();
                }
              }

            })

        }
      })

      break;

    case 'customer.subscription.deleted':

      //find startup with this customer id
      Startup.findOne({ stripeCustomerId: customerId}, (err, data) => {
        if (data) {
          data.Subscription = "inactive"
          data.save();


          //find the startups product and hide it from investors
          Product.find({ Entrepreneur_Email: data.Email })
            .then(data => {

              if (data.length > 0) {
                //loop through the data
                for (var i = 0; i < data.length; i++) {
                  data[i].Public = false;
                  data[i].save();
                }
              }

            })
        }
      });

      break;
    default:
    // Unexpected event type
  }
  response.sendStatus(200);
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/src/controller')));
app.use(express.static(path.join(__dirname + '/src')));
app.use(express.static(path.join(__dirname + "/src/Investor")));
app.use(express.static(path.join(__dirname + '/src/Entrepreneur')));
app.use(express.static(path.join(__dirname + '/src/Administrator')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/admin', router);
app.use('/api', router1);
app.use('/entrepreneur', router2);
app.use('/investor', router3);
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/src/controller/controller.html')
})

//port connection
app.listen(port, function () {
  console.log('listening for connections on port: ' + port)
})


