import { Router } from "express";
import {  verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteUser, getUserDetail,  loginUser,  logoutUser,  registerUser,   updateUserDetails } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post( registerUser);

router.route( "/login" ).post( loginUser )

router.route( "/logout" ).get( verifyJWT, logoutUser )

router.route( "/getuser" ).get( verifyJWT, getUserDetail )

router.route( "/updateprofile" ).patch( verifyJWT, updateUserDetails )


router.route("/delete-user").delete(verifyJWT, deleteUser)



export default router