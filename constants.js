require("dotenv").config();



const auth = {
  type: "OAuth2",
  user: "ahmedkhabbab272@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};



module.exports = {
  auth
};