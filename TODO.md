# Fundarbók PWA - Implementation Todo List

## Project Overview
Building a PWA for meeting management with Angular frontend, ASP.NET Core backend, and PostgreSQL database.

**IMPORTANT NAMING CONVENTIONS:**
- All code (C# classes, properties, TypeScript interfaces, variables) uses **English names**
- All database tables and columns use **English names**
- UI translations handled via i18n files (English and Faroese)
- Translation keys use dot notation: `meetings.title`, `common.save`, etc.

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Development Environment Setup
- [x] Install .NET 8 SDK
- [x] Install Node.js (LTS version) and npm
- [x] Install Angular CLI (`npm install -g @angular/cli`)
- [x] Install PostgreSQL
- [x] Install pgAdmin or preferred DB tool
- [x] Set up Git repository
- [x] Create `.gitignore` for .NET and Angular

### 1.2 Backend Project Setup (ASP.NET Core)
- [x] Create solution folder structure
- [x] Create ASP.NET Core Web API project (`dotnet new webapi -n Fundarbok.API`)
- [x] Create Class Library for Domain models (`dotnet new classlib -n Fundarbok.Domain`)
- [x] Create Class Library for Infrastructure/Data (`dotnet new classlib -n Fundarbok.Infrastructure`)
- [x] Create Class Library for Application layer (`dotnet new classlib -n Fundarbok.Application`)
- [x] Add project references (API → Application → Domain, Infrastructure → Domain)
- [x] Install NuGet packages:
  - [x] `Npgsql.EntityFrameworkCore.PostgreSQL`
  - [x] `Microsoft.EntityFrameworkCore.Design`
  - [x] `Microsoft.EntityFrameworkCore.Tools`
  - [x] `Microsoft.AspNetCore.Authentication.JwtBearer`
  - [x] `BCrypt.Net-Next` (for password hashing)
  - [x] `WebPush` (for notifications)
  - [x] `Swashbuckle.AspNetCore` (Swagger/OpenAPI)
- [x] Configure `appsettings.json` with connection string
- [x] Configure `appsettings.Development.json` for local DB
- [x] Set up CORS policy for Angular dev server
- [x] Configure Swagger/OpenAPI documentation

### 1.3 Frontend Project Setup (Angular)
- [x] Create Angular project (`ng new fundarbok-web --routing --style=scss`)
- [x] Add Angular Material (`ng add @angular/material`)
- [x] Add PWA support (`ng add @angular/pwa`)
- [x] Install additional dependencies:
  - [x] `ngx-extended-pdf-viewer` (for PDF viewing)
  - [x] `date-fns` (date manipulation)
- [x] Set up environment files (environment.ts, environment.prod.ts)
- [x] Configure proxy.conf.json for API calls during development
- [x] Set up folder structure:
  - [x] `src/app/core` (services, guards, interceptors)
  - [x] `src/app/shared` (shared components, directives, pipes)
  - [x] `src/app/features` (feature modules)
  - [x] `src/app/models` (TypeScript interfaces)

### 1.4 Database Setup
- [x] Create PostgreSQL database `fundarbok`
- [x] Create database user with appropriate permissions
- [x] Test connection from pgAdmin/CLI
- [x] Document database credentials in secure location

---

## Phase 2: Database Schema & Models

### 2.1 Domain Models (Fundarbok.Domain)
**NOTE: All property names in English, translations handled by frontend**

- [x] Create `Committee.cs` entity:
  - [x] Id (Guid)
  - [x] Name (string, required)
  - [x] Description (string, optional)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: Collection of CommitteeMembers
  - [x] Navigation: Collection of Meetings
- [x] Create `CommitteeMember.cs` entity:
  - [x] Id (Guid)
  - [x] CommitteeId (Guid, foreign key)
  - [x] Name (string, required)
  - [x] Title (string, e.g., "Chairman", "Member")
  - [x] Role (string, enum: "Chairman", "Member", "Secretary", etc.)
  - [x] IsActive (bool, active status)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: Committee
- [x] Create `Meeting.cs` entity:
  - [x] Id (Guid)
  - [x] CommitteeId (Guid, foreign key)
  - [x] MeetingNumber (string, e.g., "5/2022")
  - [x] Title (string, optional)
  - [x] Location (string)
  - [x] StartDate (DateTime)
  - [x] EndDate (DateTime)
  - [x] IsOpen (bool, is meeting open for editing)
  - [x] IsCompleted (bool, is meeting finished)
  - [x] IsApproved (bool, is meeting approved/closed)
  - [x] Description (string)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: Committee
  - [x] Navigation: Collection of AgendaItems
  - [x] Navigation: Collection of MeetingParticipants
- [x] Create `MeetingParticipant.cs` (join table):
  - [x] Id (Guid)
  - [x] MeetingId (Guid, foreign key)
  - [x] CommitteeMemberId (Guid, foreign key)
  - [x] IsParticipating (bool)
  - [x] CreatedAt (DateTime)
  - [x] Navigation: Meeting
  - [x] Navigation: CommitteeMember
- [x] Create `AgendaItem.cs` entity:
  - [x] Id (Guid)
  - [x] MeetingId (Guid, foreign key)
  - [x] Number (int, ordering)
  - [x] Title (string, required)
  - [x] Description (string)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: Meeting
  - [x] Navigation: Collection of Recommendations
  - [x] Navigation: Collection of Documents
  - [x] Navigation: Collection of Conclusions
  - [x] Navigation: Collection of Notes
  - [x] Navigation: Collection of Tasks
- [x] Create `Recommendation.cs` entity:
  - [x] Id (Guid)
  - [x] AgendaItemId (Guid, foreign key)
  - [x] Text (string, text content)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: AgendaItem
- [x] Create `Document.cs` entity:
  - [x] Id (Guid)
  - [x] AgendaItemId (Guid, foreign key, nullable for meeting-level docs)
  - [x] MeetingId (Guid, foreign key, nullable)
  - [x] Name (string, document name)
  - [x] Description (string)
  - [x] FilePath (string, file storage path)
  - [x] FileName (string, original filename)
  - [x] FileSize (long, size in bytes)
  - [x] MimeType (string, e.g., "application/pdf")
  - [x] Number (int, ordering)
  - [x] IsPublic (bool)
  - [x] IsLocked (bool, locked/final)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: AgendaItem (optional)
  - [x] Navigation: Meeting (optional)
- [x] Create `Conclusion.cs` entity:
  - [x] Id (Guid)
  - [x] AgendaItemId (Guid, foreign key)
  - [x] Text (string, text content)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: AgendaItem
- [x] Create `Note.cs` entity:
  - [x] Id (Guid)
  - [x] AgendaItemId (Guid, foreign key)
  - [x] UserId (Guid, user who created note)
  - [x] Text (string, text content)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: AgendaItem
  - [x] Navigation: User
- [x] Create `Task.cs` entity: **(Note: Renamed to `AgendaTask.cs` to avoid conflict with System.Threading.Tasks.Task)**
  - [x] Id (Guid)
  - [x] AgendaItemId (Guid, foreign key)
  - [x] Description (string, task description)
  - [x] AssignedUserId (Guid)
  - [x] DueDate (DateTime, optional)
  - [x] IsCompleted (bool)
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] Navigation: AgendaItem
  - [x] Navigation: User (AssignedUser)
- [x] Create `User.cs` entity:
  - [x] Id (Guid)
  - [x] Name (string)
  - [x] Email (string, unique)
  - [x] PasswordHash (string)
  - [x] Role (string, enum: "Secretary", "CommitteeMember")
  - [x] CommitteeMemberId (Guid, nullable, link to committee member)
  - [x] LanguagePreference (string, default: "en")
  - [x] CreatedAt (DateTime)
  - [x] UpdatedAt (DateTime)
  - [x] IsActive (bool)
  - [x] Navigation: Collection of Notes
  - [x] Navigation: Collection of AssignedTasks
- [x] Create `PushSubscription.cs` entity:
  - [x] Id (Guid)
  - [x] UserId (Guid, foreign key)
  - [x] Endpoint (string)
  - [x] P256dh (string)
  - [x] Auth (string)
  - [x] CreatedAt (DateTime)
  - [x] Navigation: User

### 2.2 Entity Framework DbContext (Fundarbok.Infrastructure)
- [x] Create `FundarbokDbContext.cs`
- [x] Add DbSet properties for all entities:
  - [x] DbSet<Committee> Committees
  - [x] DbSet<CommitteeMember> CommitteeMembers
  - [x] DbSet<Meeting> Meetings
  - [x] DbSet<MeetingParticipant> MeetingParticipants
  - [x] DbSet<AgendaItem> AgendaItems
  - [x] DbSet<Recommendation> Recommendations
  - [x] DbSet<Document> Documents
  - [x] DbSet<Conclusion> Conclusions
  - [x] DbSet<Note> Notes
  - [x] DbSet<AgendaTask> AgendaTasks
  - [x] DbSet<User> Users
  - [x] DbSet<PushSubscription> PushSubscriptions
- [x] Configure entity relationships in `OnModelCreating`:
  - [x] Committee → CommitteeMembers (one-to-many)
  - [x] Committee → Meetings (one-to-many)
  - [x] Meeting → AgendaItems (one-to-many)
  - [x] Meeting → MeetingParticipants (one-to-many)
  - [x] AgendaItem → Recommendations (one-to-many)
  - [x] AgendaItem → Documents (one-to-many)
  - [x] AgendaItem → Conclusions (one-to-many)
  - [x] AgendaItem → Notes (one-to-many)
  - [x] AgendaItem → Tasks (one-to-many)
  - [x] User → PushSubscriptions (one-to-many)
  - [x] User → Notes (one-to-many)
  - [x] User → Tasks (one-to-many, for assigned tasks)
- [x] Add indexes for performance:
  - [x] Email on User (unique)
  - [x] CommitteeId on Meeting
  - [x] MeetingId on AgendaItem
  - [x] UserId on Note
  - [x] AssignedUserId on Task
- [x] Configure column constraints (required fields, max lengths)
- [x] Add default values (CreatedAt, UpdatedAt)
- [x] Configure cascade delete rules appropriately

### 2.3 Database Migrations
- [x] Create initial migration (`dotnet ef migrations add InitialCreate`)
- [x] Review generated migration code
- [x] Apply migration to database (`dotnet ef database update`)
- [x] Verify tables created in pgAdmin (Tables: Committees, CommitteeMembers, Meetings, etc.)
- [x] Create seed data migration for:
  - [x] Default Committees (e.g., "Technical Committee", "Social Committee")
  - [x] Test User (admin/secretary role)
  - [x] Sample CommitteeMembers
- [x] Apply seed migration

**Test Credentials (seeded in database):**
- **Secretary**: `secretary@fundarbok.fo` / `password123`
- **Committee Member**: `jens@fundarbok.fo` / `password123`

