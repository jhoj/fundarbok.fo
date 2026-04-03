# CLAUDE.md - Fundarbók PWA

This file provides guidance for AI assistants working with the Fundarbók codebase.

## Project Overview

Fundarbók is a Progressive Web Application (PWA) for committee meeting management, built for Faroese organizations (councils and similar bodies). The system manages the complete lifecycle of meetings with distinct roles and workflows for secretaries (admins) and committee members.

**Primary Users:**
- **Secretary (Skrivari)**: Full admin access - plans meetings, manages agendas, controls live meetings, approves conclusions
- **Committee Member (Nevndarlimur)**: Views meetings, adds personal notes, speaks during live meetings, completes assigned tasks

## System Workflow Overview

The system operates in three distinct phases:

### Phase 1: Plan Meeting
The secretary plans an upcoming meeting by:
- Selecting the committee
- Choosing agenda items (initially standalone, will integrate with external systems for agendas and documents)
- Ordering agenda items
- Assigning reading materials/documents to each agenda item
- Managing member substitutions when members decline participation
- **Future Integration**: Agendas and documents will be sourced from external systems, but the system starts standalone

### Phase 2: Live Meeting
During the active meeting:
- **Secretary View**: 
  - Clear view of the full agenda list
  - Real-time participant list
  - Can click on members to mark them as "speaking"
  - System automatically records to meeting history: participant name, timestamp, action (speaking)
  - Auto-generates meeting summary (with minimal manual input)
  - Conducts voting on agenda items
  - Records conclusions for each agenda item
  - Gathering signatures from participants (in-house only, MFA-secured digital signatures)
- **Member View**:
  - Sees current agenda item
  - Can view assigned documents/reading materials (with admin-controlled access restrictions)
  - Can add personal notes
  - Can participate in discussions and voting (if enabled for specific agenda items)
  - Signs approval at meeting end via digital signature (with MFA)

### Phase 3: Complete Meeting
After the live meeting:
- Secretary finalizes the meeting summary
- All conclusions are reviewed and confirmed
- Voting results are recorded
- Meeting is marked as completed and approved
- Historical record is created for the committee's archives
- **Signature Management**: Secretary gathers digital signatures from all participants present (in-house only, MFA-verified)
- **Journal Export**: Easy export of meeting conclusions to publicly viewable journals (Gerðabókin/meeting log format)
- **External System Integration**: Upload completed agenda conclusions to correct journals and external systems

**Note**: The system will support integration with external systems for agenda sourcing and document management in future phases, but will function as a standalone system initially.

## Member Management & Security

### Member Onboarding
- **Admin**: Adds new members to the system
- **Members**: Reset password via email link
- **MFA Requirements**: All users must complete MFA setup (method TBD - SMS/authenticator app/etc.)

### Member Access Control
- Members can view only meetings they are explicitly added to
- Members can read documents assigned to their meetings
- **Admin Document Restrictions**: Secretary can restrict document/agenda access based on:
  - Personal conflicts of interest
  - Confidentiality requirements
  - Role-based restrictions
- Members cannot bypass access restrictions

### Meeting Participation
- Members see current agenda item during live meetings
- Members can view assigned reading materials
- Members vote when voting is enabled for an agenda item
- Members provide digital signature for meeting approval (MFA-secured)

### Digital Signatures & Audit Trail
- All signatures collected digitally with MFA verification
- Only participants who were present at the meeting can sign
- System maintains complete audit trail of:
  - Who signed and when
  - MFA verification details
  - Signature validity and timestamps
- Export-ready for compliance and archival purposes

## Architecture

The project follows **Clean Architecture** with clear separation of concerns:

