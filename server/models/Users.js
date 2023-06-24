module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        username:{
            type: DataTypes.CHAR(255)
        },
        password:{
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    });

    return Users;
}