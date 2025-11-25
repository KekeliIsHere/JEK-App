import express from "express";
import usersRouter from "./routes/users-routes.js";
import lessonsRouter from "./routes/lessons-routes.js";
import quizzesRouter from "./routes/quizzes-routes.js";
import lessonSectionsRouter from "./routes/lessonSections-routes.js";
import quizSubmissionRouter from "./routes/quizSubmission-routes.js";
import lessonProgressRouter from "./routes/lesson_progress-routes.js";
import scoreCalcRouter from "./routes/scores-routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// swagger ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes/endpoints
app.use("/user", usersRouter);
app.use("/lessons", lessonsRouter);
app.use("/quizzes", quizzesRouter);
app.use("/sections", lessonSectionsRouter);
app.use("/quiz_submission", quizSubmissionRouter);
app.use("/scores", scoreCalcRouter);
app.use("/lesson_progress", lessonProgressRouter);

app.listen(PORT, () => {
  console.log(`The server is running🚀 on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
