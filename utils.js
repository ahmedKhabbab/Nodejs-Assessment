const generateConfig = (url, accessToken) => {
    return {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-type": "application/json",
      },
    };
  };

const  makeBody = (ref, InReply, to, from, subject, message) => {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "References:", ref, "\n" +
      "In-Reply-To: ", InReply, "\n" +
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      message
    ].join('');
  
    var encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail
  }
  
  module.exports = { generateConfig , makeBody  };