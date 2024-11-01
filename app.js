const express =require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan")

dotenv.config();
const connectMongodb = require("./init/mongodb")
const {authRoute, categoryRoute} = require("./routes");
const { errorHandler } = require("./middlewares");
const {notFound} = require("./controllers/notfound")


//init app
const app = express();

//connect database
connectMongodb()

//third party midleware
app.use(express.json({
    limit: "500mb"
}));
app.use(bodyParser.urlencoded({
    limit: "500mb",
    extended: true
}));
app.use(morgan("dev"))

// route section
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/auth", categoryRoute);

//not found route
app.use("*", notFound)

// error handle middleware
app.use(errorHandler);



module.exports = app;

