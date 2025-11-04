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

## Phase 14: Frontend - Meeting Details - MAIN SLICE

**Design Reference:** Screenshot "Fundar síða TEKNISKANEVND Fundur nr. 5/2022" - Meeting detail page with agenda items sidebar

### 14.1 Meeting Detail Component
- [ ] Create component: `ng generate component features/meetings/meeting-detail`
- [ ] **Top Header Section:**
  - [ ] Title row with three parts:
    - [ ] Left: "Fundar síða" (Meeting Page) heading
    - [ ] Center: Committee name "TEKNISKANEVND" in large text
    - [ ] Center-right: Meeting number "Fundur nr. 5/2022"
    - [ ] Right: "Nevndarlimir" button with users icon
  - [ ] Info badges row:
    - [ ] "Fundurin opin" (Meeting Open) badge with lock icon - cyan color
    - [ ] "Fundardagur: 25-08-2022" (Meeting Date)
    - [ ] "Fundarstaður: fundarhali: Com-Data" (Meeting Location)
  - [ ] Action button (Secretary only):
    - [ ] "STOVNA SKRÁ" (Create Document/Report) - cyan outlined button, top right

### 14.2 Left Sidebar - Agenda Items List
- [ ] Create component: `ng generate component features/meetings/components/agenda-items-sidebar`
- [ ] **Meeting Description Section:**
  - [ ] Header: "Lýsing av fundinum" (Meeting Description) with circled number icon
  - [ ] Display meeting description text
- [ ] **Agenda Items List:**
  - [ ] Numbered list items (1, 2, 3, etc.)
  - [ ] Each item shows:
    - [ ] Number badge (circled, dark background)
    - [ ] Item title text (e.g., "Góðkenna seinasta fund")
    - [ ] Status icons with counts (right-aligned):
      - [ ] Document icon with count (e.g., "2", "4", "3") in dark circles
  - [ ] Visual styling:
    - [ ] Selected item: highlighted background (light blue/gray)
    - [ ] Hover effect on items
    - [ ] Adequate padding and spacing
  - [ ] Add new agenda item button (Secretary only):
    - [ ] Circular "+" button at bottom of list

### 14.3 Main Content Area - Agenda Item Detail
- [ ] Create component: `ng generate component features/meetings/components/agenda-item-detail`
- [ ] **Agenda Item Header:**
  - [ ] Section title "Nevndar fundur í teknisku nevnd" (Committee meeting in technical committee)
- [ ] **Content Sections:**
  - [ ] Numbered list of previous meeting items with descriptions
  - [ ] "Niðurstøða" (Conclusions) section:
    - [ ] Header in red text
    - [ ] List of conclusion items with timestamps
    - [ ] Format: "Skrá leysgivin DD-MM-YYYY kl. HH:MM av Name"
    - [ ] Nested bullet points for details
- [ ] **Action Buttons Row (bottom of content):**
  - [ ] Circular "+" button (add new item)
  - [ ] "Niðurstøða" button (Add Conclusion) - outlined, red accent
  - [ ] "Notat" button (Add Note) - outlined
  - [ ] "Uppgáva" button (Add Task) - outlined, cyan accent
  - [ ] "Prenta fundin" button (Print Meeting) - outlined
  - [ ] "Avrifa til annað mál" button (Forward to another case) - outlined

### 14.4 Document Preview Row (Bottom)
- [ ] **Document Cards:**
  - [ ] Row of 6 document preview cards
  - [ ] Each card shows:
    - [ ] Document icon (page icon)
    - [ ] Document title/description below (small text)
  - [ ] Clickable to open document preview
  - [ ] Horizontal scroll if more than 6 documents

### 14.5 Bottom Action Bar
- [ ] **Status Control Buttons (Secretary only):**
  - [ ] "Fundur ikki leysgivin" badge/button (Meeting Not Approved) - outlined, left side
  - [ ] "Loka fundin" button (Close Meeting) - filled, cyan color
