let mongoose = require('mongoose')

let clientSchema= mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    groupname:{
        type:String,
        required:true
    },
    locationname:{
        type:String,
        required:true
    },
    phoneno:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }




})


let Client = module.exports= mongoose.model('Client',clientSchema)
