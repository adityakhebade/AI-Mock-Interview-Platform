/**
 * Interview Evaluation Prompt
 * 
 * Evaluates interview submissions and generates scores with feedback.
 */

export const evaluationPrompt = {
  /**
   * Generate prompt for interview evaluation
   * 
   * @param {Object} params - Parameters for evaluation
   * @param {string} params.role - Job role
   * @param {string} params.difficulty - Interview difficulty
   * @param {Array} params.questionsAndAnswers - Array of {question, answer, code, language}
   * @returns {string} Formatted prompt
   */
  generate({ role, difficulty, questionsAndAnswers }) {
    const formattedQA = questionsAndAnswers.map((qa, index) => {
      let qaText = `Question ${index + 1}: ${qa.question}\n`;
      
      if (qa.answer) {
        qaText += `Answer: ${qa.answer}\n`;
      }
      
      if (qa.code) {
        qaText += `Code Solution (${qa.language || 'unknown'}):\n${qa.code}\n`;
      }
      
      return qaText;
    }).join('\n---\n\n');

    const prompt = `Evaluate this ${role} interview at ${difficulty} difficulty level.

INTERVIEW QUESTIONS AND CANDIDATE RESPONSES:
${formattedQA}

EVALUATION CRITERIA:
1. Technical Accuracy: Are the answers correct and demonstrate proper understanding?
2. Code Quality: If code is provided, is it clean, efficient, and follows best practices?
3. Problem-Solving: Does the candidate show good analytical and problem-solving skills?
4. Communication: Are the answers well-structured and clearly explained?
5. Depth of Knowledge: Does the candidate show deep understanding or surface-level knowledge?

SCORING:
- Overall Score: 0-100 (integer)
  - 90-100: Excellent - Outstanding performance, ready for senior roles
  - 75-89: Good - Strong performance, suitable for the role
  - 60-74: Average - Acceptable, needs some improvement
  - 40-59: Below Average - Significant gaps in knowledge
  - 0-39: Poor - Not ready for this role

RESPONSE FORMAT (return ONLY valid JSON, no markdown):
{
  "score": 85,
  "strengths": "Detailed string describing 3-5 key strengths demonstrated. Be specific with examples from their answers.",
  "weaknesses": "Detailed string describing 3-5 areas for improvement. Be constructive and specific.",
  "feedback": "Comprehensive feedback (300-500 words) including:
    - Overall performance assessment
    - Technical competency analysis
    - Specific examples of good/poor answers
    - Recommendations for improvement
    - Areas to focus on for growth"
}

Evaluate the interview now:`;

    return prompt;
  },
};
