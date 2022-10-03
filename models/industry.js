const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//industry Schema
const IndustrySchema = new Schema({

       Title:{
           type: String,
       },
       
       SubTitle:[{
           type: String,
       }],

       Live:{
           type: Boolean
       },

       Uses:{
           type: Number
       }
   
});

const Model = mongoose.model('Industry', IndustrySchema);
module.exports = Model