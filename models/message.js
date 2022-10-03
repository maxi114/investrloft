const mongoose = require('mongoose');
const { type } = require('jquery');
const Schema = mongoose.Schema;

//message Schema
const MessageSchema = new Schema({

    //startup id
    StartupId:{
        type: String,
    },

    //investors id
    InvestorId :{
        type: String,
    },

    //entrepreneurs id
    EntrepreneurId:{
        type: String,
    },

    //type of message
    MsgType:{
        type: String,
    },

    //date of initiation
    Date:{
        type: String,
    },

    //Message
    Message:[{


            //store the date of the message
            Date:{
                type: String,
            },

            //store the time the message was sent
            Time:{
                type: String
            },
            
            //message
            Msg:{
                type: String,
            },

            //startups link
            Link:{
                type: String
            },

            //to track who sent the message
            Act:{
                type: String
            }
    
    }],

    //track how many messages are sent
    conversations:{
        type: Number
    },

    //check if message is read by investor
    ReadInvestor:{
        type: Boolean,
    },

    //check if messag is read by entrepreneur
    ReadEntrepreneur:{
        type: Boolean,
    },
    
});

const Model = mongoose.model('Message', MessageSchema);
module.exports = Model