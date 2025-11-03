# Fundarbók PWA - Implementation Todo List

## Project Overview
Building a PWA for meeting management with Angular frontend, ASP.NET Core backend, and PostgreSQL database.

**IMPORTANT NAMING CONVENTIONS:**
- All code (C# classes, properties, TypeScript interfaces, variables) uses **English names**
- All database tables and columns use **English names**
- UI translations handled via i18n files (English and Faroese)
- Translation keys use dot notation: `meetings.title`, `common.save`, etc.

---

## Phase 0: Translation System Setup (i18n)

### 0.1 Translation File Structure
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

### 0.2 Translation Service
- [ ] Create `src/app/core/services/translation.service.ts`:
  - [ ] `currentLanguage$: BehaviorSubject<string>` (default: 'en')
  - [ ] `translations: { [key: string]: any }` (loaded translations)
  - [ ] `loadTranslations(lang: string): Observable<any>`
  - [ ] `setLanguage(lang: string): void`
  - [ ] `translate(key: string): string` (supports nested keys like 'meetings.title')
  - [ ] Store selected language in localStorage
  - [ ] Load language on app init

### 0.3 Translation Pipe
- [ ] Create `src/app/shared/pipes/translate.pipe.ts`:
  - [ ] `transform(key: string): string`
  - [ ] Usage: `{{ 'meetings.title' | translate }}`
  - [ ] Mark as pure pipe for performance
- [ ] Add to SharedModule exports

### 0.4 Language Switcher Component
- [ ] Create `src/app/shared/components/language-switcher/language-switcher.component.ts`:
  - [ ] Dropdown/toggle for EN/FO
  - [ ] Call TranslationService.setLanguage() on change
  - [ ] Show current language
- [ ] Add to main layout (top bar or sidebar)

### 0.5 Initial Translations
- [ ] Populate `en.json` with all UI text from Figma
- [ ] Populate `fo.json` with Faroese translations
- [ ] Organize by feature module:
  - [ ] auth (login, register)
  - [ ] meetings (list, detail, create)
  - [ ] committees
  - [ ] documents
  - [ ] common (buttons, labels, messages)

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
- [ ] Create Angular project (`ng new fundarbok-web --routing --style=scss`)
- [ ] Add Angular Material (`ng add @angular/material`)
- [ ] Add PWA support (`ng add @angular/pwa`)
- [ ] Install additional dependencies:
  - [ ] `ngx-extended-pdf-viewer` (for PDF viewing)
  - [ ] `date-fns` (date manipulation)
- [ ] Set up environment files (environment.ts, environment.prod.ts)
- [ ] Configure proxy.conf.json for API calls during development
- [ ] Set up folder structure:
  - [ ] `src/app/core` (services, guards, interceptors)
  - [ ] `src/app/shared` (shared components, directives, pipes)
  - [ ] `src/app/features` (feature modules)
  - [ ] `src/app/models` (TypeScript interfaces)

### 1.4 Database Setup
- [ ] Create PostgreSQL database `fundarbok`
- [ ] Create database user with appropriate permissions
- [ ] Test connection from pgAdmin/CLI
- [ ] Document database credentials in secure location

---

## Phase 2: Database Schema & Models

### 2.1 Domain Models (Fundarbok.Domain)
**NOTE: All property names in English, translations handled by frontend**

- [ ] Create `Committee.cs` entity:
  - [ ] Id (Guid)
  - [ ] Name (string, required)
  - [ ] Description (string, optional)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: Collection of CommitteeMembers
  - [ ] Navigation: Collection of Meetings
- [ ] Create `CommitteeMember.cs` entity:
  - [ ] Id (Guid)
  - [ ] CommitteeId (Guid, foreign key)
  - [ ] Name (string, required)
  - [ ] Title (string, e.g., "Chairman", "Member")
  - [ ] Role (string, enum: "Chairman", "Member", "Secretary", etc.)
  - [ ] IsActive (bool, active status)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: Committee
- [ ] Create `Meeting.cs` entity:
  - [ ] Id (Guid)
  - [ ] CommitteeId (Guid, foreign key)
  - [ ] MeetingNumber (string, e.g., "5/2022")
  - [ ] Title (string, optional)
  - [ ] Location (string)
  - [ ] StartDate (DateTime)
  - [ ] EndDate (DateTime)
  - [ ] IsOpen (bool, is meeting open for editing)
  - [ ] IsCompleted (bool, is meeting finished)
  - [ ] IsApproved (bool, is meeting approved/closed)
  - [ ] Description (string)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: Committee
  - [ ] Navigation: Collection of AgendaItems
  - [ ] Navigation: Collection of MeetingParticipants
- [ ] Create `MeetingParticipant.cs` (join table):
  - [ ] Id (Guid)
  - [ ] MeetingId (Guid, foreign key)
  - [ ] CommitteeMemberId (Guid, foreign key)
  - [ ] IsParticipating (bool)
  - [ ] CreatedAt (DateTime)
  - [ ] Navigation: Meeting
  - [ ] Navigation: CommitteeMember
- [ ] Create `AgendaItem.cs` entity:
  - [ ] Id (Guid)
  - [ ] MeetingId (Guid, foreign key)
  - [ ] Number (int, ordering)
  - [ ] Title (string, required)
  - [ ] Description (string)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: Meeting
  - [ ] Navigation: Collection of Recommendations
  - [ ] Navigation: Collection of Documents
  - [ ] Navigation: Collection of Conclusions
  - [ ] Navigation: Collection of Notes
  - [ ] Navigation: Collection of Tasks
- [ ] Create `Recommendation.cs` entity:
  - [ ] Id (Guid)
  - [ ] AgendaItemId (Guid, foreign key)
  - [ ] Text (string, text content)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: AgendaItem
- [ ] Create `Document.cs` entity:
  - [ ] Id (Guid)
  - [ ] AgendaItemId (Guid, foreign key, nullable for meeting-level docs)
  - [ ] MeetingId (Guid, foreign key, nullable)
  - [ ] Name (string, document name)
  - [ ] Description (string)
  - [ ] FilePath (string, file storage path)
  - [ ] FileName (string, original filename)
  - [ ] FileSize (long, size in bytes)
  - [ ] MimeType (string, e.g., "application/pdf")
  - [ ] Number (int, ordering)
  - [ ] IsPublic (bool)
  - [ ] IsLocked (bool, locked/final)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: AgendaItem (optional)
  - [ ] Navigation: Meeting (optional)
- [ ] Create `Conclusion.cs` entity:
  - [ ] Id (Guid)
  - [ ] AgendaItemId (Guid, foreign key)
  - [ ] Text (string, text content)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: AgendaItem
- [ ] Create `Note.cs` entity:
  - [ ] Id (Guid)
  - [ ] AgendaItemId (Guid, foreign key)
  - [ ] UserId (Guid, user who created note)
  - [ ] Text (string, text content)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: AgendaItem
  - [ ] Navigation: User
- [ ] Create `Task.cs` entity:
  - [ ] Id (Guid)
  - [ ] AgendaItemId (Guid, foreign key)
  - [ ] Description (string, task description)
  - [ ] AssignedUserId (Guid)
  - [ ] DueDate (DateTime, optional)
  - [ ] IsCompleted (bool)
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] Navigation: AgendaItem
  - [ ] Navigation: User (AssignedUser)
