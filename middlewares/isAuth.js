const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config/kyes");



const isAuth = async(req,res,next) => {
    try {
        // console.log(req.headers);
        const authorization = req.headers.authorization ? req.headers.authorization.split(" ") : [];
        const token = authorization.length > 1 ? authorization[1] : null;
        console.log(token)
        if (token) {
            const payload = jwt.verify(token, jwtSecret);
            console.log(payload);
            if(payload) {
                req.user = {
                    _id : payload._id,
                    name : payload.name,
                    email: payload.email,
                    role: payload.role,
                    
                };
                next();
            } else {
                res.code = 401;
                throw new Error("unauthorized")
            }
        } else {
            res.code = 400;
            throw new Error("token is required")
        }
        // console.log(authorization)
      
    } catch (error) {
        next(error)
    }
}

module.exports = isAuth