---

**NOTE FOR ALL REMAINING PHASES:**
Throughout the rest of this document, all entity/class/variable names should use the English equivalents:
- Committee (not Nevnd)
- CommitteeMember (not Nevndarlimur)
- Meeting (not Fundur)
- AgendaItem (not Fundarpunktur)
- Document (not Skjal)
- Note (not Notat)
- Task (not Uppgáva)
- Recommendation (not Tilmæli)
- Conclusion (not Niðurstøða)
- User (not Brukari)

Services, Controllers, Repositories, and Components should follow this pattern.

---

## Phase 3: Backend API - Authentication & Authorization

### 3.1 Authentication Service (Fundarbok.Application)
- [ ] Create `IAuthService.cs` interface:
  - [ ] `Task<AuthResult> LoginAsync(string email, string password)`
  - [ ] `Task<AuthResult> RegisterAsync(RegisterRequest request)`
  - [ ] `Task<bool> ValidateTokenAsync(string token)`
- [ ] Create `AuthService.cs` implementation:
  - [ ] Implement password hashing with BCrypt
  - [ ] Implement JWT token generation
  - [ ] Configure token expiration (e.g., 24 hours)
  - [ ] Add refresh token logic (optional for v1)
- [ ] Create DTOs:
  - [ ] `LoginRequest.cs` (email, password)
  - [ ] `RegisterRequest.cs` (name, email, password, role)
  - [ ] `AuthResult.cs` (token, user info, expiration)

### 3.2 Authentication Controller (Fundarbok.API)
- [ ] Create `AuthController.cs`
- [ ] Add POST `/api/auth/login` endpoint
- [ ] Add POST `/api/auth/register` endpoint
- [ ] Add GET `/api/auth/me` endpoint (get current user)
- [ ] Add proper error handling and validation
- [ ] Add XML comments for Swagger documentation

### 3.3 JWT Configuration
- [ ] Configure JWT settings in `appsettings.json`:
  - [ ] Secret key (generate secure key)
  - [ ] Issuer
  - [ ] Audience
  - [ ] Expiration time
- [ ] Register JWT authentication in `Program.cs`
- [ ] Configure authentication middleware
- [ ] Test authentication with Swagger/Postman

### 3.4 Authorization
- [ ] Create authorization policies:
  - [ ] `SkrivariOnly` policy (Secretary role)
  - [ ] `NevndarlimurinOnly` policy (Committee member role)
  - [ ] `AuthenticatedUser` policy (any logged-in user)
- [ ] Create `[Authorize]` attributes for controllers
- [ ] Test role-based access control

---

## Phase 4: Backend API - Committee Management ✅

**NOTE:** Implemented using English naming (Committee, CommitteeMember) instead of Faroese (Nevnd, Nevndarlimur) as per naming conventions.

### 4.1 Committee Repository (Fundarbok.Infrastructure)
- [x] Create `ICommitteeRepository.cs` interface:
  - [x] `Task<IEnumerable<Committee>> GetAllAsync()`
  - [x] `Task<Committee> GetByIdAsync(Guid id)`
  - [x] `Task<Committee> CreateAsync(Committee committee)`
  - [x] `Task<Committee> UpdateAsync(Committee committee)`
  - [x] `Task<bool> DeleteAsync(Guid id)`
  - [x] `Task<IEnumerable<CommitteeMember>> GetMembersAsync(Guid committeeId)`
- [x] Create `CommitteeRepository.cs` implementation
- [x] Implement with EF Core queries
- [x] Add eager loading for related entities (Include)
- [x] Create `ICommitteeMemberRepository.cs` interface
- [x] Create `CommitteeMemberRepository.cs` implementation

### 4.2 Committee Service (Fundarbok.Application)
- [x] Create `ICommitteeService.cs` interface
- [x] Create `CommitteeService.cs` implementation
- [x] Add business logic validation:
  - [x] Check for duplicate committee names
  - [x] Validate committee member assignments
- [x] Create DTOs:
  - [x] `CommitteeDto.cs` (for responses)
  - [x] `CreateCommitteeRequest.cs`
  - [x] `UpdateCommitteeRequest.cs`
  - [x] `CommitteeMemberDto.cs`
  - [x] `CreateCommitteeMemberRequest.cs`
  - [x] `UpdateCommitteeMemberRequest.cs`
- [x] Add manual mapping methods

### 4.3 Committee Controller (Fundarbok.API)
- [x] Create `CommitteesController.cs`
- [x] Add GET `/api/Committees` endpoint (list all committees)
- [x] Add GET `/api/Committees/{id}` endpoint (get single committee)
- [x] Add POST `/api/Committees` endpoint (create committee) - Secretary only
- [x] Add PUT `/api/Committees/{id}` endpoint (update committee) - Secretary only
- [x] Add DELETE `/api/Committees/{id}` endpoint (delete committee) - Secretary only
- [x] Add GET `/api/Committees/{id}/members` endpoint (get committee members)
- [x] Add POST `/api/Committees/{id}/members` endpoint (add member) - Secretary only
- [x] Add PUT `/api/Committees/{id}/members/{memberId}` endpoint (update member) - Secretary only
- [x] Add DELETE `/api/Committees/{id}/members/{memberId}` endpoint (remove member) - Secretary only
- [x] Add validation and error handling
- [x] Test all endpoints with Swagger

---

## Phase 5: Backend API - Meeting Management - CORE SLICE ✅

**NOTE:** Implemented using English naming (Meeting, MeetingParticipant) instead of Faroese (Fundur, FundurLimur) as per naming conventions.

### 5.1 Meeting Repository (Fundarbok.Infrastructure)
- [x] Create `IMeetingRepository.cs` interface:
  - [x] `Task<IEnumerable<Meeting>> GetAllAsync()`
  - [x] `Task<Meeting> GetByIdAsync(Guid id)`
  - [x] `Task<Meeting> GetWithDetailsAsync(Guid id)` (include all related data)
  - [x] `Task<Meeting> CreateAsync(Meeting meeting)`
  - [x] `Task<Meeting> UpdateAsync(Meeting meeting)`
  - [x] `Task<bool> DeleteAsync(Guid id)`
  - [x] `Task<IEnumerable<Meeting>> GetByCommitteeIdAsync(Guid committeeId)`
  - [x] `Task<IEnumerable<MeetingParticipant>> GetParticipantsAsync(Guid meetingId)`
  - [x] `Task<MeetingParticipant> AddParticipantAsync(MeetingParticipant participant)`
  - [x] `Task<bool> RemoveParticipantAsync(Guid meetingId, Guid participantId)`
- [x] Create `MeetingRepository.cs` implementation
- [x] Add eager loading for:
  - [x] Committee
  - [x] MeetingParticipants → CommitteeMembers
  - [x] AgendaItems → Documents, Recommendations, Conclusions

### 5.2 Meeting Service (Fundarbok.Application)
- [x] Create `IMeetingService.cs` interface
- [x] Create `MeetingService.cs` implementation
- [x] Add business logic:
  - [x] Validate meeting dates (start before end)
  - [x] Auto-generate meeting numbers (e.g., "2/2025")
  - [x] Handle meeting status transitions (open → completed → approved)
  - [x] Validate participant assignments
  - [x] Prevent updates/deletes of approved meetings
- [x] Create DTOs:
  - [x] `MeetingDto.cs` (summary for list view)
  - [x] `MeetingDetailDto.cs` (full details with agenda items)
  - [x] `CreateMeetingRequest.cs`
  - [x] `UpdateMeetingRequest.cs`
  - [x] `UpdateMeetingStatusRequest.cs`
  - [x] `MeetingParticipantDto.cs`
  - [x] `AddParticipantRequest.cs`

### 5.3 Meeting Controller (Fundarbok.API)
- [x] Create `MeetingsController.cs`
- [x] Add GET `/api/Meetings` endpoint (list all meetings) - All authenticated users
- [x] Add GET `/api/Meetings/{id}` endpoint (get meeting summary)
- [x] Add GET `/api/Meetings/{id}/details` endpoint (get meeting with full details)
- [x] Add GET `/api/Meetings/committee/{committeeId}` endpoint (get meetings by committee)
- [x] Add POST `/api/Meetings` endpoint (create meeting) - Secretary only
- [x] Add PUT `/api/Meetings/{id}` endpoint (update meeting) - Secretary only
- [x] Add DELETE `/api/Meetings/{id}` endpoint (delete meeting) - Secretary only
- [x] Add PATCH `/api/Meetings/{id}/status` endpoint (change status) - Secretary only
- [x] Add GET `/api/Meetings/{id}/participants` endpoint (get participants)
- [x] Add POST `/api/Meetings/{id}/participants` endpoint (add participant) - Secretary only
- [x] Add DELETE `/api/Meetings/{id}/participants/{participantId}` endpoint (remove participant) - Secretary only
- [x] Add validation and error handling
- [x] Test all endpoints (tested with curl, successfully created and retrieved meetings)

---

## Phase 6: Backend API - Agenda Items (AgendaItem) ✅

**NOTE:** Implemented using English naming (AgendaItem) instead of Faroese (Fundarpunktur) as per naming conventions.

### 6.1 AgendaItem Repository (Fundarbok.Infrastructure)
- [x] Create `IAgendaItemRepository.cs` interface:
  - [x] `Task<IEnumerable<AgendaItem>> GetByMeetingIdAsync(Guid meetingId)`
  - [x] `Task<AgendaItem> GetByIdAsync(Guid id)`
  - [x] `Task<AgendaItem> GetWithDetailsAsync(Guid id)`
  - [x] `Task<AgendaItem> CreateAsync(AgendaItem agendaItem)`
  - [x] `Task<AgendaItem> UpdateAsync(AgendaItem agendaItem)`
  - [x] `Task<bool> DeleteAsync(Guid id)`
  - [x] `Task<bool> ReorderAsync(Guid meetingId, List<Guid> orderedIds)`
- [x] Create `AgendaItemRepository.cs` implementation
- [x] Include related entities (Recommendations, Documents, Conclusions, Notes, Tasks)

### 6.2 AgendaItem Service (Fundarbok.Application)
- [x] Create `IAgendaItemService.cs` interface
- [x] Create `AgendaItemService.cs` implementation
- [x] Add business logic:
  - [x] Auto-assign sequential numbers
  - [x] Handle reordering logic
  - [x] Validate agenda item belongs to meeting
- [x] Create DTOs:
  - [x] `AgendaItemDto.cs`
  - [x] `AgendaItemDetailDto.cs`
  - [x] `CreateAgendaItemRequest.cs`
  - [x] `UpdateAgendaItemRequest.cs`
  - [x] `ReorderAgendaItemsRequest.cs` (array of IDs in new order)
  - [x] `RecommendationDto.cs`
  - [x] `ConclusionDto.cs`
  - [x] `NoteDto.cs`
  - [x] `TaskDto.cs`
  - [x] `DocumentDto.cs`

