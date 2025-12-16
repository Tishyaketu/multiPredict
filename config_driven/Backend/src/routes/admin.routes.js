
import { Router } from "express";
import {
    createConfig,
    updateConfig,
    deleteConfig
} from "../controllers/admin.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all admin routes
router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/configs").post(createConfig);
router.route("/configs/:slug")
    .put(updateConfig)
    .delete(deleteConfig);

export default router;
