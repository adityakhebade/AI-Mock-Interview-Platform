# AI Module Documentation

## Overview

The AI Module provides centralized AI capabilities for IntervueX using Google's Gemini AI. It handles question generation, interview evaluation, and resume analysis with structured JSON responses, validation, and retry logic.

---

## Architecture

Follows the layered architecture pattern:

```
Route → Controller → Service → AI Service → Gemini API
                              ↓
                         Prompt Templates
                              ↓
                          AI Parser
```

### Layers

1. **Routes** (`ai.routes.js`): Define API endpoints
2. **Controller** (`ai.controller.js`): Handle HTTP requests/responses
3. **AI Service** (`ai.service.js`): High-level AI operations
4. **Gemini Service** (`gemini.service.js`): Low-level Gemini API integration
5. **Prompt Templates** (`prompts/*.js`): Structured prompts for different tasks
6. **AI Parser** (`aiParser.js`): Parse and validate AI responses

---

## Features

### 1. Interview Question Generation
- Generate 1-50 questions based on role and difficulty
- Mix of question types: Technical (50%), Coding (30%), Behavioral (20%)
- Optional resume-based personalization
- Structured JSON output with validation

### 2. Interview Evaluation
- Evaluate candidate submissions with AI
- Score: 0-100 with detailed feedback
- Identify strengths and weaknesses
- Provide constructive recommendations

### 3. Resume Analysis
- Extract skills, technologies, and experience
- Summarize work history and education
- Identify key achievements
- Optional role-fit assessment

### 4. Health Check
- Verify AI service configuration
- Test API connectivity
- Return service status

---

## Configuration

### Environment Variables

Add to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### Model Configuration

Default model: `gemini-1.5-flash`

Settings:
- Temperature: 0.7 (balanced creativity/consistency)
- Top P: 0.95
- Top K: 40
- Max Output Tokens: 8192

---

## API Endpoints

Base path: `/api/v1/ai`

All endpoints require authentication via `requireAuthentication` middleware.

### 1. Generate Questions

**POST** `/api/v1/ai/questions`

Generate interview questions using AI.

#### Request

**Body:**
```json
{
  "role": "Backend Developer",
  "difficulty": "MEDIUM",
  "count": 10,
  "resumeText": "Optional resume text for personalization"
}
```

**Validation:**
- `role`: String, 2-100 characters (required)
- `difficulty`: Enum: EASY, MEDIUM, HARD (required)
- `count`: Integer, 1-50 (optional, default: 10)
- `resumeText`: String (optional)

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Questions generated successfully",
  "data": {
    "questions": [
      {
        "question": "Explain the difference between REST and GraphQL APIs.",
        "type": "TECHNICAL",
        "difficulty": "MEDIUM",
        "order": 1
      },
      {
        "question": "Write a function to reverse a linked list.",
        "type": "CODING",
        "difficulty": "MEDIUM",
        "order": 2
      }
    ],
    "metadata": {
      "role": "Backend Developer",
      "difficulty": "MEDIUM",
      "requestedCount": 10,
      "generatedCount": 10,
      "usedResume": false
    }
  }
}
```

**Errors:**
- `400`: Invalid input data
- `503`: AI service not configured
- `500`: AI generation failed

---

### 2. Evaluate Interview

**POST** `/api/v1/ai/evaluate`

Evaluate interview submissions using AI.

#### Request

**Body:**
```json
{
  "role": "Backend Developer",
  "difficulty": "MEDIUM",
  "questionsAndAnswers": [
    {
      "question": "Explain REST API principles",
      "answer": "REST is an architectural style...",
      "code": null,
      "language": null
    },
    {
      "question": "Implement binary search",
      "answer": "Binary search is...",
      "code": "function binarySearch(arr, target) { ... }",
      "language": "JavaScript"
    }
  ]
}
```

**Validation:**
- `role`: String, 2-100 characters (required)
- `difficulty`: Enum: EASY, MEDIUM, HARD (required)
- `questionsAndAnswers`: Array, 1-50 items (required)
  - `question`: String, min 10 characters
  - `answer`: String (optional)
  - `code`: String (optional)
  - `language`: String (optional)

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Interview evaluated successfully",
  "data": {
    "score": 78,
    "strengths": "Strong understanding of REST principles. Clean code implementation with good variable naming. Demonstrated problem-solving approach.",
    "weaknesses": "Could improve error handling in binary search. Need more depth in explaining edge cases. Time complexity analysis was incomplete.",
    "feedback": "Overall good performance with solid technical knowledge. The candidate showed understanding of core concepts but needs to work on edge case handling and optimization. Recommendations: Practice more algorithm problems, focus on error handling patterns, and improve communication of technical decisions.",
    "metadata": {
      "role": "Backend Developer",
      "difficulty": "MEDIUM",
      "questionCount": 2
    }
  }
}
```

