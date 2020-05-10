const express= require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')
const flash = require("connect-flash");
const session = require("express-session");
const passport=require('passport')



const config= require('./config/database')


const port = 8080;



let Client = require('./models/client')

//setting views and view engine as pug
app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')


//setting path public and it is a static directory
app.use(express.static(path.join(__dirname,"public")))

// using of body parser
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json())



// here comes the turn of mongoose
//lets connect the mongodb by using mongoose

mongoose.connect(config.database)
let db=mongoose.connection;


db.once('open',()=>{
    console.log('mongodb is connected')
})



db.on('error',(err)=>{
    console.error(err)
})



//express session middleware

app.use(
    session({
      secret: "keyboard cat",
      resave: true,
      saveUninitialized: true,
    })
  );


//express message middleware
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});


// passport configuration to main
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize())
app.use(passport.session())




 app.get('*',(req,res,next)=>{                       //making a global user 
    res.locals.user= req.user || null;

    next();

})

 

app.get('/',(req,res)=>{
    Client.find({},(err,client)=>{
        if(err){
            console.error('there is an error')
        }else{
            res.render('index',{
                clients:client
            })
        }
    })
})


let client = require('./routes/client');
app.use('/client',client); 



app.listen(port,()=>console.log(`listening at ${port}`))
