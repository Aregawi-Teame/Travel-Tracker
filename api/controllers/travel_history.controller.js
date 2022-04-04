const mongoose = require("mongoose");
const helper_module = require("./helper_module");
const Travel = mongoose.model(process.env.TRAVEL_MODEL);

const travelHistoryController = (()=>{
  
    const createNewTravelHistory = function(req, res){
        console.log("Create new travel history controller called")
        const response = {
            status: 200,
            message: {}
        }
        if(!helper_module.isValidData(req, res, response)) return;
        else{
            
            const newTravel = {};
            newTravel.country = req.body.country;
            newTravel.population = parseInt(req.body.population, 10);
            newTravel.tourist_attractions =[];

            Travel.create(newTravel, (err, savedTravel)=>helper_module.checkAndSendResponse(err, savedTravel ? {"Message": "Successfully Saved", savedTravel}: false,response, res));
        };
    };

    const getAll = function(req, res){
        console.log("Get All Travel History controller called");
        const response = {
            status: 200,
            message: {}
        }
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
        const response = {
            status: 200,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        Travel.findById(travel_history_id).exec((err, travelHistory)=>helper_module.checkAndSendResponse(err, travelHistory,response,res));
    }

    const _deleteOneHelper = function(res, travel_history_id, err, travelHistory){
        console.log("_deleteOneHelper travel Histroy controller called");
        const response = {
            status: 200,
            message: {}
        }
        if(err || !travelHistory){
            helper_module.checkAndSendResponse(err,travelHistory,response,res);
            return;
        }
        Travel.findByIdAndDelete(travel_history_id).exec((err, deletedHistory)=>{
            helper_module.checkAndSendResponse(err, deletedHistory? {"Message":"Successfully deleted"} : false,response,res);
        });
    }

    const deleteOne = function(req, res){
        console.log("deleteOne travel Histroy controller called");
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id,res)) return;
        Travel.findById(travel_history_id).exec((err, travelHistory)=>_deleteOneHelper(res, travel_history_id, err, travelHistory));
    }

    const _updateOneHelper = function(res, travel_history_id, updatedTravelInfo, err, travelHistory){
        console.log("_updateOneHelper travel history controller called");
        const response = {
            status: 200,
            message: {}
        }
        if(err || !travelHistory){
            helper_module.checkAndSendResponse(err, false, response,res);
            return
        }
        const tourist_attractions = travelHistory.tourist_attractions;
        updatedTravelInfo.tourist_attractions = tourist_attractions;
        Travel.findByIdAndUpdate(travel_history_id,updatedTravelInfo,{new: true}).exec((err, successfullyUpdated)=>{
            if(!successfullyUpdated){
                helper_module.checkAndSendResponse(err, false, response,res);
                return;
            }
            helper_module.checkAndSendResponse(err, successfullyUpdated? {"Message": "Successfully Updated", successfullyUpdated} : false,response,res)
        });
    }

    const updateOne =  function(req, res){
        console.log("Update one travel history controller called");
        const response = {
            status: 200,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id,res)) return;
        else{
            if(!helper_module.isValidData(req, res, response)) return;
            else{
                const updatedTravelInfo = {};
                updatedTravelInfo.country = req.body.country;
                updatedTravelInfo.population = parseInt(req.body.population, 10);
                Travel.findById(travel_history_id).exec((err, travelHistory)=>_updateOneHelper(res, travel_history_id, updatedTravelInfo, err, travelHistory));
            }
        }
    }

    return {
        createNewTravelHistory,
        getAll,
        getOne,
        deleteOne,
        updateOne
    }
})();

module.exports = travelHistoryController;