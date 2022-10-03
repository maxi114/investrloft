const express = require('express');
const router = express.Router({ caseSensitive: true });
const Product = require('../models/product.js');
const Investor = require('../models/investor');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const grid = require("gridfs-stream");
const Msg = require("../models/message");
const fs = require("file-system");
const path = require('path');
const Industry = require('../models/industry.js')
const Startup = require('../models/startup.js');
const Investment = require("../models/investments.js")
const MailMessage = require('nodemailer/lib/mailer/mail-message');
const { createSecretKey } = require('crypto');
const { Server } = require('http');
const dotenv = require('dotenv');//store the secret

//load in secret variable
dotenv.config({ vaerbose: true });

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Gmail,
        pass: process.env.Gmailpwd,
    }
});

//route to aprrove or unapprove startups
router.post("/approve", ((req, res) => {

    //find the startup
    Product.findOne({ _id: req.body.prid }, (err, data) => {

        //var to store entrepreneurs email
        var email = data.Entrepreneur_Email

        if (req.body.approve == "approved") {
            //approve the startup
            data.Approved = req.body.approve
            data.Public = true

            data.save((err, document) => {
                if (document) {
                    //compose the email
                    var mailOptions = {
                        from: 'investrloft@gmail.com',
                        to: email,
                        subject: 'Approved',
                        html: "<div>" +
                            '<h1 style = \"color: black;\" > Approved </h1> ' +
                            '<p style = \"color: black;\">Congratulations, your startup is approved. </P>' +
                            '<h4> click <a href="http://investrloft.com/login/">here to login to your account</a></h4>' +
                            "</div>",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                     });

                    res.send("sent")
                }

                if (err) {
                    res.send("err")
                }
            })
        }

        if (req.body.approve == "disapproved") {
            //approve the startup
            data.Approved = req.body.approve
            data.Public = false

            data.save((err, document) => {
                if (document) {
                    //compose the email
                    var mailOptions = {
                        from: 'investrloft@gmail.com',
                        to: email,
                        subject: 'disapproved',
                        html: "<div>" +
                            '<h1 style = \"color: black;\" > disapproved </h1> ' +
                            '<p style = \"color: black;\">Unfortunately your startup was not approved. Email support@investrloft.com with any questions.</P>' +
                            '<h4> click <a href="http://investrloft.com/login/">here to login to your account</a></h4>' +
                            "</div>",
                    };

                    transporter.sendMail(mailOptions, function (error, info) { });

                    res.send("sent")
                }

                if (err) {
                    res.send("err")
                }
            })
        }

    })

}))

//route to get startups that are pending
router.post("/strtn", ((req, res) => {

    //find the startups
    Product.find({ Approved: "pending" }, (err, data) => {
        res.send(data)
    })
}))

//route to get all startups that are approved
router.post("/stapr", ((req, res) => {

    //find the startups
    Product.find({ Approved: "approved" }, (err, data) => {
        res.send(data)
    })
}))

//route to get a;; startups that are disapproved
router.post("/disapproved", ((req, res) => {

    //find the startups
    Product.find({ Approved: "disapproved" }, (err, data) => {
        res.send(data)
    })
}))

//route to delete the industrys
router.post("/deleteIndustry", ((req, res) => {

    //find the industry
    Industry.findOne({ Title: req.body.title }, (err, data) => {
        data.remove()
        res.send("done")
    })

}))

//route to turn industry online or offline
router.post("/IndusOffline", ((req, res) => {

    //find the industry
    Industry.findOne({ Title: req.body.title }, (err, data) => {

        if (req.body.off == "yes") {
            data.Live = false
            data.save();
            res.send("done")
        }

        else {
            data.Live = true
            data.save();
            res.send("done")
        }
    })

}))

router.post("/industry", ((req, res) => {

    //see of the indudtry title exists
    Industry.findOne({ Title: req.body.title }).then(data => {

        //if it exists
        if (data) {
            res.send("exists")
        }

        //if it doesnt exists
        else {

            var industry = new Industry();

            industry.Title = req.body.title;

            //loop through the subtitles
            if (req.body.sub) {
                for (var i = 0; i < req.body.sub.length; i++) {
                    industry.SubTitle.push(req.body.sub[i])
                }
            }

            industry.Live = req.body.live;
            industry.Uses = 0

            industry.save(function (err, document) {
                res.send('done')
            })
        }
    })
}))

//route to approve investors
router.post("/approve", ((req, res) => {
    Investor.findOne({ _id: req.body.invid }, (err, data) => {

        //approve investor
        data.Approved = true;
        data.save()
        res.send("approved")
    })
}))

//route to unapprove investors
router.post("/unapprove", ((req, res) => {
    Investor.findOne({ _id: req.body.invid }, (err, data) => {

        //approve investor
        data.Approved = false;
        data.save()
        res.send("unapproved")
    })
}))


//route to send all the industries
router.post("/industry1", ((req, res) => {

    //see of the indudtry title exists
    Industry.find().then(data => {

        //if it exists
        if (data) {
            res.send(data)
        }

        //if it doesnt exists
        else {
            req.send("No Startups yet")
        }
    })
}))

//route to get investors that need approvement
router.post("/approvement", ((req, res) => {


    //find investors that need approvement
    Investor.find({ Approved: false }).then(data => {

        if (data.length !== 0) {
            res.send(data)
        }

        else {
            res.send("No investors")
        }

    })

}))

//route to get all the featured investors
router.post("/feature", ((req, res) => {

    //find investors that featured
    Investor.find({ Feature: true }).then(data => {

        if (data.length !== 0) {
            res.send(data)
        }

        else {
            res.send("No investors")
        }

    })
}))

//route to get approved investors
router.post("/invest", ((req, res) => {

    //find all investors
    Investor.find({ Approved: true }).then(data => {

        if (data.length !== 0) {
            res.send(data)
        }

        else {
            res.send("No investors")
        }

    })
}))

//route to feature investors on the homepage
router.post("/feature2", ((req, res) => {
    Investor.findOne({ _id: req.body.invid }, (err, data) => {

        //approve investor
        data.Feature = true;
        data.save()
        res.send("featured")
    })
}))

//route to feature investors on the homepage
router.post("/unfeature2", ((req, res) => {
    Investor.findOne({ _id: req.body.invid }, (err, data) => {

        //approve investor
        data.Feature = false;
        data.save()
        res.send("featured")
    })
}))

module.exports = router