const notFound = (req,res,next)=> {
    res.status(404).json({
        code:404,
        status: false,
        message: "Route Not Found"
    })
}

module.exports ={notFound}