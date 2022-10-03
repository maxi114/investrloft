const express = require('express');
const router = express.Router({ caseSensitive: true });
const Product = require('../models/product.js')
const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const grid = require("gridfs-stream");
const methodOverrid = require('method-override');
const path = require('path');
const fs = require("file-system");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Msg = require("../models/message");
const crypto = require('crypto');
const Investment = require("../models/investments.js")
const Industry = require('../models/industry.js')
const Investor = require('../models/investor');
const Startup = require('../models/startup.js')
const requireFromUrl = require('require-from-url/sync');
const { V4MAPPED } = require('dns');
const { runInContext } = require('vm');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//db connection string
const db = "mongodb://db:27017/investrloft"

//email templates
var temap1 = fs.readFileSync('./src/email/posting.html');

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
    console.log('-connection open to database- entre');

    // intialize stream
    gfs = grid(mongoose.connection.db, mongoose.mongo)

    gfs.collection('uploads');//collection name

})

//set storage engine
const storage = new gridFsStorage({
    url: db,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        //change name to lower case
        var name = req.body.name
        name = name.toLowerCase();

        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads",
                    metadata: {
                        type: "products",
                        email: file.fieldname,
                        Product_id: name
                    }
                };
                resolve(fileInfo);
            });
        });
    }
});

//upload
const upload = multer({ storage });

//route to check the status of the account
router.post("/substatus", (req, res) => {
    Startup.findOne({ Email: req.body.email }, (err, data) => {
        res.send(data.Subscription)
    })
})
//route to make product visible or not visible to investors
router.post("/public", (req, res) => {

    Product.findOne({ _id: req.body.id }, (err, data) => {

        //check if the product is approved
        if(data.Approved == "pending"){
            res.send("pending")
            return;
        }

        //check if the product is disapproved
        if(data.Approved == "disapproved"){
            res.send("disapproved")
            return;
        }

        if (req.body.pr == "on") {
            data.Public = true;
            data.save()
            res.send("saved")
        }
        else {
            data.Public = false;
            data.save()
            res.send("saved")
        }
    })
})
//check if product thats about to be posted already exists
router.post('/check', (req, res) => {

    //find all the products with the email
    Product.find({ Email: req.destroy.email }).then(data => {

        //check if there is data
        if (data.length > 0) {

            //check to see if the product already exists
            var x = data.every(element => element.Startup_Name == req.body.name)

            if (x == true) {
                res.send('exist')
            }
            if (x == false) {
                res.send('ok')
            }
        }
        else {
            res.send("ok")
        }
    })
})

