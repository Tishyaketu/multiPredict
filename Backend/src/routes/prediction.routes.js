import { Router } from "express";
import {
    predictHeart,
    predictDiabetes,
    predictBreast,
    predictLung,
    uploadHeartPrescription,
    uploadDiabetesPrescription
} from "../controllers/prediction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// All prediction routes should be protected
router.use(verifyJWT);

router.route("/heart").post(predictHeart);
router.route("/heart/upload-prescription").post(upload.single("prescription"), uploadHeartPrescription);
router.route("/diabetes").post(predictDiabetes);
router.route("/diabetes/upload-prescription").post(upload.single("prescription"), uploadDiabetesPrescription);

// Image uploads for cancer
router.route("/breast").post(upload.single("image"), predictBreast);
router.route("/lung").post(upload.single("image"), predictLung);

export default router;
