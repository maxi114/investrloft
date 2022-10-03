const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestmentSchema = new Schema({

    //product id
    PrId:{
        type: String,
    },

    //investors intrested in investing
    Investors:[{
        //invetors id
        InvId:{
            type: String
        },

        //store if investor is acceptes
        Accepted:{
            type: Boolean,
        }
    }],

})

const Model = mongoose.model("Investment", InvestmentSchema);
module.exports = Model;