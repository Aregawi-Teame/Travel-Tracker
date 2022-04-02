require("dotenv").config();
require("./api/data/db");

const path = require("path");

const express = require("express");

const userRoutes = require("./api/routes/user");
const travelerRoutes = require("./api/routes/traveler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next)=>{
    console.log(req.method, req.url);
    next();
});

app.use("/api", userRoutes);
app.use("/api", travelerRoutes);

app.use(express.static(path.join(__dirname,"public")));

app.use((req,res)=>{
    res.status(404).redirect(303,"/html/404.html");
})

const server = app.listen(process.env.PORT, process.env.HOST, ()=>{
    console.log(`${process.env.SERVER_START_UP_MESSAGE} http://${process.env.HOST}:${server.address().port}`);
});





