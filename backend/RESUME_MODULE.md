# Resume Module Documentation

## Overview

The Resume Module allows authenticated users to upload, view, replace, and delete resumes. Files are stored in **Cloudinary** cloud storage, while metadata is stored in **PostgreSQL**.

**Status**: ✅ Implemented and Ready for Testing

---

## Features

- ✅ Upload resume (PDF, DOC, DOCX)
- ✅ List user's resumes
- ✅ Get specific resume
- ✅ Replace existing resume
- ✅ Delete resume (removes from Cloudinary and database)
- ✅ File validation (type and size)
- ✅ Ownership verification
- ✅ Cloudinary integration

---

## Architecture

### Upload Flow

```
User submits file
    ↓
Multer Middleware (memory storage)
    ↓
File Validation (type, size)
    ↓
Upload Middleware Error Handler
    ↓
Resume Controller
    ↓
Resume Service
    ↓
Upload to Cloudinary
    ↓
Save Metadata to PostgreSQL
    ↓
Return Resume Details
```

### Delete Flow

```
User requests delete
    ↓
Resume Controller
    ↓
Resume Service
    ↓
Verify Ownership
    ↓
Delete from Cloudinary
    ↓
Delete from PostgreSQL
    ↓
Return Success Message
```

---

## Implementation

### 1. Cloudinary Configuration

**File**: `src/utils/cloudinary.js`

**Functions**:

#### uploadToCloudinary(fileBuffer, folder, resourceType)
- Uploads file buffer to Cloudinary
- Returns secure URL and public ID
- Used for resume uploads

#### deleteFromCloudinary(publicId, resourceType)
- Deletes file from Cloudinary by public ID
- Used when replacing or deleting resumes

#### getCloudinaryUrl(publicId, resourceType)
- Generates secure URL for file access

**Configuration** (`src/config/env.js`):
```javascript
cloudinary: {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}
```

---

### 2. Upload Middleware

**File**: `src/middleware/upload.middleware.js`

**Configuration**:
- **Storage**: Memory (files stored in buffer before Cloudinary upload)
- **Field Name**: `file`
- **Max File Size**: 5 MB
- **Allowed Types**: 
  - `application/pdf` (.pdf)
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
  - `application/msword` (.doc)

**Middleware Functions**:

#### uploadSingleFile
- Multer middleware for single file upload
- Validates file type and size
- Rejects invalid files immediately

#### handleUploadError
- Error handler for Multer errors
- Catches file size exceeded errors
- Catches file type errors
- Returns formatted error responses

**Usage**:
```javascript
router.post('/', uploadSingleFile, handleUploadError, uploadResume);
```

---

### 3. Repository Layer

**File**: `src/repositories/resume.repository.js`

**Methods**:

#### createResume(resumeData)
- Creates new resume record in database
- Stores metadata only (not the file itself)

#### findById(id)
- Finds resume by ID
- Returns null if not found

#### findByUserId(userId)
- Finds all resumes for a user
- Ordered by creation date (newest first)

#### findByIdAndUserId(id, userId)
- Finds resume with ownership verification
- Used for security checks

#### updateResume(id, updateData)
- Updates resume metadata
- Used when replacing files

#### deleteResume(id)
- Deletes resume from database
- Cascade deletes handled by Prisma

#### countByUserId(userId)
- Counts user's resumes
- Can be used for limits/quotas

---

### 4. Service Layer

**File**: `src/services/resume.service.js`

**Methods**:

#### uploadResume(userId, file)
1. Validates file exists
2. Uploads to Cloudinary
3. Saves metadata to database
4. Returns formatted response

**Stored Metadata**:
- `fileName` - Original file name
- `fileUrl` - Cloudinary secure URL
- `publicId` - Cloudinary identifier
- `fileSize` - Size in bytes

#### getResume(resumeId, userId)
- Fetches resume with ownership verification
- Throws 404 if not found or not owned by user

#### listResumes(userId)
- Returns all resumes for user
- Formatted for API response

#### replaceResume(resumeId, userId, file)
1. Verifies ownership
2. Uploads new file to Cloudinary
3. Updates metadata in database
4. Deletes old file from Cloudinary
5. Returns updated resume

**Note**: Old file deletion happens after successful upload to prevent data loss.

#### deleteResume(resumeId, userId)
1. Verifies ownership
2. Deletes from Cloudinary
3. Deletes from database
4. Returns success message

**Error Handling**: Database deletion continues even if Cloudinary deletion fails.

#### formatResumeResponse(resume)
- Formats resume for API response
- Includes all metadata fields

---

### 5. Controller Layer

**File**: `src/controllers/resume.controller.js`

**Handlers**:

