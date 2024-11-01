const mongoose = require("mongoose");
const {connectionUrl} = require("../config/kyes")

const connectMongodb = async () => {
    try {
        await mongoose.connect(connectionUrl);
        console.log("Connect to Db Success")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectMongodb