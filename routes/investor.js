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
const Startup = require('../models/startup.js');
const Investment = require("../models/investments.js")
const MailMessage = require('nodemailer/lib/mailer/mail-message');

//compose email
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
    console.log('-connection open to database-inve');

    // intialize stream
    gfs = grid(mongoose.connection.db, mongoose.mongo)

    gfs.collection('uploads');//collection name

})


//get the type of industries the investor is intrested in
router.post("/ind", (req, res) => {

    //get investors data
    Investor.findOne({ Email: req.body.email }, (err, data) => {

        //check if investor has any intrest in specific industries
        if (data.Industry.length > 0) {
            res.send(data.Industry)
        }
        else {
            res.send("none")
        }
    })
})

//route to get entrepreneurs name
router.post('/entr', (req, res) => {

    //get the entrepreneur
    Startup.findOne({ Email: req.body.email }, (err, data) => {
        res.send(data)
    })
})

//route to check for unread messages
router.post("/not", (req, res) => {

    //find all mesages with the investors id
    Msg.find({ InvestorId: req.body.id })
        .then(data => {

            if (data.length == 0) {
                res.send("none")
                return;
            }

            //var to track how many messages are unread
            var p = 0;

            //var to track if the loop is done
            var k = 0
            //loop through the data
            for (var i = 0; i < data.length; i++) {

                //check to see if ReadInvestor is true
                if (data[i].ReadInvestor == true) {
                    p++;
                }

                k++
                if (k == data.length) {
                    if (p > 0) {
                        res.send(p.toString())
                    }

                    else {
                        res.send("none")
                    }
                }
            }
        })
})

//route to showcase the messages
router.post("/chat", (req, res) => {

    //find all messages with the investors id
    Msg.find({ InvestorId: req.body.id })
        .then(data => {

            //if there are no messages
            if (data.length == 0) {
                res.send("none")
                return;
            }

            //var to store the messages
            var all;

            //store unread mesages
            var m1 = []

            //store read messages
            var m2 = []

            // loop to check for read and unread messges
            for (var i = 0; i < data.length; i++) {

                //check if message is unread
                if (data[i].ReadInvestor == true) {
                    console.log(data[i])
                    m1.push(data[i])
                }
                else {
                    m2.push(data[i])
                }

            }

            all = m1.concat(m2)
            //send the messages
            res.send(all)
        })
})

