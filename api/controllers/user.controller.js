const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helper_module = require('./helper_module');
const User = mongoose.model(process.env.USER_MODEL);

module.exports.signUp = function(req, res){
    console.log("Add new user controller called")
    const response = {
        status: process.env.HTTP_OK,
        message: {}
    }
    if(!helper_module.includesAllRequiredFieldsForUser(req, res)) return;
    if(!helper_module.isValidData(req, res, response)) return;
    if(req.body.password!=req.body.repeatPassword){
        response.status = process.env.HTTP_BAD_REQUEST;
        response.message = {message: "Your confirmation password is not match"}
        helper_module.sendResponse(res, response);
        return;
    }
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS),(err, salt)=>_checkForSaltErrorAndGenerateHash(req, res, err, salt, response))
};

const _checkForSaltErrorAndGenerateHash = function(req, res, err, salt, response){
    console.log("_checkForSaltErrorAndCreatUser user controller called");
    if(err){
        response.status = process.env.HTTP_INTERNAL_SERVER_ERROR;
        response.message = err;
        helper_module.sendResponse(res, response);
        return;
    }
    bcrypt.hash(req.body.password, salt,(err, encryptedPassword)=>_checkForHashErrorAndCreateUser(req, res, err, encryptedPassword,response));
}

const _checkForHashErrorAndCreateUser = function(req, res, err, encryptedPassword,response){
    console.log('_checkForHashErrorAndCreateUser user controller called');
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
        .then((createdUser)=>helper_module.onSuccessDataCreation(createdUser,response))
        .catch((err)=>helper_module.errorHandler(err, response))
        .finally(()=>helper_module.sendResponse(res, response));
}

module.exports.login = function(req, res){
    console.log("Login user controller called");
    if(!helper_module.includesAllRequiredFieldsForLogin(req, res)) return;
    const response = {
        status: process.env.HTTP_OK,
        message: {}
    }
    User.findOne({username: req.body.username}).exec()
        .then((user)=>helper_module.onSuccessfullyDataReturned(user,response))
        .catch((err)=>helper_module.errorHandler(err))
        .finally(()=>_checkIfUserFound(req, res, response));
}

const _checkIfUserFound = function(req, res, response){
    console.log("_checkIfUserFound user controller called")
    if(response.status!=process.env.HTTP_OK){
        response.status = process.env.HTTP_NOT_FOUND
        response.message = {message: "User not found!"}
        helper_module.sendResponse(res, response);
        return;
    }
    bcrypt.compare(req.body.password, response.message.password)
        .then((result)=>helper_module.onSuccessfullyDataReturned(result, response))
        .catch((err)=>helper_module.errorHandler(err, response))
        .finally(()=>_ckeckIfPasswordMatchAndSendResponse(res, response));
}
const _ckeckIfPasswordMatchAndSendResponse = function(res, response){
    console.log("_ckeckIfPasswordMatchAndSendResponse user controller called")
    if(response.status!=process.env.HTTP_OK){
        response.status = process.env.HTTP_BAD_REQUEST
        response.message = {message: "Incorrect Password!"}
        helper_module.sendResponse(res, response);
        return;
    }
    response.message = {message: "Successfuly loggedin!"}
    helper_module.sendResponse(res, response);
}