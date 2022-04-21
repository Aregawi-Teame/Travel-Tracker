const mongoose = require('mongoose');
const helper_module = require('./helper_module');
const bcrypt = require('bcrypt');
const User = mongoose.model(process.env.USER_MODEL);

exports.userById = (req,res,next,id)=>{
    console.log("userById user controller called")
    const response = {
        status:process.env.HTTP_OK,
        message:{}
    }
    User.findById(id).exec()
        .then((user)=>helper_module.onSuccessfullyDataReturned(user, response))
        .catch((err)=>helper_module.errorHandler(err, response))
        .finally(()=>_checkIfUserFoundAndLoadToReq(req,res,next, response));
};

const _checkIfUserFoundAndLoadToReq = function(req, res, next, response){
    if(response.status!=process.env.HTTP_OK){
        response.message={message: "User not found"}
        helper_module.sendResponse(res, response);
        return;
    }
    req.profile = response.message;
    next();
}

exports.signUp = function(req, res){
    console.log("Add new user controller called")
    const response = {
        status: process.env.HTTP_OK,
        message: {}
    }
    if(!helper_module.includesAllRequiredFieldsForUser(req, res)) return;
    if(!helper_module.isValidData(req, res, response)) return;
    if(req.body.password!=req.body.repeatPassword){
        response.status = process.env.HTTP_BAD_REQUEST;
        response.message = {message:"Your confirmation password is not match"}
        helper_module.sendResponse(res, response);
        return;
    }
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS),(err, salt)=>_checkForSaltErrorAndGenerateHash(req, res, err, salt, response))
};

const _checkForSaltErrorAndGenerateHash = function(req, res, err, salt, response){
    console.log("_checkForSaltErrorAndCreatUser auth controller called");
    if(err){
        response.status = process.env.HTTP_INTERNAL_SERVER_ERROR;
        response.message = err;
        helper_module.sendResponse(res, response);
        return;
    }
    bcrypt.hash(req.body.password, salt,(err, encryptedPassword)=>_checkForHashErrorAndCreateUser(req, res, err, encryptedPassword,response));
}

const _checkForHashErrorAndCreateUser = function(req, res, err, encryptedPassword,response){
    console.log('_checkForHashErrorAndCreateUser auth controller called');
    if(err){
        response.status = process.env.HTTP_INTERNAL_SERVER_ERROR;
        response.message = err;
        helper_module.sendResponse(res, response);
        return;
    }
    const newUser = {};
    newUser.name = req.body.name;
    newUser.username = req.body.username;
    newUser.password = encryptedPassword;

    User.create(newUser)
        .then((createdUser)=>helper_module.onSuccessDataCreation({message:"Successfully Registered"},response))
        .catch((err)=>helper_module.errorHandler(err, response))
        .finally(()=>helper_module.sendResponse(res, response));
}