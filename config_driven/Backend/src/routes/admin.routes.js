import { Router } from "express";
import {
    createConfig,
    updateConfig,
    deleteConfig,
    getAdminConfigs,
    getAdminConfigBySlug
} from "../controllers/admin.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all admin routes
router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/configs")
    .get(getAdminConfigs)
    .post(createConfig);

router.route("/configs/:slug")
    .get(getAdminConfigBySlug)
    .put(updateConfig)
    .delete(deleteConfig);

export default router;
