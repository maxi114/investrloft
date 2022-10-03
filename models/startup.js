const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StartupSchema = new Schema({

    //Email
    Email: {
        type: String,
        required: true,
        unique: true,
    },

    //first name
    FirstName: {
        type: String,
    },

    //last name
    LastName: {
        type: String,
    },

    //Phone number
    PhoneNumber: {
        type: String,
    },

    //School
    School:{
        type: String,
    },
    
    //Biography
    Bio: {
        type: String,
    },

    lat: {
        type: String,
    },

    long: {
        type: String,
    },

    //city
    City: {
        type: String,
    },

    //state
    State: {
        type: String,
    },

    //country
    Country: {
        type: String,
    },

    //position in the startup
    Position:{
        type: String
    },

    //password
    Password: {
        type: String,
    },

    //type of account
    Account: {
        type: String,
    },

    //email verification token
    EmailVerificationToken: {
        type: String,
    },

    //email varification expiration date/time
    EmailVerificationExpirationTime: {
        type: String,
    },

    //password reset token
    PasswordResetToken: {
        type: String,
    },

    //registration date
    RegistrationDate: {
        type: String,
    },

    //track is account is seen by public or if its private
    Public: {
        type: Boolean,
    },

    //track if email is verified or not
    Active: {
        type: Boolean,
    },

    //track if account is disabled or not
    Disabled: {
        type: Boolean,
    },

    //subscription
    Subscription: {
        type: String
    },

    //saved investors
    SavedInvestors: [{
        type: String
    }],

    //promocode
    PromoCode: {
        type: String,
    },

    //for editing
    edit: {
        type: Boolean
    },

    //stripe customer id
    stripeCustomerId:{
        type: String,
    },

    //stripe customer is with payment method
    customer:{
        type: String,
    },

    //stripe subscription id
    subscriptionId:{
        type: String,
    },

    canceling:{
        type: Boolean,
    },
});

const Model = mongoose.model("Startup", StartupSchema);
module.exports = Model;