### 6.3 AgendaItem Controller (Fundarbok.API)
- [x] Create `AgendaItemsController.cs`
- [x] Add GET `/api/agendaitems/meeting/{meetingId}` endpoint (list agenda items)
- [x] Add GET `/api/agendaitems/{id}` endpoint (get single item with details)
- [x] Add POST `/api/agendaitems/meeting/{meetingId}` endpoint (create) - Secretary only
- [x] Add PUT `/api/agendaitems/{id}` endpoint (update) - Secretary only
- [x] Add DELETE `/api/agendaitems/{id}` endpoint (delete) - Secretary only
- [x] Add POST `/api/agendaitems/meeting/{meetingId}/reorder` endpoint (reorder) - Secretary only
- [x] Register services in Program.cs
- [x] Test all endpoints (tested successfully with curl)

---

## Phase 7: Backend API - Document Management ✅

**NOTE:** Implemented using English naming (Document) instead of Faroese (Skjal) as per naming conventions.

### 7.1 File Storage Setup
- [x] Create `/uploads` folder in project root (for development)
- [x] Add `/uploads` to `.gitignore`
- [x] Create folder structure: `/uploads/agenda-items/{agendaItemId}/` or `/uploads/meetings/{meetingId}/`
- [x] Configure file upload limits in `Program.cs` (50MB)
- [x] Add file storage configuration to `appsettings.json`

### 7.2 Document Repository (Fundarbok.Infrastructure)
- [x] Create `IDocumentRepository.cs` interface:
  - [x] `Task<IEnumerable<Document>> GetByAgendaItemIdAsync(Guid agendaItemId)`
  - [x] `Task<IEnumerable<Document>> GetByMeetingIdAsync(Guid meetingId)`
  - [x] `Task<Document> GetByIdAsync(Guid id)`
  - [x] `Task<Document> CreateAsync(Document document)`
  - [x] `Task<Document> UpdateAsync(Document document)`
  - [x] `Task<bool> DeleteAsync(Guid id)`
- [x] Create `DocumentRepository.cs` implementation

### 7.3 File Storage Service (Fundarbok.Application)
- [x] Create `IFileStorageService.cs` interface:
  - [x] `Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder)`
  - [x] `Task<Stream> GetFileAsync(string filePath)`
  - [x] `Task<bool> DeleteFileAsync(string filePath)`
  - [x] `Task<bool> FileExistsAsync(string filePath)`
  - [x] `string GetFilePath(string folder, string fileName)`
- [x] Create `LocalFileStorageService.cs` implementation
- [x] Add file validation (size: 50MB, types: PDF, DOC, DOCX, Excel, images, text)

### 7.4 Document Service (Fundarbok.Application)
- [x] Create `IDocumentService.cs` interface
- [x] Create `DocumentService.cs` implementation
- [x] Add business logic:
  - [x] Validate file types (PDF, DOC, DOCX, Excel, images, text)
  - [x] Validate file size (max 50MB)
  - [x] Generate unique file names (GUID prefix)
  - [x] Track file metadata
- [x] Create DTOs:
  - [x] `DocumentDto.cs` (already exists)
  - [x] `UploadDocumentRequest.cs`
  - [x] `UpdateDocumentRequest.cs`

### 7.5 Document Controller (Fundarbok.API)
- [x] Create `DocumentsController.cs`
- [x] Add GET `/api/documents/agenda-item/{agendaItemId}` endpoint (list documents)
- [x] Add GET `/api/documents/meeting/{meetingId}` endpoint (list meeting-level documents)
- [x] Add POST `/api/documents/upload` endpoint (upload with multipart/form-data) - Secretary only
- [x] Add GET `/api/documents/{id}` endpoint (get document metadata)
- [x] Add GET `/api/documents/{id}/download` endpoint (download file)
- [x] Add GET `/api/documents/{id}/preview` endpoint (stream for preview)
- [x] Add PUT `/api/documents/{id}` endpoint (update metadata) - Secretary only
- [x] Add DELETE `/api/documents/{id}` endpoint (delete) - Secretary only
- [x] Implement multipart/form-data handling
- [x] Add proper content-type headers for downloads
- [x] Register services in Program.cs
- [x] Test file upload/download (tested successfully with curl)

---

## Phase 8: Backend API - Notes & Tasks ✅

**NOTE:** Implemented using English naming (Note, AgendaTask) instead of Faroese (Notat, Uppgáva) as per naming conventions.

### 8.1 Note Repository (Fundarbok.Infrastructure)
- [x] Create `INoteRepository.cs` interface
- [x] Create `NoteRepository.cs` implementation
- [x] Filter notes by user (committee members see only their own)

### 8.2 Note Service (Fundarbok.Application)
- [x] Create `INoteService.cs` interface
- [x] Create `NoteService.cs` implementation
- [x] Create DTOs:
  - [x] `NoteDto.cs`
  - [x] `CreateNoteRequest.cs`
  - [x] `UpdateNoteRequest.cs`

