const {check} = require("express-validator");
const validateEmail = require("./validateEmail")

const signupValidator =[
    check("name").notEmpty().withMessage("name is Required"), 
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is Required"), 
    check("password").isLength({
        min: 6,
    }).withMessage("Password should be 6 length").notEmpty().withMessage("password is Required")
];


const signInValidator = [
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email Is Required"),
    check("password").notEmpty().withMessage("Password is required")

]

const emailValidator = [
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is Required")
]


const verifyUserValidator = [
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is Required"),
    check("code").notEmpty().withMessage("Code is Required")
]

const recoveryPasswordValidator = [
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is Required"),
    check("code").notEmpty().withMessage("Code is Required"),
    check("password").isLength({
        min: 6,
    }).withMessage("Password should be 6 length").notEmpty().withMessage("password is Required")
]

const changePasswordValidator = [
    check("oldPassword").notEmpty().withMessage("Old Password is Required"),

    check("newPassword").notEmpty().withMessage("New Password is Required")
]

const updateProfileValidator = [
    check("email").custom(async (email) => {
       if(email) {
        const isValidEmail = validateEmail(email);
        if(!isValidEmail) {
            throw "invalid Email"
        }
       } 
    })
]




module.exports = {
    signupValidator,
    signInValidator,
    emailValidator,
    verifyUserValidator,
    recoveryPasswordValidator,
    changePasswordValidator,
    updateProfileValidator
}