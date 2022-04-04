 const mongoose = require("mongoose");
 const propertiesRule = require("./proporties.rule");
 const helper_module = (()=>{
    const checkAndSendResponse = function(err, succeededOperationResponse,response, res){
        console.log("Check and Send Response helper method called")
       if(err){
           console.log("Error "+ err);
           response.status = 500;
           response.message = {message: "Internal Server Error"};
       }
       else if(succeededOperationResponse){
               console.log("Responded  Successfuly")
               response.status = 200,
               response.message = succeededOperationResponse
       } else{
           console.log("Data is null");
           response.status = 404;
           response.message = {message: "There is no data for the provided Id"}
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

   const _isValidDataHelper = function(key, value,response){
    if(!propertiesRule.properties.get(key).test(value)){
        response.status = 400;
        response.message = {message: propertiesRule.message.get(key)}
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
        if(response.status!=200){
            res.status(response.status).json(response.message);
            return false;
        } else return true;
   };
   
   return {
       checkAndSendResponse : checkAndSendResponse,
       isValidId: isValidId,
       isValidData : isValidData,
   }
 })();

 module.exports = helper_module;
 