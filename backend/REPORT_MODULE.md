# Report Module Documentation

## Overview

The Report Module generates and manages comprehensive interview reports based on completed evaluations. It provides users with structured summaries, recommendations, and performance analytics.

---

## Architecture

Follows the layered architecture pattern:

```
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

### Layers

1. **Routes** (`report.routes.js`): Define API endpoints
2. **Controller** (`report.controller.js`): Handle HTTP requests/responses
3. **Service** (`report.service.js`): Business logic and report generation
4. **Repository** (`report.repository.js`): Database operations

---

## Database Schema

### Report Model

| Field          | Type     | Description                                 |
|----------------|----------|---------------------------------------------|
| id             | String   | Primary key (CUID)                          |
| userId         | String   | Foreign key to User                         |
| interviewId    | String   | Foreign key to Interview (unique)           |
| overallScore   | Int      | Overall interview score (0-100)             |
| summary        | Text     | Comprehensive interview summary             |
| recommendation | Text     | Performance-based recommendations           |
| createdAt      | DateTime | Timestamp of report creation                |

### Relationships

- **Report** → **User**: Many-to-one (user owns multiple reports)
- **Report** → **Interview**: One-to-one (one report per interview)
- **Report** ← **Evaluation**: Indirect dependency (report generated from evaluation)

### Constraints

- `interviewId` is unique (one report per interview)
- Interview must be COMPLETED
- Evaluation must exist before report generation

### Indexes

- Index on `userId` (for listing user's reports)
- Index on `interviewId` (for finding report by interview)
- Composite index on `userId` + `createdAt` (for sorted listing)

---

## API Endpoints

Base path: `/api/v1/reports`

All endpoints require authentication via `requireAuthentication` middleware.

### 1. Generate Report

**POST** `/api/v1/reports/:interviewId`

Generate a report from an existing evaluation.

#### Request

**Path Parameters:**
- `interviewId` (string, required): Interview ID (CUID format)

**Body:** None (report generated from existing evaluation data)

#### Response

**Success (201 Created):**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "report": {
      "id": "clxx9876543210zyxwvutsrq",
      "userId": "clxx1111222233334444555566",
      "interviewId": "clxx0987654321jihgfedcba",
      "overallScore": 85,
      "summary": "Interview for Backend Developer position completed with a score of 85/100...",
      "recommendation": "Strong Performance! You showed solid competency in most areas...",
      "createdAt": "2026-07-29T11:00:00.000Z",
      "user": {
        "id": "clxx1111222233334444555566",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "interview": {
        "id": "clxx0987654321jihgfedcba",
        "title": "Senior Backend Developer Interview",
        "role": "Backend Developer",
        "difficulty": "HARD",
        "status": "COMPLETED",
        "completedAt": "2026-07-29T10:00:00.000Z"
      }
    }
  }
}
```

**Errors:**
- `400 Bad Request`: Interview not completed
- `404 Not Found`: Interview or evaluation not found
- `409 Conflict`: Report already exists for this interview

---

### 2. Get Report by ID

**GET** `/api/v1/reports/:id`

Retrieve a specific report by its ID.

#### Request

**Path Parameters:**
- `id` (string, required): Report ID (CUID format)

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "clxx9876543210zyxwvutsrq",
      "userId": "clxx1111222233334444555566",
      "interviewId": "clxx0987654321jihgfedcba",
      "overallScore": 85,
      "summary": "Interview for Backend Developer position completed with a score of 85/100...",
      "recommendation": "Strong Performance! You showed solid competency in most areas...",
      "createdAt": "2026-07-29T11:00:00.000Z",
      "user": {
        "id": "clxx1111222233334444555566",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "interview": {
        "id": "clxx0987654321jihgfedcba",
        "title": "Senior Backend Developer Interview",
        "role": "Backend Developer",
        "difficulty": "HARD",
        "status": "COMPLETED",
        "completedAt": "2026-07-29T10:00:00.000Z"
      }
    }
  }
}
```

**Errors:**
- `404 Not Found`: Report not found or doesn't belong to user

---

### 3. List All Reports

**GET** `/api/v1/reports`

Get all reports for the authenticated user.

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "clxx9876543210zyxwvutsrq",
        "userId": "clxx1111222233334444555566",
        "interviewId": "clxx0987654321jihgfedcba",
        "overallScore": 85,
        "summary": "Interview for Backend Developer position completed...",
        "recommendation": "Strong Performance!...",
        "createdAt": "2026-07-29T11:00:00.000Z",
        "interview": {
          "id": "clxx0987654321jihgfedcba",
          "title": "Senior Backend Developer Interview",
          "role": "Backend Developer",
          "difficulty": "HARD",
          "status": "COMPLETED",
          "completedAt": "2026-07-29T10:00:00.000Z"
        }
      }
    ],
    "total": 1
  }
}
```

