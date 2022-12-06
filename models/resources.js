const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Resources Schema
const ResourcesSchema = new Schema({

    Name: {
        type: String,
    },

    Link: {
        type: String,
    },

    Description:{
        type: String,
    },

    Live: {
        type: Boolean
    },

    TitleIndustry:{
        type: String
    },

    SubIndustry:{
        type: String
    },

});

const Model = mongoose.model('Resource', ResourcesSchema);
module.exports = Model