const express = require("express")
const router= express.Router();

const {authController} = require("../controllers")

const {
     signupValidator,
     signInValidator,
     emailValidator,
     verifyUserValidator,
     recoveryPasswordValidator,
     changePasswordValidator,
     updateProfileValidator
    }= require("../validator/auth");
    
const validate = require("../validator/validate")
const isAuth = require("../middlewares/isAuth")

router.post("/signup", signupValidator, validate, authController.signup);
router.post("/signin", signInValidator, validate, authController.signIn);

//send verification email
router.post("/send-verification-email", emailValidator, validate, authController.verifyCode);

//veryfy user
router.post("/verify-user", verifyUserValidator, validate, authController.verifyUser);

// forgot Password
router.post("/forgot-password", emailValidator, validate, authController.forgotPassword);

//revovery password
router.post("/recovery-password", recoveryPasswordValidator ,validate, authController.recoveryPassword);

// change password
router.put("/change-password", changePasswordValidator, validate, isAuth, authController.changePassword);


//update Profile
router.put("/update-profile", isAuth, updateProfileValidator, validate, authController.updateProfile);


module.exports = router