**Errors:**
- `400`: Invalid input data
- `503`: AI service not configured
- `500`: Evaluation failed

---

### 3. Analyze Resume

**POST** `/api/v1/ai/resume-analysis`

Analyze resume using AI.

#### Request

**Body:**
```json
{
  "resumeText": "Full resume text content here...",
  "targetRole": "Backend Developer"
}
```

**Validation:**
- `resumeText`: String, min 100 characters (required)
- `targetRole`: String, 2-100 characters (optional)

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "analysis": {
      "skills": ["JavaScript", "Node.js", "PostgreSQL", "REST APIs", "Docker"],
      "yearsOfExperience": 5,
      "technologies": ["Express.js", "React", "MongoDB", "AWS", "Git"],
      "workExperience": "5 years in backend development with focus on Node.js and microservices architecture.",
      "education": "Bachelor's in Computer Science from XYZ University",
      "achievements": [
        "Led team of 3 developers on e-commerce platform",
        "Reduced API response time by 40%",
        "Implemented CI/CD pipeline"
      ],
      "summary": "Experienced backend developer with strong Node.js expertise and proven track record in building scalable systems.",
      "roleFit": "Strong fit for Backend Developer role with relevant experience in Node.js, databases, and API development.",
      "strengths": "Strong technical foundation, leadership experience, performance optimization skills",
      "recommendations": "Focus interview on system design, microservices architecture, and database optimization"
    },
    "metadata": {
      "targetRole": "Backend Developer",
      "resumeLength": 2500
    }
  }
}
```

**Errors:**
- `400`: Invalid input data (resume too short)
- `503`: AI service not configured
- `500`: Analysis failed

---

### 4. Health Check

**GET** `/api/v1/ai/health`

Check AI service health and configuration.

#### Response

**Configured and Healthy:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "configured": true,
    "message": "AI service is operational"
  }
}
```

**Not Configured:**
```json
{
  "success": true,
  "data": {
    "status": "unavailable",
    "configured": false,
    "message": "AI service is not configured. Set GEMINI_API_KEY environment variable."
  }
}
```

**Error:**
```json
{
  "success": true,
  "data": {
    "status": "error",
    "configured": true,
    "message": "AI service error: Invalid API key"
  }
}
```

---

## Services

### Gemini Service (`gemini.service.js`)

Low-level service for Gemini API communication.

**Methods:**
- `isConfigured()`: Check if API key is set
- `generateContent(prompt)`: Generate content from prompt
- `generateWithRetry(prompt, maxRetries)`: Generate with retry logic

**Features:**
- Singleton instance
- Automatic retry with exponential backoff (2s, 4s, 8s)
- Error handling for quota, timeout, and auth errors
- Configurable model and generation settings

---

### AI Service (`ai.service.js`)

High-level service for AI operations.

**Methods:**
- `generateQuestions({ role, difficulty, count, resumeText })`: Generate questions
- `evaluateInterview({ role, difficulty, questionsAndAnswers })`: Evaluate interview
- `analyzeResume({ resumeText, targetRole })`: Analyze resume
- `checkHealth()`: Check service health

**Features:**
- Input validation with Zod schemas
- Response parsing and validation
- Structured error handling
- Metadata tracking

---

