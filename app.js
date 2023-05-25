const axios = require('axios');
const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", (req, res) => {
    var sc = req.body.sc;
    
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            language_id: 52,
            source_code: (sc)
        }
    };

    var token = "";

    try {
        axios.request(options).then((response)=>{
            token = response.data.token;

            const opt = {
                method: 'GET',
                url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
                params: {
                token: token,
                base64_encoded: 'true',
                fields: '*'
                },
                headers: {
                'X-RapidAPI-Key': '55f55e265bmshb1c59a0d35fc62cp1b4572jsn0adf876da6fa',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            }.catch((error) => {
                console.log(error);
            });
            
            try {
                axios.request(opt).then((result)=>{
                    var out = (atob(result.data.stdout)).replaceAll('\r\n', '&#10;');
                    var inp = (atob(result.data.source_code));
                    res.render("index", {inp: inp, out: out});
                }).catch((error) => {
                    console.log(error);
                });
            } catch (error) {
                console.log(error);
            }

        })
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000!");
});

