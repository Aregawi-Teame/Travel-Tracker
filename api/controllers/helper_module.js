 const mongoose = require("mongoose");
 const propertiesRule = require("./proporties.rule");
 const helper_module = (()=>{
    const checkAndSendResponse = function(err, succeededOperationResponse,response, res){
        console.log("Check and Send Response helper method called")
       if(err){
           console.log("Error "+ err);
           response.status = process.env.HTTP_INTERNAL_SERVER_ERROR;
           response.message = {message: "Internal Server Error", err};
       }else{
            if(succeededOperationResponse){
                console.log("Responded  Successfuly")
                response.status = process.env.HTTP_OK,
                response.message = succeededOperationResponse
            } else{
                console.log("Data is null");
                response.status = process.env.HTTP_NOT_FOUND;
                response.message = {message: "There is no data for the provided Id"}
            }
       }
   
       res.status(response.status).json(response.message);
   }
   const isValidId = function(travel_history_id, res){
       console.log("isValidId helper method called");
       let isValid = mongoose.isValidObjectId(travel_history_id);
       if(isValid) return true;
       else{
           res.status(400).json({message: "Please provide valid Id"});
           return false;
       }
   }

   const includesAllRequiredFields= function(requiredFields,req, res){
       console.log("includesAllRequiredFields helper module called")
       const bodyKeys = Object.keys(req.body);
       for(let i =0; i<requiredFields.length;i++){
           if(bodyKeys.indexOf(requiredFields[i])<0){
               res.status(process.env.HTTP_BAD_REQUEST).json({"Error":`${requiredFields[i]} is required`});
               return false;
           }
       }

       return true;
   }

   const includesAllRequiredFieldsForTravelHistory = function(req, res){
       console.log("includesAllRequiredFieldsForTravelHistory helper module called")
        const requiredFields = ["country", "population"];
        if(!includesAllRequiredFields(requiredFields,req, res)) return false;
        else return true;
   }

   const includesAllRequiredFieldsForTouristAttraction = function(req, res){
    console.log("includesAllRequiredFieldsForTouristAttraction helper module called");
    const requiredFields = ["name", "description","city"];
    if(!includesAllRequiredFields(requiredFields,req,res)) return false;
    else return true;
   }

   const _isValidDataHelper = function(key, value,response){
        if(propertiesRule.properties.get(key)){
            if(!propertiesRule.properties.get(key).test(value)){
                response.status = process.env.HTTP_BAD_REQUEST;
                response.message = {message: propertiesRule.message.get(key)}
            }
    }
   }
   const isValidData = function(req, res, response){
        console.log("isValidData helper method called");
        const bodyKeys = Object.keys(req.body);
        const bodyValues = Object.values(req.body);
        const formData = new Map();

        for(let i =0; i<bodyKeys.length;i++){
            formData.set(bodyKeys[i], bodyValues[i]);
        }
        formData.forEach((value, key, m)=>_isValidDataHelper(key, value, response))
        if(response.status!=process.env.HTTP_OK){
            res.status(response.status).json(response.message);
            return false;
        } else return true;
   };
   
   return {
       checkAndSendResponse : checkAndSendResponse,
       isValidId: isValidId,
       isValidData : isValidData,
       includesAllRequiredFieldsForTravelHistory,
       includesAllRequiredFieldsForTouristAttraction
   }
 })();

 module.exports = helper_module;
 