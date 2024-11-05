const {check, param} = require("express-validator");
const mongoose = require("mongoose");

const addCategoryValidator = [
    check("title").notEmpty().withMessage("Title is Required")
]

//validate params id category not found
const validateParamsIdCategoryNotFound = [
    param("id").custom(async (id) => {
        if(id && !mongoose.Types.ObjectId.isValid(id)) {
            throw "Invalid Category Id"
        }
    })
]

module.exports = {addCategoryValidator, validateParamsIdCategoryNotFound}