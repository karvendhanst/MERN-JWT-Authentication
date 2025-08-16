import userModel from "../models/auth.model.js"

const getUserData = async(req, res)=>{
    const {userId} = req.body

    if(!userId){
        return res.json({success: false, msg: "Token Not Found"})
    }

    try {

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, msg: "User unAuthorized"})
        }else{
            return res.json({success: true, 
                user: {
                    name : user.name,
                    email: user.email,
                    isAccountVerified : user.isAccountVerified
                }
            })
        }
        
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }

}

export default getUserData