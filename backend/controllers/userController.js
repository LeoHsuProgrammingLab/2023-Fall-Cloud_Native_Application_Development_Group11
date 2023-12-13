const userService = require('../services/userService');
const carInfoService = require('../services/carInfoService');
const favorService = require('../services/favorService');
const { TIME } = require('sequelize');

async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


async function getMyInfo(req, res) {
    const userId = req.session.userId;
    if(!userId){
        res.status(401).json({ error: "Please sign in before querying user data"})
        return;
    }

    try {
        userService.getUserById(userId).then((user)=>{
            const returnUser = user.toJSON();
            if(user.nRating == 0) returnUser.rating = "0.0";
            else returnUser.rating = (user.ratingTotalScore/user.nRating).toFixed(1);
            delete returnUser.ratingTotalScore;
            delete returnUser.nRating;
            returnUser.isDriver = returnUser.isDriver == 1;
            if(returnUser.carPlate) returnUser.CarInfo.electric = returnUser.CarInfo.electric == 1;
            delete returnUser.userID;
            delete returnUser.carPlate;
            delete returnUser.Wallet.userID;
            res.status(200).json(returnUser);
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


async function createUser(req, res) {
    const userData = req.body;

    try {
        const user = await userService.createUser(userData);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


async function updateDriver(req, res) {
    try {
        const userID = req.session.userId;
        if(!userID){
            throw new Error("Please sign in before querying user data");
        }
        if(!req.body.carPlate){
            throw new Error("Please specify carPlate");
        }
        const oldDriver = await userService.getUserById(userID);
        if(oldDriver.isDriver != true || oldDriver.carPlate != req.body.carPlate){
            if(oldDriver.isDriver){
                await carInfoService.deleteCarInfo(oldDriver.carPlate);
            }
            const carInfoData = {
                "carPlate": req.body.carPlate,
                "color": req.body.color,
                "brand": req.body.brand,
                "type": req.body.type,
                "electric": req.body.electric,
                "seat": req.body.seat
            }
            await carInfoService.createCarInfo(carInfoData);
        }
        else{
            const carInfoUpdateData = {
                "color": req.body.color,
                "brand": req.body.brand,
                "type": req.body.type,
                "electric": req.body.electric,
                "seat": req.body.seat
            }
            await carInfoService.updateCarInfo(req.body.carPlate, carInfoUpdateData);
        }
        const userUpdateData = {
            "email": req.body.email,
            "gender": req.body.gender,
            "phone": req.body.phone,
            "addressHome": req.body.addressHome,
            "addressCompany": req.body.addressCompany,
            "isDriver": true,
            "carPlate": req.body.carPlate
        }
        await userService.updateUser(userID, userUpdateData);
        res.status(200).json({ message: "Update driver successfully" });
    } catch (error) {
        if(error.message == 'User not found'){
            res.status(401).json({ error: 'Driver not found'});
        }
        else if(error.message == "Please sign in before querying user data"){
            res.status(401).json({ error: error.message});
        }
        else if(error.message == "Please specify carPlate"){
            res.status(401).json({ error: error.message});
        }
        else{
            res.status(500).json({ error: "An error occurred while updating the driver" });
        }
    }
}

async function updatePassenger(req, res) {
    const userID = req.session.userId;
    if(!userID){
        res.status(401).json({ error: "Please sign in before updating passenger data"})
        return;
    }
    const updateData = {
        "email": req.body.email,
        "gender": req.body.gender,
        "phone": req.body.phone,
        "addressHome": req.body.addressHome,
        "addressCompany": req.body.addressCompany
    }

    try {
        await userService.updateUser(userID, updateData);
        res.status(200).json({ message: 'Update passenger successfully'});
    } catch (error) {
        if(error.message == 'User not found'){
            res.status(401).json({ error: 'Passenger not found'});
        }
        else{
            res.status(500).json({ error: 'An error occurred while updating the passenger' });
        }
        
    }
}


async function deleteUser(req, res) {
    const userId = req.params.id;

    try {
        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function updateRating(req, res) {
    const driverID = req.body.driverID;
    try {
        const driver = await userService.getUserByIdWithAttributes(driverID, ['ratingTotalScore', 'nRating']);
        const updateData = {
            'ratingTotalScore': driver.ratingTotalScore+req.body.rating, 
            'nRating': driver.nRating+1
        }
        await userService.updateUser(driverID, updateData);
        res.status(200).json({ "message": "Rating successfully"});
    } catch (error) {
        if(error.message == 'User not found'){
            res.status(401).json({ error: "Driver not found" });
        }
        else{
            res.status(500).json({ error: 'An error occurred while rating' });
        }
    }
}

async function updateCarInfo(req, res) {
    try {
        const userID = req.session.userId;
        if(!userID){
            throw new Error("Please sign in before querying user data");
        }
        if(!req.body.carPlate){
            throw new Error("Please specify carPlate");
        }
        const oldDriver = await userService.getUserById(userID);
        if(oldDriver.isDriver != true || oldDriver.carPlate != req.body.carPlate){
            if(oldDriver.isDriver){
                await carInfoService.deleteCarInfo(oldDriver.carPlate);
            }
            const carInfoData = {
                "carPlate": req.body.carPlate,
                "color": req.body.color,
                "brand": req.body.brand,
                "type": req.body.type,
                "electric": req.body.electric,
                "seat": req.body.seat
            }
            await carInfoService.createCarInfo(carInfoData);
        }
        else{
            const carInfoUpdateData = {
                "color": req.body.color,
                "brand": req.body.brand,
                "type": req.body.type,
                "electric": req.body.electric,
                "seat": req.body.seat
            }
            await carInfoService.updateCarInfo(req.body.carPlate, carInfoUpdateData);
        }
        const userUpdateData = {
            "isDriver": true,
            "carPlate": req.body.carPlate
        }
        await userService.updateUser(userID, userUpdateData);
        res.status(200).json({ message: "Update driver successfully" });
    } catch (error) {
        if(error.message == 'User not found'){
            res.status(401).json({ error: 'Driver not found'});
        }
        else if(error.message == "Please sign in before querying user data"){
            res.status(401).json({ error: error.message});
        }
        else if(error.message == "Please specify carPlate"){
            res.status(401).json({ error: error.message});
        }
        else{
            res.status(500).json({ error: "An error occurred while updating the driver" });
        }
    }
}

async function updateDriverFavor(req, res) {
    try {
        const userID = req.session.userId;
        if(!userID){
            throw new Error("Please sign in before querying user data");
        }
        const newData = req.body;
        console.log(newData)
        // const OldFavor = await favorService.getDriverFavorByUserId(userID);
        // let NewFavor = OldFavor;
        let NewFavor = {};
        if(newData.GO.address != null){
            NewFavor.GO_start = newData.GO.address;
            let [hours, minutes, seconds] = newData.GO.time.split(':');
            NewFavor.GO_TIME = new Date(1970, 0, 1, (hours+8), minutes, seconds);
            NewFavor.GO_stops = newData.GO.stopIDs.toString();
        }
        
        if(newData.BACK.address != null){
            NewFavor.BACK_dest = newData.BACK.address;
            console.log(newData.BACK.time)
            let [hours2, minutes2, seconds2] = newData.BACK.time.split(':');
            NewFavor.BACK_TIME = new Date(1970, 0, 1, hours2, minutes2, seconds2);
            NewFavor.BACK_stops = newData.BACK.stopIDs.toString();
        }
        // console.log(userID, NewFavor)
        
        await favorService.updateDriverFavor(userID, NewFavor);
        res.status(200).json({ message: "Update driver favorite route successfully" });
    } catch (error) {
        if(error.message == 'User not found'){
            res.status(401).json({ error: 'Driver not found'});
        }
        else if(error.message == "Please sign in before querying user data"){
            res.status(401).json({ error: error.message});
        }
        else{
            res.status(500).json({ error: "An error occurred while updating the driver's favor" });
        }
    }
}

async function updatePassengerFavor(req, res) {
    try {
        const userID = req.session.userId;
        if(!userID){
            throw new Error("Please sign in before querying user data");
        }
        const newData = req.body;
        console.log(typeof newData.BACK.address)
        let NewFavor = {};
        if(newData.GO.address != null){
            NewFavor.GO_start = newData.GO.address;
            let [hours, minutes, seconds] = newData.GO.boardTime.split(':');
            NewFavor.GO_TIME = new Date(1970, 0, 1, hours, minutes, seconds);
            NewFavor.GO_cnt = newData.GO.passengerCnt;
        }
        if(newData.BACK.address != null){
            NewFavor.BACK_dest = newData.BACK.address;
            let [hours2, minutes2, seconds2] = newData.BACK.boardTime.split(':');
            NewFavor.BACK_TIME = new Date(1970, 0, 1, hours2, minutes2, seconds2);
            NewFavor.BACK_cnt = newData.BACK.passengerCnt;
        }
        // console.log(userID, NewFavor)
        // console.log(NewFavor.BACK_TIME.toLocaleTimeString());

        await favorService.updatePassengerFavor(userID, NewFavor);
        res.status(200).json({ message: "Update passenger favorite route successfully" });
    } catch (error) {
        if(error.message == 'User not found'){
            res.status(401).json({ error: 'Driver not found'});
        }
        else if(error.message == "Please sign in before querying user data"){
            res.status(401).json({ error: error.message});
        }
        else{
            res.status(500).json({ error: "An error occurred while updating the driver's favor" });
        }
    }
}

module.exports = {
    getAllUsers,
    getMyInfo,
    createUser,
    deleteUser,
    updateDriver,
    updatePassenger,
    updateRating,
    updateCarInfo,
    updateDriverFavor,
    updatePassengerFavor
};
