const axios = require("axios");
const { generateConfig , makeBody } = require("./utils");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");


require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });



async function getAllemails(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.send(error);
  }
}


async function getMessageDetails(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/threads/${req.params.id}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.send(error);
  }
}



// send reply function 

async function sendReply(req, res) {

  try {

    // GET ALL MAILS 
    const url = "http://localhost:8000/api/mail/emails";
    const response = await axios(url);

    const messegeList = response.data.messages;
    let msg_url = '';
    for (const msg of messegeList) {

      /*   GET EACH THREAD ( The Gmail API uses Thread 
        to group email replies with original message
         into single conversation )  here i get each thread using message id 
      */
      msg_url = `http://localhost:8000/api/mail/thread/${msg.id}`;
      let resp = await axios(msg_url);


      if (!("status" in resp.data) && resp.data.status != 404) {

        if (resp.data.messages.length == 1) {

          /* here i take header array and take out Subject , to mail which i have to reply and Message-ID  */
          let headers = resp.data.messages[0].payload.headers;
          let subject;
          let to;
          let ref;
          let InReply

          headers.forEach(element => {
            if (element.name === 'Subject' || element.name === 'subject') {
              subject = element.value
            }
            if (element.name === 'From' || element.name === 'from') {
              to = element.value
            }
            if (element.name === 'Message-ID' || element.name === 'Message-Id') {
              ref = element.value
              InReply = element.value
            }
          });



          const raw = makeBody(ref, InReply, to, "ahmedkhabbab272@gmail.com", subject, "thanks for mail!")

          const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

          let id ;
          let labelIds ;

          await gmail.users.messages.send({
            auth: oAuth2Client,
            userId: 'me',
            resource: {
              raw: raw,
              message_id: resp.data.messages[0].threadId
            }

          }, function (err, response) {
            if (err) {
              return console.log('The API returned an error: ' + err);
            }
            else{
              labelIds = response.data.labelIds ;
              id = response.data.id ;
              // here i call  attachLabel function to add label after sending the reply  
              attachLabel(id , labelIds ) ;
            }
     
          });
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

}


// Attach label functions 
async function attachLabel(id , labelIds){
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
            await gmail.users.messages.modify({
            userId: 'me',
            id : id ,
            resource :{
                'addLabelIds': ['INBOX'],
                'removeLabelIds': []
            }
        });
}

module.exports = {
  getAllemails,
  sendReply,
  getMessageDetails,
};