### 8.3 Note Controller (Fundarbok.API)
- [x] Create `NotesController.cs`
- [x] Add GET `/api/notes/agenda-item/{id}` endpoint (get user's notes)
- [x] Add GET `/api/notes/my` endpoint (get all user's notes)
- [x] Add POST `/api/notes/agenda-item/{id}` endpoint (create note)
- [x] Add PUT `/api/notes/{id}` endpoint (update note)
- [x] Add DELETE `/api/notes/{id}` endpoint (delete note)
- [x] Ensure users can only access their own notes

### 8.4 AgendaTask Repository & Service (Fundarbok.Infrastructure & Application)
- [x] Create `ITaskRepository.cs` interface
- [x] Create `TaskRepository.cs` implementation
- [x] Create `ITaskService.cs` interface
- [x] Create `TaskService.cs` implementation
- [x] Create DTOs:
  - [x] `TaskDto.cs`
  - [x] `CreateTaskRequest.cs`
  - [x] `UpdateTaskRequest.cs`

### 8.5 Task Controller (Fundarbok.API)
- [x] Create `TasksController.cs`
- [x] Add GET `/api/tasks/my` endpoint (get user's tasks)
- [x] Add GET `/api/tasks/agenda-item/{id}` endpoint (get tasks for agenda item)
- [x] Add POST `/api/tasks/agenda-item/{id}` endpoint (create task) - Secretary only
- [x] Add PATCH `/api/tasks/{id}/complete` endpoint (mark complete)
- [x] Add DELETE `/api/tasks/{id}` endpoint (delete) - Secretary only
- [x] Test all endpoints (tested successfully with curl)

---

## Phase 9: Backend API - Push Notifications

### 9.1 Push Subscription Service (Fundarbok.Application)
- [ ] Install `WebPush` NuGet package
- [ ] Generate VAPID keys (public/private):
  - [ ] Store in `appsettings.json` (secure for production)
- [ ] Create `IPushNotificationService.cs` interface:
  - [ ] `Task<bool> SubscribeAsync(Guid brukariId, PushSubscription subscription)`
  - [ ] `Task<bool> UnsubscribeAsync(Guid subscriptionId)`
  - [ ] `Task SendNotificationAsync(Guid brukariId, string title, string body, object data)`
  - [ ] `Task SendToMultipleAsync(List<Guid> brukariIds, string title, string body, object data)`
- [ ] Create `PushNotificationService.cs` implementation
- [ ] Create DTOs:
  - [ ] `PushSubscriptionDto.cs`
  - [ ] `NotificationPayloadDto.cs`

### 9.2 Push Controller (Fundarbok.API)
- [ ] Create `PushController.cs`
- [ ] Add GET `/api/push/vapid-public-key` endpoint (get public VAPID key)
- [ ] Add POST `/api/push/subscribe` endpoint (save subscription)
- [ ] Add DELETE `/api/push/unsubscribe` endpoint (remove subscription)
- [ ] Add POST `/api/push/test` endpoint (send test notification)

### 9.3 Notification Triggers
- [ ] Send notification when user assigned to meeting (in FundurService)
- [ ] Send notification when new task assigned (in UppgávaService)
- [ ] Send notification when meeting status changes (in FundurService)
- [ ] Add notification preferences (optional for v1)

---

## Phase 10: Frontend - Angular Project Structure ✅

### 10.1 Folder Structure Setup
- [x] Create `src/app/core` module with guards, interceptors, services folders
- [x] Create `src/app/shared` module with components, directives, pipes folders
- [x] Create `src/app/features` folder with auth, dashboard, meetings, committees modules
- [x] Create `src/app/models` folder for TypeScript interfaces

### 10.2 Core Services
- [x] Create `src/app/core/services/api.service.ts` (base HTTP service)
- [x] Create `src/app/core/services/auth.service.ts` with login, logout, token management
- [x] Create `src/app/core/services/committee.service.ts`
- [x] Create `src/app/core/services/meeting.service.ts`
- [x] Create `src/app/core/services/document.service.ts`
- [x] Create `src/app/core/services/translation.service.ts`
- [x] Create `src/app/core/interceptors/auth.interceptor.ts` with JWT token attachment
- [x] Create `src/app/core/interceptors/error.interceptor.ts` with error handling
- [x] Create `src/app/core/guards/auth.guard.ts`
- [x] Create `src/app/core/guards/role.guard.ts`

### 10.3 Models/Interfaces
- [x] Create TypeScript interfaces matching backend DTOs:
  - [x] `src/app/models/auth.model.ts`
  - [x] `src/app/models/committee.model.ts` (Committee, CommitteeMember)
  - [x] `src/app/models/meeting.model.ts` (Meeting, AgendaItem, MeetingParticipant, Recommendations, Conclusions, Tasks)
  - [x] `src/app/models/document.model.ts`

### 10.4 Shared Components & Pipes
- [x] Create `src/app/shared/pipes/translate.pipe.ts` (i18n support)
- [x] Create `src/app/shared/directives/has-role.directive.ts` (show/hide by role)
- [x] Create shared pages: ForbiddenComponent

---

## Phase 11: Frontend - Authentication (Login/Register) ✅

### 11.1 Auth Module
- [x] Created standalone auth components with routing
- [x] Create login component
- [x] Create register component
- [x] Updated app.routes.ts with auth routing

### 11.2 Login Component
- [x] Create login form with Angular Reactive Forms
  - [x] Email field (required, email validation)
  - [x] Password field (required)
  - [x] Submit button
- [x] Style with Angular Material (mat-form-field, mat-button)
- [x] Implement login logic with AuthService
- [x] Add loading state during login
- [x] Error handling with snackbar

### 11.3 Register Component
- [x] Create registration form
  - [x] Name field
  - [x] Email field
  - [x] Password field
  - [x] Confirm password field with validation
  - [x] Role selection (CommitteeMember, Secretary)
- [x] Implement registration logic
- [x] Navigate to dashboard on success

### 11.4 App Routing
- [x] Configure main app routing in `app.routes.ts`
  - [x] Redirect `/` to `/dashboard`
  - [x] `/login` (public)
  - [x] `/register` (public)
  - [x] `/dashboard` (protected)
  - [x] `/meetings` routes (protected with lazy loading)
  - [x] `/committees` routes (protected with lazy loading)
  - [x] Lazy load feature modules
- [x] Add auth guard to protected routes
- [x] Add role guard for secretary-only routes

---

## Phase 12: Frontend - Main Layout & Navigation ✅

### 12.1 Layout Component
- [x] Create `src/app/core/layout/main-layout/main-layout.component.ts`
- [x] Design layout with sidebar and top bar
  - [x] Sidebar navigation (hamburger menu via mat-sidenav-toggle)
  - [x] Top bar with user info and actions
  - [x] Content area (router-outlet)
- [x] Use Angular Material:
  - [x] mat-sidenav for sidebar
  - [x] mat-toolbar for top bar
  - [x] mat-icon for icons
  - [x] mat-nav-list for navigation items

### 12.2 Sidebar Navigation
- [x] Create navigation menu items:
  - [x] Dashboard (Meeting overview)
  - [x] Meetings
  - [x] Committees - Secretary only
  - [x] Settings
- [x] Add logout button
- [x] Implement role-based menu visibility with appHasRole directive
- [x] Add active route highlighting with routerLinkActive

### 12.3 Top Bar
- [x] Add language selector button with dropdown
- [x] Add user profile menu with logout
- [x] Added to main-layout component

---

## Phase 12.5: Translation System Setup (i18n) - OPTIONAL FOR LATER

**NOTE:** This phase can be implemented later as it's a secondary requirement. For initial development, use hardcoded English/Faroese text in components.

### 12.5.1 Translation File Structure
- [ ] Create `src/assets/i18n` folder
- [ ] Create `en.json` (English - default)
- [ ] Create `fo.json` (Faroese)
- [ ] Define translation file structure:
  ```json
  {
    "common": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete"
    },
    "meetings": {
      "title": "Meetings Overview",
      "create": "Create New Meeting"
    }
  }
  ```

### 12.5.2 Translation Service
- [ ] Create `src/app/core/services/translation.service.ts`:
  - [ ] `currentLanguage$: BehaviorSubject<string>` (default: 'en')
  - [ ] `translations: { [key: string]: any }` (loaded translations)
  - [ ] `loadTranslations(lang: string): Observable<any>`
  - [ ] `setLanguage(lang: string): void`
  - [ ] `translate(key: string): string` (supports nested keys like 'meetings.title')
  - [ ] Store selected language in localStorage
  - [ ] Load language on app init

### 12.5.3 Translation Pipe
- [ ] Create `src/app/shared/pipes/translate.pipe.ts`:
  - [ ] `transform(key: string): string`
  - [ ] Usage: `{{ 'meetings.title' | translate }}`
  - [ ] Mark as pure pipe for performance
- [ ] Add to SharedModule exports

### 12.5.4 Language Switcher Component
- [ ] Create `src/app/shared/components/language-switcher/language-switcher.component.ts`:
  - [ ] Dropdown/toggle for EN/FO
  - [ ] Call TranslationService.setLanguage() on change
  - [ ] Show current language
- [ ] Add to main layout (top bar or sidebar)

### 12.5.5 Initial Translations
- [ ] Populate `en.json` with all UI text from Figma
- [ ] Populate `fo.json` with Faroese translations
- [ ] Organize by feature module:
  - [ ] auth (login, register)
  - [ ] meetings (list, detail, create)
  - [ ] committees
  - [ ] documents
  - [ ] common (buttons, labels, messages)

---

## Phase 13: Frontend - Meetings List - MAIN SLICE ✅

**Design Reference:** Screenshot "Yvirlit yvir fundir" - Main meetings overview page with filters and table

### 13.1 Meetings Module Setup
- [x] Generate module: `ng generate module features/meetings --routing`
- [x] Create meeting service: `ng generate service features/meetings/services/meeting`
- [x] Implement MeetingService methods:
  - [x] `getMeetings(filters?: MeetingFilter): Observable<Meeting[]>` - GET /api/meetings with query params
  - [x] `getMeetingById(id: string): Observable<MeetingDetail>` - GET /api/meetings/{id}/details
  - [x] `createMeeting(request: CreateMeetingRequest): Observable<Meeting>` - POST /api/meetings
  - [x] `updateMeeting(id: string, request: UpdateMeetingRequest): Observable<Meeting>` - PUT /api/meetings/{id}
  - [x] `deleteMeeting(id: string): Observable<boolean>` - DELETE /api/meetings/{id}
  - [x] `updateMeetingStatus(id: string, status: UpdateMeetingStatusRequest): Observable<Meeting>` - PATCH /api/meetings/{id}/status
- [x] Create MeetingFilter interface with committeeId, startDate, endDate properties

### 13.2 Meetings List Component
- [x] Create component: `ng generate component features/meetings/meetings-list`
- [x] **Layout Structure (based on screenshot):**
  - [x] Page title: "Yvirlit yvir fundir" (Meetings Overview)
  - [x] **Top Filter Bar:**
    - [x] Committee dropdown - "Allar nevndir" (All Committees) with icon
    - [x] Start date picker - "01-01-2022" format with calendar icon
    - [x] End date picker - "31-08-2022" format with calendar icon
    - [x] "Stovna nýggjan nevnd" button (Create New Committee) - Secretary only, top right
    - [x] "Stovna nýggjan fund" button (Create New Meeting) - Secretary only, top right
  - [x] **Data Table with columns:**
    - [x] "Fundir/nevnd" (Meeting/Committee) - Committee name
    - [x] "Fundur #" (Meeting Number) - e.g., "1/2020", "5/2022"
    - [x] "Næsti fundur" (Next Meeting) - Date/time "19-08-2022 - 13:00"
    - [x] "Fundur leysgivin" (Meeting Approved) - Date "30-07-2022"
    - [x] "Frágreiðing um fundin" (Meeting Report) - Text description or title
    - [x] "Leysgivin" (Approved) - "ja" (yes) in black or "Nei" (no) in RED
  - [x] **Row Interactions:**
    - [x] Clickable rows - highlight on hover
    - [x] Navigate to meeting detail on row click
    - [x] Color coding: "Nei" text in red color for unapproved meetings
    - [x] Alternating row background (light gray/white)
- [x] **Implementation Details:**
  - [x] Use Angular Material Table (mat-table)
  - [x] Add table sorting on columns
  - [x] Filter meetings on committee/date change (reactive)
  - [x] Show loading spinner (mat-spinner) while fetching
  - [x] Handle empty state - "Eingir fundir funnir" message
  - [x] Apply responsive design - horizontal scroll on mobile

### 13.3 Committee Filter Dropdown
- [x] Create reusable committee select component or use mat-select directly
- [x] Load all committees from CommitteeService on component init
- [x] Default option: "Allar nevndir" (All Committees) - clears filter
- [x] Show committee name in dropdown
- [x] Emit selected committeeId to parent on change
- [x] Add document/list icon next to dropdown

### 13.4 Date Range Filters
- [x] Use Angular Material Datepicker (mat-datepicker)
- [x] Two separate date inputs: start date and end date
- [x] Calendar icon button to open picker
- [x] Format: "DD-MM-YYYY" (Faroese date format)
- [x] Start date defaults to beginning of year
- [x] End date defaults to current date
- [x] Emit date range to parent on change
- [x] Validate: end date must be after start date

### 13.5 Action Buttons (Secretary Only)
- [x] "Stovna nýggjan nevnd" button:
  - [x] Only visible for Secretary role (use *appHasRole="Secretary")
  - [x] Navigate to `/committees/new` route
  - [x] Styled as outlined button (secondary style)
- [x] "Stovna nýggjan fund" button:
  - [x] Only visible for Secretary role
  - [x] Navigate to `/meetings/new` route
  - [x] Styled as filled button (primary style)

### 13.6 Routing Configuration
- [x] Update `app.routes.ts` with meetings routes:
  - [x] `/meetings` → MeetingsListComponent (protected, all authenticated users)
  - [x] `/meetings/new` → CreateMeetingComponent (protected, Secretary only) - placeholder for Phase 15
  - [x] `/meetings/:id` → MeetingDetailComponent (protected, all authenticated users) - placeholder for Phase 14
- [x] Add route guards as needed
- [x] Set up lazy loading for meetings module

### 13.7 Styling & Polish
- [x] Match color scheme from screenshots:
  - [x] Dark navy sidebar (#1a2332 or similar)
  - [x] Cyan/teal accent color for "Fundarbók" branding
  - [x] Light gray backgrounds for table rows
  - [x] Red text (#d32f2f) for "Nei" status
- [x] Ensure responsive layout
- [x] Add hover effects on table rows
- [x] Style buttons to match screenshots

---

## Phase 14: Frontend - Meeting Details - MAIN SLICE ✅

**Design Reference:** Screenshot "Fundar síða TEKNISKANEVND Fundur nr. 5/2022" - Meeting detail page with agenda items sidebar

### 14.1 Meeting Detail Component
- [x] Create component: `ng generate component features/meetings/meeting-detail`
- [x] **Top Header Section:**
  - [x] Title row with three parts:
    - [x] Left: "Fundar síða" (Meeting Page) heading
    - [x] Center: Committee name "TEKNISKANEVND" in large text
    - [x] Center-right: Meeting number "Fundur nr. 5/2022"
    - [x] Right: "Nevndarlimir" button with users icon
  - [x] Info badges row:
    - [x] "Fundurin opin" (Meeting Open) badge with lock icon - cyan color
    - [x] "Fundardagur: 25-08-2022" (Meeting Date)
    - [x] "Fundarstaður: fundarhali: Com-Data" (Meeting Location)
  - [x] Action button (Secretary only):
    - [x] "STOVNA SKRÁ" (Create Document/Report) - cyan outlined button, top right

### 14.2 Left Sidebar - Agenda Items List
- [x] Create component: `ng generate component features/meetings/components/agenda-items-sidebar`
- [x] **Meeting Description Section:**
  - [x] Header: "Lýsing av fundinum" (Meeting Description) with circled number icon
  - [x] Display meeting description text
- [x] **Agenda Items List:**
  - [x] Numbered list items (1, 2, 3, etc.)
  - [x] Each item shows:
    - [x] Number badge (circled, dark background)
    - [x] Item title text (e.g., "Góðkenna seinasta fund")
    - [x] Status icons with counts (right-aligned):
      - [x] Document icon with count (e.g., "2", "4", "3") in dark circles
  - [x] Visual styling:
    - [x] Selected item: highlighted background (light blue/gray)
    - [x] Hover effect on items
    - [x] Adequate padding and spacing
  - [x] Add new agenda item button (Secretary only):
    - [x] Circular "+" button at bottom of list

### 14.3 Main Content Area - Agenda Item Detail
- [x] Create component: `ng generate component features/meetings/components/agenda-item-detail`
- [x] **Agenda Item Header:**
  - [x] Section title "Nevndar fundur í teknisku nevnd" (Committee meeting in technical committee)
- [x] **Content Sections:**
  - [x] Display agenda item title and description
  - [x] "Niðurstøða" (Conclusions) section:
    - [x] Header in red text
    - [x] List of conclusion items with timestamps
    - [x] Format: "Skrá leysgivin DD-MM-YYYY kl. HH:MM av Name"
  - [x] Recommendations section with numbered list
  - [x] Notes section
  - [x] Tasks section with completion status
- [x] **Action Buttons Row (bottom of content):**
  - [x] Circular "+" button (add new item)
  - [x] "Niðurstøða" button (Add Conclusion) - outlined, red accent
  - [x] "Notat" button (Add Note) - outlined
  - [x] "Uppgáva" button (Add Task) - outlined, cyan accent
  - [x] "Prenta fundin" button (Print Meeting) - outlined
  - [x] "Avrifa til annað mál" button (Forward to another case) - outlined

### 14.4 Document Preview Row (Bottom)
- [x] **Document Cards:**
  - [x] Row of 6 document preview cards
  - [x] Each card shows:
    - [x] Document icon (page icon)
    - [x] Document title/description below (small text)
  - [x] Clickable to open document preview
  - [x] Horizontal scroll if more than 6 documents

### 14.5 Bottom Action Bar
- [x] **Status Control Buttons (Secretary only):**
  - [x] "Fundur ikki leysgivin" badge/button (Meeting Not Approved) - outlined, left side
  - [x] "Loka fundin" button (Close Meeting) - filled, cyan color
- [x] **Document Template Input:**
  - [x] Text input: "Legg fleiri standardskriv til fundin" (Add more standard documents to meeting)
  - [x] Link icon button
  - [x] Attachment icon button
- [x] **Navigation/Save Buttons:**
  - [x] "AFTUR" button (Back) - outlined, bottom right
  - [x] "GOYM" button (Save) - filled, dark background, bottom right

### 14.6 Meeting Participants Dialog ✅
- [x] Create dialog component: `ng generate component features/meetings/dialogs/participants-dialog`
- [x] **Dialog triggered by "Nevndarlimir" button**
- [x] **Dialog Content:**
  - [x] Header: Committee name displayed
  - [x] Action button: "Tilluta atgongd" (Grant Access) with "+" and user icon
  - [x] Committee description display (read-only)
  - [x] **Participants Table:**
    - [x] Columns: Navn (Name), Heiti (Title), Role, Participating (toggle)
    - [x] Each row shows member details
    - [x] "Participating" toggle switch (mat-slide-toggle) - Secretary can edit
    - [x] Multiple rows for committee members
- [x] **Grant Access Dialog (nested):**
  - [x] User selection checklist showing committee members
  - [x] Names with checkboxes (already participants shown as pre-checked/disabled)
  - [x] Add selected members as meeting participants

### 14.7 Component Logic & State Management
- [x] Load meeting details on component init (route param id)
- [x] Load agenda items for the meeting
- [x] Track selected agenda item (highlight in sidebar)
- [x] Load documents for selected agenda item
- [x] Handle agenda item selection - update main content area
- [x] Auto-select first agenda item on load
- [x] Handle meeting status changes (open/closed/approved)
- [x] Manage permissions - hide Secretary-only elements for committee members
- [ ] Implement auto-save or manual save (GOYM button) - placeholder created, backend integration needed

### 14.8 Responsive Design
- [x] Desktop: Sidebar + main content side-by-side
- [x] Tablet: Collapsible sidebar
- [x] Mobile: Stacked layout, sidebar as bottom sheet or drawer

---

## Phase 15: Frontend - Create/Edit Meeting - Secretary Only ✅

**Design Reference:** Screenshot "Stovna fund" - Meeting creation form

### 15.1 Create Meeting Component
- [x] Create component: `ng generate component features/meetings/create-meeting`
- [ ] **Page Header:**
  - [ ] Title: "Stovna fund" (Create Meeting)
  - [ ] Breadcrumb or back navigation
  - [ ] Exit fullscreen hint: "To exit full screen, press and hold Esc"
- [x] **Form Fields (Angular Reactive Forms):**
  - [x] **Nevnd (Committee)** - Required:
    - [x] mat-select dropdown
    - [x] Load all committees from API
    - [x] Option to create new committee inline
  - [x] **Yvirskrift/heiti (Title/Heading)** - Optional:
    - [x] Text input field
  - [x] **Fundarstaður (Meeting Location)** - Required:
    - [x] Text input field
  - [x] **Byrjunar dato (Start Date/Time)** - Required:
    - [x] Date picker (mat-datepicker)
    - [x] Hour/minute dropdowns (0-23 hours, 0-59 minutes)
    - [x] Calendar icon button to open date picker
  - [x] **Enda dato (End Date/Time)** - Required:
    - [x] Date picker (mat-datepicker)
    - [x] Hour/minute dropdowns
  - [x] **Lýsing av fundinum (Meeting Description)** - Optional:
    - [x] Large textarea (mat-form-field with textarea)
- [x] **Bottom Action Buttons:**
  - [x] "Cancel" button - outlined, left side
  - [x] "Save" button - filled, primary color, right side
  - [x] Full-width button row at bottom

### 15.2 Form Validation & Logic
- [x] Implement form validation rules:
  - [x] Committee: required
  - [x] Location: required
  - [x] Start date: required
  - [x] Start time: required (hours/minutes)
  - [x] End date: required
  - [x] End time: required (hours/minutes)
- [x] Show validation errors:
  - [x] Required field indicators
  - [x] Error messages below invalid fields
  - [x] Disable submit button if form invalid
- [x] Meeting number auto-generated by backend

### 15.3 Component Behavior
- [x] Load committees on component init
- [x] On "Save" click:
  - [x] Validate form
  - [x] Call MeetingService.createMeeting()
  - [x] Show loading spinner on button
  - [x] On success: Navigate to meeting detail page
  - [x] On error: Show error snackbar/toast
- [x] On "Cancel" click:
  - [x] Navigate back to meetings list

### 15.4 Edit Meeting Component
- [x] Reuse MeetingFormComponent with edit mode flag
- [x] Load existing meeting data via route param
- [x] Pre-populate all form fields
- [x] Change page title to "Edit Meeting"
- [x] Call MeetingService.updateMeeting() on save
- [x] Added route `/meetings/:id/edit`

### 15.5 Features Implemented
- [x] Single form component for create/edit
- [x] Inline committee creation via dialog
- [x] Full date/time handling with separate hour/minute controls
- [x] Responsive layout with mobile support
- [x] Material Design components throughout
- [x] API integration with error handling
- [x] Loading states and user feedback
- [x] Edit button added to meeting detail page (Secretary only)
- [x] Edit navigation working: `/meetings/:id/edit`

### 15.6 File Attachment Handling - DEFERRED
- [ ] Implement file upload preview (deferred to Phase 16)
- [ ] Support multiple files (deferred to Phase 16)
- [ ] Show file list with remove option (deferred to Phase 16)

---

## Phase 16: Frontend - Document Upload & Preview ✅

**NOTE:** Implemented with full drag & drop, file validation, PDF/image preview, and integration into meeting detail page.

### 16.1 Document Upload Dialog Component ✅
- [x] Created `DocumentUploadDialogComponent` with drag & drop support
- [x] Implemented features:
  - [x] Drag & drop file upload area with visual feedback
  - [x] Click to browse file selection
  - [x] Multiple file selection support
  - [x] File validation (PDF, DOC, DOCX, XLS, XLSX, images, TXT)
  - [x] File size validation (max 50MB)
  - [x] File preview list with size display
  - [x] Remove file capability before upload
  - [x] Upload progress indicator
  - [x] Public/private document toggle
  - [x] Name and description fields
- [x] Full integration with DocumentService
- [x] Material Design styling throughout

### 16.2 Document Preview Component ✅
- [x] Created `DocumentPreviewComponent` with multiple format support
- [x] Implemented features:
  - [x] PDF inline preview using iframe
  - [x] Image preview with proper scaling
  - [x] Download button for all document types
  - [x] Unsupported file type handling
  - [x] Document metadata display (filename, size, type, description)
  - [x] Loading and error states
  - [x] Fullscreen dialog presentation
- [x] Integrated with DocumentService for blob streaming
- [x] Safe URL handling with DomSanitizer

### 16.3 Document List Component ✅
- [x] Created `DocumentListComponent` with card-based grid layout
- [x] Implemented features:
  - [x] Document cards with appropriate icons (PDF, Word, Excel, images, etc.)
  - [x] File size display in human-readable format
  - [x] Click to preview functionality
  - [x] Delete button (Secretary only, hover-reveal)
  - [x] Public/locked status badges
  - [x] Responsive grid layout
  - [x] Empty state handling
  - [x] Hover effects and transitions
- [x] Full event-based integration with parent components

### 16.4 Integration with Meeting Detail Page ✅
- [x] Added document section to AgendaItemDetailComponent
- [x] Upload button (Secretary only)
- [x] Document list display
- [x] Event handlers for upload, preview, and delete
- [x] Integrated with MeetingDetailComponent
- [x] Document count display
- [x] Permission-based UI elements
- [x] Reload meeting data after document operations

### 16.5 Features Completed ✅
- [x] DocumentService with full API integration (upload, download, preview, delete)
- [x] File validation (size: 50MB, types: PDF, DOC, DOCX, XLS, XLSX, images, TXT)
- [x] Drag & drop file upload with visual feedback
- [x] PDF and image preview in dialogs
- [x] Document metadata management
- [x] Role-based access control (Secretary only for uploads/deletes)
- [x] Error handling and user feedback via snackbar
- [x] Translation keys added for documents
- [x] Responsive design throughout
- [x] Material Design components
- [x] Clean, maintainable code structure

### 16.6 Testing Status ✅
- [x] Frontend build successful (no errors)
- [x] Backend running on port 5255
- [x] Frontend running on port 4200
- [x] All components integrated properly
- [x] Ready for end-to-end testing

**NOTE:** For future enhancement, can install ngx-extended-pdf-viewer for advanced PDF viewing features like zoom, rotation, page navigation, etc.

---

## Phase 17: Frontend - Fundarpunktur (Agenda Item) Management - Secretary ✅

**NOTE:** Implemented with English naming (AgendaItem) as per conventions.

### 17.1 Create Agenda Item Component
- [x] Create dialog component: `ng g component features/meetings/dialogs/agenda-item-dialog`
- [x] Design form:
  - [x] Heiti (Title) field with validation
  - [x] Málslýsing (Description) textarea
  - [x] "GOYM" (Save) and "AFTUR" (Cancel) buttons
- [x] Create AgendaItemService:
  - [x] `createAgendaItem(meetingId: string, request): Observable<AgendaItem>`
  - [x] `updateAgendaItem(id: string, request): Observable<AgendaItem>`
  - [x] `deleteAgendaItem(id: string): Observable<boolean>`
  - [x] `reorderAgendaItems(meetingId: string, request): Observable<boolean>`
- [x] Call API on submit
- [x] Refresh agenda list after creation
- [x] Snackbar notifications for success/error

### 17.2 Edit Agenda Item Component
- [x] Reuse dialog component in edit mode
- [x] Enable edit via button click in agenda detail header (Secretary only)
- [x] Pre-populate form with existing data
- [x] Save changes on "GOYM" button
- [x] Cancel edit mode on "AFTUR" button

### 17.3 Reorder Agenda Items
- [x] Add drag & drop support for agenda items:
  - [x] Use Angular CDK Drag Drop module (@angular/cdk already installed)
  - [x] Implement cdkDragDrop directive on sidebar list
  - [x] cdkDragHandle for drag indicator (Secretary only)
  - [x] Visual feedback during drag (preview, animations)
- [x] Save new order on drop
- [x] API integration with reorder endpoint
- [x] Snackbar notification on reorder
- [x] Reload meeting to reflect new order

### 17.4 Delete Agenda Item
- [x] Add delete button in agenda detail header (Secretary only)
- [x] Show confirmation dialog (native confirm)
- [x] Call API to delete
- [x] Clear selected item and refresh on success
- [x] Error handling with snackbar

### 17.5 Features Implemented
- [x] AgendaItemService with full CRUD operations
- [x] AgendaItemDialogComponent for create/edit
- [x] Edit/delete buttons in AgendaItemDetailComponent
- [x] Drag handle in AgendaItemsSidebarComponent
- [x] CDK drag & drop with proper styling
- [x] Role-based UI elements (Secretary only)
- [x] Material Design tooltips on action buttons
- [x] Proper error handling and user feedback
- [x] All operations tested and working

---

## Phase 18: Frontend - Stovna Skrá (Create Document/Report)

**Design Reference:** Screenshots "Stovna skrá" - Complex document creation form with journal integration

### 18.1 Stovna Skrá Component
- [ ] Create component: `ng generate component features/meetings/create-document`
- [ ] **Page Header:**
  - [ ] Title: "Stovna skrá" (Create Document/Report)
  - [ ] Committee name: "TEKNISKANEVND"
  - [ ] Meeting number: "Fundur nr. 5/2022"
  - [ ] "Lukkað/ur fundur" (Closed Meeting) toggle switch - top right
- [ ] **Form Fields:**
  - [ ] **Navn (Document Name/Title):**
    - [ ] Text input
    - [ ] Placeholder: "Skriva navn á mál / punkt, ið skal verða á skránni ella innles frá journal"
  - [ ] **Heinta mál frá Journal (Fetch Case from Journal):**
    - [ ] Search input field with search icon button
    - [ ] Placeholder: "Trýst á leinkju og leita eftir journal nummar í Nema Journal"
    - [ ] Opens journal search modal (see 18.2)
  - [ ] **Målslýsing (Case Description):**
    - [ ] Large textarea
    - [ ] Placeholder: "Skriva frágreiðing um málið í tekst boksina her ella trýst á leinkjuna omanfyri, fyri at heinta málslýsing frá journalini"
    - [ ] Search icon button to fetch from journal
  - [ ] **Heinta tilmæli (Fetch Recommendation):**
    - [ ] Search field
    - [ ] Placeholder: "Leita í journalini eftir tilmæli"
    - [ ] Search icon button
  - [ ] **Nummar í fundarskrá (Document Number in Meeting Report):**
    - [ ] Number input/selector with up/down arrows
    - [ ] Placeholder: "Skriva hvat nummar punktið skal vera á skránni ella trýst á listan"
    - [ ] Auto-increments based on existing documents
  - [ ] **Fundarstaður (Meeting Location/Author):**
    - [ ] Text input
    - [ ] Placeholder: "Skriva fundarstað"
  - [ ] **Legg skjal inn frá Journal (Add Documents from Journal):**
    - [ ] File upload area with cloud upload icon
    - [ ] Placeholder: "Leita í journalini eftir skjølum"
    - [ ] Supports drag & drop or click to browse
- [ ] **Document List Section:**
  - [ ] Numbered document items (1, 2, 3...)
  - [ ] Each item shows:
    - [ ] Number badge on left
    - [ ] Document title/name
    - [ ] Icon row on right:
      - [ ] Web/globe icon (for public web access)
      - [ ] Search/preview icon
      - [ ] Lock icon (for locked/private documents)
      - [ ] Checkbox (for selection)
  - [ ] Example documents shown in screenshot:
    - [ ] "Umsókn um byggiloyvl" (Building permit application)
    - [ ] "Tekning uppá bygningin" (Building drawing)
- [ ] **Leinkja til web síðu (Link to Web Page):**
  - [ ] URL input field
  - [ ] Link icon button
  - [ ] Placeholder: "www.nema.fo/fundarskipan.fo"
  - [ ] Globe/search icon for validation
- [ ] **Bottom Action Buttons:**
  - [ ] "AFTUR" (Back) - outlined, left
  - [ ] "GOYM" (Save) - filled, dark, right

### 18.2 Journal Search Modal
- [ ] Create dialog component: `ng generate component features/documents/dialogs/journal-search-dialog`
- [ ] **Modal Header:**
  - [ ] Title: "VEL SKJØL" (Choose Documents) shown in green banner
  - [ ] Close button (X)
- [ ] **Search Section:**
  - [ ] Search input: "Leita..." (Search...)
  - [ ] Close icon to clear search
  - [ ] Filter checkboxes:
    - [ ] "Vís strika/ar journalir" (Show strict journals)
    - [ ] "Víðkað leiting" (Expanded search)
- [ ] **Results Table:**
  - [ ] Columns:
    - [ ] Checkbox (for multi-select)
    - [ ] Journalnummar (Journal Number) - e.g., "215-1-2020", "340-1-2020"
    - [ ] Heiti (Title/Description) - Long text descriptions
    - [ ] Journalplan (Journal Plan) - e.g., "Figgjarløvlskifti og ognir - Fastar ognir v.m..."
    - [ ] Deild (Department) - e.g., "Givin", "Mentan, Stuðul til féløg"
    - [ ] Skrásett (Registered/Created Date) - e.g., "9. sep. 2020", "8. sep. 2020"
  - [ ] Sortable columns (click header to sort)
  - [ ] Highlighted/selected rows
  - [ ] Pagination if many results (386 urslit shown)
- [ ] **Action Button:**
  - [ ] "Vel journal" (Choose Journal) button - cyan/green color
  - [ ] Positioned top right or bottom right
  - [ ] Enabled only when items selected
- [ ] **For v1 Implementation:**
  - [ ] Show placeholder message: "Journal integration coming in v2"
  - [ ] Allow manual entry instead
  - [ ] Or implement basic search if journal API available

### 18.3 Document Selection Modal (Vel Skjøl)
- [ ] Create dialog component: `ng generate component features/documents/dialogs/document-selection-dialog`
- [ ] **Modal shown when "Legg skjal inn frá Journal" clicked**
- [ ] **Header:**
  - [ ] "VEL SKJØL" title in green banner
- [ ] **Search/Filter:**
  - [ ] "Leita..." search input
  - [ ] Filter by document type/owner
- [ ] **Document Table:**
  - [ ] Columns:
    - [ ] Checkbox
    - [ ] AktNr (Activity Number) - 1, 2, 3, 4, 5, 6, 7
    - [ ] Lýsing (Description) - Document names
    - [ ] Reist av (Created By) - Names like "Landsverk", "Á Skulatrøð", "Jens Jensen"
    - [ ] Skjal (Document) - Icon indicating document type
  - [ ] Row selection with checkboxes
  - [ ] Icons for web access (globe) and email
- [ ] **Actions:**
  - [ ] Multi-select capability
  - [ ] Preview document on row click
  - [ ] Confirm selection button

### 18.4 Component Logic
- [ ] Load meeting context (committee, meeting number)
- [ ] Fetch existing documents for numbering
- [ ] Handle journal search integration (if available)
- [ ] Handle file uploads (drag & drop, click to browse)
- [ ] Validate URLs for web links
- [ ] Generate document metadata
- [ ] Save document to agenda item or meeting
- [ ] Update document list after save

### 18.5 Integration Points
- [ ] Connect to DocumentService for file uploads
- [ ] Connect to JournalService for journal search (v2)
- [ ] Link documents to specific agenda items
- [ ] Support document versioning/locking
- [ ] Handle public/private document access flags

---

## Phase 19: Frontend - Niðurstøður, Notat, Uppgávur Dialogs ✅

**NOTE:** Implemented with simplified dialogs focusing on core functionality. Advanced features like "Forward to another committee" deferred to future phases.

### 19.1 Conclusion Dialog Component
- [x] Created `ConclusionDialogComponent` (conclusion-dialog)
- [x] Designed dialog with:
  - [x] Title: Create/Edit Conclusion
  - [x] Textarea for conclusion text
  - [x] Save and Cancel buttons
  - [x] Hint text for users
- [x] Created `ConclusionService` for API integration
- [x] Integrated with MeetingDetailComponent
- [x] Save conclusion on submit
- [x] Close dialog and refresh meeting data
- [x] Tested successfully via API

### 19.2 Note Dialog Component
- [x] Created `NoteDialogComponent` (note-dialog)
- [x] Designed dialog with:
  - [x] Title: Create/Edit Note
  - [x] Textarea for note text (private to current user)
  - [x] Save and Cancel buttons
  - [x] Hint text indicating note is private
- [x] Created `NoteService` for API integration
- [x] Integrated with MeetingDetailComponent
- [x] Save note (private to current user)
- [x] Close dialog and refresh
- [x] Tested successfully via API

### 19.3 Task Dialog Component
- [x] Created `TaskDialogComponent` (task-dialog)
- [x] Designed dialog with:
  - [x] Title: Create/Edit Task
  - [x] Textarea for task description
  - [x] User assignment dropdown (populated from meeting participants)
  - [x] Optional due date picker (Material Datepicker)
  - [x] Save and Cancel buttons
  - [x] Hint text about notifications
- [x] Created `TaskService` for API integration
- [x] Integrated with MeetingDetailComponent
- [x] Assign task to selected user
- [x] Close dialog and refresh
- [x] Tested successfully via API

### 19.4 Features Implemented
- [x] All three dialog components created and working
- [x] Full CRUD services for Conclusions, Notes, and Tasks
- [x] Integrated with MeetingDetailComponent event handlers
- [x] Material Design components throughout
- [x] Form validation on all dialogs
- [x] API integration with error handling
- [x] Translation keys added to en.json
- [x] User feedback via snackbar notifications
- [x] All dialogs tested end-to-end via API calls

### 19.5 Deferred Features (Future Enhancement)
- [ ] "Forward to another committee" button
- [ ] "Select responsible" button for additional assignment
- [ ] Push notification on task assignment (Phase 9)
- [ ] Advanced date/responsibility selection for conclusions

---

## Phase 20: Frontend - Approve & Close Meeting Workflow ✅

### 20.1 Close Meeting Confirmation ✅
- [x] Create dialog: `CloseMeetingDialogComponent`
- [x] Design confirmation dialog:
  - [x] Title: "Close Meeting?"
  - [x] Message: Clear explanation of closing impact
  - [x] Checklist of incomplete items (validation)
  - [x] "Cancel", "Close Meeting" buttons
- [x] Validate meeting completeness:
  - [x] All agenda items must have at least one conclusion
  - [x] Show validation error if any items missing conclusions
- [x] Call MeetingService.updateStatus(id, 'completed')
- [x] Update UI on success with snackbar notification

### 20.2 Approve Meeting Confirmation ✅
- [x] Create dialog: `ApproveMeetingDialogComponent`
- [x] Design comprehensive approval dialog:
  - [x] Title: "Approve and Lock Meeting"
  - [x] Message explaining consequences and journal sync
  - [x] Checklist showing all agenda items with completion status
  - [x] Toggle: "Notify participants about meeting approval"
  - [x] Confirmation question with radio buttons (Yes/No)
  - [x] "Cancel", "Approve Meeting" buttons
- [x] Validate all items completed (must be closed first)
- [x] Call MeetingService.updateStatus(id, 'approved')
- [x] Lock meeting from further edits
- [x] Show success message with snackbar
- [x] Reload meeting data to reflect new status

### 20.3 Integration ✅
- [x] Added imports to MeetingDetailComponent
- [x] Implemented closeMeeting() method
- [x] Implemented approveMeeting() method
- [x] Added event handlers for dialog results
- [x] Proper error handling and user feedback
- [x] Status updates trigger meeting reload

### 20.4 Translation Keys ✅
- [x] Added English translations for close workflow
- [x] Added English translations for approve workflow
- [x] Added Faroese translations for close workflow
- [x] Added Faroese translations for approve workflow
- [x] Added yes/no translations to common.ui

---

## Phase 21: Frontend - Committee Member View (Limited) ✅

### 21.1 My Meetings View ✅
- [x] Create component: `MyMeetingsComponent`
- [x] Show only meetings assigned to current user
- [x] Filter by upcoming/past meetings
- [x] Simplified view:
  - [x] Committee name
  - [x] Date/time
  - [x] Location
  - [x] Status badge (open/completed/approved)
- [x] Click to view meeting details (read-only)
- [x] Responsive table layout with Material Design
- [x] Empty state messaging

### 21.2 Read-Only Meeting Detail ✅
- [x] Meeting detail component already supports read-only viewing
- [x] Non-Secretary users see existing meeting details
- [x] Allow viewing documents ✓ (already supported)
- [x] Allow adding personal notes ✓ (already supported via NoteService)
- [x] Allow marking tasks as complete ✓ (already supported via TaskService.toggleComplete())
- [x] Edit/close/approve buttons hidden for non-Secretaries via *appHasRole directive

### 21.3 My Tasks View ✅
- [x] Create component: `MyTasksComponent`
- [x] List tasks assigned to current user
- [x] Group by:
  - [x] Pending (incomplete)
  - [x] Completed (checked off)
- [x] Show:
  - [x] Task description
  - [x] Related meeting link
  - [x] Due date with smart formatting (overdue, due today, due in N days)
  - [x] Complete checkbox with visual indicator
- [x] Update task status on checkbox change with snackbar feedback
- [x] Sort pending tasks by due date (earliest first)
- [x] Responsive design with empty states

### 21.4 Translations ✅
- [x] Added English translations for My Meetings
- [x] Added English translations for My Tasks
- [x] Added Faroese translations for My Meetings
- [x] Added Faroese translations for My Tasks

### 21.5 Routing ✅
- [x] Added `/meetings/my-meetings` route
- [x] Added `/meetings/my-tasks` route
- [x] Both routes use lazy loading
- [x] Integrated with existing authentication guards

---

## Phase 22: PWA Configuration ✅

### 22.1 Service Worker Setup ✅
- [x] Verify `@angular/pwa` is installed (done in setup)
- [x] Review and update `ngsw-config.json`:
  - [x] Configure asset groups (app shell, lazy bundles)
  - [x] Configure data groups (API calls for meetings, documents, committees, agenda items, notes, tasks)
  - [x] Set cache strategies (network-first for freshness)
- [x] Service worker registration enabled in production mode

### 22.2 Web App Manifest ✅
- [x] Configure `manifest.webmanifest`:
  - [x] App name: "Fundarbók - Meeting Management"
  - [x] Short name: "Fundarbók"
  - [x] Description: "PWA for managing committee meetings and agendas"
  - [x] Theme color: #00bcd4 (cyan/teal brand color)
  - [x] Background color: #ffffff
  - [x] Icons (all sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
  - [x] Display mode: "standalone"
  - [x] Start URL: "/"
- [x] Icons already exist in `src/assets/icons/`

### 22.3 Push Notification Setup ✅
- [x] Create `src/app/core/services/notification.service.ts`
- [x] Implement methods:
  - [x] `requestNotificationPermission(): Promise<boolean>`
  - [x] `disableNotifications(): Promise<boolean>`
  - [x] `isEnabled(): Observable<boolean>`
  - [x] `isSubscriptionActive(): Observable<boolean>`
- [x] SwPush subscription management
- [x] Backend integration with PushNotificationService
- [x] Generate VAPID keys (stored in appsettings.json)
- [x] Create PushNotificationService in backend
- [x] Create PushController with endpoints:
  - [x] GET /api/push/vapid-public-key
  - [x] POST /api/push/subscribe
  - [x] DELETE /api/push/unsubscribe
  - [x] POST /api/push/test
- [x] Register services in Program.cs

### 22.4 Service Worker Update Service ✅
- [x] Create `src/app/core/services/sw-update.service.ts`
- [x] Implement methods:
  - [x] Check for updates periodically
  - [x] Listen for VERSION_READY events
  - [x] Show update notification snackbar
  - [x] Activate updates on user action
  - [x] Reload app with new version

### 22.5 UI Components ✅
- [x] Create `NotificationPromptComponent`:
  - [x] Show on first login (after 2 second delay)
  - [x] Snackbar with "Enable" action
  - [x] Handle permission grant/deny
  - [x] Show success/error feedback
- [x] Create `OfflineIndicatorComponent`:
  - [x] Show banner when offline
  - [x] Track navigator.onLine status
  - [x] Yellow warning color scheme
  - [x] Cloud off icon
- [x] Integrate into MainLayoutComponent
  - [x] Added to template
  - [x] Positioned at top and in snackbar area

### 22.6 Offline Support ✅
- [x] Configure ngsw-config.json with dataGroups:
  - [x] Meetings API (network-first, 1h cache)
  - [x] Documents API (network-first, 24h cache)
  - [x] Committees API (network-first, 24h cache)
  - [x] Agenda Items API (network-first, 1h cache)
  - [x] Notes/Tasks API (network-first, 30m cache)
- [x] OfflineIndicatorComponent shows when offline
- [x] Service worker caches responses automatically

### 22.7 Configuration ✅
- [x] Add VAPID keys to appsettings.json (Development & Production)
- [x] Add VAPID public key to environment.ts and environment.prod.ts
- [x] Initialize services in app.config.ts
- [x] Add translation keys for PWA features (en.json, fo.json)

### 22.8 Build & Testing ✅
- [x] Frontend builds successfully (no TypeScript errors)
- [x] Backend builds successfully (no compilation errors)
- [x] All services registered and injected properly
- [x] Service worker registered for production builds
- [x] Manifest properly configured with all icons

---

## Phase 23: Styling & Theming

### 23.1 Angular Material Theme
- [ ] Create custom theme in `src/styles/theme.scss`:
  - [ ] Define primary color palette (teal/cyan from Figma)
  - [ ] Define accent color
  - [ ] Define warn color (red)
  - [ ] Configure typography
- [ ] Apply theme to application
- [ ] Override Material component styles as needed

### 23.2 Global Styles
- [ ] Create `src/styles/variables.scss`:
  - [ ] Colors
  - [ ] Spacing units
  - [ ] Breakpoints
  - [ ] Typography scales
- [ ] Create utility classes in `src/styles/utilities.scss`
- [ ] Import in `styles.scss`

### 23.3 Responsive Design
- [ ] Test on mobile (320px, 375px, 425px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1440px, 1920px)
- [ ] Adjust layouts for different screen sizes:
  - [ ] Sidebar: toggle on mobile, permanent on desktop
  - [ ] Tables: horizontal scroll on mobile
  - [ ] Forms: stack on mobile, grid on desktop
- [ ] Use Angular Flex Layout or CSS Grid

### 23.4 Faroese Language Support
- [ ] Ensure all UI text is in Faroese
- [ ] Review translations with native speaker (if possible)
- [ ] Add i18n support for future multi-language (optional)
- [ ] Use `@angular/localize` if needed

### 23.5 Component-Specific Styling
- [ ] Style meeting list table (matching Figma)
- [ ] Style meeting detail layout (sidebar + content)
- [ ] Style forms (matching Figma design)
- [ ] Style dialogs/modals
- [ ] Style buttons (primary, secondary, danger)
- [ ] Add hover/focus states
- [ ] Add loading states
- [ ] Add error states

---

## Phase 24: Testing

### 24.1 Backend Unit Tests (Optional for MVP)
- [ ] Set up xUnit test project
- [ ] Write tests for services:
  - [ ] AuthService tests
  - [ ] FundurService tests
  - [ ] SkjalService tests
- [ ] Write tests for repositories
- [ ] Achieve >70% code coverage

### 24.2 Backend Integration Tests (Optional for MVP)
- [ ] Set up test database
- [ ] Write API endpoint tests:
  - [ ] Auth endpoints
  - [ ] Fundur CRUD endpoints
  - [ ] File upload/download
- [ ] Use WebApplicationFactory for testing

### 24.3 Frontend Unit Tests (Optional for MVP)
- [ ] Write component tests:
  - [ ] Test critical components (FundirList, FundurDetail)
  - [ ] Test form validation
  - [ ] Test service methods
- [ ] Use Jasmine/Karma (default Angular setup)
- [ ] Achieve >60% code coverage

### 24.4 E2E Tests (Optional for MVP)
- [ ] Set up Cypress or Playwright
- [ ] Write E2E flows:
  - [ ] Login flow
  - [ ] Create meeting flow
  - [ ] Add agenda item flow
  - [ ] Upload document flow
  - [ ] Approve meeting flow
- [ ] Run E2E tests in CI/CD

### 24.5 Manual Testing
- [ ] Test as Secretary role:
  - [ ] Create committee
  - [ ] Create meeting
  - [ ] Add agenda items
  - [ ] Upload documents
  - [ ] Add conclusions
  - [ ] Assign tasks
  - [ ] Close meeting
  - [ ] Approve meeting
- [ ] Test as Committee Member role:
  - [ ] View assigned meetings
  - [ ] View documents
  - [ ] Add personal notes
  - [ ] Complete tasks
- [ ] Test notifications
- [ ] Test offline mode
- [ ] Test on mobile devices
- [ ] Test cross-browser (Chrome, Firefox, Safari, Edge)

---

## Phase 25: Deployment Preparation

### 25.1 Backend Deployment
- [ ] Configure production connection string (environment variable)
- [ ] Set up production database (PostgreSQL instance)
- [ ] Run migrations on production DB
- [ ] Configure CORS for production domain
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure file storage:
  - [ ] Azure Blob Storage (or)
  - [ ] AWS S3 (or)
  - [ ] Local server with proper permissions
- [ ] Set up logging (Serilog, NLog)
- [ ] Configure error monitoring (Sentry, Application Insights)
- [ ] Set environment variables:
  - [ ] JWT secret (secure, random)
  - [ ] VAPID keys (for push notifications)
  - [ ] Database credentials
  - [ ] File storage credentials

### 25.2 Frontend Deployment
- [ ] Build for production: `ng build --configuration production`
- [ ] Review build output in `/dist`
- [ ] Test production build locally
- [ ] Configure environment.prod.ts with production API URL
- [ ] Set up hosting:
  - [ ] Static hosting (Netlify, Vercel, Azure Static Web Apps)
  - [ ] Or traditional web server (Nginx, IIS)
- [ ] Configure redirects for SPA routing
- [ ] Set up HTTPS
- [ ] Configure CDN for static assets (optional)

### 25.3 Database Backup
- [ ] Set up automated backups (daily)
- [ ] Test restore procedure
- [ ] Document backup/restore process

### 25.4 CI/CD Pipeline (Optional)
- [ ] Set up GitHub Actions / Azure DevOps / GitLab CI
- [ ] Configure build pipeline:
  - [ ] Backend: build, test, publish
  - [ ] Frontend: build, test
- [ ] Configure deployment pipeline:
  - [ ] Deploy backend to server
  - [ ] Deploy frontend to hosting
- [ ] Add environment-specific configs

### 25.5 Documentation
- [ ] Write README.md:
  - [ ] Project overview
  - [ ] Tech stack
  - [ ] Setup instructions (local development)
  - [ ] Deployment instructions
- [ ] Document API endpoints (Swagger already provides this)
- [ ] Write user guide (basic usage):
  - [ ] How to create meeting
  - [ ] How to add agenda items
  - [ ] How to approve meeting
- [ ] Document database schema
- [ ] Create troubleshooting guide

---

## Phase 26: Post-MVP Enhancements (Future)

### 26.1 Journal Integration
- [ ] Analyze Journal system API/database
- [ ] Create integration service
- [ ] Implement document import from Journal
- [ ] Implement export to Journal on meeting approval
- [ ] Test integration thoroughly

### 26.2 Multi-Tenant Support
- [ ] Add Organization entity
- [ ] Update all entities with OrganizationId
- [ ] Add organization selection on login
- [ ] Implement data isolation by organization
- [ ] Add organization admin role

### 26.3 Advanced Reporting
- [ ] Create meeting reports (PDF export)
- [ ] Create meeting minutes template
- [ ] Add chart/statistics dashboard
- [ ] Export to Excel/CSV

### 26.4 Advanced Search
- [ ] Full-text search across meetings
- [ ] Search within documents (OCR for PDFs)
- [ ] Advanced filtering options

### 26.5 Mobile App (Native)
- [ ] Evaluate need for native mobile app
- [ ] Consider Ionic/Capacitor for code reuse
- [ ] Or build separate React Native/Flutter app

### 26.6 Real-time Collaboration
- [ ] Add SignalR for real-time updates
- [ ] Show when other users are viewing/editing
- [ ] Live updates when meeting status changes

### 26.7 Email Notifications
- [ ] Send email in addition to push notifications
- [ ] Use SendGrid/SMTP service
- [ ] Create email templates

---

## Current Status Tracker

**Last Updated:** 2025-11-06

**Current Phase:** Phase 22 - PWA Configuration (COMPLETE ✅)

**Completed Phases:**
- Phase 1 - Project Setup & Infrastructure ✅
- Phase 2 - Database Schema & Models ✅
- Phase 3 - Backend API - Authentication & Authorization ✅
- Phase 4 - Backend API - Committee Management ✅
- Phase 5 - Backend API - Meeting Management ✅
- Phase 6 - Backend API - Agenda Items ✅
- Phase 7 - Backend API - Document Management ✅
- Phase 8 - Backend API - Notes & Tasks ✅
- Phase 10 - Frontend - Angular Project Structure ✅
- Phase 11 - Frontend - Authentication (Login/Register) ✅
- Phase 12 - Frontend - Main Layout & Navigation ✅
- Phase 13 - Frontend - Meetings List ✅
- Phase 14 - Frontend - Meeting Details ✅
- Phase 15 - Frontend - Create/Edit Meeting ✅
  - Single form component for create/edit modes
  - Full date/time handling with hour/minute dropdowns
  - Inline committee creation
  - API integration working
  - Responsive design
- Phase 17 - Frontend - Agenda Item Management ✅
  - AgendaItemService with full CRUD operations
  - Create/edit dialog component
  - Delete with confirmation
  - Drag & drop reordering with Angular CDK
  - Role-based access control (Secretary only)
  - Complete API integration
- Phase 16 - Frontend - Document Upload & Preview ✅
  - DocumentUploadDialogComponent with drag & drop
  - DocumentPreviewComponent with PDF/image support
  - DocumentListComponent with card grid layout
  - Full integration with MeetingDetailComponent
  - File validation (size, type)
  - Role-based access control
  - All document operations working
- Phase 19 - Frontend - Niðurstøður, Notat, Uppgávur Dialogs ✅
  - ConclusionDialogComponent with ConclusionService
  - NoteDialogComponent with NoteService
  - TaskDialogComponent with TaskService
  - Full integration with MeetingDetailComponent
  - All dialogs tested and working
  - Material Design implementation

**Next Steps:**
- [ ] Phase 18 - Frontend - Create Document/Report (STOVNA SKRÁ) - Complex form with journal integration
- [ ] Phase 9 - Backend API - Push Notification Triggers - Add notification triggers to services
- [ ] Phase 23 - Styling & Theming - Custom Angular Material theme and responsive design
- [ ] Phase 24 - Testing - Unit, integration, and E2E tests

**Blockers:**
- None

**Recent Changes (2025-11-06):**
- ✅ **Phase 22 - PWA Configuration COMPLETED** - Full PWA implementation with offline support and push notifications
  - **Backend Push Notification Infrastructure:**
    - Generated VAPID key pair for Web Push
    - Added VAPID keys to appsettings.json (Development & Production)
    - Created IPushNotificationService and PushNotificationService
    - Implemented subscription management (subscribe/unsubscribe)
    - Implemented single and multi-user notification sending
    - Created PushController with 4 endpoints (vapid-public-key, subscribe, unsubscribe, test)
    - Created IPushSubscriptionRepository and PushSubscriptionRepository
    - Registered services in Program.cs
    - Added WebPush NuGet package
    - Backend builds successfully with no errors
  - **Frontend Push Notification Service:**
    - Created NotificationService with SwPush integration
    - Implemented requestNotificationPermission() method
    - Implemented disableNotifications() method
    - Added permission state tracking (enabled, subscriptionActive)
    - Backend subscription integration (send subscription data to API)
    - ArrayBuffer to Base64 conversion for VAPID keys
  - **Frontend Service Worker Update Service:**
    - Created SwUpdateService for detecting new app versions
    - Periodic update checks (every 6 hours)
    - VERSION_READY event listener
    - Update notification snackbar with action button
    - Activate update and reload on user action
  - **Frontend UI Components:**
    - Created NotificationPromptComponent with smart timing (2s delay)
    - Shows on first login with snackbar interface
    - Handle permission grant/deny gracefully
    - Created OfflineIndicatorComponent with banner
    - Tracks navigator.onLine status
    - Yellow warning styling with cloud-off icon
    - Integrated both components into MainLayoutComponent
  - **Service Worker Configuration:**
    - Updated ngsw-config.json with 5 API dataGroups
    - Network-first strategy for all API calls
    - Configurable cache durations (30m to 24h)
    - Asset caching for static files
  - **Manifest & Configuration:**
    - Updated manifest.webmanifest with proper app metadata
    - App name: "Fundarbók - Meeting Management"
    - Cyan/teal theme color (#00bcd4) matching brand
    - Added VAPID public key to environment files
    - Added translation keys (en.json, fo.json)
  - **Frontend & Backend Build:**
    - Fixed TypeScript errors (SwUpdate.activationEvents, MatSnackBar positions)
    - Fixed C# ambiguous reference (PushSubscription namespace)
    - Frontend builds successfully (1 minor budget warning on CSS)
    - Backend builds successfully (3 minor NuGet version warnings)
    - All services properly registered and injected

**Notes:**
- Backend core API fully implemented and tested (Phases 3-8) ✅
- Frontend Phases 10-17, 19 complete and fully functional ✅
- **Phase 16 - Document Upload & Preview NOW COMPLETE** ✅
- All navigation, routing, and guards working correctly ✅
- Build system fully functional - no TypeScript errors ✅
- Agenda item CRUD with drag & drop working end-to-end ✅
- Conclusion, Note, and Task dialogs fully integrated ✅
- Document upload, preview, and delete fully functional ✅
- Backend running on port 5255, frontend on port 4200 ✅
- Ready for Phase 18 - Create Document/Report (STOVNA SKRÁ)
- Or Phase 20 - Approve & Close Meeting Workflow
- Or Dashboard Meetings Filter
