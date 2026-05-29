// backend/src/routes/cv.routes.ts (CORREGIDO)
import { Router } from "express";
import {
  handleGenerateCV,
  handleEditCV,
  handleSuggestField,
} from "../controllers/cv.controller";

const router = Router();

router.post("/generate", handleGenerateCV);
router.post("/edit", handleEditCV);
router.post("/suggest", handleSuggestField); // ✅ Solo una vez, delegado al controller

export default router;