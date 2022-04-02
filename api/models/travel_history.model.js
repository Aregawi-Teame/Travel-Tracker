const mongoose = require("mongoose");

const TouristAttractionsSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    }
})
const TravelHistorySchema = mongoose.Schema({
    country:{
        type: String,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    tourist_attractions: [TouristAttractionsSchema]
});

mongoose.model(process.env.TRAVEL_MODEL, TravelHistorySchema, process.env.TRAVEL_COLLECTION);