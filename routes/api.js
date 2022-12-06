const express = require('express');
const router = express.Router({ caseSensitive: true });
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const Investor = require('../models/investor.js');
const Startup = require('../models/startup.js')
const randomString = require("randomstring");
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product.js');
const mongoose = require('mongoose');
const crypto = require('crypto');
const gridFsStorage = require('multer-gridfs-storage');
const grid = require("gridfs-stream");
const methodOverrid = require('method-override');
const fs = require("file-system");
const Industry = require("../models/industry");
const Investment = require("../models/investments.js")
var util = require('util');
const bodyParser = require('body-parser');
const Request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const dotenv = require('dotenv');//store the secret 

//load in secret variable
dotenv.config({ vaerbose: true });

mailchimp.setConfig({
    apiKey: process.env.MailchimpApi,
    server: process.env.MailchimpServer,
});

//db connection string
const db = "mongodb://db:27017/investrloft"

const stripe = require('stripe')(process.env.StripeSK);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Gmail,
        pass: process.env.Gmailpwd,
    }
});

var conn = mongoose.connection;

var gfs;

conn.once('open', function () {
    console.log('-connection open to database- api');

    // intialize stream
    gfs = grid(mongoose.connection.db, mongoose.mongo)

    gfs.collection('profile');//collection name

})

//route to get investors for the home screen
router.post("/homeInvestor", ((req,res)=>{

    //look for investors who are home page feature approved
    Investor.find({Feature: true})
    .then(data =>{
        var investor;

        //function to randomly shuffle the investors
        function shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }

            res.send(a)
        }

        shuffle(data)

    })

}))

//route for refering investors
router.post("/referinvtstr", ((req,res)=>{

    //store users email
    var Email = req.body.email;

    //mail chimp
    (async () => {

        try {
            const response1 = await mailchimp.lists.getListMember(
                process.env.MailchimpAudienceid,
                Email
            );

            
            if (response1.status == "subscribed" || response1.status == "unsubscribed" || response1.status == "cleaned") {

                const response = await mailchimp.lists.updateListMember(
                    process.env.MailchimpAudienceid,
                    Email,
                    {
                        email_address: Email,
                        status: "subscribed",
                    },

                );

            }

            else{
                const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                    email_address: Email,
                    status: "subscribed",

                });
            }

        } catch (e) {
            if (e.status === 404) {
                const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                    email_address: Email,
                    status: "subscribed",

                });
            }
        }

        const response2 = await mailchimp.lists.updateListMemberTags(
            process.env.MailchimpAudienceid,
            Email,
            {
                body: {
                    tags: [
                        {
                            name: "ReferStartup",
                            status: "inactive",
                        },
                        {
                            name: "ReferInvstr",
                            status: "active",
                        },
                    ],
                },
            }
        );

        res.send("done")
    })();
}))

//route for refering startups
router.post("/referstartup", ((req,res)=>{

    //store users email
    var Email = req.body.email;

    //mail chimp
    (async () => {

        try {
            const response1 = await mailchimp.lists.getListMember(
                process.env.MailchimpAudienceid,
                Email
            );

            
            if (response1.status == "subscribed" || response1.status == "unsubscribed" || response1.status == "cleaned") {

                const response = await mailchimp.lists.updateListMember(
                    process.env.MailchimpAudienceid,
                    Email,
                    {
                        email_address: Email,
                        status: "subscribed",
                    },

                );

            }

            else{
                const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                    email_address: Email,
                    status: "subscribed",

                });
            }

        } catch (e) {
            if (e.status === 404) {
                const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                    email_address: Email,
                    status: "subscribed",

                });
            }
        }

        const response2 = await mailchimp.lists.updateListMemberTags(
            process.env.MailchimpAudienceid,
            Email,
            {
                body: {
                    tags: [
                        {
                            name: "ReferInvstr",
                            status: "inactive",
                        },
                        {
                            name: "ReferStartup",
                            status: "active",
                        },
                    ],
                },
            }
        );

        res.send("done")
    })();
}))

