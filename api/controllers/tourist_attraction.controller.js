const mongoose=require("mongoose");
const Travel = mongoose.model(process.env.TRAVEL_MODEL);
const helper_module = require("./helper_module");
const ObjectId = require("mongodb").ObjectId;

const tourist_attractionController = (function(){

    const _foundTravelHistoryAndTouristAttraction = function(err, travelHistory, response,res, tourist_id){
        if(!travelHistory){
            helper_module.checkAndSendResponse(err, false, response,res);
            return false;
        }
        const touristAttract = travelHistory.tourist_attractions.id(tourist_id);
        if(!touristAttract){
            helper_module.checkAndSendResponse(err, false, response,res);
            return false;
        }
        return true;
    }

    const addTouristAttraction =  function(req, res){
        console.log("addTouristAttraction tourist_attraction controller called");
        const response = {
            status: 200,
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
        
        Travel.findByIdAndUpdate(travel_history_id,{$push:{tourist_attractions:tourist_attractions}},{new: true},(err, updetedTravelHistory)=>{
            if(!updetedTravelHistory){
                helper_module.checkAndSendResponse(err, false, response,res)
                return;
            } 

            const indexOfLastInsertedTourist_attraction = updetedTravelHistory.tourist_attractions.length-1;
            console.log("Length "+ indexOfLastInsertedTourist_attraction);
            helper_module.checkAndSendResponse(err, updetedTravelHistory.tourist_attractions[indexOfLastInsertedTourist_attraction], response,res)
            
        });
    }

    const getAll =  function(req, res){
        console.log("getAll tourist_attraction controller called");
        const response = {
            status: 200,
            message: {}
        }
        const travel_history_id = req.params.travel_history_id;
        if(!helper_module.isValidId(travel_history_id,res)) return;
    
        Travel.findById(travel_history_id).select("tourist_attractions").exec((err, travelHistroy)=>helper_module.checkAndSendResponse(err,travelHistroy,response,res));
        
    }

    const _getOneHelper =function(res, err, travelHistory, tourist_id){
        console.log("_getOneHelper tourist_attraction controller called");
        const response = {
            status: 200,
            message: {}
        }
        if(!_foundTravelHistoryAndTouristAttraction(err, travelHistory, response,res,tourist_id)) return;
        helper_module.checkAndSendResponse(err, travelHistory.tourist_attractions.id(tourist_id),response, res)
    }


    const getOne = function(req, res){
        console.log("getOne tourist_attraction controller called");
        const travel_history_id = req.params.travel_history_id;
        const tourist_id = req.params.tourist_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidId(tourist_id, res)) return;
       
        Travel.findById(travel_history_id).select("tourist_attractions").exec((err, travelHistory)=>_getOneHelper(res, err, travelHistory, tourist_id));
    }

    const _deleteTouristAttractionHelper = function(res, travel_history_id,err, travelHistory, tourist_id){
        console.log("_deleteTouristAttractionHelper tourist_attraction controller called");
        const response = {
            status: 200,
            message: {}
        }
        if(!_foundTravelHistoryAndTouristAttraction(err, travelHistory, response,res,tourist_id)) return;
        Travel.findOneAndUpdate(({_id: ObjectId(travel_history_id)}),{$pull: {tourist_attractions:{_id: ObjectId(tourist_id)}}},{new:true},(err, result)=>helper_module.checkAndSendResponse(err,{"Message":"Successfully deleted"},response,res));
    }

    const deleteTouristAttraction = async function(req,res){
        console.log("deleteTouristAttraction tourist_attraction controller called");
        const travel_history_id = req.params.travel_history_id;
        const tourist_id = req.params.tourist_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidId(tourist_id,res)) return;

        Travel.findById(travel_history_id).exec((err, travelHistory)=>_deleteTouristAttractionHelper(res, travel_history_id, err, travelHistory, tourist_id));
    }

    const _updateOne = function(req, res, updateOneTouristAttractionCallback){
        console.log("_updateOne tourist attraction controller called");
        const travel_history_id = req.params.travel_history_id;
        const tourist_id = req.params.tourist_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidId(tourist_id, res)) return;
        const response = {
            status: 200,
            message: {}
        }
        if(!helper_module.isValidData(req, res, response)) return;
        Travel.findById(travel_history_id).exec(function(err, travelHistory){
            if(err || !travelHistory || !travelHistory.tourist_attractions.id(tourist_id)){
                helper_module.checkAndSendResponse(err, false,response,res);
                return;
            }
            updateOneTouristAttractionCallback(req, res, travelHistory,tourist_id,response);
        })
    }

    const _replaceOneTouristAttraction = function(req, res, travelHistory,tourist_id, response){
        console.log("_replaceOneTouristAttraction tourist attractions controller called");
        if(!helper_module.includesAllRequiredFieldsForTouristAttraction(req,res)) return;

        travelHistory.tourist_attractions.id(tourist_id).name = req.body.name;
        travelHistory.tourist_attractions.id(tourist_id).description = req.body.description;
        travelHistory.tourist_attractions.id(tourist_id).city = req.body.city;
        travelHistory.save((err, updatedTravelHistroy)=>helper_module.checkAndSendResponse(err, updatedTravelHistroy.tourist_attractions.id(tourist_id),response,res))
        
    
    }
    const replaceOneTouristAttraction =  function(req,res){
        console.log("updateTouristAttraction tourist_attraction controller called");
        _updateOne(req, res,_replaceOneTouristAttraction);
    }

    const _updateOneTouristAttractionPartialy = function(req, res, travelHistory,tourist_id,response){
        console.log("_updateOneTouristAttractionPartialy tourist attraction called");
        travelHistory.tourist_attractions.id(tourist_id).name = req.body.name || travelHistory.tourist_attractions.id(tourist_id).name;
        travelHistory.tourist_attractions.id(tourist_id).description = req.body.description || travelHistory.tourist_attractions.id(tourist_id).description;
        travelHistory.tourist_attractions.id(tourist_id).city = req.body.city || travelHistory.tourist_attractions.id(tourist_id).city;
        travelHistory.save((err, updatedTravelHistroy)=>helper_module.checkAndSendResponse(err, updatedTravelHistroy.tourist_attractions.id(tourist_id),response,res))
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