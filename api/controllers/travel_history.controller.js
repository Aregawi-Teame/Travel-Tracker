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

        Travel.create(newTravel)
            .then((createdTravelHistory)=>helper_module.onSuccessDataCreation(createdTravelHistory, response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>helper_module.sendResponse(res, response));
    };

    const getAll = function(req, res){
        console.log("Get All Travel History controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        let offset = 0;
        let count = 6;
        const maxCount = 10;
        // Travel.find().exec()
        const maxOffset =  10000
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
            helper_module.sendResponse(res, response);
            return;
        };
        Travel.find().skip(offset).limit(count+offset).exec()
            .then((travelHistories)=>helper_module.onSuccessfullyDataReturned(travelHistories,response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>helper_module.sendResponse(res, response));
    }
    
    const getOne = function(req, res){
        console.log("getOne travel Histroy controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        Travel.findById(travel_history_id).exec()
            .then((travelHistory)=>helper_module.onSuccessfullyDataReturned(travelHistory, response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>helper_module.sendResponse(res, response));
    }

    const _deleteOneHelper = function(res, travel_history_id, response){
        console.log("_deleteOneHelper travel Histroy controller called");
        if(response.status!=process.env.HTTP_OK){
            helper_module.sendResponse(res, response);
            return;
        }
        Travel.findByIdAndDelete(travel_history_id).exec()
            .then((deletedStatus)=>helper_module.handleOnDeleteResponse(deletedStatus,response))
            .catch((err)=>helper_module.errorHandler(err,response))
            .finally(()=>helper_module.sendResponse(res, response));
    }

    const deleteOne = function(req, res){
        console.log("deleteOne travel Histroy controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id,res)) return;
        Travel.findById(travel_history_id).exec()
            .then((travelHistory)=>helper_module.onSuccessfullyDataReturned(travelHistory, response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>_deleteOneHelper(res, travel_history_id, response));
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
        Travel.findById(travel_history_id).exec()
            .then((travelHistory)=>helper_module.onSuccessfullyDataReturned(travelHistory, response))
            .catch((err)=>helper_module.errorHandler(err,response))
            .finally(()=>_checkForErrorAndCallUpdateOneCallback(req, res, response, updateOneCallback));
    }

    const _checkForErrorAndCallUpdateOneCallback = function(req, res, response, updateOneCallback){
        if(response.status!=process.env.HTTP_OK){
            helper_module.sendResponse(res, response);
            return;
        }
        updateOneCallback(req, res, response)
    }

    const _replaceOneTravelHistory = function(req,res, response){
        console.log("_replaceOneTravelHistory travel history controller called");
        if(!helper_module.includesAllRequiredFieldsForTravelHistory(req, res))return;
        response.message.country = req.body.country;
        response.message.population = parseInt(req.body.population,10);
        response.message.tourist_attractions = [];
        response.message.save()
            .then((updatedTravelHistory)=>helper_module.handleOnUpdateResponse(updatedTravelHistory, response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>helper_module.sendResponse(res, response));
    }

    const replaceOneTravelHistory =  function(req, res){
        console.log("replaceOneTravelHistor  travel history controller called");
        _updateOne(req, res, _replaceOneTravelHistory);
    }


    const _partialUpdate = function(req, res, response){
        console.log("_partialUpdate travel history controller called");
        response.message.country = req.body.country || response.message.country;
        response.message.population = req.body.population || response.message.population;
        response.message.tourist_attractions = req.body.tourist_attractions || response.message.tourist_attractions;
        response.message.save()
            .then((updatedTravelHistory)=>helper_module.handleOnUpdateResponse(updatedTravelHistory, response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>helper_module.sendResponse(res, response));
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