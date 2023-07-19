const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
 
const app = express();
  
app.use(bodyParser.urlencoded({extended: true}));
 
// Static Folder 
app.use(express.static("public"));
 
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
 

app.post("/", function(req, res){
 
    const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;

    // Construct Requesting data based on mailchimp
    const data = {
        members: [
            {
              email_address: email,
              status: 'subscribed',
              merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName
              }
            }
          ]
    }
 
    // *** Stringify inputed data as JSON format***
    const jsonData = JSON.stringify(data);
 
    // url = "https://<data center>.api.mailchimp.com/3.0/lists/{listID}"; 
    // data center is the last part of the api key after -
    const url = process.env.MAILCHIMP_URL;

 
    const options = {
        method: "POST",
        auth: process.env.MAILCHIMP_AUTH
    };
    
    // Requesting and send back our data to mailchimp
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
 
    request.write(jsonData);
    request.end();
    
 
});
 
app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port: 3000!");
});


