const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helper_module = require('./helper_module');
const User = mongoose.model(process.env.USER_MODEL);

module.exports.addUser = function(req, res){
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
