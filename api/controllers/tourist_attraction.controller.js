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
        const name = req.body.name;
        const description = req.body.description;
        const city = req.body.city;
        if(!name || !description || !city){
            response.status = 400;
            response.message = {message: "Please provide all information"}
        }
        if(response.status!=200){
            res.status(response.status).json(response.message);
            return;
        }
        const tourist_attractions ={
            name: name,
            description: description,
            city: city
        }
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

    const _updateTouristAttractionHelper = function(res, travel_history_id,err, travelHistory, tourist_id,tourist_attractions){
        console.log("_updateTouristAttractionHelper tourist_attraction controller called");
        const response = {
            status: 200,
            message: {}
        }
        if(!_foundTravelHistoryAndTouristAttraction(err, travelHistory, response,res, tourist_id)) return;

        Travel.findOneAndUpdate(({_id: ObjectId(travel_history_id), "tourist_attractions._id": ObjectId(tourist_id)}),{$set: {"tourist_attractions.$": tourist_attractions}},{new:true},(err, result)=>{
                if(!result){
                    helper_module.checkAndSendResponse(err, false, response,res);
                } else{
                    const tourist_attractionsRes = result.tourist_attractions;
                    helper_module.checkAndSendResponse(err,tourist_attractionsRes?{"Message": "Successfully Updated", tourist_attractionsRes} : false,response,res)
                }
            });
    }

    const updateTouristAttraction = async function(req,res){
        console.log("updateTouristAttraction tourist_attraction controller called");
        const travel_history_id = req.params.travel_history_id;
        const tourist_id = req.params.tourist_id;
        if(!helper_module.isValidId(travel_history_id, res)) return;
        if(!helper_module.isValidId(tourist_id, res)) return;
        const response = {
            status: 200,
            message: {}
        }
        const name = req.body.name;
        const description = req.body.description;
        const city = req.body.city;
        if(!name || !description || !city){
            response.status = 400;
            response.message = {message: "Please provide all information"}
        }
        if(response.status!=200){
            res.status(response.status).json(response.message);
            return;
        }
        const tourist_attractions ={
            name: name,
            description: description,
            city: city,
            _id: ObjectId(tourist_id)
        }
        Travel.findById(travel_history_id).exec((err, travelHistory)=>_updateTouristAttractionHelper(res,travel_history_id,err, travelHistory, tourist_id, tourist_attractions));
    }
    return{
        addTouristAttraction,
        getAll,
        getOne,
        deleteTouristAttraction,
        updateTouristAttraction
    }
})();

module.exports = tourist_attractionController;