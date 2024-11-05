const express = require("express");
const router = express.Router();
const {categoryController} =require("../controllers");
const {addCategoryValidator, validateParamsIdCategoryNotFound} = require("../validator/category")
const validate = require("../validator/validate")
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");


router.post(
    "/",
    isAuth,
    isAdmin,
    addCategoryValidator,
    validate,
    categoryController.addCategory
)


router.put(
    "/:id",
    isAuth,
    isAdmin,
    validateParamsIdCategoryNotFound,
    validate,
    categoryController.updateCategory
)


router.delete(
    "/:id",
     isAuth,
    isAdmin,
    validateParamsIdCategoryNotFound,
    validate,
    categoryController.deleteCategory
)

router.get(
    "/",
    isAuth,
    categoryController.getCategory

)

router.get("/:id", isAuth, validateParamsIdCategoryNotFound, validate, categoryController.getSingleCategory)

module.exports = router;