//route to get the entrepreneurs info
router.post("/chat2", ((req, res) => {

    Startup.findOne({ _id: req.body.id }, (err, data) => {
        res.send(data)
    })
}))
//route to initiate message
router.post("/initiate", (req, res) => {

    //get date
    var currentdate = new Date();

    //get current date
    var datetime = (currentdate.getMonth() + 1) + "/"
        + currentdate.getDate() + "/"
        + currentdate.getFullYear();


    //get time
    var d = new Date();
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    m = m < 10 ? "0" + m : m;

    s = s < 10 ? "0" + s : s;

    var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

    var time = h + ":" + m;
    time += " " + dd;


    //check if there was a previous conversation between the investor and the entrepreneur
    Msg.findOne({ InvestorId: req.body.invid, EntrepreneurId: req.body.enid }, (err, data) => {


        if (data) {


            data.conversations = data.conversations + 1;

            data.ReadEntrepreneur = true;

            //if the investor is sending a request
            if (req.body.type == "request") {

                if (req.body.pid) {
                    var pid2 = req.body.pid.split("/")
                }

                data.Message.push({
                    Date: datetime,
                    Time: time,
                    Msg: req.body.msg,
                    Link: req.body.pid,
                    Act: "investor"
                })

                data.MsgType = req.body.type

                data.save(function (err, document) {

                    //find the investors data
                    Investor.findOne({ _id: req.body.invid }, (err, data) => {

                        data.Requests = data.Requests + 1;
                        data.Requested.push({
                            Product: pid2[0],
                            Status: "Pending"
                        })
                        data.save()

                        //fint the entrepreneur data
                        Startup.findOne({ _id: req.body.enid }, (err, data1) => {
                            //compose the email
                            var mailOptions = {
                                from: 'investrloft@gmail.com',
                                to: data1.Email,
                                subject: 'Investment Request',
                                html: "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                                    "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                                    '<h1 style = \"color: black;\" > Investment request </h1> ' +
                                    '<p style = \"color: black;\">An investor has requested to invest in your startup</P>' +
                                    '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                                    "</div>",
                            };

                            transporter.sendMail(mailOptions, function (error, info) { });
                        })

                        //check to see if this is the investors first request
                        if (data.Requests == 1) {
                            res.send("first")
                        }

                        else {
                            res.send("Sent")
                        }
                    })

                })

                //investments
                Investment.findOne({ PrId: pid2[0] }, (err, data) => {
                    if (data) {
                        data.Investors.push({
                            InvId: req.body.invid,
                            Accepted: false,
                        })

                        data.save();
                    }
                    else {
                        const investment = new Investment();

                        investment.PrId = pid2[0]
                        investment.Investors.push({
                            InvId: req.body.invid,
                            Accepted: false
                        })

                        investment.save(function (err, document) {

                        })
                    }
                })

            }

            else {

                data.Message.push({
                    Date: datetime,
                    Time: time,
                    Msg: req.body.msg,
                    Act: "investor"
                })

                data.save(function (err, document) {
                    
                })

                //fint the entrepreneur data
                Startup.findOne({ _id: req.body.enid }, (err, data1) => {
                    //compose the email
                    var mailOptions = {
                        from: 'investrloft@gmail.com',
                        to: data1.Email,
                        subject: 'New Message',
                        html: "<div>" +
                            '<h1 style = \"color: black;\" > New Message </h1> ' +
                            '<p style = \"color: black;\">New message from an investor.</P>' +
                            '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                            "</div>",
                    };

                    transporter.sendMail(mailOptions, function (error, info) { });

                    res.send("sent")
                })
            }


        }

        else {

            var msg = new Msg;

            var pid2 = req.body.pid.split("/")

            //store the message
            msg.StartupId = req.body.pid;
            msg.InvestorId = req.body.invid;
            msg.EntrepreneurId = req.body.enid;
            msg.MsgType = req.body.type;

            //check if investor has a message
            msg.Message.push({
                Date: datetime,
                Time: time,
                Msg: req.body.msg,
                Link: req.body.pid,
                Act: "investor"
            })

            msg.conversations = 1;
            msg.ReadEntrepreneur = true;

            msg.save(function (err, document) {

                //if saved
                if (document) {

                    //find the investors data
                    Investor.findOne({ _id: req.body.invid }, (err, data) => {

                        data.Requests = data.Requests + 1;

                        data.Requested.push({
                            Product: pid2[0],
                            Status: "Pending"
                        })

                        data.save()

                        //fint the entrepreneur data
                        Startup.findOne({ _id: req.body.enid }, (err, data1) => {
                            //compose the email
                            var mailOptions = {
                                from: 'investrloft@gmail.com',
                                to: data1.Email,
                                subject: 'Investment Request',
                                html: "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                                    "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                                    '<h1 style = \"color: black;\" > Investment Request </h1> ' +
                                    '<p style = \"color: black;\">An investor has requested to invest in your startup.</P>' +
                                    '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                                    "</div>",
                            };

                            transporter.sendMail(mailOptions, function (error, info) { });
                        })

                        //check to see if this is the investors first request
                        if (data.Requests == 1) {
                            res.send("first")
                        }

                        else {
                            res.send("Sent")
                        }
                    })

                    //investments
                    Investment.findOne({ PrId: pid2[0] }, (err, data) => {
                        if (data) {
                            data.Investors.push({
                                InvId: req.body.invid,
                                Accepted: false,
                            })

                            data.save();
                        }
                        else {
                            const investment = new Investment();

                            investment.PrId = pid2[0]
                            investment.Investors.push({
                                InvId: req.body.invid,
                                Accepted: false
                            })

                            investment.save(function (err, document) {

                            })
                        }
                    })
                }
            })
        }
    });

})


//route to change status of unread message to read
router.post("/read", (req, res) => {

    //find the message
    Msg.findOne({ _id: req.body.id }, (err, data) => {
        data.ReadInvestor = false;

        //save the data
        data.save();
        res.send("saved")
    })
})

