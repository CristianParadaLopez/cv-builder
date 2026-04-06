import { Router } from "express";
import { handleGenerateCV, handleEditCV } from "../controllers/cv.controller";

const router = Router();

router.post("/generate", handleGenerateCV);
router.post("/edit", handleEditCV);

export default router;