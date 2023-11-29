const DataTypes = require('sequelize');
const sequelize = require('../../config/database');
const CarInfo = require('./CarInfo')
const Wallet = require('./Wallet')
module.exports = ((sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
        userID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        isDriver: DataTypes.ENUM('YES', 'NO'),
        gender: DataTypes.ENUM('M', 'F'),
        phone: DataTypes.STRING,
        addressHome: DataTypes.STRING,
        addressCompany: DataTypes.STRING,
        nCancel: DataTypes.INTEGER,
        ratingTotalScore: DataTypes.INTEGER,
        nRating: DataTypes.INTEGER,
        carPlate: DataTypes.STRING
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    });
    User.belongsTo(CarInfo, { foreignKey: 'carPlate' });
    User.hasOne(Wallet, { foreignKey: 'userID' });
    return User;
})(sequelize, DataTypes);