//route to showcase the messages
router.post("/chat", (req, res) => {

    //find all messages with the investors id
    Msg.find({ EntrepreneurId: req.body.id })
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

//route to get the investors info
router.post("/chat2", ((req, res) => {

    Investor.findOne({ _id: req.body.id }, (err, data) => {
        res.send(data)
    })
}))

//route to send a message
router.post("/msg", (req, res) => {

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
    Msg.findOne({ InvestorId: req.body.inid, EntrepreneurId: req.body.enid }, (err, data) => {

        var link1 = req.body.link.toString("")

        if (data) {

            if (req.body.link[0] !== null) {
                data.Message.push({
                    Date: datetime,
                    Time: time,
                    Msg: req.body.msg,
                    Link: link1,
                    Act: "entrepreneur"
                })
            }

            else {
                data.Message.push({
                    Date: datetime,
                    Time: time,
                    Msg: req.body.msg,
                    Act: "entrepreneur"
                })
            }

            data.conversations = data.conversations + 1;

            data.ReadInvestor = true;

            data.save(function (err, document) {
            })
            //find the entrepreneur data
            Investor.findOne({ _id: req.body.inid }, (err, data1) => {
                //compose the email
                var mailOptions = {
                    from: 'investrloft@gmail.com',
                    to: data1.Email,
                    subject: 'New Message',
                    html: "<div>" +
                        '<h1 style = \"color: black;\" > New Message </h1> ' +
                        '<p style = \"color: black;\">New message from a startup.</P>' +
                        '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                        "</div>",
                };

                transporter.sendMail(mailOptions, function (error, info) { });

                res.send("sent")
            })
        }

        //if there is no data
        else {

            var msg = new Msg;

            //store the message
            msg.InvestorId = req.body.inid;
            msg.EntrepreneurId = req.body.enid;
            msg.MsgType = req.body.type;
            msg.conversations = 1;
            msg.ReadInvestor = true;

            if (req.body.link[0] !== null) {
                msg.Message.push({
                    Date: datetime,
                    Time: time,
                    Msg: req.body.msg,
                    Link: link1,
                    Act: "entrepreneur"
                })
            }

            else {
                msg.Message.push({
                    Date: datetime,
                    Time: time,
                    Msg: req.body.msg,
                    Act: "entrepreneur"
                })
            }

            msg.save(function (err, document) {
            })

            //find the entrepreneur data
            Investor.findOne({ _id: req.body.inid }, (err, data1) => {
                //compose the email
                var mailOptions = {
                    from: 'investrloft@gmail.com',
                    to: data1.Email,
                    subject: 'New Message',
                    html: "<div>" +
                        '<h1 style = \"color: black;\" > New Message </h1> ' +
                        '<p style = \"color: black;\">New message from a startup.</P>' +
                        '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                        "</div>",
                };

                transporter.sendMail(mailOptions, function (error, info) { });

                res.send("sent")
            })
        }
    })
})

//route to look for investors pending request
router.post("/investtt", (req, res) => {

    Investment.findOne({ PrId: req.body.id }, (err, data) => {
        if (data) {
            res.send(data)
        }
        else {
            res.send("none")
        }
    })

})

//route to get investors inrested in investing or that have already invested
router.post("/investtt2", (req, res) => {

    //find the investor
    Investor.findOne({ _id: req.body.id }, (err, data) => {
        if (data) {
            res.send(data)
        }
        else {
            res.send("none")
        }
    })
})

//route to accept investor
router.post("/accept", (req, res) => {

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

    //mark startup as not visbile to public
    Product.findOne({ _id: req.body.prid }, (err, data) => {
        data.Public = false;
        data.save();
    })

    //mark investor as accepted on the investor data
    Investor.findOne({ _id: req.body.invid }, (err, data) => {
        //compose the email
        var mailOptions = {
            from: 'investrloft@gmail.com',
            to: data.Email,
            subject: 'Accepted Investment Request',
            html: "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                '<h1 style = \"color: black;\" > Accepted Investment Request </h1> ' +
                '<p style = \"color: black;\">Congratulations a startup you requested has accepted your investment request. Make sure to follow up with the Startup on how to make the investment. We do not process any investments, all we do is help you find your potential startup investment.</P>' +
                '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                "</div>",
        };

        transporter.sendMail(mailOptions, function (error, info) { });
        //loop through the requested products
        for (var r = 0; r < data.Requested.length; r++) {
            if (data.Requested[r].Product == req.body.prid) {
                data.Requested[r].Status = "Accepted";
                data.save();
                break;
            }
        }
    })

    //mark investors as accepted on the Investments data
    Investment.findOne({ PrId: req.body.prid }, (err, data) => {

        //loop through the investors
        for (var i = 0; i < data.Investors.length; i++) {
            if (data.Investors[i].InvId == req.body.invid) {
                data.Investors[i].Accepted = true,

                    data.save();
                break;
            }
        }
    })

    //notify through message
    Msg.findOne({ InvestorId: req.body.invid, EntrepreneurId: req.body.enid }, (err, data) => {
        data.Message.push({
            Date: datetime,
            Time: time,
            Msg: "Investment request accepted",
            Link: req.body.prid + "/" + req.body.name,
            Act: "entrepreneur"
        })

        data.conversations = data.conversations + 1;

        data.ReadInvestor = true;

        data.save();
    })

    res.send("done")
})

//route to unreject investor
router.post("/unrjct", (req, res) => {

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


    //mark investor as accepted on the investor data
    Investor.findOne({ _id: req.body.invid }, (err, data) => {
        //compose the email
        var mailOptions = {
            from: 'investrloft@gmail.com',
            to: data.Email,
            subject: 'Investment Reconsidaration',
            html: "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                '<h1 style = \"color: black;\" > Lifted Rejection </h1> ' +
                '<p style = \"color: black;\">A startup that rejected your investment has lifted your rejection. This means that the startup is reconsidering you as their potential investor.</P>' +
                '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                "</div>",
        };

        transporter.sendMail(mailOptions, function (error, info) { });
        //loop through the requested products
        for (var r = 0; r < data.Requested.length; r++) {
            if (data.Requested[r].Product == req.body.prid) {
                data.Requested[r].Status = "Pending";
                data.save();
                break;
            }
        }
    })


    //notify through message
    Msg.findOne({ InvestorId: req.body.invid, EntrepreneurId: req.body.enid }, (err, data) => {
        data.Message.push({
            Date: datetime,
            Time: time,
            Msg: "Rejected investment request lifted",
            Link: req.body.prid + "/" + req.body.name,
            Act: "entrepreneur"
        })

        data.conversations = data.conversations + 1;

        data.ReadInvestor = true;

        data.save();
    })

    res.send("done")
})

//route to reject investor
router.post("/rejct", (req, res) => {

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

    //mark investor as accepted on the investor data
    Investor.findOne({ _id: req.body.invid }, (err, data) => {
        //compose the email
        var mailOptions = {
            from: 'investrloft@gmail.com',
            to: data.Email,
            subject: 'Rejected Investment Request',
            html: "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                '<h1 style = \"color: black;\" > Rejected Investment Request </h1> ' +
                '<p style = \"color: black;\">Unfortunately, a startup you requested to invest in has rejected your investment request. Try to follow up with the startup and see if you can still invest in it. You can also look for other startups that you may be intrested in investing in.</P>' +
                '<h4> click <a href="http://localhost:8080/login/">here to login to your account</a></h4>' +
                "</div>",
        };

        transporter.sendMail(mailOptions, function (error, info) { });
        //loop through the requested products
        for (var r = 0; r < data.Requested.length; r++) {
            if (data.Requested[r].Product == req.body.prid) {
                data.Requested[r].Status = "Rejected";
                data.save();
                break;
            }
        }
    })

    //notify through message
    Msg.findOne({ InvestorId: req.body.invid, EntrepreneurId: req.body.enid }, (err, data) => {
        data.Message.push({
            Date: datetime,
            Time: time,
            Msg: "Investment request rejected",
            Link: req.body.prid + "/" + req.body.name,
            Act: "entrepreneur"
        })

        data.conversations = data.conversations + 1;

        data.ReadInvestor = true;

        data.save();
    })

    res.send("done")
})

//route to change status of unread message to read
router.post("/read", (req, res) => {

    //find the message
    Msg.findOne({ _id: req.body.id }, (err, data) => {
        data.ReadEntrepreneur = false;

        //save the data
        data.save();

        res.send("ok")
    })
})

//route to get all the entrepreneurs startup
router.post("/insert", (req, res) => {

    //get all the entrepreneurs startup
    Product.find({ Entrepreneur_Email: req.body.email })
        .then(data => {
            res.send(data)
        })
})

//route to check for unread messages
router.post("/not", (req, res) => {

    //find all mesages with the investors id
    Msg.find({ EntrepreneurId: req.body.id })
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

                //check to see if ReadEntrepreneur is true
                if (data[i].ReadEntrepreneur == true) {
                    p = p + 1;
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

//posting product 
router.post('/post', upload.any(), (req, res) => {

    /*gfs.files.find().toArray((err, files) => {
        //console.log(files)
    })*/

    //find all the products belonging to this user
    Product.find({ Email: req.body.Email }).then(data => {

        var user = JSON.parse(req.body.user)

        //get date
        var currentdate = new Date();

        //get current date
        var datetime = (currentdate.getMonth() + 1) + "/"
            + currentdate.getDate() + "/"
            + currentdate.getFullYear();

        //change name to lower case
        var name = req.body.name
        name = name.toLowerCase();

        var ind1;
        var ind2;

        //if there is no industry
        if (req.body.industry == "click here to pick your industry") {
            ind1 = 'none'
            ind2 = 'none'
        }
        else {

            var ind = req.body.industry
            ind = ind.toLowerCase();
            ind = ind.split(":");


            if (ind.length > 1) {
                ind1 = ind[0]
                ind2 = ind[1]
            }
            else {
                ind1 = ind[0];
                ind2 = "none"
            }

            //remove all space at the start of the string
            while (ind1.charAt(0) == " ") {
                ind1 = ind1.substring(1);
            }

            //remove all space at the end of the string
            while (ind1.charAt(ind1.length - 1) == " ") {
                ind1 = ind1.substring(0, ind1.length - 1);
            }

             //remove all space at the start of the string
             while (ind2.charAt(0) == " ") {
                ind2 = ind2.substring(1);
            }

            //remove all space at the end of the string
            while (ind2.charAt(ind2.length - 1) == " ") {
                ind2 = ind2.substring(0, ind2.length - 1);
            }

            //check to see if the industry exists
            Industry.findOne({ Title: ind1 }, (err, data) => {
                if (data) {
                    data.Uses = data.Uses + 1;

                    data.save();
                }
                else {

                    var industry = new Industry();

                    industry.Title = ind1

                    if(ind2 !== "none"){
                    industry.SubTitle.push(ind2)
                    }


                    industry.Live = false;
                    industry.Uses = 1

                    industry.save(function (err, document) {
                    })
                }
            })
        }


        //get the product schema
        const product = new Product();

        if (req.body.video) {

            var vids = req.body.video.split(",")

            for (var v = 0; v < vids.length; v++) {
                product.Startup_Video_Link.push(
                    vids[v]
                )
            }
        }

        var user = JSON.parse(req.body.user)

        product.Entrepreneur_Email = user.Email
        product.Startup_Name = name;
        product.Startup_Location.Country = user.Country
        product.Startup_Location.State = user.State
        product.Startup_Location.City = user.City
        product.Startup_Description = req.body.description;
        product.Startup_Website = req.body.website;
        product.Startup_Employees = req.body.employees;
        product.Startup_RaisedCapital = req.body.money2
        product.Startup_Money_Request = req.body.money;
        product.Startup_Percent_Offer = req.body.offer;
        product.Startup_Description2 = req.body.description2;
        product.Startup_TitleIndustry = ind1;
        product.Startup_SubIndustry = ind2;
        product.Views = 0;
        product.Saves = 0;
        product.lat = user.lat;
        product.long = user.long;
        product.Post_date = datetime;
        product.Public = false;
        product.Approved = "pending";

            //save to mongoose database
            product.save(function (err, document) {

                if (document) {
                    res.send(document)
                }

                //if there is no document or if there is an error
                if (!document || err) {

                    //remove the saved files
                    gfs.files.find({ 'metadata.email': user.Email, 'metadata.Product_id': name }).toArray((err, files) => {

                        //loop through the files
                        for (var f = 0; f < files.length; f++) {
                            gfs.remove({ _id: files[f]._id, root: 'uploads' }, (err, GridFSBucket) => {
                            })
                        }
                    })
                }
            });
    });

})

//retrive the users products information from the database
router.post('/user-products', function (req, res) {
    if (req.body.Email) {

        //store the products and images to be sent
        var sending = {
            images: [],
            product: {},
        }

        //get the products
        Product.find({ Entrepreneur_Email: req.body.Email }).then(data => {

            //var to check if sending is already sents
            var sent = false
            if (data.length > 0) {

                //loop the data
                for (var d = 0; d < data.length; d++) {

                    gfs.files.find({ 'metadata.email': req.body.Email, 'metadata.Product_id': data[d].Startup_Name }).toArray((err, files) => {

                        sending.images.push(files);
                        sending.product = data;


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
                            writestream.on('close', function () {

                                //send the files
                                if (sent == false) {
                                    res.send(sending)
                                    sent = true
                                }
                            })
                        }

                    })


                }

            }
            else {
                res.send("no")
            }
        });

    };

});

//retrive product industry type
router.post("/prind", (req, res) => {

    //var to store the industries
    var ind = [];

    //find all the users products
    Product.find({ Entrepreneur_Email: req.body.email }).then(data => {

        //if user has products posted
        if (data.length > 0) {

            //loop through the data
            for (var i = 0; i < data.length; i++) {

                //var to store the industries
                var obj = {};

                obj["title"] = data[i].Startup_TitleIndustry;
                obj["subtitle"] = data[i].Startup_SubIndustry;

                ind.push(obj);
            }

            res.send(ind)
        }
        //if user hasnt posted yet
        else {
            res.send("none")
        }
    })
})


//retrive filterd investors
router.post("/filinvestor", (req, res) => {

    //var to store the investors
    var investor = [];
    var investor2 = [];
    var investor3 = [];

    //var to store entrepreneur
    var entrepreneur = []

    //get the entrepreneurs data
    Startup.findOne({ Email: req.body.email }).then(data23 => {

        entrepreneur.push(data23)

        //get investors 
        Investor.find({ Active: true, Approved: true}).then(data => {

            //function to randomly shuffle array
            function shuffle(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                var all = entrepreneur.concat(a)
                res.send(all);
            }


            //function to randomly shuffle investor3 array
            function shuffle2(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                investor3 = a
            }

            //function to randomly shuffle investor2 array
            function shuffle1(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                investor2 = a
            }

            //function to randomly shuffle investor array
            function shuffle0(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                investor = a
            }

            if (req.body.ind == "none" || req.body.ind[0] == "any") {
                shuffle(data);
                return;
            }

            if (typeof req.body.ind[0] === "string") {

                processArray(data)
                async function processArray(data) {
                    //loop through the data
                    for (var u = 0; u < data.length; u++) {
                        var x = data[u].Industry.every(e => e.title !== req.body.ind[0])

                        if (x == false) {
                            investor.push(data[u])
                        }
                        if (x == true) {
                            investor2.push(data[u])
                        }

                    }
                    shuffle0(investor)
                    shuffle1(investor2)

                    var all = entrepreneur.concat(investor, investor2)
                    res.send(all)
                }
                return;
            }

            if (req.body.ind.length == 1 && !req.body.ind[0].subtitle) {

                processArray(data)
                async function processArray(data) {
                    //loop through the data
                    for (var u = 0; u < data.length; u++) {
                        var x = data[u].Industry.every(e => e.title !== req.body.ind[0].title)

                        if (x == false) {
                            investor2.push(data[u])
                        }
                        if (x == true) {
                            investor.push(data[u])
                        }

                    }
                    shuffle0(investor)
                    shuffle1(investor2)

                    var all = entrepreneur.concat(investor2, investor)
                    res.send(all)
                }
                return;
            }

            //loop through the data
            for (var a = 0; a < data.length; a++) {

                //loop to make sure industries dont match
                var x = data[a].Industry.every(e =>

                    req.body.ind.every(element => e.title !== element.title)
                )

                if (x == true) {
                    investor3.push(data[a])
                }

                else if (x == false) {

                    function DontMatch(arr, title) {
                        var x = arr.every(element => element.subtitle !== title.subtitle);

                        if (x == true) {
                            investor2.push(data[a])
                        }
                        else {
                            investor.push(data[a])
                        }
                    }

                    DontMatch(data[a].Industry, req.body.ind);


                }
            }

            shuffle0(investor);
            shuffle1(investor2);
            shuffle2(investor3);

            var all = entrepreneur.concat(investor, investor2, investor3)

            res.send(all)

        })
    });



})

//retrive investors
router.post("/investor", (req, res) => {

    var industry = req.body.industry;
    industry = industry.split(",")

    //check if industry has a split
    if (industry[0] !== "any") {
        Investor.find({ "Industry.title": "home", Active: true }).then(data => {
            res.send(data)
        })
    }
    else if (industry.length == 1) {

        //get all investor
        Investor.find().then(data => {
            if (data.length > 0) {
                res.send(data)
            }
        })
    }


})

//retrive all types of industries from database
router.get("/industry", (req, res) => {

    Industry.find({Live: true}).then(data => {
        res.send(data)
    })

})


//route to save users saved investor
router.post("/save", (req, res) => {

    //find the entrepreneurs data
    Startup.findOne({ Email: req.body.EntrepreneurEmail }, (err, data) => {


        if (data) {

            //loop to make sure their are no duplicates
            var x = data.SavedInvestors.every(element => element !== req.body.InvestorEmail)

            if (x == true) {
                //push the saved investor to the entrepreneurs saved investors data
                data.SavedInvestors.push(req.body.id)

                //save the data
                data.save();

                //save the data
                res.send("saved")
            }

            if (x == false) {
                res.send("none")
            }

        }

        //if there is no data or err
        if (!data || err) {
            res.send("none")
        }
    })
})

//route to retrive saved investors
router.post("/savedInvestors", (req, res) => {

    Startup.findOne({ Email: req.body.email }, (err, data1) => {

        //var to store the investors data
        var invdat = []

        if (data1.SavedInvestors.length == 0) {
            res.send("none")
        }
        else {

            var k = 0;

            //loop through the entrepreneurs saved investors
            for (var i = 0; i < data1.SavedInvestors.length; i++) {

                Investor.findOne({ _id: data1.SavedInvestors[i] }, (err, data) => {

                    k++

                    if (data) {
                        invdat.push(data)
                    }

                    if (k == i) {

                        //if there is data
                        if (invdat.length > 0) {
                            res.send(invdat)
                        }
                        else {
                            res.send("none")
                        }

                    }




                })
            }
        }

    })
})


//route to unsave saved investors
router.post("/unsaveInvestor", (req, res) => {

    //finf the entrepreneurs data
    Startup.findOne({ Email: req.body.email }, (err, data) => {

        //loop through the saved investors
        for (var i = 0; i < data.SavedInvestors.length; i++) {

            //if investor thats been removed is found
            if (data.SavedInvestors[i] == req.body.id) {

                //remove the investors id
                data.SavedInvestors.splice(i, 1)
                //save the data
                data.save();

                res.send("saved")
            }

            if (!data || err) {
                res.send('no')
            }
        }
    })
})


//retrive the products that investors have accepted entrepreneurs offer
router.post("/offer", function (req, res) {
    if (req.body.email) {
        Product.find({ email: req.body.email }, (err, data) => {
            //var to store data
            var pdata = data;
            if (err) {
                res.send(err)
            }
            if (pdata) {
                res.send(pdata)
            }

        })
    }
})

router.post("/notification", (req, res) => {
    //update investors accepted status to true
    Product.updateOne({ name: req.body.product }, {
        status: "complete"
    }, (err, data) => { })
    Product.updateOne({ name: req.body.product }, {
        $set: {
            investors: {
                name: req.body.name,
                email: req.body.email,
                accepted: true,
                request: true
            }
        }
    }, (err, document) => { })

    //find the products email and send an email to the investor
    Product.findOne({ name: req.body.product }, (err, data) => {
        var mailOptions = {
            from: 'investrloft@gmail.com',
            to: req.body.email,
            subject: 'Accepted offer',
            html:
                "<div style = \"text-align:center; max-width: 500px; margin: auto; border:solid 1px lawngreen; border-radius: 10px;\">" +
                "<img class=\"logo\" style = \" width: 50px; height: 50px;\" src=\"../src/logo/favicon.ico\" alt=\"Logo\">" +
                "<h1> congratulations " + data.user + " has accepted your offer</h1>" +
                "<P>you may send him/her an email and schedule a meeting pysically or through the phone to disccus more about your product and the investment</p>" +
                '<h4> <a href="http://localhost:8080/login">click here to sign in to your account </a></h4>' +
                "</div>"
        };

        transporter.sendMail(mailOptions);
    })
})

//check if entrepreneur has already accepted an offer and disable the products
router.post("/accept", function (req, res) {
    Product.find({ email: req.body.user.email }, (err, data) => {
        if (data) {
            res.send(data)
        }
    })
})

//post function to delete the product from the databse
router.post("/delete", (req, res) => {

    //find all the entrepreneus email
    Product.find({ Entrepreneur_Email: req.body.email })
        .then(data => {

            //loop through the products
            for (var p = 0; p < data.length; p++) {

                //find the product that is been deleted through its name
                if (data[p].Startup_Name == req.body.name) {

                    Investment.findOne({ PrId: data._id }, (err, data2) => {

                        if (data2) {
                            data2.remove();
                        }
                    })

                    data[p].remove();
                }
            }

            //delete the images
            gfs.files.find({ 'metadata.email': req.body.email, 'metadata.Product_id': req.body.name }).toArray((err, files) => {

                //loop through the files
                for (var f = 0; f < files.length; f++) {
                    gfs.remove({ _id: files[f]._id, root: 'uploads' }, (err, GridFSBucket) => {
                    })

                }

            })

            res.send("done")
        })

})

//update the poduct edit to true
router.post("/updatep", (req, res) => {
    Product.find({ Entrepreneur_Email: req.body.email }).then(data => {

        //loop through the data
        for (var d = 0; d < data.length; d++) {
            if (data[d].Startup_Name == req.body.name) {
                data[d].edit = true;
                data[d].save();
            }
        }
    })
})
//update the product edit to false
router.post("/unload", (req, res) => {
    Product.find({ Entrepreneur_Email: req.body.email }).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].edit == "true") {
                data[i].edit = false
                data[i].save();
                res.send("save")
            }
        }
    })
})