- [ ] **Document Template Input:**
  - [ ] Text input: "Legg fleiri standardskriv til fundin" (Add more standard documents to meeting)
  - [ ] Link icon button
  - [ ] Attachment icon button
- [ ] **Navigation/Save Buttons:**
  - [ ] "AFTUR" button (Back) - outlined, bottom right
  - [ ] "GOYM" button (Save) - filled, dark background, bottom right

### 14.6 Meeting Participants Dialog
- [ ] Create dialog component: `ng generate component features/meetings/dialogs/participants-dialog`
- [ ] **Dialog triggered by "Nevndarlimir" button**
- [ ] **Dialog Content (from screenshot 3):**
  - [ ] Header: Committee name "TEKNISKANEVND"
  - [ ] Two action buttons:
    - [ ] "Tilluta atgongd" (Grant Access) with "+" and user icon
    - [ ] "Stovna nevnd" (Create Committee) with "+" and users icon
  - [ ] Description text area:
    - [ ] "Stuttt lýsing av uppgávuni hjá nevndini" (Short description of committee tasks)
  - [ ] **Participants Table:**
    - [ ] Columns: Navn (Name), Heiti (Title), Rættindi (Rights), Virkin (Active)
    - [ ] Each row shows member details
    - [ ] "Rættindi" shown as placeholder text
    - [ ] "Virkin" as toggle switch (mat-slide-toggle)
  - [ ] Multiple rows for committee members
- [ ] **Grant Access Dialog (nested, screenshot 4):**
  - [ ] User selection checklist
  - [ ] Names with checkboxes (some checked, some unchecked)
  - [ ] User search/filter capability

### 14.7 Component Logic & State Management
- [ ] Load meeting details on component init (route param id)
- [ ] Load agenda items for the meeting
- [ ] Track selected agenda item (highlight in sidebar)
- [ ] Load documents for selected agenda item
- [ ] Handle agenda item selection - update main content area
- [ ] Implement auto-save or manual save (GOYM button)
- [ ] Handle meeting status changes (open/closed/approved)
- [ ] Manage permissions - hide Secretary-only elements for committee members

### 14.8 Responsive Design
- [ ] Desktop: Sidebar + main content side-by-side
- [ ] Tablet: Collapsible sidebar
- [ ] Mobile: Stacked layout, sidebar as bottom sheet or drawer

---

## Phase 15: Frontend - Create/Edit Meeting - Secretary Only

**Design Reference:** Screenshot "Stovna fund" - Meeting creation form

### 15.1 Create Meeting Component
- [ ] Create component: `ng generate component features/meetings/create-meeting`
- [ ] **Page Header:**
  - [ ] Title: "Stovna fund" (Create Meeting)
  - [ ] Breadcrumb or back navigation
  - [ ] Exit fullscreen hint: "To exit full screen, press and hold Esc"
- [ ] **Form Fields (Angular Reactive Forms):**
  - [ ] **Nevnd (Committee)** - Required:
    - [ ] mat-select dropdown
    - [ ] Load all committees from API
    - [ ] Pre-populate if coming from committee view
    - [ ] Shows "Tekniskanevnd" in screenshot
  - [ ] **Fundarskabelón (Meeting Template)** - Optional for v1:
    - [ ] mat-select dropdown
    - [ ] Placeholder: "Eingin skabelón vald" (No template selected)
    - [ ] Can be disabled/hidden for v1
  - [ ] **Yvirskrift/heiti (Title/Heading)** - Optional:
    - [ ] Text input field
    - [ ] Placeholder: "Fundur nummar 5/2022"
    - [ ] Auto-generated if empty (based on meeting number)
  - [ ] **Fundarstaður (Meeting Location)** - Required:
    - [ ] Text input field
    - [ ] Placeholder: "Skriva fundarstað"
  - [ ] **Byrjunar dato (Start Date/Time)** - Required:
    - [ ] Two inputs side by side:
      - [ ] Date picker (mat-datepicker) - "25-08-2022" format
      - [ ] Time dropdown - "15:00" format (15-minute intervals)
    - [ ] Calendar icon button to open date picker
  - [ ] **Enda dato (End Date/Time)** - Required:
    - [ ] Two inputs side by side:
      - [ ] Date picker (mat-datepicker) - "25-08-2022" format
      - [ ] Time dropdown - "17:30" format
    - [ ] Validate: must be after start date/time
  - [ ] **Lukkað/ur fundur? (Closed Meeting?)** - Required:
    - [ ] Radio button group (mat-radio-group)
    - [ ] Options: "Ja" (Yes) / "Nei" (No)
    - [ ] "Nei" selected by default (shown in screenshot)
  - [ ] **Viðheft møgulu atmen skjøl (Attach Possible Documents):**
    - [ ] Text input/search field
    - [ ] Placeholder: "Viðheft møgulu atmen skjøl, so sum leiðreglur, lóg o.a."
    - [ ] Link icon button (for adding web links)
    - [ ] Attachment icon button (for file upload)
  - [ ] **Lýsing av fundinum (Meeting Description)** - Optional:
    - [ ] Large textarea (mat-form-field with textarea)
    - [ ] Placeholder: "Skriva møgulga frágreiðing"
    - [ ] Multiple rows (6-8 lines)
