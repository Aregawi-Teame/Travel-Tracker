const mongoose=require("mongoose");
const Travel = mongoose.model(process.env.TRAVEL_MODEL);
const helper_module = require("./helper_module");
const ObjectId = require("mongodb").ObjectId;

const tourist_attractionController = (function(){

    const _foundTravelHistoryAndTouristAttraction = function(res, response, tourist_id){
        console.log("_foundTravelHistoryAndTouristAttraction tourist attraction controller called")
        if(response.status!=process.env.HTTP_OK){
            helper_module.sendResponse(res, response);
            return false;
        }
        const touristAttract = response.message.tourist_attractions.id(tourist_id);
        helper_module.onSuccessfullyDataReturned(touristAttract,response);
        if(response.status!=process.env.HTTP_OK){
            helper_module.sendResponse(res, response);
            return false;
        }
        return true;
    }

    const addTouristAttraction =  function(req, res){
        console.log("addTouristAttraction tourist_attraction controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.includesAllRequiredFieldsForTouristAttraction(req,res)) return;
        if(!helper_module.isValidData(req, res, response)) return;

        const tourist_attractions = {};
        tourist_attractions.name = req.body.name;
        tourist_attractions.description = req.body.description;
        tourist_attractions.city = req.body.city;
        
        Travel.findByIdAndUpdate(travel_history_id,{$push:{tourist_attractions:tourist_attractions}},{new: true})
            .then((updatedData)=>helper_module.handleOnUpdateResponse(updatedData, response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>_checkResponseStatusAndSendResponse(res, response));
    }

    const _checkResponseStatusAndSendResponse = function(res, response){
        console.log("_checkResponseStatusAndSendResponse tourist attraction controller called");
        if(response.status!=process.env.HTTP_OK){
            helper_module.sendResponse(res, response);
            return;
        }
        const indexOfLastInsertedTourist_attraction = response.message.updatedData.tourist_attractions.length-1;
        helper_module.onSuccessDataCreation(response.message.updatedData.tourist_attractions[indexOfLastInsertedTourist_attraction],response);
        helper_module.sendResponse(res, response);
    }

    const getAll =  function(req, res){
        console.log("getAll tourist_attraction controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id,res)) return;
    
        Travel.findById(travel_history_id).select("tourist_attractions").exec()
            .then((touristAttractions)=>helper_module.onSuccessfullyDataReturned(touristAttractions, response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>helper_module.sendResponse(res, response));
        
    }

    const _getOneHelper =function(res, response, tourist_id){
        console.log("_getOneHelper tourist_attraction controller called");
        if(!_foundTravelHistoryAndTouristAttraction(res, response,tourist_id)) return;
        helper_module.sendResponse(res, response);
    }


    const getOne = function(req, res){
        console.log("getOne tourist_attraction controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        const tourist_id = req.params.tourist_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidId(tourist_id, res)) return;
       
        Travel.findById(travel_history_id).select("tourist_attractions").exec()
            .then((travelHistory)=>helper_module.onSuccessfullyDataReturned(travelHistory,response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>_getOneHelper(res, response, tourist_id));
    }

    const _deleteTouristAttractionHelper = function(travel_history_id, tourist_id , res, response){
        console.log("_deleteTouristAttractionHelper tourist_attraction controller called");
        if(!_foundTravelHistoryAndTouristAttraction(res,response,tourist_id)) return;
        Travel.findOneAndUpdate(({_id: ObjectId(travel_history_id)}),{$pull: {tourist_attractions:{_id: ObjectId(tourist_id)}}},{new:true})
            .then((deletedData)=>helper_module.handleOnDeleteResponse({},response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>helper_module.sendResponse(res, response));
    }

    const deleteTouristAttraction = async function(req,res){
        console.log("deleteTouristAttraction tourist_attraction controller called");
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        const tourist_id = req.params.tourist_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidId(tourist_id,res)) return;

        Travel.findById(travel_history_id).exec()
            .then((travelHistory)=>helper_module.onSuccessfullyDataReturned(travelHistory,response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>_deleteTouristAttractionHelper(travel_history_id,tourist_id,res, response));
    }

    const _updateOne = function(req, res, updateOneTouristAttractionCallback){
        console.log("_updateOne tourist attraction controller called");
        const travel_history_id = req.params.travel_history_id;
        const tourist_id = req.params.tourist_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidId(tourist_id, res)) return;
        const response = {
            status: process.env.HTTP_OK,
            message: {}
        }
        if(!helper_module.isValidData(req, res, response)) return;
        Travel.findById(travel_history_id).exec()
            .then((travelHistory)=>helper_module.onSuccessfullyDataReturned(travelHistory,response))
            .catch((err)=>helper_module.errorHandler(err, response))
            .finally(()=>_checkForErrorAndCallUpdateOneTouristAttractionCallback(req, res, response,tourist_id, updateOneTouristAttractionCallback));
    }

    const _checkForErrorAndCallUpdateOneTouristAttractionCallback = function(req, res, response,tourist_id, updateOneTouristAttractionCallback){
         console.log("_checkForErrorAndCallUpdateOneTouristAttractionCallback tourist attraction controller called");
         if(response.status!=process.env.HTTP_OK)  {
             helper_module.sendResponse(res, response);
             return;
         }
         //helper_module.onSuccessfullyDataReturned(response.message.tourist_attractions.id(tourist_id),response); 
         if(!response.message.tourist_attractions.id(tourist_id)){
            response.status = process.env.HTTP_NOT_FOUND;
            response.message = {message: "Tourist Id not found"}
            helper_module.sendResponse(res, response);
            return;
        }
        updateOneTouristAttractionCallback(req, res,tourist_id,response);
    }
    const _replaceOneTouristAttraction = function(req, res,tourist_id, response){
        console.log("_replaceOneTouristAttraction tourist attractions controller called");
        if(!helper_module.includesAllRequiredFieldsForTouristAttraction(req,res)) return;

        response.message.tourist_attractions.id(tourist_id).name = req.body.name;
        response.message.tourist_attractions.id(tourist_id).description = req.body.description;
        response.message.tourist_attractions.id(tourist_id).city = req.body.city;
        response.message.save((err, updatedTravelHistroy)=>helper_module.checkAndSendResponse(err, updatedTravelHistroy.tourist_attractions.id(tourist_id),response,res))
        
    
    }
    const replaceOneTouristAttraction =  function(req,res){
        console.log("updateTouristAttraction tourist_attraction controller called");
        _updateOne(req, res,_replaceOneTouristAttraction);
    }

    const _updateOneTouristAttractionPartialy = function(req, res,tourist_id,response){
        console.log("_updateOneTouristAttractionPartialy tourist attraction called");
        response.message.tourist_attractions.id(tourist_id).name = req.body.name || response.message.tourist_attractions.id(tourist_id).name;
        response.message.tourist_attractions.id(tourist_id).description = req.body.description || response.message.tourist_attractions.id(tourist_id).description;
        response.message.tourist_attractions.id(tourist_id).city = req.body.city || response.message.tourist_attractions.id(tourist_id).city;
        response.message.save((err, updatedTravelHistroy)=>helper_module.checkAndSendResponse(err, updatedTravelHistroy.tourist_attractions.id(tourist_id),response,res))
    }
    const updateOneTouristAttractionPartialy = function(req, res){
        console.log("updateOneTouristAttractionPartialy tourist attraction controller");
        _updateOne(req, res, _updateOneTouristAttractionPartialy);
    }

    return{
        addTouristAttraction,
        getAll,
        getOne,
        deleteTouristAttraction,
        replaceOneTouristAttraction,
        updateOneTouristAttractionPartialy
    }
})();

module.exports = tourist_attractionController;