//route for contact us
router.post("/contactus", ((req, res)=>{

    //compose the email
    var mailOptions = {
        from: req.body.email,
        to: "investrloft@gmail.com",
        subject: "Message from " + req.body.name + " Email: " + req.body.email ,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if(info){
            res.send("sent")
        }
        if(error){
            res.send("An error occured!")
        }
    });

}))
//route to retrieve user data
router.post("/info", ((req, res) => {

    //store the user data
    var data1 = []

    if (req.body.account == "investor") {

        //get the investor data
        Investor.findOne({ _id: req.body.id }, (err, data) => {
            if (data) {
                data1.push(data)

                //var to store the startups
                var data2 = [];
                if (data.Requested.length > 0) {

                    //to track if the loop is done
                    var k = 0;
                    //loop through the startups
                    for (var i = 0; i < data.Requested.length; i++) {

                        (function (datap) {
                            Product.findOne({ _id: datap }, (err, data) => {
                                if (data) {
                                    data2.push(data)
                                    k++
                                    if (k == i) {
                                        data1.push(data2)
                                        res.send(data1)
                                    }
                                }
                                else {
                                    k++
                                    if (k == i) {
                                        data1.push(data2)
                                        res.send(data1)
                                    }
                                }
                            })

                        }(data.Requested[i].Product));
                    }

                }

                else {
                    data1.push(data2)
                    res.send(data1)
                }
            }
        })
    }

    if (req.body.account == "startup") {

        //get the startup data
        Startup.findOne({ _id: req.body.id }, (err, data) => {
            data1.push(data)

            //get all the entrepreneurs listed startups
            Product.find({ Entrepreneur_Email: data.Email })
                .then(data2 => {

                    if (data2.length > 0) {
                        data1.push(data2)
                        res.send(data1)
                    }

                    else {
                        res.send(data1)
                    }
                })
        })
    }

}));

//verification of tokens 
router.post('/verify', function (request, response) {
    if (!request.body.token) {
        return response.status(400).send('No token has been provided')
    }
    jwt.verify(request.body.token, process.env.secret, function (err, decoded) {
        if (err) {
            return response.status(400).send('Error with token')
        }
        return response.status(200).send(decoded);
    })
})



router.post('/create-subscription', async (req, res) => {
    // Attach the payment method to the customer
    try {
        await stripe.paymentMethods.attach(req.body.paymentMethodId, {
            customer: req.body.customerId,
        });
    } catch (error) {
        return res.status('402').send({ error: { message: error.message } });
    }

    // Change the default invoice settings on the customer to the new payment method
    await stripe.customers.update(
        req.body.customerId,
        {
            invoice_settings: {
                default_payment_method: req.body.paymentMethodId,
            },
        }
    );

    Startup.findOne({ Email: req.body.email }, (err, data) => {
        //store the customer id and payment_method in a token
        var customerinfo = jwt.sign({
            customerid: req.body.customerId,
            paymethod: req.body.paymentMethodId,
        }, process.env.secret)

        if (data) {

            data.customer = customerinfo,
                data.save();
        }
        else {

            Investor.findOne({ Email: req.body.email }, (err, data) => {
                data.customer = customerinfo,
                    data.save();
            })
        }
    })

    if (req.body.subscription2 == "inactive") {
        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: req.body.customerId,
            items: [{ price: req.body.priceId }],
            expand: ['latest_invoice.payment_intent'],
        });

        Startup.findOne({ Email: req.body.email }, (err, data) => {

            if (data) {

                data.subscriptionId = subscription.id
                data.save();
            }
            else {

                Investor.findOne({ Email: req.body.email }, (err, data) => {
                    data.subscriptionId = subscription.id
                    data.save();
                })
            }
        })
        res.send(subscription);

    }
    else {
        res.send("done")
    }

});

router.post("/customerPortal", async (req, res) => {
    var session = await stripe.billingPortal.sessions.create({
        customer: req.body.customerId,
        return_url: 'https://example.com/account',
    });

    res.send(session)
})

router.post('/reactive-subscription', async (req, res) => {

    Startup.findOne({ Email: req.body.email }, (err, data) => {
        if (data) {
            data.canceling = false;
            data.save();
        }
        else {
            Investor.findOne({ Email: req.body.email }, (err, data) => {
                data.canceling = false;
                data.save();
            })
        }
    })
    const subscription = await stripe.subscriptions.retrieve(req.body.subscriptionId);
    stripe.subscriptions.update(req.body.subscriptionId, {
        cancel_at_period_end: false,
    });

    res.send(subscription)
});