- [ ] Create `User.cs` entity:
  - [ ] Id (Guid)
  - [ ] Name (string)
  - [ ] Email (string, unique)
  - [ ] PasswordHash (string)
  - [ ] Role (string, enum: "Secretary", "CommitteeMember")
  - [ ] CommitteeMemberId (Guid, nullable, link to committee member)
  - [ ] LanguagePreference (string, default: "en")
  - [ ] CreatedAt (DateTime)
  - [ ] UpdatedAt (DateTime)
  - [ ] IsActive (bool)
  - [ ] Navigation: Collection of Notes
  - [ ] Navigation: Collection of AssignedTasks
- [ ] Create `PushSubscription.cs` entity:
  - [ ] Id (Guid)
  - [ ] UserId (Guid, foreign key)
  - [ ] Endpoint (string)
  - [ ] P256dh (string)
  - [ ] Auth (string)
  - [ ] CreatedAt (DateTime)
  - [ ] Navigation: User

### 2.2 Entity Framework DbContext (Fundarbok.Infrastructure)
- [ ] Create `FundarbokDbContext.cs`
- [ ] Add DbSet properties for all entities:
  - [ ] DbSet<Committee> Committees
  - [ ] DbSet<CommitteeMember> CommitteeMembers
  - [ ] DbSet<Meeting> Meetings
  - [ ] DbSet<MeetingParticipant> MeetingParticipants
  - [ ] DbSet<AgendaItem> AgendaItems
  - [ ] DbSet<Recommendation> Recommendations
  - [ ] DbSet<Document> Documents
  - [ ] DbSet<Conclusion> Conclusions
  - [ ] DbSet<Note> Notes
  - [ ] DbSet<Task> Tasks
  - [ ] DbSet<User> Users
  - [ ] DbSet<PushSubscription> PushSubscriptions
- [ ] Configure entity relationships in `OnModelCreating`:
  - [ ] Committee → CommitteeMembers (one-to-many)
  - [ ] Committee → Meetings (one-to-many)
  - [ ] Meeting → AgendaItems (one-to-many)
  - [ ] Meeting → MeetingParticipants (one-to-many)
  - [ ] AgendaItem → Recommendations (one-to-many)
  - [ ] AgendaItem → Documents (one-to-many)
  - [ ] AgendaItem → Conclusions (one-to-many)
  - [ ] AgendaItem → Notes (one-to-many)
  - [ ] AgendaItem → Tasks (one-to-many)
  - [ ] User → PushSubscriptions (one-to-many)
  - [ ] User → Notes (one-to-many)
  - [ ] User → Tasks (one-to-many, for assigned tasks)
- [ ] Add indexes for performance:
  - [ ] Email on User (unique)
  - [ ] CommitteeId on Meeting
  - [ ] MeetingId on AgendaItem
  - [ ] UserId on Note
  - [ ] AssignedUserId on Task
