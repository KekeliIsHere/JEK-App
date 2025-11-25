import db from "../config/database.js"
import { v4 as uuid } from "uuid"

export const computeLessonScore = async (req, res) => {
  const userId = req.user.id;
  const { sectionId } = req.body;

  try{
    const [sectionRows] = await db.query("SELECT lesson_id FROM lesson_sections WHERE id = ?", [sectionId]);
    if(sectionRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No section found!",
      })
    }

    const lessonId = sectionRows[0].lesson_id;

    // get all sections of this lesson
    const [allSections] = await db.query("SELECT id FROM lesson_sections WHERE lesson_id = ?", [lessonId])

    const sectionIds = allSections.map((s) => s.id)

    if (sectionIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No sections found for this lesson!",
      });
    }

    // get best score per section for this user
    const [bestScores] = await db.query(
      `SELECT section_id, MAX(score) AS bestScore
       FROM quiz_submissions
       WHERE user_id = ? AND section_id IN (?)
       GROUP BY section_id`,
      [userId, sectionIds]
    );

    if (bestScores.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No quiz submissions found for this lesson!",
      });
    }

    // calculate lesson score (average of best scores)
    const totalBestScore = bestScores.reduce((sum, s) => sum + s.bestScore, 0);
    const lessonScore = Math.round(totalBestScore / bestScores.length);

    const status = lessonScore >= 50 ? "passed" : "failed";

    // check if a score record already exists
    const [existingScore] = await db.query(
      "SELECT id FROM scores WHERE user_id = ? AND lesson_id = ?",
      [userId, lessonId]
    );

    if (existingScore.length > 0) {
      // update existing
      await db.query(
        "UPDATE scores SET score = ?, status = ?, updated_at = NOW() WHERE id = ?",
        [lessonScore, status, existingScore[0].id]
      );
    } else {
      // insert new
      await db.query(
        "INSERT INTO scores (id, user_id, lesson_id, score, status) VALUES (?, ?, ?, ?, ?)",
        [uuid(), userId, lessonId, lessonScore, status]
      );
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Lesson score computed successfully!✅",
      lessonId,
      score: lessonScore,
      status,
    });
  } catch (err) {
    console.error("Failed to compute lesson score:", err);
    return res.status(500).json({
      success: false,
      error: "Database error",
    });
  }
  
};