router.post('/retrieve-subscription', async (req, res) => {

    const subscription = await stripe.subscriptions.retrieve(
        req.body.subscriptionId
    );

    res.send(subscription)

});

router.post('/payments', async (req, res) => {

    const charges = await stripe.invoices.list({
        customer: req.body.customerId,
    });

    res.send(charges)

});


router.post('/cancel-subscription', async (req, res) => {

    Startup.findOne({ Email: req.body.email }, (err, data) => {
        if (data) {
            data.canceling = true;
            data.save();
        }
        else {
            Investor.findOne({ Email: req.body.email }, (err, data) => {
                data.canceling = true;
                data.save();
            })
        }
    })
    const subscription = await stripe.subscriptions.retrieve(req.body.subscriptionId);
    stripe.subscriptions.update(req.body.subscriptionId, {
        cancel_at_period_end: true,
    });

    res.send(subscription)
});

//route to retrieve card
router.post("/retrievecard", ((req, res) => {

    //find the boards data
    Startup.findOne({ Email: req.body.email }, (err, data) => {

        if (data) {
            const customer = jwt.decode(data.customer);

            stripe.paymentMethods.retrieve(
                customer.paymethod,
                function (err, paymentMethod) {
                    // asynchronously called
                    res.send(paymentMethod)
                }
            );

        }

        else {
            Investor.findOne({ Email: req.body.email }, (err, data) => {
                const customer = jwt.decode(data.customer);

                stripe.paymentMethods.retrieve(
                    customer.paymethod,
                    function (err, paymentMethod) {
                        // asynchronously called
                        res.send(paymentMethod)
                    }
                );


            })
        }

    })


}));

//route to show that user is subscribed
router.post("/subcomplete", (req, res) => {

    Startup.findOne({ Email: req.body.email }, (err, data) => {
        if (data) {

            data.Subscription = "active"
            data.save();
            res.send(data)
        }
        else {
            Investor.findOne({ Email: req.body.email }, (err, data) => {
                data.Subscription = "active"
                data.save();
                res.send(data)
            })
        }
    })
})

//get all the industries
router.get("/industry", (req, res) => {

    Industry.find({Live: true}).then(data => {
        res.send(data)
    })

})

router.post('/retry-invoice', async (req, res) => {
    // Set the default payment method on the customer

    try {
        await stripe.paymentMethods.attach(req.body.paymentMethodId, {
            customer: req.body.customerId,
        });
        await stripe.customers.update(req.body.customerId, {
            invoice_settings: {
                default_payment_method: req.body.paymentMethodId,
            },
        });
    } catch (error) {
        // in case card_decline error
        return res
            .status('402')
            .send({ result: { error: { message: error.message } } });
    }

    const invoice = await stripe.invoices.retrieve(req.body.invoiceId, {
        expand: ['payment_intent'],
    });
    res.send(invoice);
});

//check to see if the user is using the right account
router.post("/account", (req, res) => {

    //find the investor email
    Investor.findOne({ Email: req.body.Email }, (err, data) => {

        //if there is data
        if (data) {
            res.send(data)
        }

        //if data is undefined
        if (data == undefined) {

            //check the startup data
            Startup.findOne({ Email: req.body.Email }, (err, data) => {

                if (data) {
                    res.send(data)
                }
                
            })
        }
    })
})

//change the password on the database
router.post('/pwrdreset', (request, response) => {
    const password = bcrypt.hashSync(request.body.user.password, bcrypt.genSaltSync(10));
    const token = request.body.url;

    //find a user with the token
    Startup.findOne({ PasswordResetToken: token }, (err, data) => {
        if (data) {
            data.Password = password;
            data.PasswordResetToken = "";
            data.save();
            response.send("password succesfully changed")
        }

        else {
            Investor.findOne({ PasswordResetToken: token }, (err, data) => {
                if (data) {
                    data.Password = password;
                    data.PasswordResetToken = "";
                    data.save();
                    response.send("password succesfully changed")
                }
                else {
                    response.send("this link has expired")
                }
            })
        }
    })

})