## Prompt Templates

### Question Generation (`question.prompt.js`)

Generates structured prompts for question generation.

**Parameters:**
- Role (e.g., "Backend Developer")
- Difficulty (EASY, MEDIUM, HARD)
- Count (1-50)
- Optional resume text

**Output Format:**
```javascript
{
  questions: [
    { question, type, difficulty, order }
  ]
}
```

---

### Evaluation (`evaluation.prompt.js`)

Generates prompts for interview evaluation.

**Parameters:**
- Role
- Difficulty
- Questions and answers array

**Output Format:**
```javascript
{
  score: 0-100,
  strengths: string,
  weaknesses: string,
  feedback: string
}
```

**Scoring Criteria:**
- Technical Accuracy
- Code Quality
- Problem-Solving
- Communication
- Depth of Knowledge

---

### Resume Analysis (`resume.prompt.js`)

Generates prompts for resume analysis.

**Parameters:**
- Resume text
- Optional target role

**Output Format:**
```javascript
{
  skills: string[],
  yearsOfExperience: number,
  technologies: string[],
  workExperience: string,
  education: string,
  achievements: string[],
  summary: string,
  roleFit: string (optional),
  strengths: string,
  recommendations: string
}
```

---

## AI Parser (`aiParser.js`)

Utility for parsing and validating AI responses.

**Methods:**
- `extractJSON(text)`: Extract JSON from markdown code blocks or plain text
- `parseJSON(jsonString)`: Parse JSON safely with error handling
- `parse(text)`: Extract and parse in one step
- `validate(data, schema)`: Validate with Zod schema
- `parseAndValidate(text, schema)`: Complete parsing and validation

**Features:**
- Handles markdown code blocks (```json ... ```)
- Extracts JSON from mixed text
- Detailed error messages
- Schema validation with Zod

---

## Error Handling

### Common Errors

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Invalid input data | Validation failed |
| 401 | Invalid API key | Wrong Gemini API key |
| 429 | Quota exceeded | API rate limit reached |
| 500 | AI generation failed | Parsing or generation error |
| 503 | Service not configured | Missing GEMINI_API_KEY |
| 504 | Timeout | API request timeout |

### Retry Logic

- Maximum retries: 3
- Exponential backoff: 2s, 4s, 8s
- No retry on auth errors (401, 503)
- Automatic retry on temporary failures

---

## Security

### API Key Protection
- Stored in environment variables only
- Never exposed in responses or logs
- Validated on service initialization

### Rate Limiting
- Applied to all AI endpoints via middleware
- Prevents API quota exhaustion
- User-specific limits

### Input Validation
- All inputs validated with Zod schemas
- Maximum lengths enforced
- Type checking on all fields

### Response Validation
- AI responses validated before returning
- Schema validation ensures data integrity
- Invalid responses rejected with error

---

## Performance

### Optimization Strategies

1. **Retry Logic**: Automatic recovery from temporary failures
2. **Token Limits**: 8192 max output tokens
3. **Concurrent Requests**: Non-blocking async operations
4. **Error Caching**: Fast failure on repeated errors

### Typical Response Times

- Question Generation: 3-8 seconds
- Interview Evaluation: 5-12 seconds
- Resume Analysis: 4-10 seconds
- Health Check: <1 second

*Times vary based on AI load and complexity*

---

## Testing

### Manual Testing

1. **Check Configuration:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/ai/health
```

2. **Generate Questions:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Backend Developer",
    "difficulty": "MEDIUM",
    "count": 5
  }' \
  http://localhost:5000/api/v1/ai/questions
```

3. **Test Without API Key:**
   - Remove GEMINI_API_KEY from .env
   - Restart server
   - Should see warning message
   - AI endpoints should return 503

---

## Integration Examples

### Generate Questions for Interview

