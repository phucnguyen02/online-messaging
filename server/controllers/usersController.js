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

async function deleteUser(id){
  try{
    await Users.destroy(
      {where: {userID: id}}
    )
  }catch(err){
    console.error(err);
  }
}

async function findUsername(name){
    try{
        const user = await Users.find(
            {where: {username: name}}
        )
        return user;
    }
    catch(err){
        console.log(err);
    }
}

async function verifyUserPassword(name, password){
    try{
        const user = await Users.find(
            {where: {username: name}}
        )
        return user.dataValues.password === password;
    }
    catch(err){
        console.log(err);
    }
}

async function getAllUsers(){
    try{
        return await Users.findAll();
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    insertUser,
    deleteUser,
    findUsername,
    verifyUserPassword,
    getAllUsers
};