//send the reset password token to email
router.post('/reset', (request, response) => {
    const email = request.body.email.email;

    //generate secrettoken
    const token = randomString.generate();

    //save the token on the users data
    if (email) {
        function send() {
            //compose the email
            var mailOptions = {
                from: 'investrloft@gmail.com',
                to: email,
                subject: 'Reset password',
                html: "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                    "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                    '<h1 style = \"color: black;\" > Password change request </h1> ' +
                    '<p style = \"color: black;\"> you are receiving this because you (or someone else) have requested for a password change. if you did not request for a password change please ignore this email </P>' +
                    '<h4> click <a href="localhost:8080/reset/' + token + '">here to change your password</a></h4>' +
                    "</div>",
            };

            transporter.sendMail(mailOptions, function (error, info) {

            });

            response.send("an email has been sent to " + email + " with further instructions");
        }

        Startup.findOne({ Email: email }, (err, data) => {


            if (data) {
                data.PasswordResetToken = token
                data.save();
                send();
            }

            else {
                Investor.findOne({ Email: email }, (err, data) => {

                    if (data) {
                        data.PasswordResetToken = token
                        data.save();
                        send();
                    }

                    else {
                        response.send('no email found')
                    }
                })
            }

        })


    }

})


//startup account registration
router.post('/startuprgt', function (request, response) {

    //see if user exists in Investors data
    Investor.findOne({ Email: request.body.startup.email }, (err, data) => {
        //if email exists
        if (data) {
            response.send("exists");
            return;
        }

        //if email doesnt exists
        if (data == undefined) {

            //check startups data
            Startup.findOne({ Email: request.body.startup.email }, (err, data) => {

                //if user exists
                if (data) {
                    response.send("exists");
                    return;
                };

                //if user doesnt exist
                if (data == undefined) {

                    //get date
                    var currentdate = new Date();

                    //get current date
                    var datetime = (currentdate.getMonth() + 1) + "/"
                        + currentdate.getDate() + "/"
                        + currentdate.getFullYear();


                    var startup = new Startup();

                    var email = request.body.startup.email
                    email = email.toLowerCase();

                    startup.Email = email;
                    startup.FirstName = request.body.startup.FirstName;
                    startup.LastName = request.body.startup.LastName;
                    startup.PhoneNumber = request.body.startup.PhoneNumber;
                    startup.School = request.body.startup.School;
                    startup.Bio = request.body.startup.bio;
                    startup.lat = request.body.startup.lat;
                    startup.long = request.body.startup.long;
                    startup.City = request.body.startup.city;
                    startup.State = request.body.startup.state;
                    startup.Country = request.body.startup.country;
                    startup.Position = request.body.startup.position;
                    startup.Password = bcrypt.hashSync(request.body.startup.password, bcrypt.genSaltSync(10));
                    startup.Account = "startup";
                    startup.public = true;
                    startup.Disabled = false;
                    startup.RegistrationDate = datetime;
                    startup.Subscription = "free";

                    //generate email verification token
                    const evt = randomString.generate();
                    startup.EmailVerificationToken = evt;

                    //flag account as inactive
                    startup.Active = false;

                    //save user in the database
                    startup.save(function (err, document) {
                        //store the user info in a token      
                        var token = jwt.sign({
                            data: document
                        }, process.env.secret, { expiresIn: 60 });

                        response.send(token);

                    })

                    //compose email
                    var mailOptions = {
                        from: 'investrloft@gmail.com',
                        to: startup.Email,
                        subject: 'Verify email',
                        html: "<div style = \"text-align:center; \">" +
                            "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon2.ico.png\" alt=\"Logo\">" +
                            "<h2>click the button below to verify your email</h2>" +
                            "<br>" +
                            '<a href="http://localhost:8080/vemail/' + startup.EmailVerificationToken + '" style = \"font-size: 20px; soutline: none; height: 25px; width: 50px; background-color: black; color: white; text-decoration: none; padding: 15px; border-radius: 10px;\">Verify email</a>' +
                            "<br>" +
                            "</div>",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {

                    });

                }

            });
        }
    });
});

