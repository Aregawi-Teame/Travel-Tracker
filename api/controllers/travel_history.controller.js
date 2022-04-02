const mongoose = require("mongoose");
const helper_module = require("./helper_module");
const Travel = mongoose.model(process.env.TRAVEL_MODEL);

const travelHistoryController = (()=>{
    const response = {
        status: 200,
        message: {}
    }
  
    const createNewTravelHistory = function(req, res){
        console.log("Create new travel history controller called")
        if(!helper_module.isValidData(req, res, response)) return;
        else{
            const country = req.body.country;
            const population = parseInt(req.body.population, 10);
            const newTravel = {
                country: country,
                population: population,
                tourist_attractions: []
            }
            Travel.create(newTravel, (err, savedTravel)=>helper_module.checkAndSendResponse(err, savedTravel,response, res));
        };
    };
    const getAll = function(req, res){
        console.log("Get All Travel History controller called");
        let offset = 0;
        let count = 5;
        const maxCount = 10;
        // Travel.find().exec()
        const maxOffset =  10000
        console.log("Max: "+ maxOffset);
        if(req.query){
            offset = req.query.offset ? parseInt(req.query.offset,10) : offset;
            count  = req.query.count ? parseInt(req.query.count, 10) : count;
            if(isNaN(offset) || offset<0 || offset >maxOffset){
                response.status = 400,
                response.message = {message: `Offset must be a digit and between 0 and ${maxOffset}`};
            }
            else if(isNaN(count) || count<1 || count>maxCount){
                response.status = 400,
                response.message = {message: `Offset must be a digit and between 1 and ${maxCount}`};
            }
        }
        if(response.status!=200){
            res.status(response.status).json(response.message);
            return;
        };
        Travel.find().skip(offset).limit(count+offset).exec((err, travelHistories)=>helper_module.checkAndSendResponse(err, travelHistories,response,res));
    }
    
    const getOne = function(req, res){
        console.log("getOne travel Histroy controller called");
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        Travel.findById(travel_history_id).exec((err, travelHistory)=>helper_module.checkAndSendResponse(err, travelHistory,response,res));
    }

    const deleteOne = function(req, res){
        console.log("DeleteOne travel Histroy controller called");
        const travel_history_id = req.params.travel_history_id;

        if(!helper_module.isValidId(travel_history_id,res)) return;

        Travel.findByIdAndDelete(travel_history_id).exec((err, deletedHistory)=>helper_module.checkAndSendResponse(err, deletedHistory,response,res));
    }

    const updateOne = async function(req, res){
        console.log("Update one travel history controller called");
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id,res)) return;
        const isFound = await helper_module.isIdFound(Travel, travel_history_id, res, response);
        console.log(isFound);
        if(!isFound) return;
        else{
            let tourist_attractions = [];
            if(!helper_module.isValidData(req, res, response)) return;
            else{
                const country = req.body.country;
                const population = parseInt(req.body.population, 10);
                Travel.findById(travel_history_id).exec((err, travelHistory)=>{
                    tourist_attractions = travelHistory.tourist_attractions;
                    })
                const updatedTravelInfo = {
                    country: country,
                    population: population,
                    tourist_attractions: tourist_attractions
                }
                Travel.findByIdAndUpdate(travel_history_id,updatedTravelInfo).exec((err, successfullyUpdatedResponse)=>helper_module.checkAndSendResponse(err, successfullyUpdatedResponse,response,res));
            }
        }
    }
    return {
        createNewTravelHistory : createNewTravelHistory,
        getAll: getAll,
        getOne : getOne,
        deleteOne: deleteOne,
        updateOne: updateOne
    }
})();

module.exports = travelHistoryController;