- [ ] **Bottom Action Buttons:**
  - [ ] "AFTUR" (Back/Cancel) button - outlined, left side
  - [ ] "GOYM" (Save) button - filled, dark background, right side
  - [ ] Full-width button row at bottom

### 15.2 Form Validation & Logic
- [ ] Implement form validation rules:
  - [ ] Committee: required
  - [ ] Location: required
  - [ ] Start date: required
  - [ ] Start time: required
  - [ ] End date: required
  - [ ] End time: required
  - [ ] End date/time must be after start date/time
- [ ] Show validation errors:
  - [ ] Required field indicators (red asterisk or border)
  - [ ] Error messages below invalid fields
  - [ ] Disable submit button if form invalid
- [ ] Auto-generate meeting number on committee selection
- [ ] Handle file attachments (store temporarily, upload on save)

### 15.3 Component Behavior
- [ ] Load committees on component init
- [ ] If template selected, pre-populate form fields
- [ ] On "GOYM" click:
  - [ ] Validate form
  - [ ] Call MeetingService.createMeeting()
  - [ ] Show loading spinner on button
  - [ ] On success: Navigate to meeting detail page
  - [ ] On error: Show error snackbar/toast
- [ ] On "AFTUR" click:
  - [ ] Show confirmation dialog if form dirty
  - [ ] Navigate back to meetings list

### 15.4 Edit Meeting Component
- [ ] Create component: `ng generate component features/meetings/edit-meeting` OR
- [ ] Reuse CreateMeetingComponent with edit mode flag
- [ ] Load existing meeting data via route param
- [ ] Pre-populate all form fields
- [ ] Change page title to "Redigera fund" (Edit Meeting)
- [ ] Call MeetingService.updateMeeting() on save
- [ ] Prevent editing if meeting is approved/locked

### 15.5 Shared Form Component (Optional)
- [ ] If create/edit have duplicate code, extract to:
  - [ ] `ng generate component features/meetings/components/meeting-form`
  - [ ] @Input() meeting: Meeting | null (null for create, object for edit)
  - [ ] @Input() mode: 'create' | 'edit'
  - [ ] @Output() submitForm: EventEmitter<CreateMeetingRequest | UpdateMeetingRequest>
  - [ ] @Output() cancel: EventEmitter<void>

### 15.6 File Attachment Handling
- [ ] Implement file upload preview
- [ ] Support multiple files
- [ ] Show file list with remove option
- [ ] Upload files as part of meeting creation
- [ ] Or upload files after meeting created (two-step process)

---

## Phase 16: Frontend - Skjal (Document) Upload & Preview

### 16.1 Skjal Upload Component
- [ ] Create component: `ng g component features/skjol/skjal-upload`
- [ ] Design matching Figma screenshot 8:
  - [ ] File upload area (drag & drop or click to browse)
  - [ ] File list with:
    - [ ] File name
    - [ ] Size
    - [ ] Remove button
  - [ ] "Legg skjal inn frá Journal" button (disabled for v1)
  - [ ] Search/select from existing files modal
