import jwt from "jsonwebtoken"
import userModel from "../models/auth.model.js"
import transporter from "../config/greetMail.js"
import bcrypt from "bcrypt"

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body       

        if (!name || !email || !password) {
            return res.json({ success: false, msg: "All fields are required" })
        }

        const userExist = await userModel.findOne({ email })

        if (userExist) {
            return res.json({ msg: "User Already Exist" })
        }

        const user = new userModel({ name, email, password })

        await user.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Hello from Your Karvendhan",
            text: "Welcome 🎉  You have been successfully ✅ Registered in Karvendhan's Application 💻",
        };

        await transporter.sendMail(mailOptions)

        return res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, msg: error.message })
    }

}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, msg: "All fields are required" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, msg: "Invalid Email" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, msg: "Password Does not match" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, user })


    } catch (error) {
        return res.json({ success: false, msg: error.message })
    }
}

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
        path: "/" 
    })
    res.json({success:true, msg: "Logged out successfully" });
}

export const sendOtp = async (req, res) => {

    const { userId } = req.body;

    if (!userId) {
        return res.json({ success: false, msg: "User Authorized" })
    }

    try {

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, msg: "user not found" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Hello from Your Karvendhan",
            text: `Your Verifiction OTP:  🎉 ${otp}  From Karvendhan's Application 💻`,
        };

        await transporter.sendMail(mailOptions)

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save()

        res.json({ success: true, msg: "otp sent to email" })


    } catch (error) {
        res.json({ success: false, msg: error.message })
    }

}

export const verifyEmail = async (req, res) => {

    const { otp, userId } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, msg: "OTP Not Found" })
    }

    try {

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, msg: "user not found" })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, msg: "OTP Expired" })
        }

        if (otp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, msg: "Invalid OTP" })
        }


        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save()

        res.json({ success: true, msg: "Account Verified" })


    } catch (error) {
        res.json({ success: false, msg: error.message })
    }

}

export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, msg: "Please Provide email" })
    }

    try {

        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({ success: false, msg: "user not found" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Hello from Your Karvendhan",
            text: `Your Password Reset OTP:  🎉 ${otp}  From Karvendhan's Application 💻`,
        };

        await transporter.sendMail(mailOptions)

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 60 * 60 * 1000;
        await user.save()

        res.json({ success: true, msg: "Password reset otp sent to email" })

    } catch (error) {
        res.json({ success: false, msg: error.message })
    }

}

export const verifyResetOtp = async (req, res) => {

    const { email,newPassword,otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, msg: "Data Not Found" })
    }

    try {

        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({ success: false, msg: "user not found" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, msg: "OTP Expired" })
        }

        if (otp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, msg: "Invalid OTP" })
        }else{
            if (!newPassword || newPassword.trim() === "") {
                return res.json({ success: false, msg: "Password is required" });
              }
            user.password = newPassword
        }

        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save()

        res.json({ success: true, msg: "Password Changed" })


    } catch (error) {
        res.json({ success: false, msg: error.message })
    }

}

export const isAuthorized = (req, res)=>{
    try {
        return res.json({ success: true, msg: "User Authorized" })
    } catch (error) {
        return res.json({ success: false, msg: "User Not Authorized" })
    }
}