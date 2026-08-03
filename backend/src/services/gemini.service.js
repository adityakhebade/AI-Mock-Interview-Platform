import { GoogleGenerativeAI } from '@google/generative-ai';
import AppError from '../utils/AppError.js';

/**
 * Gemini Service
 * 
 * Handles communication with Google Gemini AI API.
 * Low-level service for making AI requests.
 */

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  GEMINI_API_KEY not found in environment variables. AI features will not work.');
    }
    
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.model = null;
    
    // Initialize model if API key exists
    if (this.genAI) {
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });
    }
  }

  /**
   * Check if Gemini is configured
   * 
   * @returns {boolean} True if API key is set
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Generate content using Gemini AI
   * 
   * @param {string} prompt - The prompt to send to AI
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} AI response text
   */
  async generateContent(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new AppError('Gemini AI is not configured. Please set GEMINI_API_KEY in environment variables.', 503);
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new AppError('AI returned empty response', 500);
      }

      return text;
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      
      // Handle specific error cases
      if (error.message?.includes('API key')) {
        throw new AppError('Invalid Gemini API key', 401);
      }
      
      if (error.message?.includes('quota')) {
        throw new AppError('AI service quota exceeded. Please try again later.', 429);
      }
      
      if (error.message?.includes('timeout')) {
        throw new AppError('AI service timeout. Please try again.', 504);
      }

      // Re-throw AppError instances
      if (error instanceof AppError) {
        throw error;
      }

      // Generic error
      throw new AppError('AI service error: ' + error.message, 500);
    }
  }

  /**
   * Generate content with retry logic
   * 
   * @param {string} prompt - The prompt to send to AI
   * @param {number} maxRetries - Maximum number of retries (default: 3)
   * @returns {Promise<string>} AI response text
   */
  async generateWithRetry(prompt, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generateContent(prompt);
      } catch (error) {
        lastError = error;
        
        // Don't retry on authentication or configuration errors
        if (error.statusCode === 401 || error.statusCode === 503) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Retrying AI request (attempt ${attempt + 1}/${maxRetries}) after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw lastError;
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
