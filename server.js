require("dotenv").config();
require("./api/data/db");
const path = require("path");
const express = require("express");

const routes = require("./api/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next)=>{
    console.log(req.method, req.url);
    next();
});
app.use("/api", (req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, authorization,Content-Type, Accept');
    res.header('Access-Control-Allow-Methods' ,'PUT, PATCH, DELETE')
    next();
})
app.use("/api", routes);

app.use(express.static(path.join(__dirname,"public")));

app.use((req,res)=>{
    console.log("Page Not Found")
    res.status(process.env.HTTP_NOT_FOUND).json({Message:"Page Not Found"});
})

const server = app.listen(process.env.PORT, process.env.HOST, ()=>{
    console.log(`${process.env.SERVER_START_UP_MESSAGE} http://${process.env.HOST}:${server.address().port}`);
});





