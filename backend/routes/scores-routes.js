import express from "express";
import { computeLessonScore } from "../controllers/scores-controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/compute_score", requireAuth, computeLessonScore);



export default router;
