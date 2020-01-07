import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

let port = 8080;
let app = express();

app.listen(port, console.log("Server listening on port", port));

app.get('/hello', (req, res) => {
   res.send("Hello world");
});
