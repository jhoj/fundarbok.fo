# Fundarbók PWA - Current Status & Roadmap

## Project Overview
**Fundarbók** is a PWA for managing committee meetings.
**Stack**: Angular 18+, ASP.NET Core 8, PostgreSQL
**Status**: 22/26 phases complete, ready for Phase 9, 18, 23-24

**Naming Convention**: All code uses English names (Committee, Meeting, AgendaItem, etc.). UI text translated via i18n.

---

## COMPLETED PHASES (22/26) ✅
See `completed-todos.md` for full details.

**Backend (Phases 1-8, 22):**
- Project setup, DB schema, Auth, Committees, Meetings, Agenda Items, Documents, Notes/Tasks, PWA

**Frontend (Phases 10-17, 19-22):**
- Angular structure, Auth, Layout, Meetings List, Meeting Details, Create/Edit Meeting, Document Upload, Agenda Item Management, Dialogs (Conclusions/Notes/Tasks), Approve & Close Meeting, Committee Member View, PWA Configuration

**Build Status:**
- Frontend: ✅ Builds successfully (no TS errors)
- Backend: ✅ Builds successfully (no C# errors)
- Backend: port 5255 | Frontend: port 4200

---

## PENDING PHASES (4 remaining)

### Phase 9: Backend Push Notification Triggers
**Status**: Infrastructure DONE → Needs trigger integration
**Tasks:**
- [ ] Integrate push notification triggers into MeetingService
  - [ ] Send notification when user assigned to meeting
  - [ ] Send notification when task assigned
  - [ ] Send notification when meeting status changes
- [ ] Integrate into TaskService for task-assigned events
- [ ] Add notification preferences (optional for v1)

**Est. Time**: 2-4 hours

---

### Phase 18: Frontend - STOVNA SKRÁ (Create Document/Report)
**Status**: NOT STARTED
**Blocker**: Journal API integration requirements
**Tasks:**
- [ ] Create StovnaSkraComponent (complex document form)
- [ ] Journal search dialog with filtering
- [ ] Document list with metadata (name, public/lock status)
- [ ] Manual entry support if Journal API unavailable
- [ ] Link to web page field
- [ ] Document number sequencing

**Dependencies**: Journal system integration details needed
**Est. Time**: 8-12 hours

---

### Phase 23: Styling & Theming
**Status**: NOT STARTED
**Tasks:**
- [ ] Create custom Angular Material theme (teal/cyan brand color)
- [ ] Global styles and variables
- [ ] Responsive design testing (320px → 1920px)
- [ ] Faroese language rendering validation
- [ ] Component-specific styling refinements

**Est. Time**: 6-10 hours

---

### Phase 24: Testing
**Status**: NOT STARTED
**Tasks:**
- [ ] E2E tests (Cypress/Playwright) - PRIORITY
  - Login → Create meeting → Add agenda items → Close meeting → Approve
- [ ] Frontend unit tests (optional for MVP)
- [ ] Backend unit tests (optional for MVP)
- [ ] Manual testing checklist

**Est. Time**: 10-16 hours (E2E core tests)

---

## RECOMMENDED NEXT STEPS

**Immediate (before MVP release):**
1. **Phase 9** (2-4h) - Add push triggers to existing services
2. **Phase 23** (6-10h) - Polish styling and responsive design
3. **Phase 18** (8-12h) - Document creation form (if Journal integration available)

**Before public launch:**
4. **Phase 24** (10-16h) - Core E2E tests for main workflows

**Post-MVP:**
5. Phase 25 - Deployment preparation
6. Phase 26 - Post-MVP enhancements

---

## KEY FEATURES IMPLEMENTED ✅

**Core Functionality:**
- Full meeting lifecycle (create → edit → close → approve)
- Agenda items with drag-drop reordering
- Document upload/preview (PDF, images, Office)
- Notes per committee member (private)
- Task assignment & tracking
- Conclusions/Recommendations per agenda item

**Architecture:**
- Role-based access (Secretary vs Committee Member)
- JWT authentication
- Repository + Service + Controller pattern
- Reactive Angular with Material Design
- Responsive layouts (mobile → desktop)

**PWA Features:**
- Offline support with service worker caching
- Push notification subscription infrastructure
- Update detection & installation prompts
- Manifest configuration complete

**Test Credentials:**
- Secretary: `secretary@fundarbok.fo` / `password123`
- Member: `jens@fundarbok.fo` / `password123`

---

## NOTES

- Phase 12.5 (i18n Translations) marked OPTIONAL - UI uses placeholder keys currently
- Phase 18 depends on Journal system API details (can defer if not MVP-critical)
- All core APIs tested and working via curl
- Ready for end-to-end user testing
- No security vulnerabilities identified in architecture

---

## Quick Reference

| Phase | Status | Time | Notes |
|-------|--------|------|-------|
| 1-8 | ✅ | - | Backend core |
| 9 | ⏳ | 2-4h | Push triggers |
| 10-17, 19-22 | ✅ | - | Frontend core + PWA |
| 18 | ⏳ | 8-12h | Document creation |
| 23 | ⏳ | 6-10h | Styling |
| 24 | ⏳ | 10-16h | Testing |

