import AppError from './AppError.js';

/**
 * AI Parser Utility
 * 
 * Parses and validates AI responses.
 * Extracts JSON from AI text responses.
 */

export const aiParser = {
  /**
   * Extract JSON from AI response text
   * Handles markdown code blocks and plain JSON
   * 
   * @param {string} text - AI response text
   * @returns {string} Extracted JSON string
   */
  extractJSON(text) {
    if (!text || typeof text !== 'string') {
      throw new AppError('Invalid AI response: empty or non-string', 500);
    }

    // Remove leading/trailing whitespace
    text = text.trim();

    // Try to extract JSON from markdown code block
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // Try to find JSON object or array in the text
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return jsonMatch[1].trim();
    }

    // If no JSON found, return original text
    return text;
  },

  /**
   * Parse JSON string safely
   * 
   * @param {string} jsonString - JSON string to parse
   * @returns {Object|Array} Parsed JSON object or array
   */
  parseJSON(jsonString) {
    try {
      const json = JSON.parse(jsonString);
      return json;
    } catch (error) {
      console.error('JSON Parse Error:', error.message);
      console.error('Failed JSON:', jsonString.substring(0, 200) + '...');
      throw new AppError('AI returned invalid JSON format', 500);
    }
  },

  /**
   * Parse AI response and extract JSON
   * 
   * @param {string} text - AI response text
   * @returns {Object|Array} Parsed JSON object or array
   */
  parse(text) {
    const jsonString = this.extractJSON(text);
    return this.parseJSON(jsonString);
  },

  /**
   * Validate parsed data against a schema
   * 
   * @param {Object|Array} data - Parsed data
   * @param {Object} schema - Zod schema
   * @returns {Object|Array} Validated data
   */
  validate(data, schema) {
    try {
      return schema.parse(data);
    } catch (error) {
      console.error('Validation Error:', error.errors);
      throw new AppError('AI response validation failed: ' + error.errors[0]?.message, 500);
    }
  },

  /**
   * Parse and validate AI response in one step
   * 
   * @param {string} text - AI response text
   * @param {Object} schema - Zod schema
   * @returns {Object|Array} Parsed and validated data
   */
  parseAndValidate(text, schema) {
    const data = this.parse(text);
    return this.validate(data, schema);
  },
};