- [ ] Implement file upload:
  - [ ] Drag & drop support
  - [ ] Click to browse
  - [ ] Multiple file selection
  - [ ] File type validation (PDF, DOC, DOCX, images)
  - [ ] File size validation (e.g., max 10MB)
  - [ ] Progress bar for upload
- [ ] Create SkjalService methods:
  - [ ] `uploadSkjal(punktId: string, file: File, metadata): Observable<Skjal>`
  - [ ] `getSkjol(punktId: string): Observable<Skjal[]>`
  - [ ] `deleteSkjal(id: string): Observable<boolean>`
- [ ] Call API to upload files
- [ ] Display uploaded files list

### 16.2 Skjal Preview Component
- [ ] Create component: `ng g component features/skjol/skjal-preview`
- [ ] Design matching Figma screenshot 11:
  - [ ] Document preview area (center)
  - [ ] PDF viewer integration (ngx-extended-pdf-viewer)
  - [ ] Navigation buttons (previous/next page)
  - [ ] Zoom controls
  - [ ] Download button
- [ ] Implement PDF viewing:
  - [ ] Install ngx-extended-pdf-viewer
  - [ ] Load PDF from API endpoint
  - [ ] Handle different document types (images, etc.)
- [ ] Add fullscreen mode (optional)

### 16.3 Skjal List Component
- [ ] Create component: `ng g component features/skjol/skjal-list`
- [ ] Display documents as:
  - [ ] List view with icons
  - [ ] Thumbnail grid (optional)
- [ ] Show document metadata:
  - [ ] Name
  - [ ] Size
  - [ ] Upload date
  - [ ] Uploaded by
- [ ] Add click handler to open preview
- [ ] Add delete button (Secretary only)

---

## Phase 17: Frontend - Fundarpunktur (Agenda Item) Management - Secretary

### 17.1 Create Agenda Item Component
- [ ] Create component: `ng g component features/fundarpunktur/create-fundarpunktur`
- [ ] Design form:
  - [ ] Heiti (Title) field
  - [ ] Málslýsing (Description) textarea
  - [ ] "GOYM" (Save) button
- [ ] Create FundarpunkturService:
  - [ ] `createFundarpunktur(fundurId: string, request): Observable<Fundarpunktur>`
  - [ ] `updateFundarpunktur(id: string, request): Observable<Fundarpunktur>`
  - [ ] `deleteFundarpunktur(id: string): Observable<boolean>`
  - [ ] `reorderFundarpunktur(fundurId: string, order: string[]): Observable<boolean>`
- [ ] Call API on submit
- [ ] Refresh agenda list after creation

### 17.2 Edit Agenda Item Component
- [ ] Create inline edit mode in FundarpunkturDetailComponent
- [ ] Enable edit mode on button click (Secretary only)
- [ ] Save changes on "GOYM" button
- [ ] Cancel edit mode on "AFTUR" button

### 17.3 Reorder Agenda Items
- [ ] Add drag & drop support for agenda items:
  - [ ] Use Angular CDK Drag Drop
  - [ ] Install: `ng add @angular/cdk`
  - [ ] Implement cdkDragDrop directive
- [ ] Save new order on drop
- [ ] Update agenda item numbers

### 17.4 Delete Agenda Item
- [ ] Add delete button (Secretary only)
- [ ] Show confirmation dialog
- [ ] Call API to delete
- [ ] Remove from list on success

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

## Phase 19: Frontend - Niðurstøður, Notat, Uppgávur Dialogs

### 19.1 Niðurstøða Dialog Component
- [ ] Create dialog: `ng g component features/fundarpunktur/dialogs/nidurstoda-dialog`
- [ ] Design matching Figma screenshot 12:
  - [ ] Title: "Stovna niðurstøðu"
  - [ ] Text: "Málið um marknaðarumskipan varð samtýkt við 5 atkveðnum fyri ein tveimum í móti..."
  - [ ] Textarea for conclusion text
  - [ ] "Avrifa til aðra nevnd" (Forward to another committee) button
  - [ ] "Vel ábyrgdara" (Select responsible) button
  - [ ] "Vel dato" (Select date) button
  - [ ] "GOYM" (Save) button
