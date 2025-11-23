/**
 * User Model for Authentication
 * Created by: Chadwick Enebeli
 * Date: Nov 22, 2025
 * Description: Mongoose schema for user authentication with passport-local-mongoose
 */

let mongoose = require('mongoose')
let passportLocalMongoose = require('passport-local-mongoose');
const { createIndexes, collection } = require('./workout');

let User = mongoose.Schema({
    username:
    {
        type:String,
        default:"",
        trim:true,
        required: "Username is Required"
    },
    /*password:
    {
        type:String,
        default:"",
        trim:true,
        required: "Password is Required"
    },*/
    email:
    {
        type:String,
        default:"",
        trim:true,
        required: "Email is Required"
    },
    displayName:
    {
        type:String,
        default:"",
        trim:true,
        required: "Display name is Required"
    },
    created:
    {
        type:Date,
        default:Date.now
    },
    updated:
    {
        type:Date,
        default:Date.now
    },
},
{
    collection:"user"
}
)


let options = ({MissingPasswordError:"Wrong/Missing Password"});
User.plugin(passportLocalMongoose, options)
module.exports.User = mongoose.model('User',User)