//profile image
router.post('/profile', function (req, res) {

    gfs.files.findOne({ 'metadata.email': req.body.user }, (err, file) => {

        if (file !== null) {


            var type = file.contentType.split("/")
            type = type[1];

            //write the images to a writeto folder
            var writestream = fs.createWriteStream(path.join(__dirname, '../src/profile/' + file._id + "." + type));

            //read the files
            var read = gfs.createReadStream({ _id: file._id })

            read.pipe(writestream);
            writestream.on('close', function () {
                res.send(file._id + "." + type)
            })

        }
        if (file == null) {
            res.send("none")
        }
    })

})

//profile imageon investors startup
router.post('/profile2', function (req, res) {

    gfs.files.findOne({ 'metadata.email': req.body.user }, (err, file) => {

        if (file !== null) {


            var type = file.contentType.split("/")
            type = type[1];

            //write the images to a writeto folder
            var writestream = fs.createWriteStream(path.join(__dirname, '../src/profile/' + file._id + "." + type));

            //read the files
            var read = gfs.createReadStream({ _id: file._id })

            read.pipe(writestream);
            writestream.on('close', function () {
                res.send(file)
            })

        }
        else {
            res.send("none")
        }
    })

})

//investor account registration
router.post('/investorgt', function (request, response) {

    //check to see if email exists in startups data
    Startup.findOne({ Email: request.body.investor.email }, (err, data) => {

        //if email exists
        if (data) {
            response.send("exists");
            return;
        }

        //if email doesnt exist
        if (data == undefined) {

            //check the investors data
            Investor.findOne({ Email: request.body.investor.email }, (err, data) => {

                //if user exists
                if (data) {
                    response.send("exists");
                    return;
                };

                //if user doesnt exist
                if (data == undefined) {

                    //get date
                    var currentdate = new Date();

                    //get current date
                    var datetime = (currentdate.getMonth() + 1) + "/"
                        + currentdate.getDate() + "/"
                        + currentdate.getFullYear();


                    var investor = new Investor();

                    //ceck if user has input industries
                    if (request.body.industry.length > 0) {

                        //loop through the insudtry
                        for (var i = 0; i < request.body.industry.length; i++) {

                            //push in the investor data
                            investor.Industry.push(request.body.industry[i])
                        }
                    }
                    var email = request.body.investor.email
                    email = email.toLowerCase();

                    investor.Email = email;
                    investor.FirstName = request.body.investor.FirstName;
                    investor.LastName = request.body.investor.LastName;
                    investor.PhoneNumber = request.body.investor.PhoneNumber;
                    investor.Bio = request.body.investor.bio;
                    investor.InvestorType = request.body.investor.type;
                    investor.lat = request.body.investor.lat;
                    investor.long = request.body.investor.long;
                    investor.City = request.body.investor.city;
                    investor.State = request.body.investor.state;
                    investor.Budget = request.body.investor.budget;
                    investor.Country = request.body.investor.country;
                    investor.Password = bcrypt.hashSync(request.body.investor.password, bcrypt.genSaltSync(10));
                    investor.Account = "investor";
                    investor.Requests = 0;
                    investor.public = true;
                    investor.Disabled = false;
                    investor.RegistrationDate = datetime;
                    investor.Feature = false;
                    investor.Approved = false;

                    //generate email verification token
                    const evt = randomString.generate();
                    investor.EmailVerificationToken = evt;

                    //flag account as inactive
                    investor.Active = false;

                    //save user in the database
                    investor.save(function (err, document) {
                        //store the user info in a token      
                        var token = jwt.sign({
                            data: document
                        }, process.env.secret, { expiresIn: 60 });

                        response.send(token);

                    })

                    //compose email

                    var mailOptions = {
                        from: 'investrloft@gmail.com',
                        to: investor.Email,
                        subject: 'Verify email',
                        html: "<div style = \"text-align:center; \">" +
                            "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon2.ico.png\" alt=\"Logo\">" +
                            "<h2>click the button below to verify your email</h2>" +
                            "<br>" +
                            '<a href="http://localhost:8080/vemail/' + investor.EmailVerificationToken + '" style = \"font-size: 20px; soutline: none; height: 25px; width: 50px; background-color: black; color: white; text-decoration: none; padding: 15px; border-radius: 10px;\">Verify email</a>' +
                            "<br>" +
                            "</div>",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {

                        
                    });
                }

            });
        }
    })

});

