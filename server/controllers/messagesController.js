const {Messages} = require('../models');
const e = require("express");

async function insertMessage(user, content){
  try {
      const message = {
        sender: user,
        content: content
      };
      await Messages.create(message);
  } catch (err) {
    console.error(err);
  }
}

async function getLatest100Messages(){
  try {
      const messages = await Messages.findAll(
              {
                  limit: 100,
                  order: [
                      ['createdAt', 'ASC']
                  ]
              }
          );
      return messages;
    } catch (err) {
      console.error(err);
    }
}

async function editMessage(id, content){
  try {
    await Messages.update(
      {content: content},
      {where: {messageID: id}}
    )
  } catch (err) {
    console.error(err);
  }
}

async function deleteMessage(id){
  try{
    await Messages.destroy(
      {where: {messageID: id}}
    )
  }catch(err){
    console.error(err);
  }
}
module.exports = {
    insertMessage,
    getLatest100Messages,
    editMessage,
    deleteMessage
};