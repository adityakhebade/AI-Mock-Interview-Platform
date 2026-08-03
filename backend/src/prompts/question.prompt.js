/**
 * Interview Question Generation Prompt
 * 
 * Generates interview questions based on role, difficulty, and optionally resume.
 */

export const questionPrompt = {
  /**
   * Generate prompt for question generation
   * 
   * @param {Object} params - Parameters for question generation
   * @param {string} params.role - Job role (e.g., "Backend Developer")
   * @param {string} params.difficulty - Difficulty level (EASY, MEDIUM, HARD)
   * @param {number} params.count - Number of questions to generate (default: 10)
   * @param {string} [params.resumeText] - Optional resume text for personalization
   * @returns {string} Formatted prompt
   */
  generate({ role, difficulty, count = 10, resumeText }) {
    const basePrompt = `Generate ${count} interview questions for a ${role} position at ${difficulty} difficulty level.

REQUIREMENTS:
1. Generate exactly ${count} questions
2. Mix of question types: Technical (50%), Coding (30%), Behavioral (20%)
3. Questions should be relevant to ${role} role
4. Difficulty: ${difficulty}
   - EASY: Basic concepts, syntax, simple problems
   - MEDIUM: Practical scenarios, problem-solving, system design basics
   - HARD: Complex algorithms, architecture, performance optimization

${resumeText ? `CANDIDATE BACKGROUND (from resume):
${resumeText}

Personalize some questions based on the candidate's experience and skills mentioned in the resume.` : ''}

RESPONSE FORMAT (return ONLY valid JSON, no markdown):
{
  "questions": [
    {
      "question": "Question text here",
      "type": "TECHNICAL" | "CODING" | "BEHAVIORAL",
      "difficulty": "${difficulty}",
      "order": 1
    }
  ]
}

QUESTION TYPE DISTRIBUTION:
- TECHNICAL: Conceptual questions, best practices, theory
- CODING: Algorithm problems, code implementation challenges
- BEHAVIORAL: Situational questions, past experience, problem-solving approach

Generate questions now:`;

    return basePrompt;
  },
};
