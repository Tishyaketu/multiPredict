import { Router } from "express";
import {
    predictHeart,
    predictDiabetes,
    predictBreast,
    predictLung
} from "../controllers/prediction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// All prediction routes should be protected
router.use(verifyJWT);

router.route("/heart").post(predictHeart);
router.route("/diabetes").post(predictDiabetes);

// Image uploads for cancer
router.route("/breast").post(upload.single("image"), predictBreast);
router.route("/lung").post(upload.single("image"), predictLung);

export default router;
