const mongoose = require("mongoose");
require("../models/travel_history.model");
require("../models/user.model");
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

mongoose.connection.on("connected",function(){
    console.log(process.env.MONGOOSE_CONNECTED_MSG, process.env.DB_NAME);
});

mongoose.connection.on("error", function(err){
    console.log(process.env.MONGOOSE_CONNECTION_ERROR, err);
    process.exit(0);
});

mongoose.connection.on("disconnected", function(){
    console.log(process.env.MONGOOSE_DISCONNECTED_MSG, process.env.DB_NAME);
});

process.on("SIGINT", function(){
    mongoose.connection.close(function(){
        console.log(process.env.MONGOOSE_INTERUPTED);
        process.exit(0);
    })
})