//get the stripe customer id
router.post("/cusid", (req, res) => {
    Startup.findOne({ Email: req.body.email }, (err, data) => {
        if (data) {
            res.send(data.stripeCustomerId)
        }
        else {
            Investor.findOne({ Email: req.body.email }, (err, data) => {
                res.send(data.stripeCustomerId)
            })
        }
    })
});

//verify email sent token
router.post('/vemail', (request, response,) => {

    const secret = request.body.url;

    if (secret) {
        //find account that matches the secret token
        Startup.findOne({ EmailVerificationToken: secret }, (err, data) => {
            if (data) {

                //mail chimp
                (async () => {

                    try {
                        const response1 = await mailchimp.lists.getListMember(
                            process.env.MailchimpAudienceid,
                            data.Email
                        );

                        
                        if (response1.status == "subscribed" || response1.status == "unsubscribed" || response1.status == "cleaned") {

                            const response = await mailchimp.lists.updateListMember(
                                process.env.MailchimpAudienceid,
                                data.Email,
                                {
                                    email_address: data.Email,
                                    status: "subscribed",
                                    merge_fields: {
                                        FNAME: data.FirstName,
                                        LNAME: data.LastName,
                                    },
                                },

                            );



                        }
                        else{
                            const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                                email_address: data.Email,
                                status: "subscribed",
                                merge_fields: {
                                    FNAME: data.FirstName,
                                    LNAME: data.LastName,
                                },

                            });
                        }

                    } catch (e) {
                        if (e.status === 404) {
                            const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                                email_address: data.Email,
                                status: "subscribed",
                                merge_fields: {
                                    FNAME: data.FirstName,
                                    LNAME: data.LastName,
                                },

                            });
                        }
                    }


                    const response6 = await mailchimp.lists.updateListMemberTags(
                        process.env.MailchimpAudienceid,
                        data.Email,
                        {
                            body: {
                                tags: [
                                    {
                                        name: "DelInve",
                                        status: "inactive",
                                    },
                                    {
                                        name: "Investor",
                                        status: "inactive",
                                    },
                                    {
                                        name: "Entrepreneur",
                                        status: "inactive",
                                    },
                                    {
                                        name: "DelEntr",
                                        status: "inactive",
                                    },
                                ],
                            },
                        }
                    );
                    const response2 = await mailchimp.lists.updateListMemberTags(
                        process.env.MailchimpAudienceid,
                        data.Email,
                        {
                            body: {
                                tags: [
                                    {
                                        name: "Entrepreneur",
                                        status: "active",
                                    },
                                ],
                            },
                        }
                    );
                })();

                (async () => {
                    //create customer
                    const customer = await stripe.customers.create({
                        email: data.Email,
                        name: data.FirstName + " " + data.LastName,
                        description: data.Account,
                    }).catch(e => { throw e })
                    // save the customer.id as stripeCustomerId
                    // in your database.

                     data.Active = true;
                     data.stripeCustomerId = customer.id
                     data.EmailVerificationToken = "";
                     data.save();


                     response.send("your email is verified you may now log in")
                })();


            }



            else {
                //check the investors data
                Investor.findOne({ EmailVerificationToken: secret }, (err, data) => {
                    if (data) {

                        //mail chimp
                        (async () => {

                            try {
                                const response1 = await mailchimp.lists.getListMember(
                                    process.env.MailchimpAudienceid,
                                    data.Email
                                );
        
                                if (response1.status == "subscribed" || response1.status == "unsubscribed" || response1.status == "cleaned") {
        
                                    const response = await mailchimp.lists.updateListMember(
                                        process.env.MailchimpAudienceid,
                                        data.Email,
                                        {
                                            email_address: data.Email,
                                            status: "subscribed",
                                            merge_fields: {
                                                FNAME: data.FirstName,
                                                LNAME: data.LastName,
                                            },
                                        },
        
                                    );
        
        
        
                                }
                                else{
                                    const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                                        email_address: data.Email,
                                        status: "subscribed",
                                        merge_fields: {
                                            FNAME: data.FirstName,
                                            LNAME: data.LastName,
                                        },
        
                                    });
                                }
        
                            } catch (e) {
                                if (e.status === 404) {
                                    const response = await mailchimp.lists.addListMember(process.env.MailchimpAudienceid, {
                                        email_address: data.Email,
                                        status: "subscribed",
                                        merge_fields: {
                                            FNAME: data.FirstName,
                                            LNAME: data.LastName,
                                        },
        
                                    });
                                }
                            }

                            const response6 = await mailchimp.lists.updateListMemberTags(
                                process.env.MailchimpAudienceid,
                                data.Email,
                                {
                                    body: {
                                        tags: [
                                            {
                                                name: "DelInve",
                                                status: "inactive",
                                            },
                                            {
                                                name: "Investor",
                                                status: "inactive",
                                            },
                                            {
                                                name: "Entrepreneur",
                                                status: "inactive",
                                            },
                                            {
                                                name: "DelEntr",
                                                status: "inactive",
                                            },
                                        ],
                                    },
                                }
                            );

                            const response2 = await mailchimp.lists.updateListMemberTags(
                                process.env.MailchimpAudienceid,
                                data.Email,
                                {
                                    body: {
                                        tags: [
                                            {
                                                name: "Investor",
                                                status: "active",
                                            },
                                        ],
                                    },
                                }
                            );

                        })();

                        // in the database.
                        data.Active = true;
                        data.EmailVerificationToken = "";
                        data.save();

                        response.send("your email is verified you may now log in")
                    }
                    else {
                        response.send("this link has expired")
                    }
                })
            }
        });
    }

})