```javascript
// In question.service.js or interview workflow
import { aiService } from './ai.service.js';

async function generateInterviewQuestions(interviewId, role, difficulty) {
  // Generate questions with AI
  const result = await aiService.generateQuestions({
    role,
    difficulty,
    count: 10,
  });

  // Save questions to database
  const questions = result.questions.map((q, index) => ({
    interviewId,
    question: q.question,
    type: q.type,
    difficulty: q.difficulty,
    order: index + 1,
  }));

  return await questionRepository.createManyQuestions(questions);
}
```

### Evaluate Interview Automatically

```javascript
// After interview completion
async function autoEvaluate(interviewId) {
  // Fetch interview details
  const interview = await interviewRepository.findById(interviewId);
  
  // Fetch submissions
  const submissions = await submissionRepository.findByInterviewId(interviewId);
  
  // Format for AI
  const questionsAndAnswers = submissions.map(s => ({
    question: s.question.question,
    answer: s.answer,
    code: s.code,
    language: s.language,
  }));

  // Evaluate with AI
  const result = await aiService.evaluateInterview({
    role: interview.role,
    difficulty: interview.difficulty,
    questionsAndAnswers,
  });

  // Save evaluation
  return await evaluationRepository.createEvaluation({
    interviewId,
    score: result.score,
    strengths: result.strengths,
    weaknesses: result.weaknesses,
    feedback: result.feedback,
  });
}
```

---

## Troubleshooting

### AI Service Not Working

**Symptom**: 503 Service Unavailable

**Solutions**:
1. Check GEMINI_API_KEY in .env file
2. Verify API key is valid
3. Restart server after adding key
4. Check `/api/v1/ai/health` endpoint

### Invalid JSON Response

**Symptom**: "AI returned invalid JSON format"

**Solutions**:
1. Check AI response in logs
2. Verify prompt format
3. Increase max output tokens if truncated
4. Retry request (automatic)

### Quota Exceeded

**Symptom**: 429 error

**Solutions**:
1. Wait for quota reset
2. Upgrade Gemini API plan
3. Implement request queuing
4. Cache frequent requests

---

## Future Enhancements

1. **Caching**: Cache common question sets
2. **Streaming**: Real-time response streaming
3. **Multi-Model**: Support OpenAI and other providers
4. **Fine-Tuning**: Custom model for interview domain
5. **Batch Processing**: Generate multiple interviews at once
6. **A/B Testing**: Compare different prompt strategies
7. **Analytics**: Track AI performance metrics
8. **Custom Prompts**: User-defined prompt templates

---

## Module Statistics

- **Services**: 2 (gemini, ai)
- **Prompt Templates**: 3 (question, evaluation, resume)
- **Controllers**: 1
- **Endpoints**: 4
- **Utilities**: 1 (aiParser)

---

## Implementation Status

✅ Gemini Service Integration  
✅ AI Service (High-level)  
✅ Prompt Templates (3)  
✅ AI Parser Utility  
✅ AI Controller  
✅ AI Routes  
✅ AI Validation Schemas  
✅ Route Registration  
✅ Documentation  

**Module Status**: COMPLETE

---

## Related Documentation

- `QUESTION_MODULE.MD`: Question generation integration
- `EVALUATION_MODULE.MD`: Evaluation storage
- `RESUME_MODULE.MD`: Resume upload for analysis
- `AUTHENTICATION.MD`: API authentication
- `ARCHITECTURE.MD`: System architecture

---

## Key Features

✅ **Gemini AI Integration**: Google's latest AI model  
✅ **Structured Responses**: JSON validation with Zod  
✅ **Retry Logic**: Automatic recovery from failures  
✅ **Multiple Use Cases**: Questions, evaluation, resume analysis  
✅ **Error Handling**: Comprehensive error management  
✅ **Security**: API key protection and input validation  
✅ **Performance**: Optimized prompts and token limits  
✅ **Flexibility**: Easy to add new AI features  

---

## Configuration Steps

1. Get Gemini API key from https://aistudio.google.com/app/apikey
2. Add to `.env`: `GEMINI_API_KEY=your_key_here`
3. Restart backend server
4. Verify: `GET /api/v1/ai/health`
5. Test question generation
6. Ready to use!

**Note**: AI features work without API key in development, but return configuration warnings.