- [ ] Configure column constraints (required fields, max lengths)
- [ ] Add default values (CreatedAt, UpdatedAt)
- [ ] Configure cascade delete rules appropriately

### 2.3 Database Migrations
- [ ] Create initial migration (`dotnet ef migrations add InitialCreate`)
- [ ] Review generated migration code
- [ ] Apply migration to database (`dotnet ef database update`)
- [ ] Verify tables created in pgAdmin (Tables: Committees, CommitteeMembers, Meetings, etc.)
- [ ] Create seed data migration for:
  - [ ] Default Committees (e.g., "Technical Committee", "Social Committee")
  - [ ] Test User (admin/secretary role)
  - [ ] Sample CommitteeMembers
- [ ] Apply seed migration

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

## Phase 4: Backend API - Nevnd (Committee) Management

### 4.1 Nevnd Repository (Fundarbok.Infrastructure)
- [ ] Create `INevndRepository.cs` interface:
  - [ ] `Task<IEnumerable<Nevnd>> GetAllAsync()`
  - [ ] `Task<Nevnd> GetByIdAsync(Guid id)`
  - [ ] `Task<Nevnd> CreateAsync(Nevnd nevnd)`
  - [ ] `Task<Nevnd> UpdateAsync(Nevnd nevnd)`
  - [ ] `Task<bool> DeleteAsync(Guid id)`
  - [ ] `Task<IEnumerable<Nevndarlimurin>> GetLimirlirAsync(Guid nevndId)`
- [ ] Create `NevndRepository.cs` implementation
- [ ] Implement with EF Core queries
- [ ] Add eager loading for related entities (Include)

### 4.2 Nevnd Service (Fundarbok.Application)
- [ ] Create `INevndService.cs` interface
- [ ] Create `NevndService.cs` implementation
- [ ] Add business logic validation:
  - [ ] Check for duplicate committee names
  - [ ] Validate committee member assignments
- [ ] Create DTOs:
  - [ ] `NevndDto.cs` (for responses)
  - [ ] `CreateNevndRequest.cs`
  - [ ] `UpdateNevndRequest.cs`
  - [ ] `NevndarlimurinDto.cs`
  - [ ] `CreateNevndarlimurinRequest.cs`
- [ ] Add AutoMapper configuration (or manual mapping)

### 4.3 Nevnd Controller (Fundarbok.API)
- [ ] Create `NevndirController.cs`
- [ ] Add GET `/api/nevndir` endpoint (list all committees)
- [ ] Add GET `/api/nevndir/{id}` endpoint (get single committee)
- [ ] Add POST `/api/nevndir` endpoint (create committee) - Secretary only
- [ ] Add PUT `/api/nevndir/{id}` endpoint (update committee) - Secretary only
- [ ] Add DELETE `/api/nevndir/{id}` endpoint (delete committee) - Secretary only
- [ ] Add GET `/api/nevndir/{id}/limirlir` endpoint (get committee members)
- [ ] Add POST `/api/nevndir/{id}/limirlir` endpoint (add member) - Secretary only
- [ ] Add PUT `/api/nevndir/{id}/limirlir/{limurId}` endpoint (update member) - Secretary only
- [ ] Add DELETE `/api/nevndir/{id}/limirlir/{limurId}` endpoint (remove member) - Secretary only
- [ ] Add validation and error handling
- [ ] Test all endpoints with Swagger

---

## Phase 5: Backend API - Fundur (Meeting) Management - CORE SLICE

### 5.1 Fundur Repository (Fundarbok.Infrastructure)
- [ ] Create `IFundurRepository.cs` interface:
  - [ ] `Task<IEnumerable<Fundur>> GetAllAsync(FundurFilter filter)`
  - [ ] `Task<Fundur> GetByIdAsync(Guid id)`
  - [ ] `Task<Fundur> GetWithDetailsAsync(Guid id)` (include all related data)
  - [ ] `Task<Fundur> CreateAsync(Fundur fundur)`
  - [ ] `Task<Fundur> UpdateAsync(Fundur fundur)`
  - [ ] `Task<bool> DeleteAsync(Guid id)`
  - [ ] `Task<IEnumerable<Fundur>> GetByNevndIdAsync(Guid nevndId)`
  - [ ] `Task<IEnumerable<Fundur>> GetByBrukariAsync(Guid brukariId)` (meetings for user)
- [ ] Create `FundurRepository.cs` implementation
- [ ] Implement filtering logic (by date range, nevnd, status)
- [ ] Add eager loading for:
  - [ ] Nevnd
  - [ ] FundurLimirlir → Nevndarlimir
  - [ ] Fundarpunktir → Skjol, Tilmæli, Niðurstøður

### 5.2 Fundur Service (Fundarbok.Application)
- [ ] Create `IFundurService.cs` interface
- [ ] Create `FundurService.cs` implementation
- [ ] Add business logic:
  - [ ] Validate meeting dates (start before end)
  - [ ] Auto-generate meeting numbers (e.g., "5/2022")
  - [ ] Handle meeting status transitions (open → closed → approved)
  - [ ] Validate participant assignments
