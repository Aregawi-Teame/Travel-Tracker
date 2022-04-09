const mongoose = require("mongoose");
const helper_module = require("./helper_module");
const Travel = mongoose.model(process.env.TRAVEL_MODEL);

const travelHistoryController = (()=>{
  
    const createNewTravelHistory = function(req, res){
        console.log("Create new travel history controller called")
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        if(!helper_module.includesAllRequiredFieldsForTravelHistory(req, res)) return;
        if(!helper_module.isValidData(req, res, response)) return;
        const newTravel = {};
        newTravel.country = req.body.country;
        newTravel.population = parseInt(req.body.population, 10);
        newTravel.tourist_attractions =[];

        Travel.create(newTravel, (err, savedTravel)=>helper_module.checkAndSendResponse(err, savedTravel ? {"Message": "Successfully Saved", savedTravel}: false,response, res));
    };

    const getAll = function(req, res){
        console.log("Get All Travel History controller called");
        const response = {
            status: process.env.HTTP_OK,
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
                response.status = process.env.HTTP_BAD_REQUEST,
                response.message = {message: `Offset must be a digit and between 0 and ${maxOffset}`};
            }
            else if(isNaN(count) || count<1 || count>maxCount){
                response.status = process.env.HTTP_BAD_REQUEST,
                response.message = {message: `Offset must be a digit and between 1 and ${maxCount}`};
            }
        }
        if(response.status!=process.env.HTTP_OK){
            res.status(response.status).json(response.message);
            return;
        };
        Travel.find().skip(offset).limit(count+offset).exec((err, travelHistories)=>helper_module.checkAndSendResponse(err, travelHistories,response,res));
    }
    
    const getOne = function(req, res){
        console.log("getOne travel Histroy controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        Travel.findById(travel_history_id).exec((err, travelHistory)=>helper_module.checkAndSendResponse(err, travelHistory,response,res));
    }

    const _deleteOneHelper = function(res, travel_history_id, err, travelHistory){
        console.log("_deleteOneHelper travel Histroy controller called");
        const response = {
            status: process.env.HTTP_OK,
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

    const _updateOne = function(req, res, updateOneCallback){
        console.log("_updateOneHelper travel history controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidData(req, res, response)) return;
        Travel.findById(travel_history_id).exec(function(err, travelHistory){
            if(err || !travelHistory) {
                helper_module.checkAndSendResponse(err, travelHistory,response,res);
                return;
            }
            updateOneCallback(req, res, travelHistory, response);
        })
    }

    const _replaceOneTravelHistory = function(req,res,travelHistory, response){
        console.log("_replaceOneTravelHistory travel history controller called");
        if(!helper_module.includesAllRequiredFieldsForTravelHistory(req, res))return;
        travelHistory.country = req.body.country;
        travelHistory.population = parseInt(req.body.population,10);
        travelHistory.tourist_attractions = [];
        travelHistory.save((err, successfullyUpdated)=>helper_module.checkAndSendResponse(err, successfullyUpdated? {"Message": "Successfully Updated", successfullyUpdated} : false,response,res));
    }
    const replaceOneTravelHistory =  function(req, res){
        console.log("replaceOneTravelHistor  travel history controller called");
        _updateOne(req, res, _replaceOneTravelHistory);
    }


    const _partialUpdate = function(req, res, travelHistory, response){
        console.log("_partialUpdate travel history controller called");
        travelHistory.country = req.body.country || travelHistory.country;
        travelHistory.population = req.body.population || travelHistory.population;
        travelHistory.tourist_attractions = req.body.tourist_attractions || travelHistory.tourist_attractions;
        travelHistory.save((err, successfullyUpdated)=>helper_module.checkAndSendResponse(err, successfullyUpdated? {"Message": "Successfully Updated", successfullyUpdated}:false,response,res));
    }
    const partialUpdate = function(req, res){
        console.log("partialUpdate travel history controller called");
        _updateOne(req, res, _partialUpdate);
    }


    return {
        createNewTravelHistory,
        getAll,
        getOne,
        deleteOne,
        replaceOneTravelHistory,
        partialUpdate
    }
})();

module.exports = travelHistoryController;