---

### 4. Delete Report

**DELETE** `/api/v1/reports/:id`

Delete a report.

#### Request

**Path Parameters:**
- `id` (string, required): Report ID (CUID format)

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Report deleted successfully",
  "data": null
}
```

**Errors:**
- `404 Not Found`: Report not found or doesn't belong to user

---

## Business Rules

### Report Generation Rules

1. **Evaluation Required**: Evaluation must exist before report generation
2. **Interview Completion Required**: Interview status must be `COMPLETED`
3. **One Report Per Interview**: Unique constraint on `interviewId`
4. **Ownership Verification**: User must own the interview
5. **Read-Only After Generation**: Reports cannot be modified (only deleted)

### Report Content

**Summary Structure:**
- Interview role and score
- Key strengths (from evaluation)
- Areas for improvement (from evaluation)
- Detailed feedback (from evaluation)

**Recommendation Logic:**
- **Score 90-100**: "Excellent Performance!"
- **Score 75-89**: "Strong Performance!"
- **Score 60-74**: "Good Performance!"
- **Score 40-59**: "Fair Performance"
- **Score 0-39**: "Needs Improvement"

---

## Security

### Authentication
- All endpoints require JWT authentication via `requireAuthentication` middleware
- User ID extracted from authenticated token (`req.user.id`)

### Authorization
- Users can only access their own reports
- Ownership verified through userId field
- 404 errors returned for unauthorized access (prevents information leakage)

### Validation
- All inputs validated using Zod schemas
- CUID format validation for IDs
- No user input for report content (generated from evaluation)

---

## Repository Methods

### `createReport(reportData)`
Creates a new report with user and interview details included.

**Parameters:**
- `userId`: String (user ID)
- `interviewId`: String (interview ID)
- `overallScore`: Integer (evaluation score)
- `summary`: String (generated summary)
- `recommendation`: String (generated recommendation)

**Returns:** Created report with user and interview relations

---

### `findById(reportId)`
Finds report by ID, includes user and interview details.

**Returns:** Report object or null

---

### `findByInterviewId(interviewId)`
Finds report by interview ID, includes user and interview details.

**Returns:** Report object or null

---

### `findByUserId(userId)`
Finds all reports for a user, includes interview details, ordered by creation date (newest first).

**Returns:** Array of report objects

---

### `deleteReport(reportId)`
Deletes report by ID.

**Returns:** Deleted report object

---

### `countByUserId(userId)`
Counts total reports for a user (for pagination/stats).

**Returns:** Number

---

## Service Methods

### `generateReport(userId, interviewId)`
**Purpose**: Generate report from existing evaluation

**Validations**:
- Interview exists and belongs to user
- Interview status is COMPLETED
- Evaluation exists for interview
- No existing report for interview

**Process**:
1. Verify interview ownership and completion
2. Check evaluation exists
3. Check no duplicate report
4. Generate summary from evaluation data
5. Generate recommendation based on score
6. Create and return report

**Returns**: Created report with relations

---

### `getReport(userId, reportId)`
**Purpose**: Retrieve report by ID

**Validations**:
- Report exists
- User owns the report

**Returns**: Report with relations

---

### `listReports(userId)`
**Purpose**: Get all reports for authenticated user

**Returns**: Object with reports array and total count

---

### `deleteReport(userId, reportId)`
**Purpose**: Delete report

**Validations**:
- Report exists
- User owns the report

**Returns**: void

---

### `_generateSummary(evaluation, interview)` (Private)
**Purpose**: Generate formatted summary from evaluation data

**Format**:
```
Interview for [role] position completed with a score of [score]/100.

Key Strengths:
[evaluation.strengths]

Areas for Improvement:
[evaluation.weaknesses]