//get the product from the databse to display it in the update page
router.post("/updatef", (req, res) => {
    Product.find({ Entrepreneur_Email: req.body.email }).then(data => {

        //to track if loop is done
        var k = 0;
        for (var i = 0; i < data.length; i++) {
            k++
            if (data[i].edit == "true") {

                //var to store the data
                var data2 = {
                    picture: [],
                };
                var data3 = []
                data3.push(data[i])

                var data4 = []
                //get the images
                gfs.files.find({ 'metadata.email': req.body.email, 'metadata.Product_id': data[i].Startup_Name }).toArray((err, files) => {
                    data2.picture.push(files)

                    data4.push(data2);
                    data4.push(data3);

                    if (k == data.length) {
                        res.send(data4)
                    }
                })
            }
        }
    })
})

//route to delete the previous picture before updating the startup
router.post("/picdelete", ((req, res) => {


    //first check to see if the product already exists
    Product.find({ Entrepreneur_Email: req.body.email }).then(data => {

        if (req.body.name !== req.body.name2) {
            //check to see if the product exists
            var x = data.every(e => e.Startup_Name !== req.body.name2)

            if (x == false) {
                res.send("exists")
            }
            else {
                gfs.files.find({ "metadata.email": req.body.email, 'metadata.Product_id': req.body.name }).toArray((err, files) => {
                    //loop through the files
                    for (var f = 0; f < files.length; f++) {
                        gfs.remove({ _id: files[f]._id, root: 'uploads' }, (err, GridFSBucket) => {
                        })
                    }
                })

                res.send("done")
            }
            return;
        }
        else {
            gfs.files.find({ "metadata.email": req.body.email, 'metadata.Product_id': req.body.name }).toArray((err, files) => {
                //loop through the files
                for (var f = 0; f < files.length; f++) {
                    gfs.remove({ _id: files[f]._id, root: 'uploads' }, (err, GridFSBucket) => {
                    })
                }
            })

            res.send("done")
        }


    })


}))

