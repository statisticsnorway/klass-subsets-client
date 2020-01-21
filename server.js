const express = require("express");
const app = express();
//import cors from "cors";
//import bodyParser from "body-parser";
const path = require('path');

const port = 8080;

app.listen(port, console.log("Server listening on port", port));

app.get('/hello', (req, res) => res.send('Hello World!'));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