#### uploadResume
- POST /api/v1/resumes
- Extracts user ID from req.user
- Gets file from req.file (set by Multer)
- Calls resumeService.uploadResume()
- Returns 201 Created

#### listResumes
- GET /api/v1/resumes
- Extracts user ID from req.user
- Returns all user's resumes

#### getResume
- GET /api/v1/resumes/:id
- Extracts resume ID from params
- Verifies ownership in service layer

#### replaceResume
- PATCH /api/v1/resumes/:id
- Uploads new file
- Replaces existing resume
- Deletes old Cloudinary file

#### deleteResume
- DELETE /api/v1/resumes/:id
- Deletes from Cloudinary and database
- Returns success message

---

### 6. Routes

**File**: `src/routes/resume.routes.js`

**Base Path**: `/api/v1/resumes`

**All routes require authentication**

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/` | requireAuthentication, uploadSingleFile, handleUploadError | Upload resume |
| GET | `/` | requireAuthentication | List user's resumes |
| GET | `/:id` | requireAuthentication | Get specific resume |
| PATCH | `/:id` | requireAuthentication, uploadSingleFile, handleUploadError | Replace resume |
| DELETE | `/:id` | requireAuthentication | Delete resume |

**Middleware Order**:
1. `requireAuthentication` - Verify user is logged in
2. `uploadSingleFile` - Handle file upload with Multer
3. `handleUploadError` - Catch upload errors
4. Controller handler - Process request

---

## API Endpoints

### POST /api/v1/resumes

**Purpose**: Upload a new resume

**Authentication**: Required (Clerk token)

**Content-Type**: `multipart/form-data`

**Request**:
```
Field name: file
File types: PDF, DOC, DOCX
Max size: 5 MB
```

**Example using curl**:
```bash
curl -X POST http://localhost:5000/api/v1/resumes \
  -H "Authorization: Bearer <clerk_token>" \
  -F "file=@/path/to/resume.pdf"