- [ ] Create NotatService (if not exists)
- [ ] Save conclusion on submit
- [ ] Close dialog and refresh

### 19.2 Notat Dialog Component
- [ ] Create dialog: `ng g component features/fundarpunktur/dialogs/notat-dialog`
- [ ] Design matching Figma screenshot 13:
  - [ ] Title: "Stovna Notat"
  - [ ] Text: "Uppgávan at senda jattanarskriv til umsøkjaran"
  - [ ] Textarea for note text
  - [ ] "Avrifa til aðra nevnd" button
  - [ ] "Vel ábyrgdara" button
  - [ ] "Vel dato" button
  - [ ] "GOYM" button
- [ ] Save note (private to current user)
- [ ] Close dialog

### 19.3 Uppgáva Dialog Component
- [ ] Create dialog: `ng g component features/fundarpunktur/dialogs/uppgava-dialog`
- [ ] Design matching Figma screenshot 14:
  - [ ] Title: "Stovna uppgávu"
  - [ ] Text: "Uppgávan at senda svarsskrív og kanna umstøðurnar við umhørvistoývuna..."
  - [ ] Textarea for task description
  - [ ] "Uppgáva" label/field
  - [ ] User assignment (somuleiðis skal ein niðurstøða gerast...)
  - [ ] "GOYM" button
- [ ] Create UppgavaService
- [ ] Assign task to selected user
- [ ] Send push notification to assignee
- [ ] Close dialog

---

## Phase 20: Frontend - Approve & Close Meeting Workflow

### 20.1 Close Meeting Confirmation
- [ ] Create dialog: `ng g component features/fundir/dialogs/close-fundur-dialog`
- [ ] Design confirmation dialog:
  - [ ] Title: "Loka fundin?"
  - [ ] Message: "Confirm that all agenda items are complete..."
  - [ ] Checklist of incomplete items (validation)
  - [ ] "Nei", "Ja" buttons
- [ ] Validate meeting completeness:
  - [ ] All agenda items have conclusions
  - [ ] All required documents uploaded
- [ ] Call FundurService.updateStatus(id, 'closed')
- [ ] Update UI on success

### 20.2 Approve Meeting Confirmation
- [ ] Create dialog: `ng g component features/fundir/dialogs/approve-fundur-dialog`
- [ ] Design matching Figma screenshot 15:
  - [ ] Title: "Fundurin verður avgreiddur og lokaður"
  - [ ] Message: "Øll punktini á fundinum verða lokað og niðurstøðurnar frá hvørjum punkti verða avritað yvir á tær respektivu journalirnar í journalskipanini"
  - [ ] Checklist showing items that will be approved:
    - [ ] List all agenda items with checkmarks/x
  - [ ] Toggle: "Loka" (Close/Lock)
  - [ ] Toggle: "Nevndarlimir" (Committee members notification)
  - [ ] Confirmation question: "Er tú heilt vísur í, at tú ynskir at loka fundin?"
  - [ ] Radio buttons: "Nei", "Ja"
- [ ] Validate all items completed
- [ ] Call FundurService.updateStatus(id, 'approved')
- [ ] Lock meeting from further edits
- [ ] Show success message
- [ ] Navigate back to list

---

## Phase 21: Frontend - Committee Member View (Limited)

### 21.1 My Meetings View
- [ ] Create component: `ng g component features/fundir/my-fundir`
- [ ] Show only meetings assigned to current user
- [ ] Filter by upcoming/past meetings
- [ ] Simplified view:
  - [ ] Meeting name/committee
  - [ ] Date/time
  - [ ] Location
  - [ ] Status badge
- [ ] Click to view meeting details (read-only)