- [ ] Create DTOs:
  - [ ] `FundurDto.cs` (summary for list view)
  - [ ] `FundurDetailDto.cs` (full details with agenda items)
  - [ ] `CreateFundurRequest.cs`
  - [ ] `UpdateFundurRequest.cs`
  - [ ] `FundurFilterDto.cs` (date range, nevnd, status filters)
  - [ ] `FundurLimurDto.cs`

### 5.3 Fundur Controller (Fundarbok.API)
- [ ] Create `FundirController.cs`
- [ ] Add GET `/api/fundir` endpoint (list with filters) - All authenticated users
- [ ] Add GET `/api/fundir/{id}` endpoint (get meeting details)
- [ ] Add POST `/api/fundir` endpoint (create meeting) - Secretary only
- [ ] Add PUT `/api/fundir/{id}` endpoint (update meeting) - Secretary only
- [ ] Add DELETE `/api/fundir/{id}` endpoint (delete meeting) - Secretary only
- [ ] Add PATCH `/api/fundir/{id}/status` endpoint (change status) - Secretary only
- [ ] Add POST `/api/fundir/{id}/limirlir` endpoint (assign participants) - Secretary only
- [ ] Add DELETE `/api/fundir/{id}/limirlir/{limurId}` endpoint (remove participant) - Secretary only
- [ ] Add validation and error handling
- [ ] Test all endpoints

---

## Phase 6: Backend API - Fundarpunktur (Agenda Items)

### 6.1 Fundarpunktur Repository (Fundarbok.Infrastructure)
- [ ] Create `IFundarpunkturRepository.cs` interface:
  - [ ] `Task<IEnumerable<Fundarpunktur>> GetByFundurIdAsync(Guid fundurId)`
  - [ ] `Task<Fundarpunktur> GetByIdAsync(Guid id)`
  - [ ] `Task<Fundarpunktur> GetWithDetailsAsync(Guid id)`
  - [ ] `Task<Fundarpunktur> CreateAsync(Fundarpunktur punkt)`
  - [ ] `Task<Fundarpunktur> UpdateAsync(Fundarpunktur punkt)`
  - [ ] `Task<bool> DeleteAsync(Guid id)`
  - [ ] `Task<bool> ReorderAsync(Guid fundurId, List<Guid> orderedIds)`
- [ ] Create `FundarpunkturRepository.cs` implementation
- [ ] Include related entities (Tilmæli, Skjol, Niðurstøður, Notat)

### 6.2 Fundarpunktur Service (Fundarbok.Application)
- [ ] Create `IFundarpunkturService.cs` interface
- [ ] Create `FundarpunkturService.cs` implementation
- [ ] Add business logic:
  - [ ] Auto-assign sequential numbers
  - [ ] Handle reordering logic
  - [ ] Validate agenda item belongs to meeting
- [ ] Create DTOs:
  - [ ] `FundarpunkturDto.cs`
  - [ ] `FundarpunkturDetailDto.cs`
  - [ ] `CreateFundarpunkturRequest.cs`
  - [ ] `UpdateFundarpunkturRequest.cs`
  - [ ] `ReorderRequest.cs` (array of IDs in new order)
  - [ ] `TilmæliDto.cs`
  - [ ] `NiðurstøðaDto.cs`

### 6.3 Fundarpunktur Controller (Fundarbok.API)
- [ ] Create `FundarpunkturController.cs`
- [ ] Add GET `/api/fundir/{fundurId}/punktir` endpoint (list agenda items)
- [ ] Add GET `/api/fundarpunktur/{id}` endpoint (get single item)
- [ ] Add POST `/api/fundir/{fundurId}/punktir` endpoint (create) - Secretary only
- [ ] Add PUT `/api/fundarpunktur/{id}` endpoint (update) - Secretary only
- [ ] Add DELETE `/api/fundarpunktur/{id}` endpoint (delete) - Secretary only
- [ ] Add POST `/api/fundir/{fundurId}/punktir/reorder` endpoint (reorder) - Secretary only
- [ ] Add POST `/api/fundarpunktur/{id}/tilmæli` endpoint (add recommendation) - Secretary only
- [ ] Add POST `/api/fundarpunktur/{id}/niðurstøða` endpoint (add conclusion) - Secretary only
- [ ] Test all endpoints

---

## Phase 7: Backend API - Skjal (Document) Management

### 7.1 File Storage Setup
- [ ] Create `/uploads` folder in project root (for development)
- [ ] Add `/uploads` to `.gitignore`
- [ ] Create folder structure: `/uploads/{fundurId}/{punktId}/`
- [ ] Configure file upload limits in `Program.cs`
- [ ] Plan for production storage (Azure Blob, AWS S3, or local server)

### 7.2 Skjal Repository (Fundarbok.Infrastructure)
- [ ] Create `ISkjalRepository.cs` interface:
  - [ ] `Task<IEnumerable<Skjal>> GetByFundarpunkturIdAsync(Guid punktId)`
  - [ ] `Task<IEnumerable<Skjal>> GetByFundurIdAsync(Guid fundurId)`
  - [ ] `Task<Skjal> GetByIdAsync(Guid id)`
  - [ ] `Task<Skjal> CreateAsync(Skjal skjal)`
  - [ ] `Task<Skjal> UpdateAsync(Skjal skjal)`
  - [ ] `Task<bool> DeleteAsync(Guid id)`
