const {Users} = require('../models');
const e = require("express");

async function insertUser(username, password){
    try { 
        const user = {
            username: username,
            password: password
        };
        await Users.create(user);
        return user;
    } catch (err) {
        console.error(err);
    }
}

async function findUsername(name){
    try{
        const user = await Users.findOne(
            {where: {username: name}}
        )
        return user;
    }
    catch(err){
        console.log(err);
    }
}

async function getAllUsers(){
    try{
        const users = await Users.findAll();
        return users;
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    insertUser,
    findUsername,
    getAllUsers
};