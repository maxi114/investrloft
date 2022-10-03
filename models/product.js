const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');
const Schema = mongoose.Schema;

//product schema
const ProductSchema = new Schema({
    //Startup name
    Startup_Name: {
        type: String,
        required: true,
        unique: true
    },

    //Entrepreneur email
    Entrepreneur_Email: {
        type: String,
        required: true
    },

    //Startup_description
    Startup_Description: {
        type: String,

    },

    //store startup videos urls
    Startup_Video_Link:[{
    }],
    //the startups wesbite
    Startup_Website:{
        type: String,
    },

    //store the number of employees
    Startup_Employees:{
        type: String,
    },

    //raised capital
    Startup_RaisedCapital:{
        type:  Number,
    },

    //amount of money the startup is asking for
    Startup_Money_Request: {
        type: Number,
    },

    //how much percent is the startup willing to give away
    Startup_Percent_Offer: {
        type: String || Number
    },

    //what does the entrepreneur want from the investor
    Startup_Description2: {
        type: String,
    },

    //location of the startup
    Startup_Location: {
        Country: {
            type: String
        },

        State: {
            type: String,
        },

        City: {
            type: String
        }
    },

    lat: {
        type: String,
    },

    long: {
        type: String,
    },

    Startup_TitleIndustry: {
        type: String,
    },

    Startup_SubIndustry: {
        type: String,
    },

    //date of post
    Post_date: {
        type: String,
    },

    //date that it was last updated
    Update_date: {
        type: String,
    },

    //views/watches
    Views: {
        type: Number,
    },

    //saves
    Saves: {
        type: Number,
    },

    //truck if the product is viewable by investors
    Public: {
        type: Boolean,
    },

    //truck if post
    status: {
        type: String,
    },

    edit: {
        type: String,
    },
    time: {
        type: String,
    },

    Approved: {
        type: String,
    },
});

// Attach the plugin to the schema
ProductSchema.plugin(arrayUniquePlugin);

const Model = mongoose.model('Product', ProductSchema);
module.exports = Model