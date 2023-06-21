module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define("Messages", {
        messageID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        sender:{
            type: DataTypes.CHAR(255)
        },
        content:{
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    });

    return Messages;
}