import { Router } from "express";
import {
    getConfigs,
    getConfigBySlug,
    predictDynamic,
    parsePrescription,
    getPredictionLogs
} from "../controllers/dynamic.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Routes (or Protected? Dashboard usually protected)
router.use(verifyJWT);

router.route("/configs").get(getConfigs);
router.route("/configs/:slug").get(getConfigBySlug);
router.route("/logs").get(getPredictionLogs);

router.route("/upload-prescription").post(
    upload.single("prescription"),
    parsePrescription
);

router.route("/:slug").post(
    upload.single("file"), // "file" is the field name for image uploads
    predictDynamic
);

export default router;
