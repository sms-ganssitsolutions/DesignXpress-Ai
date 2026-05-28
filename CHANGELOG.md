# Changelog

All notable changes to DesignXpress AI Story Video Studio are documented here.

## [v1.0-documentation-complete] - 2026

### Documentation Expansion (Major Release)
- Created comprehensive Documentation Hub (`docs/index.md`)
- Added dedicated `docs/diagrams.md` with multiple Mermaid diagrams:
  - System architecture
  - AI services data flow
  - Media upload pipeline
  - Export queue state machine
  - Full Entity Relationship Diagram
  - Real-time collaboration flow
- New specialized guides:
  - `workflows.md` (user & developer workflows)
  - `faq.md`
  - `testing.md` (expanded with examples)
  - `performance.md` (expanded with metrics)
  - `environment-variables.md`
  - `security.md`
  - `contributing.md`
  - `roadmap.md`
- Created single-file consolidated guide: `DesignXpress_AI_Complete_User_and_Developer_Guide.md` (optimized for PDF export)
- Significantly enhanced `architecture.md`, `deployment.md`, and `README.md`
- Added local release notes: `RELEASE_v1.0-documentation-complete.md`
- Tagged as `v1.0-documentation-complete`

This release dramatically improves the usability and maintainability of the project through professional-grade documentation.

## [v1.0] - Advanced Collaboration & Rendering

### Major Features
- **BullMQ Export Queue**: Professional background job system for video rendering with progress tracking, retries, and history
- **Real Video Clip Support**: Scenes can now use actual uploaded video files in FFmpeg renders
- **Playable Video Preview**: HTML5 video playback directly inside the Studio timeline
- **Project Version History**: Automatic versioning with restore functionality
- **Enhanced Real-time Collaboration**: Bidirectional scene sync + in-Studio team chat
- **Improved Media Library**: Folder organization and search
- **Public Project Sharing**: Foundation for shareable links

### Technical Improvements
- Added `ExportJob` model to Prisma
- Robust error handling across queues, AI calls, and rendering
- Better Socket.IO event management

---

## [v0.8 - v0.9] - Collaboration & Polish

- Live floating cursors
- Real-time scene synchronization
- In-Studio chat
- AI Music Suggestions
- PayPal checkout modal (sandbox)
- Templates Marketplace with publish + load flow
- Basic Version History
- Significant FFmpeg improvements (multi-track audio, transitions)

---

## [v0.6 - v0.7] - Advanced Rendering

- Multi-track audio with music bed ducking
- Advanced FFmpeg transitions (dissolve, wipe, fade)
- Real OpenAI integration with graceful fallbacks
- Production Docker setup (`docker-compose.prod.yml`)
- Initial BullMQ preparation

---

## [v0.4 - v0.5] - Core Platform

- Full Next.js 15 frontend with glassmorphism UI
- Express + Prisma backend
- JWT authentication
- Basic FFmpeg rendering pipeline
- AI tools panel (script, voiceover, thumbnail, subtitles)
- Docker development environment
- PowerShell automation scripts for Windows

---

**Note**: This project follows continuous development. Version numbers in this changelog reflect major milestone releases during active building.
