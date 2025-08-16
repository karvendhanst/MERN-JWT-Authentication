import express from "express"
import { login, logout, register, sendOtp, verifyEmail, sendResetOtp, verifyResetOtp, isAuthorized } from "../controller/auth.controller.js"
import userAuth from "../middleware/userAuth.js"

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/send-verify-otp", userAuth, sendOtp)
authRouter.post("/verify-account", userAuth, verifyEmail)
authRouter.post("/reset-otp", sendResetOtp)
authRouter.post("/verify-reset-otp", verifyResetOtp)
authRouter.get("/is-auth",userAuth, isAuthorized)

export default authRouter