### 21.2 Read-Only Meeting Detail
- [ ] Modify FundurDetailComponent for committee member role
- [ ] Hide all edit/create buttons
- [ ] Show agenda items (read-only)
- [ ] Allow viewing documents
- [ ] Allow adding personal notes (Notat)
- [ ] Allow marking tasks as complete (if assigned)
- [ ] Disable all Secretary actions

### 21.3 My Tasks View
- [ ] Create component: `ng g component features/uppgavur/my-uppgavur`
- [ ] List tasks assigned to current user
- [ ] Group by:
  - [ ] Pending
  - [ ] Completed
- [ ] Show:
  - [ ] Task description
  - [ ] Related meeting/agenda item
  - [ ] Due date
  - [ ] Complete checkbox
- [ ] Update task status on checkbox change

---

## Phase 22: PWA Configuration

### 22.1 Service Worker Setup
- [ ] Verify `@angular/pwa` is installed (done in setup)
- [ ] Review generated `ngsw-config.json`:
  - [ ] Configure asset groups (app shell, lazy bundles)
  - [ ] Configure data groups (API calls)
  - [ ] Set cache strategies (performance vs freshness)
- [ ] Add offline page fallback
- [ ] Test service worker in production build

### 22.2 Web App Manifest
- [ ] Configure `manifest.webmanifest`:
  - [ ] App name: "Fundarbók"
  - [ ] Short name: "Fundarbók"
  - [ ] Description
  - [ ] Theme color (matching brand)
  - [ ] Background color
  - [ ] Icons (multiple sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
  - [ ] Display mode: "standalone"
  - [ ] Start URL: "/"
- [ ] Create app icons (design or use placeholder)
- [ ] Add icons to `src/assets/icons/`

### 22.3 Push Notification Setup
- [ ] Create `src/app/core/services/push-notification.service.ts`
- [ ] Implement methods:
  - [ ] `requestPermission(): Promise<boolean>`
  - [ ] `subscribeToNotifications(): Promise<PushSubscription>`
  - [ ] `unsubscribe(): Promise<boolean>`
  - [ ] `getVapidPublicKey(): Observable<string>`
- [ ] Add service worker message listener
- [ ] Display notification on receive
- [ ] Handle notification click (navigate to meeting/task)
- [ ] Add notification permission prompt on first login

### 22.4 Offline Support
- [ ] Configure cache-first strategy for static assets
- [ ] Configure network-first strategy for API calls
- [ ] Add offline indicator in UI
- [ ] Handle offline form submissions:
  - [ ] Queue requests in IndexedDB
  - [ ] Retry when back online
  - [ ] Show sync status
- [ ] Test offline functionality

### 22.5 Install Prompt
- [ ] Listen for `beforeinstallprompt` event
- [ ] Show custom "Install App" button
- [ ] Trigger install prompt on click
- [ ] Hide button after install
- [ ] Test on mobile devices (Android, iOS)

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

**Last Updated:** 2025-11-04

**Current Phase:** Phase 14 - Frontend - Meeting Details (or Phase 9 - Backend API - Push Notifications)

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

**Next Steps:**
- [ ] Phase 14 - Frontend - Meeting Details (main slice - recommended next)
- [ ] Phase 15 - Frontend - Create/Edit Meeting (Secretary Only)
- [ ] Phase 9 - Backend API - Push Notifications (optional for MVP)

**Blockers:**
- Pre-existing build errors in frontend need to be fixed:
  - Environment import issues in api.service.ts and auth.service.ts
  - Dashboard component importing Committee from wrong model file
  - Committees-list component missing RouterModule import

**Notes:**
- Backend core API fully implemented and tested (Phases 3-8) ✅
- Phase 13 (Meetings List) fully implemented following the TODO plan ✅
  - All components, services, routing, and styling complete
  - Matches Figma design specifications
  - Includes filters, table, sorting, responsive design
- Created SharedModule for HasRoleDirective and TranslatePipe
- Meeting service implemented with all CRUD operations
- Frontend has pre-existing build errors that need resolution
- Backend running on port 5255, frontend configured to use it
- Ready to proceed with Phase 14 (Meeting Details) after fixing build errors
