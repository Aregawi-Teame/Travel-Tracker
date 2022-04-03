 const mongoose = require("mongoose");
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

   const isValidData = function(req, res, response){
        console.log("isValidData helper method called");
        const country = req.body.country;
        const population = parseInt(req.body.population, 10);
        if(!population || !country){
            response.status = 400;
            response.message = {message: "Please provide country and number of population"}
        }
        else if(country.length<=1){
            console.log(country.length, !country);
            response.status = 400;
            response.message = {message: "Please provide a valid Country name"}
        }
        else if(isNaN(population) || population<1){
            response.status = 400;
            response.message = {message: "Please provide a valid number of population"}
        }
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
 