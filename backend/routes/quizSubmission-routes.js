import express from "express";
import {
  createQuizSubmission
} from "../controllers/quizSubmission-controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// router to submit quiz
router.post("/submit_quiz", requireAuth, createQuizSubmission);


export default router;