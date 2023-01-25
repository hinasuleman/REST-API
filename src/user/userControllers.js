//const { request, response } = require("express");
const User = require("./userModels");
const jwt = require("jsonwebtoken");
const { request } = require("express");

exports.createUser = async (request, response) => {
    // console.log(request);
    try {
        const newUser = await User.create(request.body);
        const token = jwt.sign({_id: newUser._id}, process.env.SECRET_KEY);
        response.status(201).send({msg: "createUser has created the following token", token});
    } catch (error) {
        console.log(error);
        response.status(500).send({error: error.message})
    };
};

exports.listUsers = async (request,response) => {
    try {
        const users = await User.find({});
        response.status(218).send({user: users});
    } catch (error) {
        console.log(error);
        response.status(500).send({error: error.message});
    };
};

exports.login = async (request,response) => {
    try {
        const token = jwt.sign({_id: request.user._id},process.env.SECRET_KEY);
        response.send({user: request.user.username, token});
    } catch (error) {
        console.log(error);
        response.status(401).send({error: error.message})
    };
};

exports.updateEmail = async (request, response) => {

    try {
        console.log(request.body.username)
        const updateEmail = await User.updateOne(
            {username: request.body.username},
            {email: request.body.newemail},
            {new:true}
        )
        console.log(updateEmail)
        if (updateEmail.modifiedCount !=1) {
            response.status(400).send({message:"Email not found", updateEmail})
        } else {
           response.status(200).send({ successfully: true, updateEmail})
        }
    } catch (error) {
        console.log(error);
        response.status(500).send ({message:error.message})
        
    }
}

exports.deleteUser = async (request, response) => {
    try {
        await User.deleteOne({username: request.body.username})
        response.send({'deleteSuccess': true})
    } catch (error) {
        console.log(error)
        response.send({'deleteSuccess': false})
    }
}