Detailed Feedback:
[evaluation.feedback]
```

---

### `_generateRecommendation(score, strengths, weaknesses)` (Private)
**Purpose**: Generate performance-based recommendation

**Logic**:
- Score-based performance assessment
- Encouragement to build on strengths
- Guidance to address weaknesses

---

## Error Handling

### Common Errors

| Status | Error                                           | Cause                                      |
|--------|-------------------------------------------------|--------------------------------------------|
| 400    | Interview must be completed before report       | Interview status is not COMPLETED          |
| 404    | Interview not found                             | Interview doesn't exist or wrong user      |
| 404    | Evaluation not found                            | No evaluation exists for interview         |
| 404    | Report not found                                | Report doesn't exist or wrong user         |
| 409    | Report already exists for this interview        | Duplicate report attempt                   |

---

## Integration Points

### With Interview Module
- Verifies interview completion status
- Ensures interview ownership
- Cascade delete: Deleting interview deletes report

### With Evaluation Module
- Requires evaluation to exist before report generation
- Uses evaluation score, strengths, weaknesses, and feedback
- Report content derived from evaluation data

### With User Module
- Reports linked to users through userId
- User details included in report responses
- Cascade delete: Deleting user deletes all reports

---

## Report Generation Logic

### Summary Generation
Combines evaluation data with interview context to create a comprehensive summary:
- Interview details (role, difficulty)
- Overall score
- Key strengths
- Areas for improvement
- Detailed feedback

### Recommendation Algorithm
Score-based performance categories:
1. **Excellent (90-100)**: Exceptional skills, well-prepared
2. **Strong (75-89)**: Solid competency in most areas
3. **Good (60-74)**: Decent foundation, needs some improvement
4. **Fair (40-59)**: Several key areas need work
5. **Needs Improvement (0-39)**: Significant preparation required

Plus guidance to:
- Build upon strengths
- Address identified weaknesses
- Improve interview performance

---

## Testing Checklist

### Functional Tests
- ✓ Generate report from completed interview with evaluation
- ✓ Prevent duplicate reports
- ✓ Block report generation without evaluation
- ✓ Block report generation for incomplete interviews
- ✓ Retrieve report by ID
- ✓ List all user reports
- ✓ Delete report
- ✓ Ownership verification

### Security Tests
- ✓ Unauthenticated access blocked
- ✓ Cross-user access blocked
- ✓ Invalid interview ID rejected
- ✓ Invalid report ID rejected

### Business Logic Tests
- ✓ Summary correctly formatted
- ✓ Recommendation matches score range
- ✓ Score copied from evaluation
- ✓ Reports ordered by creation date

---

## Future Enhancements

1. **Analytics**: Add aggregate statistics across multiple reports
2. **PDF Export**: Generate downloadable PDF reports
3. **Email Reports**: Send report via email
4. **Report Templates**: Customizable report formats
5. **Comparison**: Compare performance across multiple interviews
6. **Trends**: Track performance improvement over time
7. **Charts**: Visual representation of scores and performance
8. **AI Insights**: Enhanced recommendations using AI analysis
9. **Report Sharing**: Share reports with recruiters/employers

---

## Module Statistics

- **Repository Methods**: 6
- **Service Methods**: 4 (public) + 2 (private)
- **Controllers**: 4
- **Endpoints**: 4
- **Validation Schemas**: 2

---

## Implementation Status

✅ Report Repository  
✅ Report Service  
✅ Report Controller  
✅ Report Routes  
✅ Report Validation  
✅ Route Registration  
✅ Documentation  

**Module Status**: COMPLETE

---

## Related Documentation

- `EVALUATION_MODULE.MD`: Evaluation data source for reports
- `INTERVIEW_MODULE.MD`: Interview completion requirements
- `AUTHENTICATION.MD`: Authentication and authorization patterns
- `DATABASE_DESIGN.MD`: Complete database schema
- `ARCHITECTURE.MD`: System architecture overview

---

## Usage Example

### Complete Flow: Interview → Evaluation → Report

1. **Complete Interview**
   ```bash
   POST /api/v1/interviews/:id/complete
   ```

2. **Create Evaluation**
   ```bash
   POST /api/v1/evaluations/:interviewId
   {
     "score": 85,
     "strengths": "Strong problem-solving...",
     "weaknesses": "Could improve...",
     "feedback": "Overall excellent..."
   }
   ```

3. **Generate Report**
   ```bash
   POST /api/v1/reports/:interviewId
   ```
   (No body required - generated from evaluation)

4. **Retrieve Report**
   ```bash
   GET /api/v1/reports/:id
   ```

5. **List All Reports**
   ```bash
   GET /api/v1/reports
   ```

---

## Key Features

✅ **Automated Generation**: Reports auto-generated from evaluation data  
✅ **Smart Recommendations**: Score-based performance assessment  
✅ **Comprehensive Summary**: Includes strengths, weaknesses, and feedback  
✅ **Ownership Protection**: Users only see their own reports  
✅ **Duplicate Prevention**: One report per interview  
✅ **Read-Only Content**: Reports immutable after generation  
✅ **Cascade Deletion**: Automatically cleaned up with interview/user  

---

## Backend Completion Status

🎉 **ALL 8 BACKEND MODULES COMPLETE** 🎉

1. ✅ Authentication Module
2. ✅ User Module
3. ✅ Resume Module
4. ✅ Interview Module
5. ✅ Question Module
6. ✅ Submission Module
7. ✅ Evaluation Module
8. ✅ Report Module

**Total API Endpoints**: 42 endpoints across 8 domains  
**Backend Development**: 100% Complete