//update function to update the entrepreneurs product/company/idea
router.post("/update", upload.any(), (req, res) => {


    //find the product that the entrepreneur wants to edit
    Product.find({ Entrepreneur_Email: req.body.Entrepreneur_Email }, (err, data) => {

        //get date
        var currentdate = new Date();

        //get current date
        var datetime = (currentdate.getMonth() + 1) + "/"
            + currentdate.getDate() + "/"
            + currentdate.getFullYear();

        //change name to lower case
        var name = req.body.name
        name = name.toLowerCase();

        var ind1;
        var ind2;

        //if there is no industry
        if (req.body.industry == "click here to pick your industry") {
            ind1 = 'none'
            ind2 = 'none'
        }
        else {

            var ind = req.body.industry
            ind = ind.toLowerCase();
            ind = ind.split(":");


            if (ind.length > 1) {
                ind1 = ind[0]
                ind2 = ind[1]
            }
            else {
                ind1 = ind[0];
                ind2 = "none"
            }

            //remove all space at the start of the string
            while (ind1.charAt(0) == " ") {
                ind1 = ind1.substring(1);
            }

            //remove all space at the end of the string
            while (ind1.charAt(ind1.length - 1) == " ") {
                ind1 = ind1.substring(0, ind1.length - 1);
            }

             //remove all space at the start of the string
             while (ind2.charAt(0) == " ") {
                ind2 = ind2.substring(1);
            }

            //remove all space at the end of the string
            while (ind2.charAt(ind2.length - 1) == " ") {
                ind2 = ind2.substring(0, ind2.length - 1);
            }

            //check to see if the industry exists
            Industry.findOne({ Title: ind1 }, (err, data) => {
                if (data) {
                    data.Uses = data.Uses + 1;

                    data.save();
                }
                else {

                    var industry = new Industry();

                    industry.Title = ind1

                    if(ind2 !== "none"){
                    industry.SubTitle.push(ind2)
                    }


                    industry.Live = false;
                    industry.Uses = 1

                    industry.save(function (err, document) {
                    })
                }
            })
        }

        for (var i = 0; i < data.length; i++) {
       
            if (data[i].Startup_Name == req.body.Startup_Name) {

                var money2 = req.body.money2.toString();

                if (req.body.video) {
                    data[i].Startup_Video_Link = [];

                    data[i].save();
                }
                //update the product in the databse
                data[i].Startup_Name = req.body.name;
                data[i].Startup_Description = req.body.description;

                if (req.body.website) {
                    data[i].Startup_Website = req.body.website
                }

                if (req.body.employees) {
                    data[i].Startup_Employees = req.body.employees
                }

                if (money2 == "null") {
                    data[i].Startup_RaisedCapital = 0;
                }
                else{
                    data[i].Startup_RaisedCapital = req.body.money2
                }

                if (req.body.money !== null) {
                    data[i].Startup_Money_Request = req.body.money;
                }

                if (req.body.offer) {
                    data[i].Startup_Percent_Offer = req.body.offer;
                }

                if (req.body.description2) {
                    data[i].Startup_Description2 = req.body.description2;
                }

                if (req.body.video.length == 0) {
                    data[i].Startup_Video_Link = [];
                }
                else {
                    var vids = req.body.video.split(",")
                    //loop through req.body.video
                    for (var v = 0; v < vids.length; v++) {
                        data[i].Startup_Video_Link.push(
                            vids[v]
                        )
                    }
                }

                data[i].Startup_TitleIndustry = ind1;
                data[i].Startup_SubIndustry = ind2;
                data[i].Update_date = datetime;
                data[i].edit = false;

                data[i].save(function(err, document){
                    console.log(err)
                    console.log("yujhgfghjhvcvhh")
                });

                res.send("saved")

                break

            }
        }

    });

});

module.exports = router