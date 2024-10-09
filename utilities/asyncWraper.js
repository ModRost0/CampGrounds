const CustomError = require("./CustomExpressError")
function asyncWraper(func){
    return function (req,res,next){
        func(req,res,next).catch(e => {next(e)
            console.log(e)
        })  
    }
}
module.exports = asyncWraper