//login
router.post('/login', (request, response) => {


    if (request.body.email && request.body.password) {

        Investor.findOne({ Email: request.body.email }, (err, investor) => {
            if (err) {
                return response.status(400).send('error')
            }

            //if ther is no investor
            if (!investor) {

                //look in the startup account
                Startup.findOne({ Email: request.body.email }, (err, startup) => {
                    if (err) {
                        return response.status(400).send('error');
                    }

                    //if there is no account
                    if (!startup) {
                        response.send("NoAccount");
                        return;
                    }

                    //check to see if account is activated or not
                    if (startup.Active == false) {
                        return response.status(400).send("inactive");
                    }

                    if (bcrypt.compareSync(request.body.password, startup.Password)) {
                        const token = jwt.sign({
                            data: startup
                        }, process.env.secret, { expiresIn: 36000 })
                        return response.status(200).send(token);
                    }
                    return response.status(400).send('Wrong email or password')
                })

                return;
            }

            //if there is no account
            if (!investor) {
                response.send("NoAccount");
                return;
            }

            if (investor.Active == false) {

                return response.status(400).send('inactive')
            }

            if (bcrypt.compareSync(request.body.password, investor.Password)) {
                const token = jwt.sign({
                    data: investor
                }, process.env.secret, { expiresIn: 36000 })
                return response.status(200).send(token);
            }
            return response.status(400).send('Wrong email or password')
        })
    }
    else {
        response.send("missing")
    }
})

//set storage engine
const storage = new gridFsStorage({

    url: db,
    options: { useUnifiedTopology: true },
    file: (req, file) => {

        return new Promise((resolve, reject) => {



            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "profile",
                    metadata: {
                        type: 'profile',
                        email: file.fieldname,
                    }
                };
                resolve(fileInfo);

            });

        });
    }
});

//upload
const upload = multer({ storage });

