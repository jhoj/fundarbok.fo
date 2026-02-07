# CLAUDE.md - Fundarbók PWA

This file provides guidance for AI assistants working with the Fundarbók codebase.

## Project Overview

Fundarbók is a Progressive Web Application (PWA) for meeting management, built for Faroese organizations. It allows secretaries to create and manage committee meetings, agenda items, documents, and enables committee members to view meetings and add personal notes.

**Primary Users:**
- **Secretary (Skrivari)**: Full admin access - create/edit/approve meetings
- **Committee Member (Nevndarlimur)**: View meetings, add personal notes, complete assigned tasks

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
- .NET 8 SDK
- Node.js (LTS) and npm
- PostgreSQL (database: `fundarbok`, user: `postgres`, password: `postgres`)
- Angular CLI: `npm install -g @angular/cli`

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
- Proxy config forwards `/api` to backend at `http://localhost:5000`

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

**Current Phase**: Phase 1 complete, Phase 2 (Domain Models) complete

**What's Done**:
- Project structure and configuration
- All domain entities defined
- EF Core DbContext with full configuration
- Initial database migration applied
- Database seeding with sample data
- Frontend project with Angular Material and PWA support

**What's Pending**:
- API Controllers
- Authentication endpoints
- Business logic services
- Frontend components and routing
- Testing infrastructure

See `TODO.md` for the complete implementation roadmap.

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

1. **API Proxy Mismatch**: Frontend proxy targets port 5000, but backend defaults to 5255. Either update proxy.conf.json or use http profile.

2. **Cascade Delete Rules**: Carefully review delete behavior in `FundarbokDbContext`. Documents use cascade delete from both Meeting and AgendaItem.

3. **PWA Service Worker**: Only enabled in production builds. Test with `ng build --configuration production` then serve the dist folder.

4. **CORS**: Configured for `localhost:4200` and `localhost:4300` in development.

5. **JWT Secret**: Change `JwtSettings.SecretKey` before production deployment.

6. **File Uploads**: Not yet implemented. `/uploads` folder planned but not created.

7. **Application Layer**: `Fundarbok.Application` is mostly empty - ready for business logic and DTOs.

## Troubleshooting

### Database connection fails
- Ensure PostgreSQL is running
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