//route to withdraw request
router.post("/withdraw", (req, res) => {
       //get date
       var currentdate = new Date();

       //get current date
       var datetime = (currentdate.getMonth() + 1) + "/"
           + currentdate.getDate() + "/"
           + currentdate.getFullYear();
   
   
       //get time
       var d = new Date();
       var hh = d.getHours();
       var m = d.getMinutes();
       var s = d.getSeconds();
       var dd = "AM";
       var h = hh;
       if (h >= 12) {
           h = hh - 12;
           dd = "PM";
       }
       if (h == 0) {
           h = 12;
       }
       m = m < 10 ? "0" + m : m;
   
       s = s < 10 ? "0" + s : s;
   
       var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
   
       var time = h + ":" + m;
       time += " " + dd;

    var pid = req.body.pid.split("/")
    pid = pid[0]
    //find investor
    Investor.findOne({ _id: req.body.invid }, (err, data) => {

        //loop through the requested products
        for (var i = 0; i < data.Requested.length; i++) {

            if (data.Requested[i].Product == pid) {
                data.Requested.splice(i, 1)
            }
        }

        data.save();
    })

     //mark investors as accepted on the Investments data
     Investment.findOne({PrId: pid},(err,data)=>{

        //loop through the investors
        for(var i = 0; i< data.Investors.length; i++){
            if(data.Investors[i].InvId == req.body.invid){
                data.Investors.splice(i, 1)

                data.save();
                break;
            }
        }
    
    })

    //notify through email
    Startup.findOne({_id: req.body.enid},(err,data)=>{
        //compose the email
        var mailOptions = {
            from: 'investrloft@gmail.com',
            to: data.Email,
            subject: 'Withdrawn Investment Request',
            html: "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                '<h1 style = \"color: black;\" > Withdrawn Investment Request </h1> ' +
                '<p style = \"color: black;\">An investor has withdrawn their investment request on your startup.</P>' +
                '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                "</div>",
        };

        transporter.sendMail(mailOptions, function (error, info) {});
    })

     //notify through message
     Msg.findOne({ InvestorId: req.body.invid, EntrepreneurId: req.body.enid }, (err, data) => {
        data.Message.push({
            Date: datetime,
            Time: time,
            Msg: "Withdrawn investment request",
            Link: req.body.pid,
            Act: "investor"
        })

        data.conversations = data.conversations + 1;

        data.MsgType = "Withdrawn";

        data.ReadEntrepreneur = true;

        data.save();
    })

    res.send("done")
})

//route to save the product
router.post("/savestrt", (req, res) => {

    //find the investors data
    Investor.findOne({ Email: req.body.user }, (err, data) => {

        if (data) {

            //loop to make sure their are no duplicates
            var x = data.SavedStartups.every(element => element !== req.body.id)

            if (x == true) {
                //push the saved startup to the investors saved startups data
                data.SavedStartups.push(req.body.id)

                //save the data
                data.save();

                //find the product
                Product.findOne({ _id: req.body.id }, (err, data1) => {

                    data1.Saves = data1.Saves + 1;

                    data1.save();

                    //save the data
                    res.send("saved")
                })
            }

            if (x == false) {
                res.send("none1")
            }

        }

        //if there is no data or err
        if (!data || err) {
            res.send("none")
        }
    })
})

//route to unsave product
router.post("/unsave", (req, res) => {
    //find the investors data
    Investor.findOne({ Email: req.body.user }, (err, data) => {

        //loop through the saved investors
        for (var i = 0; i < data.SavedStartups.length; i++) {

            if (data.SavedStartups[i] == req.body.id) {

                //remove the startup is
                data.SavedStartups.splice(i, 1);
                //save the data
                data.save();

                //find the product
                Product.findOne({ _id: req.body.id }, (err, data1) => {

                    //check if saves is greater than 0
                    if (data1.Saves > 0) {

                        data1.Saves = data1.Saves - 1;

                        data1.save();

                    }


                })
            }
        }



        res.send("done")


    })
})

