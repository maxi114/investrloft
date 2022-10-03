const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//industry Schema
const IndustrySchema = new Schema({

    //industry name
    Name:{
         type: String,
    },

    //how many times was it used
    Used:{
        type: Number,
    }
});