- [ ] Create `SkjalRepository.cs` implementation

### 7.3 File Storage Service (Fundarbok.Application)
- [ ] Create `IFileStorageService.cs` interface:
  - [ ] `Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder)`
  - [ ] `Task<Stream> GetFileAsync(string filePath)`
  - [ ] `Task<bool> DeleteFileAsync(string filePath)`
  - [ ] `Task<bool> FileExistsAsync(string filePath)`
- [ ] Create `LocalFileStorageService.cs` implementation
- [ ] Add file validation (size, type)
- [ ] Add virus scanning (optional for v1)

### 7.4 Skjal Service (Fundarbok.Application)
- [ ] Create `ISkjalService.cs` interface
- [ ] Create `SkjalService.cs` implementation
- [ ] Add business logic:
  - [ ] Validate file types (PDF, DOC, DOCX, images)
  - [ ] Generate unique file names
  - [ ] Track file metadata
- [ ] Create DTOs:
  - [ ] `SkjalDto.cs`
  - [ ] `UploadSkjalRequest.cs`
  - [ ] `UpdateSkjalRequest.cs`

### 7.5 Skjal Controller (Fundarbok.API)
- [ ] Create `SkjolController.cs`
- [ ] Add GET `/api/fundarpunktur/{punktId}/skjol` endpoint (list documents)
- [ ] Add POST `/api/fundarpunktur/{punktId}/skjol` endpoint (upload) - Secretary only
- [ ] Add GET `/api/skjol/{id}` endpoint (get document metadata)
- [ ] Add GET `/api/skjol/{id}/download` endpoint (download file)
- [ ] Add GET `/api/skjol/{id}/preview` endpoint (stream for preview)
- [ ] Add PUT `/api/skjol/{id}` endpoint (update metadata) - Secretary only
- [ ] Add DELETE `/api/skjol/{id}` endpoint (delete) - Secretary only
- [ ] Implement multipart/form-data handling
- [ ] Add proper content-type headers for downloads
- [ ] Test file upload/download

---

## Phase 8: Backend API - Notat (Notes) & Uppgávur (Tasks)

### 8.1 Notat Repository (Fundarbok.Infrastructure)
- [ ] Create `INotatRepository.cs` interface
- [ ] Create `NotatRepository.cs` implementation
- [ ] Filter notes by user (committee members see only their own)

### 8.2 Notat Service (Fundarbok.Application)
- [ ] Create `INotatService.cs` interface
- [ ] Create `NotatService.cs` implementation
- [ ] Create DTOs:
  - [ ] `NotatDto.cs`
  - [ ] `CreateNotatRequest.cs`
  - [ ] `UpdateNotatRequest.cs`