```

**Response** (201):
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "id": "clres123",
    "userId": "cluser123",
    "fileName": "resume.pdf",
    "fileUrl": "https://res.cloudinary.com/.../resume.pdf",
    "publicId": "intervuex/resumes/abc123",
    "fileSize": 245678,
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Error Responses**:
- 400: No file provided
- 400: Invalid file type
- 400: File size exceeds 5 MB
- 401: Unauthorized
- 500: Upload failed

---

### GET /api/v1/resumes

**Purpose**: List all resumes for authenticated user

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <clerk_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Resumes retrieved successfully",
  "data": {
    "resumes": [
      {
        "id": "clres123",
        "userId": "cluser123",
        "fileName": "resume.pdf",
        "fileUrl": "https://res.cloudinary.com/.../resume.pdf",
        "publicId": "intervuex/resumes/abc123",
        "fileSize": 245678,
        "createdAt": "2026-07-25T10:00:00Z",
        "updatedAt": "2026-07-25T10:00:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- 401: Unauthorized

---

### GET /api/v1/resumes/:id

**Purpose**: Get a specific resume by ID

**Authentication**: Required (must be owner)

**Request Headers**:
```
Authorization: Bearer <clerk_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Resume retrieved successfully",
  "data": {
    "id": "clres123",
    "userId": "cluser123",
    "fileName": "resume.pdf",
    "fileUrl": "https://res.cloudinary.com/.../resume.pdf",
    "publicId": "intervuex/resumes/abc123",
    "fileSize": 245678,
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 404: Resume not found or access denied

---

### PATCH /api/v1/resumes/:id

**Purpose**: Replace an existing resume with a new file

**Authentication**: Required (must be owner)

**Content-Type**: `multipart/form-data`

**Request**:
```
Field name: file
File types: PDF, DOC, DOCX
Max size: 5 MB
```

**Example**:
```bash
curl -X PATCH http://localhost:5000/api/v1/resumes/clres123 \
  -H "Authorization: Bearer <clerk_token>" \
  -F "file=@/path/to/new-resume.pdf"
```

**Response** (200):
```json
{
  "success": true,
  "message": "Resume replaced successfully",
  "data": {
    "id": "clres123",
    "fileName": "new-resume.pdf",
    "fileUrl": "https://res.cloudinary.com/.../new-resume.pdf",
    "publicId": "intervuex/resumes/xyz789",
    "fileSize": 312456,
    "updatedAt": "2026-07-25T11:00:00Z"
  }
}
```

**Error Responses**:
- 400: No file provided
- 400: Invalid file type
- 400: File size exceeds 5 MB
- 401: Unauthorized
- 404: Resume not found or access denied
- 500: Replace failed

---

### DELETE /api/v1/resumes/:id

**Purpose**: Delete a resume

**Authentication**: Required (must be owner)

**Request Headers**:
```
Authorization: Bearer <clerk_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Resume deleted successfully",
  "data": {
    "message": "Resume deleted successfully"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 404: Resume not found or access denied

---

## Database Schema

### Resume Table

```sql
CREATE TABLE "resumes" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "publicId" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  
  CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "resumes_userId_idx" ON "resumes"("userId");
CREATE INDEX "resumes_publicId_idx" ON "resumes"("publicId");
```

### Prisma Model

```prisma
model Resume {
  id        String   @id @default(cuid())
  userId    String
  fileName  String
  fileUrl   String
  publicId  String
  fileSize  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  interviews Interview[]

  @@index([userId])
  @@index([publicId])
  @@map("resumes")
}
```

**Relationships**:
- Many Resumes → One User (cascade delete)
- One Resume → Many Interviews (optional reference)

---

## Business Rules

### 1. File Storage

- ✅ Files stored **only** in Cloudinary
- ✅ Metadata stored in PostgreSQL
- ✅ Never store files on application server
- ✅ Files stored in `intervuex/resumes` folder on Cloudinary

### 2. Ownership

- ✅ User can **only** access their own resumes
- ✅ User ID from `req.user.id` (verified token)
- ✅ Ownership verified in service layer
- ✅ 404 returned if resume not found or not owned

### 3. File Validation

- ✅ Only PDF, DOC, DOCX allowed
- ✅ Maximum size: 5 MB
- ✅ Validation happens before upload to Cloudinary
- ✅ Invalid files rejected with 400 error

### 4. File Replacement

- ✅ Upload new file first
- ✅ Update database second
- ✅ Delete old file last
- ✅ Prevents data loss if upload fails

### 5. File Deletion

- ✅ Delete from Cloudinary first
- ✅ Delete from database second
- ✅ Database deletion continues even if Cloudinary fails
- ✅ Prevents orphaned database records

---

## Security

### Authentication

- All endpoints require valid Clerk token
- Token verified by `requireAuthentication` middleware
- 401 returned if missing or invalid

### Authorization

- User can only access their own resumes
- Ownership verified using `findByIdAndUserId()`
- 404 returned for unauthorized access attempts

### File Validation

- MIME type validation in Multer
- File size limit enforced (5 MB)
- Only allowed file types accepted
- Prevents malicious file uploads

### Cloudinary Security

- API credentials stored in environment variables
- Never exposed in responses
- Secure HTTPS URLs only
- Public IDs not guessable (generated by Cloudinary)

---

## Error Handling

### File Upload Errors

**No File Provided** (400):
```json
{
  "success": false,
  "message": "Please upload a file"
}
```

**Invalid File Type** (400):
```json
{
  "success": false,
  "message": "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
}
```

**File Too Large** (400):
```json
{
  "success": false,
  "message": "File size exceeds the maximum limit of 5 MB."
}
```

### Ownership Errors

**Resume Not Found** (404):
```json
{
  "success": false,
  "message": "Resume not found or access denied"
}
```

### Cloudinary Errors

**Upload Failed** (500):
```json
{
  "success": false,
  "message": "Failed to upload resume"
}
```

---

## Testing

### Setup Cloudinary

1. Create Cloudinary account at https://cloudinary.com
2. Get credentials from dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Test Upload

```bash
# Upload resume
curl -X POST http://localhost:5000/api/v1/resumes \
  -H "Authorization: Bearer <clerk_token>" \
  -F "file=@resume.pdf"
```

### Test List

```bash
# List all resumes
curl -X GET http://localhost:5000/api/v1/resumes \
  -H "Authorization: Bearer <clerk_token>"
```

### Test Get

```bash
# Get specific resume
curl -X GET http://localhost:5000/api/v1/resumes/clres123 \
  -H "Authorization: Bearer <clerk_token>"
```

### Test Replace

```bash
# Replace resume
curl -X PATCH http://localhost:5000/api/v1/resumes/clres123 \
  -H "Authorization: Bearer <clerk_token>" \
  -F "file=@new-resume.pdf"
```

### Test Delete

```bash
# Delete resume
curl -X DELETE http://localhost:5000/api/v1/resumes/clres123 \
  -H "Authorization: Bearer <clerk_token>"
```

### Test Validation Errors

**File Too Large**:
```bash
# Try uploading file > 5 MB
curl -X POST http://localhost:5000/api/v1/resumes \
  -H "Authorization: Bearer <clerk_token>" \
  -F "file=@large-file.pdf"
```

**Invalid File Type**:
```bash
# Try uploading image
curl -X POST http://localhost:5000/api/v1/resumes \
  -H "Authorization: Bearer <clerk_token>" \
  -F "file=@image.jpg"
```

Expected: 400 with validation error

---

## Environment Variables

### Required

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Validation

The application warns if Cloudinary credentials are missing:
```
⚠️  Cloudinary configuration missing. Resume upload will not work.
```

---

## Folder Structure

```
src/
├── config/
│   └── env.js              # Cloudinary configuration
├── middleware/
│   └── upload.middleware.js # Multer configuration
├── utils/
│   └── cloudinary.js        # Cloudinary utility functions
├── controllers/
│   └── resume.controller.js # Resume HTTP handlers
├── services/
│   └── resume.service.js    # Resume business logic
├── repositories/
│   └── resume.repository.js # Resume database operations
├── routes/
│   └── resume.routes.js     # Resume endpoints
└── validations/
    └── resume.validation.js # Resume validation schemas
```

---

## Integration with Other Modules

### Interview Module (Future)

Interviews can reference resumes:

```javascript
const interview = await interviewService.createInterview({
  userId,
  resumeId: 'clres123', // Optional
  title: 'Frontend Interview',
  ...
});
```

If resume is deleted, `resumeId` in interviews becomes NULL (ON DELETE SET NULL).

---

## Best Practices

### 1. Always Delete Old Files

```javascript
// ✅ Good - delete old file when replacing
const updatedResume = await resumeService.replaceResume(id, userId, file);

// ❌ Bad - upload new file without deleting old
await resumeService.uploadResume(userId, file);
await resumeService.deleteResume(oldId, userId);
```

### 2. Handle Cloudinary Errors Gracefully

```javascript
try {
  await deleteFromCloudinary(publicId);
} catch (error) {
  console.error('Cloudinary deletion failed:', error);
  // Continue with database deletion
}
```

### 3. Verify Ownership Before Operations

```javascript
// ✅ Good - service verifies ownership
const resume = await resumeService.getResume(resumeId, userId);

// ❌ Bad - no ownership check
const resume = await resumeRepository.findById(resumeId);
```

### 4. Use Memory Storage for Cloudinary

```javascript
// ✅ Good - memory storage (uploaded directly to Cloudinary)
const storage = multer.memoryStorage();

// ❌ Bad - disk storage (creates temporary files)
const storage = multer.diskStorage({ ... });
```

---

## Limitations & Future Enhancements

### Current Limitations

- Maximum 5 MB file size
- Only PDF, DOC, DOCX supported
- No resume parsing/analysis
- No file preview generation
- No download tracking

### Future Enhancements

1. **Resume Parsing**
   - Extract text from PDF
   - Parse structured data
   - Generate skills list

2. **File Conversion**
   - Convert all formats to PDF
   - Generate thumbnails
   - Create preview images

3. **Storage Limits**
   - Quota per user
   - Total storage tracking
   - Cleanup old resumes

4. **Advanced Features**
   - Resume versions/history
   - Template suggestions
   - ATS score calculation

---

## Success Criteria

✅ **Resume upload works**
- File uploaded to Cloudinary
- Metadata saved to PostgreSQL
- Returns resume details

✅ **File stored in Cloudinary**
- No local file storage
- Secure HTTPS URLs
- Public ID for deletion

✅ **Metadata stored in PostgreSQL**
- All resume fields saved
- Relations to User working
- Timestamps auto-managed

✅ **Ownership verification**
- Users can only access own resumes
- 404 for unauthorized access
- User ID from token only

✅ **Replace works correctly**
- New file uploaded
- Old file deleted from Cloudinary
- Database updated

✅ **Delete works correctly**
- File removed from Cloudinary
- Record removed from database
- Cascade delete working

✅ **No local file storage**
- Files in Cloudinary only
- Memory storage used
- No temp files created

✅ **Ready for Interview Module**
- Resume can be referenced by interviews
- Ownership pattern established
- CRUD operations complete

---

## Troubleshooting

### Issue: "Cloudinary configuration missing" warning

**Cause**: Environment variables not set

**Solution**: Add credentials to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Issue: "File size exceeds maximum limit"

**Cause**: File larger than 5 MB

**Solution**: Compress file or change limit in `upload.middleware.js`:
```javascript
limits: {
  fileSize: 10 * 1024 * 1024, // 10 MB
}
```

---

### Issue: "Invalid file type"

**Cause**: Unsupported file format

**Solution**: Convert to PDF, DOC, or DOCX

---

### Issue: Upload succeeds but old file not deleted

**Cause**: Cloudinary API error

**Solution**: Check Cloudinary logs. Database update still succeeds to prevent data loss.

---

**Implementation Date**: 2026-07-25  
**Status**: ✅ Complete and Ready for Testing  
**Version**: 1.0

**Note**: Cloudinary credentials must be configured before testing uploads.
