
//midleware for admin role and manager
const isAdmin = (req,res,next) => {
    try {
        if(req.user && (req.user.role === 1|| req.user.role === 2)) {
            next()
        } else {
            res.code = 401;
            throw new Error("You not Have Permission")
        }
    } catch (error) {
        next(error)
    }
}

module.exports = isAdmin