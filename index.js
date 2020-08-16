const express = require("express");
const app = express();
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser');


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


var download = function(uri, globalres){
    request.head(uri, function(err, res, body){

        content = res.headers['content-type'].split("/")
        try{
            if(content[0] !== "image") {
                throw new Error("Ссылка не содержит изображения!");
            }
            var filename = makeid(16);
        while(fs.existsSync("./imgs/"+ filename + "." + content[1])) {
            filename = makeid(16);
        }

          request(uri).pipe(fs.createWriteStream("imgs/" + filename + "." + content[1])).on('close', () => {
              globalres.json({
                  dir : "imgs/" + filename + "." + content[1]
              })
          });
        } catch(e) {
            globalres.send(e.message)
        }
    });
  };

  var jsonParser = bodyParser.json()


app.post("/", jsonParser, (req,res) => {    

    download(req.body.url + "", res);

})

app.listen(8000, () => {
    console.log("Listening 8000 port")
})