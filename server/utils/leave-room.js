function leaveRoom(userID, users){
    return users.filter((user) => user.id != userID);
}

module.exports = leaveRoom;