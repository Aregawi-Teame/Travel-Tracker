require("dotenv").config();
require("./api/data/db");
const path = require("path");
const express = require("express");

const tourist_attractionRoutes = require("./api/routes/tourist_attraction");
const travelerRoutes = require("./api/routes/traveler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next)=>{
    console.log(req.method, req.url);
    next();
});
app.use("/api", (req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods' ,'PUT, PATCH, DELETE')
    next();
})
app.use("/api", tourist_attractionRoutes);
app.use("/api", travelerRoutes);

app.use(express.static(path.join(__dirname,"public")));

app.use((req,res)=>{
    console.log("Page Not Found")
    res.status(process.env.HTTP_NOT_FOUND).json({Message:"Page Not Found"});
})

const server = app.listen(process.env.PORT, process.env.HOST, ()=>{
    console.log(`${process.env.SERVER_START_UP_MESSAGE} http://${process.env.HOST}:${server.address().port}`);
});