### 8.3 Notat Controller (Fundarbok.API)
- [ ] Create `NotatController.cs`
- [ ] Add GET `/api/fundarpunktur/{punktId}/notat` endpoint (get user's notes)
- [ ] Add POST `/api/fundarpunktur/{punktId}/notat` endpoint (create note)
- [ ] Add PUT `/api/notat/{id}` endpoint (update note)
- [ ] Add DELETE `/api/notat/{id}` endpoint (delete note)
- [ ] Ensure users can only access their own notes

### 8.4 Uppgáva Repository & Service (Fundarbok.Infrastructure & Application)
- [ ] Create `IUppgávaRepository.cs` interface
- [ ] Create `UppgávaRepository.cs` implementation
- [ ] Create `IUppgávaService.cs` interface
- [ ] Create `UppgávaService.cs` implementation
- [ ] Create DTOs:
  - [ ] `UppgávaDto.cs`
  - [ ] `CreateUppgávaRequest.cs`
  - [ ] `UpdateUppgávaRequest.cs`

### 8.5 Uppgáva Controller (Fundarbok.API)
- [ ] Create `UppgávurController.cs`
- [ ] Add GET `/api/uppgávur/my` endpoint (get user's tasks)
- [ ] Add GET `/api/fundarpunktur/{punktId}/uppgávur` endpoint (get tasks for agenda item)
- [ ] Add POST `/api/fundarpunktur/{punktId}/uppgávur` endpoint (create task) - Secretary only
- [ ] Add PATCH `/api/uppgávur/{id}/complete` endpoint (mark complete)
- [ ] Add DELETE `/api/uppgávur/{id}` endpoint (delete) - Secretary only

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

## Phase 10: Frontend - Angular Project Structure

### 10.1 Folder Structure Setup
- [ ] Create `src/app/core` module:
  - [ ] Create `core.module.ts`
  - [ ] Add guards, interceptors, services folders
- [ ] Create `src/app/shared` module:
  - [ ] Create `shared.module.ts`
  - [ ] Add components, directives, pipes folders
- [ ] Create `src/app/features` folder:
  - [ ] `auth` module
  - [ ] `nevndir` module
  - [ ] `fundir` module (MAIN SLICE)
  - [ ] `fundarpunktur` module
  - [ ] `skjol` module
  - [ ] `notat` module
  - [ ] `dashboard` module
- [ ] Create `src/app/models` folder for TypeScript interfaces

### 10.2 Core Services
- [ ] Create `src/app/core/services/api.service.ts` (base HTTP service)
- [ ] Create `src/app/core/services/auth.service.ts`:
  - [ ] Login method
  - [ ] Logout method
  - [ ] Get current user
  - [ ] Token storage (localStorage)
  - [ ] isAuthenticated$ observable
- [ ] Create `src/app/core/interceptors/auth.interceptor.ts`:
  - [ ] Attach JWT token to requests
  - [ ] Handle 401 responses
- [ ] Create `src/app/core/interceptors/error.interceptor.ts`:
  - [ ] Global error handling
  - [ ] Show error messages
- [ ] Create `src/app/core/guards/auth.guard.ts`:
  - [ ] Protect routes requiring authentication
- [ ] Create `src/app/core/guards/role.guard.ts`:
  - [ ] Protect routes by role (Skrivarin, Nevndarlimur)

### 10.3 Models/Interfaces
- [ ] Create TypeScript interfaces matching backend DTOs:
  - [ ] `src/app/models/brukari.model.ts`
  - [ ] `src/app/models/nevnd.model.ts`
  - [ ] `src/app/models/nevndarlimur.model.ts`
  - [ ] `src/app/models/fundur.model.ts`
  - [ ] `src/app/models/fundarpunktur.model.ts`
  - [ ] `src/app/models/skjal.model.ts`
  - [ ] `src/app/models/notat.model.ts`
  - [ ] `src/app/models/uppgava.model.ts`
  - [ ] `src/app/models/tilmæli.model.ts`
  - [ ] `src/app/models/niðurstøða.model.ts`
  - [ ] `src/app/models/auth.model.ts`

### 10.4 Shared Components
- [ ] Create `src/app/shared/components/loading-spinner/loading-spinner.component.ts`
- [ ] Create `src/app/shared/components/error-message/error-message.component.ts`
- [ ] Create `src/app/shared/components/confirm-dialog/confirm-dialog.component.ts`
- [ ] Create `src/app/shared/pipes/date-format.pipe.ts` (Faroese date formatting)
- [ ] Create `src/app/shared/directives/has-role.directive.ts` (show/hide by role)

---

## Phase 11: Frontend - Authentication (Login/Register)

### 11.1 Auth Module
- [ ] Generate auth module: `ng g module features/auth --routing`
- [ ] Create components:
  - [ ] `ng g component features/auth/login`
  - [ ] `ng g component features/auth/register`
- [ ] Configure auth routing in `auth-routing.module.ts`:
  - [ ] `/login` → LoginComponent
  - [ ] `/register` → RegisterComponent

### 11.2 Login Component
- [ ] Create login form with Angular Reactive Forms:
  - [ ] Email field (required, email validation)
  - [ ] Password field (required)
  - [ ] Submit button
  - [ ] "Forgot password?" link (placeholder)
- [ ] Style with Angular Material (mat-form-field, mat-button)
- [ ] Implement login logic:
  - [ ] Call AuthService.login()
  - [ ] Store token
  - [ ] Navigate to dashboard on success
  - [ ] Show error message on failure
- [ ] Add loading state during login

### 11.3 Register Component (Optional for v1)
- [ ] Create registration form:
  - [ ] Name field
  - [ ] Email field
  - [ ] Password field
  - [ ] Confirm password field
  - [ ] Role selection (if admin)
- [ ] Implement registration logic
- [ ] Navigate to login after successful registration

### 11.4 App Routing
- [ ] Configure main app routing in `app-routing.module.ts`:
  - [ ] Redirect `/` to `/dashboard`
  - [ ] `/login` (public)
  - [ ] `/dashboard` (protected)
  - [ ] `/fundir` (protected)
  - [ ] Lazy load feature modules
- [ ] Add auth guard to protected routes
- [ ] Add redirect to login for unauthenticated users

---

## Phase 12: Frontend - Main Layout & Navigation

### 12.1 Layout Component
- [ ] Create `src/app/core/layout/main-layout/main-layout.component.ts`
- [ ] Design layout matching Figma:
  - [ ] Sidebar navigation (hamburger menu)
  - [ ] Top bar with user info
  - [ ] Content area (router-outlet)
- [ ] Use Angular Material:
  - [ ] mat-sidenav for sidebar
  - [ ] mat-toolbar for top bar
  - [ ] mat-icon for icons

### 12.2 Sidebar Navigation
- [ ] Create navigation menu items:
  - [ ] "Yvirlit yvir fundir" (Meeting overview)
  - [ ] "Nevndir" (Committees) - Secretary only
  - [ ] "Nevndarlimir" (Committee members) - Secretary only
  - [ ] "Brúkarar" (Users) - Secretary only (future)
  - [ ] "Uppseting" (Settings)
- [ ] Show user profile in sidebar:
  - [ ] Avatar
  - [ ] Name ("Jens Jensen")
  - [ ] Role ("Inritaður sum")
- [ ] Add logout button
- [ ] Implement role-based menu visibility
- [ ] Add active route highlighting

### 12.3 Top Bar
- [ ] Add breadcrumb navigation (optional)
- [ ] Add notification bell icon (for push notifications)
- [ ] Add "Skifta felag" (Switch organization) button (future multi-tenant)

---

## Phase 13: Frontend - Fundir (Meetings) List - MAIN SLICE

### 13.1 Fundir Module
- [ ] Generate module: `ng g module features/fundir --routing`
- [ ] Create service: `ng g service features/fundir/services/fundur`
- [ ] Implement FundurService methods:
  - [ ] `getFundir(filters?: FundurFilter): Observable<Fundur[]>`
  - [ ] `getFundurById(id: string): Observable<FundurDetail>`
  - [ ] `createFundur(request: CreateFundurRequest): Observable<Fundur>`
  - [ ] `updateFundur(id: string, request: UpdateFundurRequest): Observable<Fundur>`
  - [ ] `deleteFundur(id: string): Observable<boolean>`
  - [ ] `updateStatus(id: string, status: FundurStatus): Observable<Fundur>`

### 13.2 Fundir List Component
- [ ] Create component: `ng g component features/fundir/fundir-list`
- [ ] Design layout matching Figma screenshot 1:
  - [ ] Page title: "Yvirlit yvir fundir"
  - [ ] Filter section:
    - [ ] Committee dropdown ("Allar nevndir")
    - [ ] Date range pickers (start date, end date)
    - [ ] "Stovna nýggjan nevnd" button (Secretary only)
    - [ ] "Stovna nýggjan fund" button (Secretary only)
  - [ ] Table view:
    - [ ] Columns: Fundir/nevnd, Fundur #, Næsti fundur, Fundur leysgivin, Frágreiðing um fundin, Leysgivin
    - [ ] Clickable rows
    - [ ] Color coding (e.g., "Nei" in red)
- [ ] Implement filtering logic:
  - [ ] Filter by committee (multi-select or single)
  - [ ] Filter by date range
  - [ ] Apply filters on change
- [ ] Add pagination (if many meetings)
- [ ] Add loading spinner while fetching data
- [ ] Navigate to meeting details on row click

### 13.3 Committee Filter Component
- [ ] Create shared component for committee selection
- [ ] Use mat-select with multiple selection
- [ ] Load committees from NevndService
- [ ] Emit selected committees to parent

### 13.4 Routing
- [ ] Configure fundir routing:
  - [ ] `/fundir` → FundirListComponent
  - [ ] `/fundir/new` → CreateFundurComponent (Secretary only)
  - [ ] `/fundir/:id` → FundurDetailComponent

---

## Phase 14: Frontend - Fundur (Meeting) Details - MAIN SLICE

### 14.1 Fundur Detail Component
- [ ] Create component: `ng g component features/fundir/fundur-detail`
- [ ] Design layout matching Figma screenshots 7-8:
  - [ ] Top section:
    - [ ] Meeting title/type (e.g., "TEKNISKANEVND")
    - [ ] Meeting number (e.g., "Fundur nr. 5/2022")
    - [ ] Date/location info
    - [ ] "Fundur opin!" status badge
    - [ ] Action buttons: "STOVNA SKRÁ" (Secretary)
    - [ ] Committee members icons with "Nevndarlimir" button
  - [ ] Left sidebar:
    - [ ] "Lýsing av fundinum" section (description)
    - [ ] Agenda items list (numbered):
      - [ ] Item title
      - [ ] Status indicators (icons with numbers)
  - [ ] Main content area:
    - [ ] Selected agenda item details
    - [ ] Tabs: "Byggíloyvl til frystugoymslu", "Tilmæli", "Skjal", etc.
  - [ ] Bottom actions:
    - [ ] "Niðurstøða", "Notat", "Uppgáva" buttons
    - [ ] "Prenta fundin" button
    - [ ] "Avrifa til annað mál" button
    - [ ] "Leysgjeva fundin" button
    - [ ] "AFTUR", "GOYM" buttons
- [ ] Load meeting data on init (using route param ID)
- [ ] Display all meeting information
- [ ] Show agenda items in sidebar
- [ ] Handle agenda item selection (click to view details)

### 14.2 Agenda Item List (Sidebar)
- [ ] Create component: `ng g component features/fundir/components/agenda-item-list`
- [ ] Display agenda items with numbers
- [ ] Show status icons (document count, etc.)
- [ ] Highlight selected item
- [ ] Handle click events to select item
- [ ] Show "+ AFTUR" button for adding new items (Secretary)

### 14.3 Agenda Item Detail (Main Content)
- [ ] Create component: `ng g component features/fundarpunktur/fundarpunktur-detail`
- [ ] Display selected agenda item:
  - [ ] Title/description
  - [ ] Málslýsing (description text)
  - [ ] Tilmæli (recommendations) section
  - [ ] Skjol (documents) section with previews
  - [ ] Niðurstøður (conclusions) section
- [ ] Add tabs for different sections (if needed)

### 14.4 Meeting Participants Display
- [ ] Create component: `ng g component features/fundir/components/participants-display`
- [ ] Show participant avatars/icons
- [ ] Open modal/dialog on "Tilluta atgongd" or "Nevndarlimir" button
- [ ] Display participant list with:
  - [ ] Name
  - [ ] Title/Role
  - [ ] Rights (Rættindi)
  - [ ] Active status toggle (Virkin)
- [ ] Allow adding/removing participants (Secretary only)

### 14.5 Meeting Actions (Bottom Buttons)
- [ ] Implement "Niðurstøða" button:
  - [ ] Open dialog to add conclusion
  - [ ] Save conclusion to selected agenda item
- [ ] Implement "Notat" button:
  - [ ] Open dialog to add note
  - [ ] Save note for current user
- [ ] Implement "Uppgáva" button (Secretary):
  - [ ] Open dialog to create task
  - [ ] Assign task to user
- [ ] Implement "GOYM" (Save) button:
  - [ ] Save all changes
  - [ ] Show success message
- [ ] Implement status change buttons (Secretary):
  - [ ] "Loka fundin" (Close meeting)
  - [ ] "Leysgjeva fundin" (Approve meeting)
  - [ ] Show confirmation dialog

---

## Phase 15: Frontend - Create/Edit Fundur (Meeting) - Secretary Only

### 15.1 Create Fundur Component
- [ ] Create component: `ng g component features/fundir/create-fundur`
- [ ] Design form matching Figma screenshot 6:
  - [ ] Nevnd (Committee) dropdown
  - [ ] Fundarskabelón (Template) dropdown (optional for v1)
  - [ ] Yvirskrift/heiti (Title) field
  - [ ] Fundarstaður (Location) field
  - [ ] Byrjunar dato (Start date/time) picker
  - [ ] Enda dato (End date/time) picker
  - [ ] Lukkað/ur fundur? (Is closed) radio buttons
  - [ ] Viðheft møgulu atmen skjøl (Attachments) section
  - [ ] Lýsing av fundinum (Description) textarea
  - [ ] "AFTUR" (Cancel), "GOYM" (Save) buttons
- [ ] Implement form validation:
  - [ ] Committee required
  - [ ] Start date required
  - [ ] End date after start date
- [ ] Add date/time pickers (Angular Material Datepicker)
- [ ] Implement file upload for attachments
- [ ] Call FundurService.createFundur() on submit
- [ ] Navigate to meeting details on success
- [ ] Show error message on failure

### 15.2 Edit Fundur Component
- [ ] Create component: `ng g component features/fundir/edit-fundur`
- [ ] Reuse form from CreateFundurComponent (shared form component)
- [ ] Load existing meeting data
- [ ] Pre-populate form fields
- [ ] Call FundurService.updateFundur() on submit
- [ ] Handle concurrent edits (optimistic locking, optional)

### 15.3 Fundur Form Component (Shared)
- [ ] Create reusable form component: `ng g component features/fundir/components/fundur-form`
- [ ] Accept @Input() for initial data (for edit mode)
- [ ] @Output() for form submission
- [ ] Extract form logic for reuse

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

### 18.1 Stovna Skrá Component
- [ ] Create component: `ng g component features/fundir/stovna-skra`
- [ ] Design matching Figma screenshots 8-10:
  - [ ] Form fields:
    - [ ] Navn (Name/Title)
    - [ ] Heinta mál frá Journal (fetch from journal) - search field with modal
    - [ ] Målslýsing (Description) textarea
    - [ ] Heinta tilmæli (Fetch recommendation) - search modal
    - [ ] Nummar í fundarskrá (Document number in meeting) - auto-increment selector
    - [ ] Fundarstaður (Location/Author)
    - [ ] Legg skjal inn frá Journal (Add document from journal) - upload area
  - [ ] Document list sections:
    - [ ] Numbered items (1, 2, ...) with document titles
    - [ ] Icons for web/private/locked status
  - [ ] Link to web page section
  - [ ] "AFTUR", "GOYM" buttons
- [ ] Implement form logic
- [ ] Connect to SkjalService for uploads
- [ ] Save document metadata

### 18.2 Journal Search Modal (Placeholder for v1)
- [ ] Create modal component: `ng g component features/skjol/journal-search-modal`
- [ ] Design matching Figma screenshot 9:
  - [ ] Search field
  - [ ] Filter options (search strict journals, show locked journals)
  - [ ] Results table with:
    - [ ] Journal number
    - [ ] Title
    - [ ] Journal plan
    - [ ] Split date
    - [ ] Checkboxes for selection
  - [ ] "Vel journal" (Select journal) button
- [ ] Display message: "Journal integration coming in v2"
- [ ] Allow manual entry instead

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

**Last Updated:** [Insert Date]

**Current Phase:** Phase 1 - Project Setup

**Completed Phases:** None

**In Progress:**
- [ ] Setting up development environment

**Blockers:** None

**Notes:**
- Remember to update this TODO.md file as tasks are completed
- Mark items with `[x]` when done
- Add notes for any issues encountered
- Keep track of time spent on each phase
