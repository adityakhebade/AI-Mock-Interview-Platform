/**
 * Resume Analysis Prompt
 * 
 * Analyzes resume and extracts structured information.
 */

export const resumePrompt = {
  /**
   * Generate prompt for resume analysis
   * 
   * @param {Object} params - Parameters for resume analysis
   * @param {string} params.resumeText - Resume text content
   * @param {string} [params.targetRole] - Optional target role for analysis
   * @returns {string} Formatted prompt
   */
  generate({ resumeText, targetRole }) {
    const prompt = `Analyze the following resume and extract structured information.

RESUME CONTENT:
${resumeText}

${targetRole ? `TARGET ROLE: ${targetRole}\n\nProvide analysis specific to this role.` : ''}

ANALYSIS REQUIREMENTS:
1. Extract key skills (technical and soft skills)
2. Identify years of experience
3. List relevant technologies/tools
4. Summarize work experience
5. Identify education background
6. Extract notable achievements
${targetRole ? '7. Assess fit for target role' : ''}

RESPONSE FORMAT (return ONLY valid JSON, no markdown):
{
  "skills": ["skill1", "skill2", "skill3"],
  "yearsOfExperience": 5,
  "technologies": ["tech1", "tech2", "tech3"],
  "workExperience": "Brief summary of work history and roles",
  "education": "Education background summary",
  "achievements": ["achievement1", "achievement2"],
  "summary": "2-3 sentence professional summary",
  ${targetRole ? '"roleFit": "Assessment of fit for ' + targetRole + ' role (1-2 sentences)",' : ''}
  "strengths": "Key strengths for interviews",
  "recommendations": "Recommended interview focus areas based on background"
}

Analyze the resume now:`;

    return prompt;
  },
};