```
fundarbok.fo/
├── backend/                      # ASP.NET Core 8.0 Backend
│   ├── Fundarbok.sln            # Solution file
│   ├── Fundarbok.API/           # Web API layer (Controllers, endpoints)
│   ├── Fundarbok.Application/   # Business logic layer (Services, DTOs)
│   ├── Fundarbok.Domain/        # Domain entities and models
│   └── Fundarbok.Infrastructure/ # Data access (EF Core, DbContext)
├── frontend/
│   └── fundarbok-web/           # Angular 18 PWA
│       ├── src/app/
│       │   ├── core/            # Guards, interceptors, core services
│       │   ├── shared/          # Shared components, pipes, directives
│       │   ├── features/        # Feature modules (auth, meetings, etc.)
│       │   └── models/          # TypeScript interfaces
│       └── src/environments/    # Environment configs
└── TODO.md                      # Project roadmap and task tracking
```

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0 (C#)
- **ORM**: Entity Framework Core 9.0
- **Database**: PostgreSQL
- **Authentication**: JWT Bearer tokens
- **Password Hashing**: BCrypt.Net
- **API Docs**: Swagger/OpenAPI (Swashbuckle)
- **Push Notifications**: WebPush library

### Frontend
- **Framework**: Angular 18.0 (TypeScript 5.4)
- **UI Components**: Angular Material 18
- **Styling**: SCSS
- **PWA**: @angular/pwa with service worker
- **PDF Viewer**: ngx-extended-pdf-viewer
- **Date Handling**: date-fns
- **Testing**: Karma + Jasmine

## Development Workflow

### Prerequisites
- Docker (for PostgreSQL)
- .NET 8 SDK
- Node.js (LTS) and npm
- Angular CLI: `npm install -g @angular/cli`
- EF Core tools: `dotnet tool install --global dotnet-ef`

### Starting the Database
```bash
docker compose -f docker-compose.dev.yml up -d
```
This starts PostgreSQL on port 5432 with database `fundarbok`, user `postgres`, password `postgres`.

### Running the Backend
```bash
cd backend/Fundarbok.API
dotnet restore
dotnet run
```
- Development: `http://localhost:5255` or `https://localhost:7174`
- Swagger: `http://localhost:5255/swagger`

### Running the Frontend
```bash
cd frontend/fundarbok-web
npm install
npm start
```
- Development: `http://localhost:4200`
- Proxy config forwards `/api` to backend at `http://localhost:5255`

### Database Commands
```bash
cd backend/Fundarbok.Infrastructure

# Add a new migration
dotnet ef migrations add <MigrationName> --startup-project ../Fundarbok.API

# Apply migrations
dotnet ef database update --startup-project ../Fundarbok.API

# Remove last migration (if not applied)
dotnet ef migrations remove --startup-project ../Fundarbok.API
```

### Build Commands
```bash
# Backend
cd backend
dotnet build

# Frontend production build
cd frontend/fundarbok-web
npm run build
```

### Test Commands
```bash
# Frontend tests
cd frontend/fundarbok-web
npm test
```

## Naming Conventions

**CRITICAL**: All code uses **English names** - translations are handled by the frontend i18n system.

| Faroese (UI) | English (Code) |
|--------------|----------------|
| Nevnd | Committee |
| Nevndarlimur | CommitteeMember |
| Fundur | Meeting |
| Fundarpunktur | AgendaItem |
| Skjal | Document |
| Notat | Note |
| Uppgáva | AgendaTask (to avoid System.Threading.Tasks.Task) |
| Tilmæli | Recommendation |
| Niðurstøða | Conclusion |
| Brukari | User |
| Skrivari | Secretary |

### Code Style
- **C#**: File-scoped namespaces, nullable enabled, implicit usings
- **TypeScript**: Strict mode, no implicit any
- **Angular**: Standalone components pattern
- **Translation keys**: Use dot notation (e.g., `meetings.title`, `common.save`)

## Key Domain Entities

Located in `backend/Fundarbok.Domain/Entities/`:

- **Committee**: Organization committees/boards
- **CommitteeMember**: Members with roles (Chairman, Member, Secretary)
- **Meeting**: Meeting records with status (IsOpen, IsCompleted, IsApproved)
- **MeetingParticipant**: Attendance tracking (composite key)
- **AgendaItem**: Numbered items on meeting agenda
- **Recommendation**: Proposed recommendations for agenda items
- **Conclusion**: Final decisions on agenda items
- **Document**: PDF and other file attachments
- **Note**: Private user notes on agenda items
- **AgendaTask**: Tasks assigned to users with due dates
- **User**: System users with roles and language preferences
- **PushSubscription**: Web push notification subscriptions

## Key Configuration Files

### Backend
- `backend/Fundarbok.API/appsettings.json`: Connection strings, JWT settings, CORS
- `backend/Fundarbok.API/appsettings.Development.json`: Dev-specific logging
- `backend/Fundarbok.API/Properties/launchSettings.json`: Kestrel profiles

### Frontend
- `frontend/fundarbok-web/angular.json`: Angular CLI config, build settings
- `frontend/fundarbok-web/tsconfig.json`: TypeScript compiler options
- `frontend/fundarbok-web/proxy.conf.json`: API proxy for development
- `frontend/fundarbok-web/ngsw-config.json`: Service worker caching
- `frontend/fundarbok-web/src/environments/`: API URLs per environment

## Database

**Connection**: `Host=localhost;Database=fundarbok;Username=postgres;Password=postgres`

### Seeded Test Users
| Role | Email | Password |
|------|-------|----------|
| Secretary | secretary@fundarbok.fo | password123 |
| Committee Member | jens@fundarbok.fo | password123 |

### Key Tables
- `Committees`, `CommitteeMembers`
- `Meetings`, `MeetingParticipants`
- `AgendaItems`, `Recommendations`, `Conclusions`
- `Documents`, `Notes`, `AgendaTasks`
- `Users`, `PushSubscriptions`

### Important Relationships
- Committee → Meetings (one-to-many, restrict delete)
- Meeting → AgendaItems (one-to-many, cascade delete)
- Meeting → MeetingParticipants (one-to-many, cascade delete)
- AgendaItem → Documents, Recommendations, Conclusions, Notes, Tasks (cascade delete)

## Project Status

**Current Phase**: Phase 0 (Infrastructure) and Phase 1 (Foundation) complete

**What's Done**:
- Project structure and configuration
- All domain entities defined
- EF Core DbContext with full configuration
- Initial database migration applied
- Database seeding with sample data
- Frontend project with Angular Material and PWA support

**What's Pending** (Priority Order):
1. **Phase 1.5 - Member Management & Security**:
   - MFA system (method TBD - SMS/authenticator/etc.)
   - Admin member management (add/remove/reset password)
   - Member access control and document restrictions
   - Digital signature infrastructure
   
2. **Phase 2 - Meeting Planning Features**:
   - API endpoints for meeting creation and management
   - Secretary UI for planning meetings (committee selection, agenda ordering, document assignment)
   - Member substitution management
   - Document access restrictions and permissions
   
3. **Phase 3 - Live Meeting Features**:
   - Real-time meeting session management
   - Secretary meeting dashboard (agenda view, participant list, control panel)
   - Live speaker tracking and auto-history recording
   - Member live meeting interface
   - Digital signature collection (MFA-secured)
   
4. **Phase 4 - Meeting Completion & Reporting**:
   - Summary generation and editing
   - Voting and conclusion recording
   - Meeting approval workflow with signatures
   - Journal export (Gerðabókin format)
   - Historical archives
   
5. **Phase 5 - Integration & Enhancement**:
   - External system integration for agenda sourcing
   - Document management integration
   - Journal/conclusion upload to external systems
   - Push notifications for meeting updates
   - Advanced reporting and analytics

See `TODO.md` for the detailed implementation roadmap.

## Common Tasks

### Adding a New Entity
1. Create entity class in `Fundarbok.Domain/Entities/`
2. Add DbSet to `FundarbokDbContext`
3. Configure relationships in `OnModelCreating`
4. Create migration: `dotnet ef migrations add AddNewEntity`
5. Apply migration: `dotnet ef database update`

### Adding a New API Endpoint
1. Create DTOs in `Fundarbok.Application/DTOs/`
2. Create service interface and implementation in `Fundarbok.Application/Services/`
3. Create controller in `Fundarbok.API/Controllers/`
4. Register services in `Program.cs`

### Adding a New Angular Component
```bash
cd frontend/fundarbok-web
ng generate component features/<feature-name>/<component-name> --standalone
```

### Adding a New Angular Service
```bash
ng generate service features/<feature-name>/services/<service-name>
```

## Important Notes

1. **Cascade Delete Rules**: Carefully review delete behavior in `FundarbokDbContext`. Documents use cascade delete from both Meeting and AgendaItem.

2. **MFA Implementation** (TBD): 
   - Required for all users
   - Method to be determined (TOTP/SMS/etc.)
   - Must be enforced for digital signature collection
   - Plan domain entities and database migration

3. **Digital Signatures & Audit Trail**:
   - Only participants marked as "present" can sign
   - All signatures must be MFA-verified
   - Maintain complete audit log: who signed, when, MFA verification details
   - Design signature storage and validation strategy
   - Export-ready format for compliance

4. **Member Access Control**:
   - Implement permission model for document access
   - Secretary can restrict documents/agendas per member
   - Enforce access restrictions in API layer
   - Consider conflict-of-interest and confidentiality scenarios

5. **Journal Export (Gerðabókin)**:
   - Plan export format for public meeting logs
   - Support conclusions upload to external systems
   - Maintain formatting for compliance with Faroese standards

6. **PWA Service Worker**: Only enabled in production builds. Test with `ng build --configuration production` then serve the dist folder.

7. **CORS**: Configured for `localhost:4200` and `localhost:4300` in development.

8. **JWT Secret**: Change `JwtSettings.SecretKey` before production deployment.

9. **File Uploads**: Not yet implemented. `/uploads` folder planned but not created.

10. **Application Layer**: `Fundarbok.Application` is mostly empty - ready for business logic and DTOs.

## Troubleshooting

### Database connection fails
- Ensure PostgreSQL container is running: `docker compose -f docker-compose.dev.yml up -d`
- Check container logs: `docker compose -f docker-compose.dev.yml logs db`
- Verify database `fundarbok` exists
- Check credentials match appsettings.json

### Frontend can't reach API
- Check backend is running
- Verify proxy.conf.json target port matches backend
- Start frontend with: `ng serve --proxy-config proxy.conf.json`

### EF Core migration errors
- Ensure you're in the Infrastructure project directory
- Use `--startup-project ../Fundarbok.API` flag
- Check for model configuration issues in DbContext
