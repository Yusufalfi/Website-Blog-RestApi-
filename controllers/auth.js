const {User} = require("../models")
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword")
const generateToken = require("../utils/generateToken")
const generateCode = require("../utils/generateCode")
const sendEmail = require("../utils/sendEmail");
// const hashPassword = require("../utils/hashPassword");



const signup = async (req, res, next) => {
    try {
       
        const {name, email, password,role} = req.body;

        //validate input signup for email existing
        const isEmailExist = await User.findOne({email});
        if(isEmailExist){
            res.code = 400;
            throw new Error("Email Already Exist")
        }

        // hast password
        const hashedPassword = await hashPassword(password);
      
        //create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        })

        await newUser.save();

        res.status(201).json({
            code:201,
            status: true,
            message: "User Register success"
        });

    } catch (error) {
       next(error)
    }
}

const signIn = async (req, res, next) => {
    try {
      const {email, password} = req.body;
    //   get email From db
      const user = await User.findOne({email});
      if(!user){
        res.code = 401;
        throw new Error("Email Not Found")
      }
    //   compare passsword 
      const match = await comparePassword(password, user.password);
      if(!match) {
        res.code = 401;
        throw new Error("Password Wrong")
      }
      //token
      const token = generateToken(user);

    //   if there is email in db
      res.status(200).json({
        code: 200,
        status: true,
        message: "User Login Success",
        data: {token},
      });
             
    } catch (error) {
        next(error)
    }
}

const verifyCode = async (req, res, next) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
      res.code = 404;
      throw new Error("User Not Found")
    }
    if(user.isVerified) {
      res.code = 400;
      throw new Error("User already verified")
    }

    //generate code
    const code = generateCode(6);
    user.verificationCode = code;
    await user.save()

    //send email to user
    await sendEmail({
      emailTo: user.email,
      subject: " Email Verify code",
      code,
      content: "kirim kode verifikasi"
    })


    res.status(200).json({
      code:200,
      status: true,
      message: "User verification code success"
    })



  } catch (error) {
    next(error)
  }
}


const verifyUser = async(req, res, next) => {
  try {
    const {email, code} = req.body;

    const user = await User.findOne({email});
    if(!user) {
      res.code = 404;
      throw new Error("User Not Found")
    }

    if(user.verificationCode !== code) {
      res.code = 400;
      throw new Error("Invalid code")
    }

    //update column is verified on table and verificationCode if sucess
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "User verification Succesfully"
    })



  } catch (error) {
    next(error)
  }
}

const forgotPassword = async(req, res, next) => {
   try {
    const {email} = req.body;

    const user = await User.findOne({email});
    // console.log(user);
    // console.log(user.email);
    if(!user) {
      res.code = 404;
      throw new Error("User Not Found")
    }

    //generate number for forgot password
    const code = generateCode(6);
    // insert field on db forgot password
    user.forgotPasswordCode = code;
    await user.save();

    //send email code to user
    await sendEmail({
      emailTo: user.email,
      subject: "Forgot Password Code",
      code,
      content: "Change Your Password"
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Send code forgot password sucessfully"
    });

  } catch (error) {
    next(error)
  }
}


const recoveryPassword = async(req,res,next) => {
  try {
    const {email,code,password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
      res.code = 400;
      throw new Error("user not found")
    }

    if(user.forgotPasswordCode !== code) {
       res.code = 400;
      throw new Error("Invalid Code")
    }

    const hashedPass = await hashPassword(password);
    user.password = hashedPass;
    user.forgotPasswordCode = null;
    user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Recovery password sucessfully"
    });


  } catch (error) {
    next(error)
  }
}

const changePassword = async(req,res,next) => {
  try {
    const {oldPassword, newPassword}= req.body;
    // const {_id} = req.user;
    const ids = req.user._id;
    console.log("ids" + " " + ids);
     const user = await User.findById(ids); 
    // const user = await User.findById(_id); 
    if(!user) {
      res.code = 400;
      throw new Error("user Not Found");
    }
    // compare old password on input with pass on db
    const match  = await comparePassword(oldPassword, user.password)
    if(!match) {
       res.code = 400;
      throw new Error("old password not match");
    }

    // cek password old on db with new password in input
    if(oldPassword === newPassword) {
      throw new Error("you are providing old password")
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Success Change Password"
    })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async(req,res,next) => {
  try {
    const {_id}= req.user;
    const {name,email} = req.body;
    
    //data berikut jangan di tampilkan (-password -verificationCode -forgotPasswordCode)
    const user = await User.findById(_id).select("-password -verificationCode -forgotPasswordCode");
    if(!user) {
      res.code = 404;
      throw new Error("User Not Found")
    }
      // cek is there email on db
    if(email) {
      const isUserExist = await User.findOne({email});
      if(isUserExist && isUserExist.email === email && String(user._id) !== String(isUserExist._id)) {
        res.code = 400;
        throw new Error("Email already Exist")
      }
    }

    // change current Name
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;

    //update column isVerified on db
    if(email) {
      user.isVerified = false;
    }
    //save
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Success Update Profile",
      data: {
        user
      }
    })


  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  signIn,
  verifyCode,
  verifyUser,
  forgotPassword,
  recoveryPassword,
  changePassword,
  updateProfile
};