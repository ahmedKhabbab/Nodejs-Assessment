const express = require("express");
const routes = require("./routes");
const axios = require("axios") ;
const {sendReply} = require('./controllers') ;

require("dotenv").config();

const app = express();

app.use('/api',routes);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

app.get("/", async (req, res) => {
  res.send("Welcome to Gmail API with NodeJS");
});


// call send reply function repeatedly 

setInterval(()=>{
  sendReply()
  // generating random intervals between 45 and 120 
  let interval = Math.floor(Math.random() * (120 - 45 )  + 45 ) ;
} , 1000 * interval) ;




