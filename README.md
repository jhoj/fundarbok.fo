<div align="center">
  <img src="./frontend/fundarbok-web/public/fundarbok_logo.svg" alt="Fundarbok.fo Logo" width="150" height="150">

  # Fundarbok.fo

  Committee meeting management system for Faroese councils and organizations.
</div>

## Overview

Fundarbók is a Progressive Web Application (PWA) that manages the complete lifecycle of committee meetings with distinct workflows for secretaries (admins) and committee members.

### Three-Phase Meeting Workflow

**1. Plan Meeting**
- Secretary selects committee and agenda items
- Orders agenda items and assigns reading materials/documents
- Manages member substitutions
- (Future: Integration with external systems for agendas and documents)

**2. Live Meeting**
- Secretary controls the meeting with real-time dashboard:
  - Clear agenda list and participant list
  - Mark members as "speaking" (auto-records to history with timestamp)
  - Auto-generates meeting summary
  - Conducts voting and records conclusions
- Members participate:
  - View current agenda item and assigned documents
  - Add personal notes
  - Vote when enabled
  - Sign approval digitally (MFA-secured)

**3. Complete Meeting**
- Secretary finalizes summary and conclusions
- Collects digital signatures from all participants (in-house only, MFA-verified)
- Exports meeting conclusions to public journals (Gerðabókin format)
- Uploads to external systems for archival

### User Roles

**Secretary (Skrivari) - Admin Access**
- Full meeting management (plan, control, complete)
- Approve conclusions
- Manage members and document permissions
- Gather signatures
- Export meeting logs

**Committee Member (Nevndarlimur) - Participant Access**
- View assigned meetings and documents
- Add personal notes
- Speak and vote during meetings
- Sign meeting approval

## Project Status & Roadmap

This project is actively under development with a phased implementation approach. Track progress and contribute via [GitHub Issues](https://github.com/jhoj/fundarbok.fo/issues).

### Current Work (MVP Release)

| Phase | Task | Priority | Status | Link |
|-------|------|----------|--------|------|
| 9 | Backend Push Notification Triggers | High | To Do | [#1](https://github.com/jhoj/fundarbok.fo/issues/1) |
| 23 | Styling & Theming | High | To Do | [#3](https://github.com/jhoj/fundarbok.fo/issues/3) |
| 24 | Testing | High | To Do | [#4](https://github.com/jhoj/fundarbok.fo/issues/4) |

### Upcoming Work (Post-MVP)

| Phase | Task | Priority | Status | Link |
|-------|------|----------|--------|------|
| 18 | Frontend - Create Document/Report (STOVNA SKRÁ) | Medium | Blocked | [#2](https://github.com/jhoj/fundarbok.fo/issues/2) |

## Technology Stack

- **Frontend**: Angular
- **Backend**: .NET Core / C#
- **Database**: PostgreSQL
- **PWA**: Firebase Cloud Messaging (FCM)
- **Deployment**: Docker, CI/CD

## Getting Started

### Prerequisites
- Node.js (for frontend)
- .NET 6+ (for backend)
- PostgreSQL
- Docker (optional)

### Development Setup

```bash
# Backend
cd backend
dotnet build
dotnet run

# Frontend
cd frontend
npm install
npm start
```

## Test Credentials

Available in completed phases and CI/CD configuration.

## Contributing

See [GitHub Issues](https://github.com/jhoj/fundarbok.fo/issues) for open work.

For completed milestones, see `completed-todos.md`.

## License

TBD
