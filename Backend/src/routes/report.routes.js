import { Router } from "express";
import { downloadReport, parsePrescription } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/download", downloadReport);
router.post("/parse-prescription", parsePrescription);

export default router;
