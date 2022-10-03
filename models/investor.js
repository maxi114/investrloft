const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestorSchema = new Schema({

    //store the profile image
    profileimage:{
        data: Buffer, 
        contentType: String,
        filename:String,
       },

    //Email
    Email:{
        type: String,
        required: true,
        unique: true,
    },

    //first name
    FirstName:{
        type: String,
    },

    //last name
    LastName:{
        type: String,
    },

    //Phone number
    PhoneNumber:{
        type: String,
    },

    //Biography
    Bio:{
        type: String,
    },

    //investor type
    InvestorType:{
        type: String,
    },

    //latitude location
    lat:{
        type: String
    },

    //longitude location
    long:{
        type: String
    },
    
    //city
    City:{
        type: String,
    },

    //state
    State:{
        type: String,
    },

    //country
    Country:{
        type: String,
    },

    //password
    Password:{
        type: String,
    },

    //investment budget
    Budget:{
        type: String,
    },
    
    //type of account
    Account:{
        type: String,
    },

    //email verification token
    EmailVerificationToken:{
        type: String,
    },

    //email varification expiration date/time
    EmailVerificationExpirationTime:{
        type: String,
    },

    //password reset token
    PasswordResetToken:{
        type: String,
    },

    //registration date
    RegistrationDate:{
        type: String,
    },

    //track is account is seen by public or if its private
    Public:{
        type: Boolean,
    },

    //track if email is verified or not
    Active:{
        type: Boolean,
    },

    //track if account is disabled or not
    Disabled:{
         type: Boolean,
    },


    //promocode
    PromoCode:{
        type: String,
    },

    //store all the producst that the investor has viewed
    History:[{
        type: String,
    }],


    //track how many requests the investor has made
    Requests:{
        type: Number
    },

    //keep track of all requested startups
    Requested:[{
        Product:{
            type: String
        },
        
        Status:{
            type: String
        }
    }],

    //what type of industries the investor is intrested in investing
    Industry:[{
        type: Object
    }],

    //saved startups
    SavedStartups:[{
        type: String,
    }],
    
    //maximum investment budget
    Budget:{
        type: String,
    },

    //homepage feature
    Feature:{
        type: Boolean
    },
   
    //Approve investor
    Approved:{
        type: Boolean
    }
    
});

const Model = mongoose.model("investor", InvestorSchema);
module.exports = Model;