//post function to update the entrepreneurs profile
router.post("/update", upload.any(), (req, res) => {

    var inr = JSON.parse(req.body.industry)

    //remove the saved files
    gfs.files.find({ 'metadata.email': req.body.email, }).toArray((err, files) => {

        for (var f = 0; f < files.length - 1; f++) {
            //delete the previous file
            gfs.remove({ _id: files[0]._id, root: 'profile' }, (err, GridFSBucket) => {
            })
        }

    })

    //look for account type
    //if account type is startup account
    if (req.body.account == "startup") {

        //update products location
        Product.find({ Entrepreneur_Email: req.body.email })
            .then(data => {

                //loop through the data
                for (var i = 0; i < data.length; i++) {

                    data[i].Startup_Location.Country = req.body.country;
                    data[i].Startup_Location.State = req.body.state;
                    data[i].Startup_Location.City = req.body.city;
                    data[i].lat = req.body.lat;
                    data[i].long = req.body.long;

                    data[i].save();
                }
            })

        //update entrepreneurs profile
        Startup.updateOne({ Email: req.body.email }, {
            $set: {
                FirstName: req.body.fname,
                LastName: req.body.lname,
                Bio: req.body.bio,
                Country: req.body.country,
                State: req.body.state,
                City: req.body.city,
                lat: req.body.lat,
                long: req.body.long,
            }
        }, (err, data) => {
            res.send("saved")
        })
    }

    //if account type is investor acount
    if (req.body.account == "investor") {

        //update investors profile
        Investor.updateOne({ Email: req.body.email }, {
            $set: {
                FirstName: req.body.fname,
                LastName: req.body.lname,
                Bio: req.body.bio,
                Country: req.body.country,
                State: req.body.state,
                City: req.body.city,
                lat: req.body.lat,
                long: req.body.long,
            }
        }, (err, data) => {
            Investor.findOne({ Email: req.body.email }, (err, data) => {

                //remove the industry
                data.Industry = [];

                //push the new industry
                for (var i = 0; i < inr.length; i++) {
                    data.Industry.push(inr[i])
                }

                data.save()

                res.send("saved")
            })
        })



    }


})

//route to delete striope customer
router.post('/delete-customer', async (req, res) => {

    const deleted = await stripe.customers.del(
        req.body.customerId
    );

    res.send(deleted)

});

//delte account
router.post("/delete", (req, res) => {

    //if its a startup account
    if (req.body.account == "startup") {

        (async () => {
            const response2 = await mailchimp.lists.updateListMemberTags(
                process.env.MailchimpAudienceid,
                req.body.email,
                {
                    body: {
                        tags: [
                            {
                                name: "Entrepreneur",
                                status: "inactive",
                            },
                            {
                                name: "DelEntr",
                                status: "active",
                            },
                        ],
                    },
                }
            );
        })();

        //delete the startups accoubt
        Startup.findOne({ Email: req.body.email }, (err, data) => {

            data.remove();
        })

        //delete the products
        Product.find({ Entrepreneur_Email: req.body.email })
            .then(data => {

                if (data) {
                    //loop through the data
                    for (var i = 0; i < data.length; i++) {

                        //delete the ivestments
                        Investment.findOne({ PrId: data[i]._id }, (err, data2) => {
                            if (data2) {
                                data2.remove();
                            }
                        })

                        data[i].remove();

                    }
                }
            })

        //delete the images
        gfs.files.find({ 'metadata.email': req.body.email }).toArray((err, files) => {

            //loop through the files
            for (var f = 0; f < files.length; f++) {
                gfs.remove({ _id: files[f]._id, root: 'uploads' }, (err, GridFSBucket) => {
                })

                gfs.remove({ _id: files[f]._id, root: 'profile' }, (err, GridFSBucket) => {
                })
            }
        })

        res.send("done")
    }

    //if its an investors account
    if (req.body.account == "investor") {

        (async () => {
            const response2 = await mailchimp.lists.updateListMemberTags(
                process.env.MailchimpAudienceid,
                req.body.email,
                {
                    body: {
                        tags: [
                            {
                                name: "Investor",
                                status: "inactive",
                            },
                            {
                                name: "DelInve",
                                status: "active",
                            },
                        ],
                    },
                }
            );
        })();

        Investor.findOne({ Email: req.body.email }, (err, data) => {
            data.remove();
        })

        //delete the images
        gfs.files.find({ 'metadata.email': req.body.email }).toArray((err, files) => {

            //loop through the files
            for (var f = 0; f < files.length; f++) {

                gfs.remove({ _id: files[f]._id, root: 'profile' }, (err, GridFSBucket) => {
                })
            }
        })

        res.send("done")
    }
});

module.exports = router