//restrive filterd products
router.post("/filstartup", (req, res) => {

    //var to store products
    var product = [];
    var product2 = [];
    var product3 = [];

    //var to store investor
    var investor = []

    //to store the products with images
    var allp = {
        images: [],
        data: []
    }

    Investor.findOne({ Email: req.body.email }, (err, data) => {
        investor.push(data.SavedStartups)
    })

    //store the industries investor is intrested in
    var ind = req.body.ind;
    
    //get products which are viewable to investors
    Product.find({ Public: true, Approved : "approved"})
        .then(data => {

            //function to randomly shuffle the products
            function shuffle(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }

                product = a
            }

            //function to randomly shuffle the products
            function shuffle2(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }

                product2 = a
            }

            //function to randomly shuffle the products
            function shuffle3(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }

                product3 = a
            }

            //if req.body.ind is any or none
            if (req.body.ind == "any" || req.body.ind == "none") {
                product.push(data)
                shuffle(data)
                var all = investor.concat(product)
                res.send(all)
                return;
            }

            //if their is a filter search
            if (req.body.ind[0].fil) {

                //loop through the prodcts
                for (var p = 0; p < data.length; p++) {

                    //get the product that dont match the investors intrests
                    var x = ind.every(e => e.title !== data[p].Startup_TitleIndustry)

                    //if products doesnt match ivestors intrests
                    if (x == true) {
                        product3.push(data[p])
                    }

                    //if product matches investors intrests
                    else if (x == false) {

                        //if their isnt a subtitle
                        if (!req.body.ind[0].subtitle) {
                            product.push(data[p])
                        }
                        else {
                            function DontMatch(arr, subtitle) {
                                var x = arr.every(element => element.subtitle !== subtitle);

                                //if subtitle dont match
                                if (x == true) {
                                    product2.push(data[p])
                                }

                                //if subtitles match
                                else {
                                    product.push(data[p])
                                }
                            }

                            DontMatch(ind, data[p].Startup_SubIndustry);
                        }
                    }
                }

                shuffle(product);
                shuffle2(product2);
                shuffle3(product3);

                var all = investor.concat(product, product2, product3)
                res.send(all)

                return;
            }

            //loop through the prodcts
            for (var p = 0; p < data.length; p++) {

                //get the product that dont match the investors intrests
                var x = ind.every(e => e.title !== data[p].Startup_TitleIndustry)

                //if products doesnt match ivestors intrests
                if (x == true) {
                    product3.push(data[p])
                }

                //if product matches investors intrests
                else if (x == false) {


                    function DontMatch(arr, subtitle) {

                        var x = arr.every(element => element.subtitle !== subtitle);

                        //if subtitle dont match
                        if (x == true) {
                            product2.push(data[p])
                        }

                        //if subtitles match
                        else {
                            product.push(data[p])
                        }
                    }

                    DontMatch(ind, data[p].Startup_SubIndustry);


                }
            }

            shuffle(product);
            shuffle2(product2);
            shuffle3(product3);

            var all = investor.concat(product, product2, product3)
            res.send(all)

        })
})

//retrive products images
router.post("/imgfil", (req, res) => {

    //var to check if sending is already sents
    var sent = false

    gfs.files.find({ 'metadata.email': req.body.email, 'metadata.Product_id': req.body.name }).toArray((err, files) => {


        //loop through the files
        for (var f = 0; f < files.length; f++) {

            if (files[f].contentType.includes("image")) {

                var type = files[f].contentType.split("/")
                type = type[1];

                //write the images to a writeto folder
                var writestream = fs.createWriteStream(path.join(__dirname, '../src/writeto/' + files[f]._id + "." + type));
            }
            else {

                var type = files[f].contentType.split("/")
                type = type[1];

                //write the images to a writeto folder
                var writestream = fs.createWriteStream(path.join(__dirname, '../src/writeto/' + files[f]._id + "." + type));

            }

            //read the files
            var read = gfs.createReadStream({ _id: files[f]._id })

            read.pipe(writestream);

        }

        writestream.on('close', function () {

            //send the files
            if (sent == false) {
                res.send(files)
                sent = true
            }
        })

    })


})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
//display while searching
router.post("/display", (req, res) => {
    if (req.body.search) {
        const regex = new RegExp(escapeRegex(req.body.search), 'gi');
        Product.find({ name: regex }, function (err, products) {
            if (err) {
                res.send(err);
            } else {
                res.send(products);
            }
        }).limit(10)
    }

})
//retrive products from the databse as searched
router.post("/search", (req, res) => {

    Product.find({
        name: {
            $regex: new RegExp(req.body.search)
        }
    }, {
        _id: 0,
        __v: 0
    }, function (err, data) {
        if (data) {
            res.send(data)
        }
        else {
            res.send(err)
        }
    }).limit(10);

});

//retrive products from the databse as searched
router.post("/search2", (req, res) => {

    Product.find({
        name: {
            $regex: new RegExp(req.body.data)
        }
    }, {
        _id: 0,
        __v: 0
    }, function (err, data) {
        if (data) {
            res.send(data)
        }
        else {
            res.send(err)
        }
    }).limit(10);

});

//retrive saved startups
router.post('/savedStartups', ((req, res) => {

    //get the investors data
    Investor.findOne({ Email: req.body.email }, (err, data) => {

        //var to save the saved startups
        var all = [];

        //var track the amount of loops
        var k = 0

        //if their is no saved startups
        if (data.SavedStartups.length == 0) {
            res.send("none")
            return;
        }

        //loop through the startups
        for (var i = 0; i < data.SavedStartups.length; i++) {

            (function (data) {
                //find the startup
                Product.findOne({ _id: data }, (err, data1) => {

                    k++

                    //push the startup data
                    all.push(data1)

                    //once the loop is done
                    if (i == k) {
                        res.send(all)
                    }

                })


            }(data.SavedStartups[i]));
        }

    })
}))

