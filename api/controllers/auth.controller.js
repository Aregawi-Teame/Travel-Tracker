const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const helper_module = require('./helper_module');
const User = mongoose.model(process.env.USER_MODEL);


exports.login = function(req, res){
    console.log("Login auth controller called");
    if(!helper_module.includesAllRequiredFieldsForLogin(req, res)) return;
    const response = {
        status: process.env.HTTP_OK,
        message: {}
    }
    User.findOne({username: req.body.username}).exec()
        .then((user)=>helper_module.onSuccessfullyDataReturned(user,response))
        .catch((err)=>helper_module.errorHandler(err,response))
        .finally(()=>_checkIfUserFound(req, res, response));
}

const _checkIfUserFound = function(req, res, response){
    console.log("_checkIfUserFound auth controller called")
    if(response.status!=process.env.HTTP_OK){
        response.status = process.env.HTTP_NOT_FOUND
        response.message = "User not found!"
        helper_module.sendResponse(res, response);
        return;
    }
    const user = response.message;
    bcrypt.compare(req.body.password, response.message.password)
        .then((result)=>helper_module.onSuccessfullyDataReturned(result, response))
        .catch((err)=>helper_module.errorHandler(err, response))
        .finally(()=>_ckeckIfPasswordMatchAndSendResponse(res, response,user));
}
const _ckeckIfPasswordMatchAndSendResponse = function(res, response,user){
    console.log("_ckeckIfPasswordMatchAndSendResponse auth controller called")
    if(response.status!=process.env.HTTP_OK){
        response.status = process.env.HTTP_BAD_REQUEST
        response.message = "Incorrect Password!"
        helper_module.sendResponse(res, response);
        return;
    }
    response.message =  "Successfuly loggedin!"
    const isAdmin = user.role==1? true : false;
    const token = jwt.sign({_id: user._id,name: user.name,isAdmin: isAdmin}, process.env.JWT_SECRET,{expiresIn : 3600});
    response.token = token,
    res.status(response.status).json(response);
    return;
}

exports.isAuth = (req, res, next)=>{
    let user = req.profile && req.auth && req.profile._id==req.auth._id;
    const response ={
        status: process.env.HTTP_OK,
        message: {}
    }
    if(!user){
        response.message = "Access denied!"
        response.status = process.env.HTTP_FORBIDDEN;
        helper_module.sendResponse(res, response)
        return;
    }
    next();
};

exports.isAdmin = (req, res, next)=>{
    const response ={
        status: process.env.HTTP_OK,
        message: {}
    }
    if(req.profile.role==0 || !req.auth.isAdmin){
        response.message = "Admin resourse! Access denied"
        response.status = process.env.HTTP_FORBIDDEN;
        helper_module.sendResponse(res, response)
        return;
    }
    next();
};

exports.requireSignin = function(req, res, next){
    console.log("requireSignin auth controller called")
    const headerExist = req.headers.authorization;
    const response = {
        status: process.env.HTTP_FORBIDDEN,
        message: {},
    }
    if(headerExist){
        const jwtVerifyPromise = util.promisify(jwt.verify, {context: jwt})
        const token = req.headers.authorization.split(" ")[1];
        jwtVerifyPromise(token, process.env.JWT_SECRET)
            .then((payload)=>_decodeTokenAndCallNextMiddleware(payload,req, res, next))
            .catch((err)=>_invalidAuthorizationToken(err, res, response))
    }
    else{
        response.message = {message: "No token provided"}
        helper_module.sendResponse(res, response)
    }
}
const _decodeTokenAndCallNextMiddleware = function(payload, req, res, next){
    console.log("_decodeTokenAndCallNextMiddleware auth controller called");
    const auth = {
        _id: payload._id,
        isAdmin: payload.isAdmin
    }
    req.auth = auth;
    next();
}
const _invalidAuthorizationToken =function (err, res, response){
    console.log("_invalidAuthorizationToken auth controller called")
    response.status = process.env.HTTP_UNAUTHORIZED,
    response.message = {message: "Unauthorized!"}
    helper_module.sendResponse(res, response);
}




