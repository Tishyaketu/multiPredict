import { Router } from "express";
import {
    loginAdmin,
    logoutAdmin,
    registerAdmin,
    refreshAdminAccessToken,
    getCurrentAdmin
} from "../controllers/adminAuth.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)

//secured routes
router.route("/logout").post(verifyAdminJWT, logoutAdmin)
router.route("/refresh-token").post(refreshAdminAccessToken)
router.route("/current-admin").get(verifyAdminJWT, getCurrentAdmin)

export default router;