//route to get the requested startups
router.post("/requested", (req, res) => {

    //get the investors data
    Investor.findOne({ Email: req.body.email }, (err, data) => {

        //array to store the products
        var pr = [];

        pr.push(data.SavedStartups)
        var k = 0;

        //check if there are any requested startups
        if (data.Requested.length == 0) {
            res.send("none")
            return;
        }
        //loop through the investors requested startups
        for (var i = 0; i < data.Requested.length; i++) {

            //find the startup
            Product.findOne({ _id: data.Requested[i].Product }, (err, data) => {

                if (data) {
                    pr.push(data)
                }

                k++

                if (k == i) {

                    res.send(pr)
                }

            })
        }
    })
})

//to show the whole startup clearly
router.post('/preview', ((req, res) => {

    var all = [];



    //find the Startup
    Product.findOne({ _id: req.body.id }, (err, data1) => {

        //check to see if entrepreneur is the one viewing
        if (req.body.email == "startup") {
            all.push("startups")
            all.push("startups")
            all.push(data1)
            res.send(all)
            return;
        }

        //get the investors data
        Investor.findOne({ Email: req.body.email }, (err, data) => {

            //push the saved startups
            all.push(data.SavedStartups)

            //push the requested startups
            all.push(data.Requested)

            //push the product
            all.push(data1)

            //send the data
            res.send(all)

            //if there is data in the history
            if (data.History.length > 0) {

                //loop through the data
                var x = data.History.every(e => e !== req.body.id)

                if (x == true) {
                    //push the product id to the investors history
                    data.History.push(req.body.id)

                    //add 1 to the views
                    data1.Views = data1.Views + 1;

                    //save the data
                    data1.save();

                    //save the data
                    data.save();
                }
            }
            else {
                //push the product id to the investors history
                data.History.push(req.body.id)

                //add 1 to the views
                data1.Views = data1.Views + 1;

                //save the data
                data1.save();

                //save the data
                data.save();
            }

        })
    })

}))

//retrive the accepted offer products name
router.post("/offer", (req, res, next) => {


    //update product status to pending
    Product.updateOne({ name: req.body.data }, { status: "pending" }, function (err, data) {
    });
    //push the investors information on the products document in the databse 
    Product.updateOne({ name: req.body.data }, {
        "$push": {
            investors: {
                name: req.body.user.name,
                email: req.body.user.email,
                accepted: false,
                request: true,
            }
        }
    }, (err, data) => {
    });

    //find the products email and send an email to the entrepreneur
    Product.findOne({ name: req.body.data }, (err, data) => {
        var mailOptions = {
            from: 'investrloft@gmail.com',
            to: data.email,
            subject: 'Requested Offer',
            html:
                "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                "<h1> you have recieved an offer </h1>" +
                "<P>if you accept the investors offer, you may send him/her an email and schedule a meeting pysically or through the phone to disccus more about your product and the investment</p>" +
                '<h4> <a href="http://localhost:8080/login">click here to sign in to your account </a></h4>' +
                "</div>"
        };

        transporter.sendMail(mailOptions);
    })




    //get the investors email and the products name and save it in the investors model 
    //push the name of the product
    User.updateOne({ email: req.body.user.email }, {
        "$push": {
            products: {
                name: req.body.data
            }
        }
    }, (err, data) => {

    })

});

//get function to see if the investor has already accepted an offer and disable the accept button
router.post("/accepted", (req, res) => {
    User.find({ email: req.body.user.email }, (err, data) => {
        if (err) {
            res.send(err)
        };
        if (data) {
            res.send(data)
        }
    })

})



//get the investors data
router.post("/invest", (req, res) => {
    User.findOne({ email: req.body.user.email }, (err, data) => {
        if (err) {
            res.send(err)
        }
        if (data) {
            res.send(data)
        }
    })
})

//get all the products that have been accepted by the entrepreneur
router.post("/invest2", (req, res) => {
    Product.findOne({ name: req.body.data }, (err, data) => {
        if (data) {
            res.send(data)
        }
    })
})

//get all the products that have been searched through the filter
router.post("/filter", (req, res) => {
    //change money from string to number
    var money1 = req.body.from.replace(/,/g, '');
    var money2 = req.body.to.replace(/,/g, '');
    Product.find({
        money: { $gte: money1, $lte: money2 }
    }, (err, data) => {
        if (err) {
            res.send(err)
        }
        if (data) {
            res.send(data)
        }
    })
})



module.exports = router