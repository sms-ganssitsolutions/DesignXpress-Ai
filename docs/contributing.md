# Contributing to DesignXpress AI

Thank you for your interest in contributing to **DesignXpress AI Story Video Studio**!

This document outlines how to contribute effectively.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Assume good intent

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Follow the [Getting Started Guide](./getting-started.md) to set up the project
4. Create a new branch for your feature/fix:
   ```powershell
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Before Submitting a Pull Request

- Make sure the app runs cleanly with `.\scripts\start.ps1`
- Test your changes on Windows 11 (the primary target platform)
- Add or update documentation when appropriate
- Keep commits focused and well-described

### Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add real video clip support to FFmpeg renderer
fix: handle missing voiceover file in export queue
docs: improve deployment guide for Railway
```

## Areas Where Contributions Are Welcome

- **FFmpeg Rendering** — New transitions, effects, multi-track improvements
- **Real-time Collaboration** — Enhanced cursors, comments, presence
- **AI Features** — New prompt strategies, better error handling, usage tracking
- **Asset Management** — Media organization, search, tagging
- **Documentation** — Improving clarity and completeness
- **Testing** — Adding automated tests (currently limited)
- **UI/UX Polish** — Refinements to the Studio interface

## Pull Request Process

1. Push your branch to your fork
2. Open a Pull Request against the main branch
3. Provide a clear description of the changes
4. Reference any related issues
5. Be responsive to review feedback

## Code Style

- Follow existing patterns in the codebase
- Use TypeScript strictly (avoid `any` when possible)
- Write readable, self-documenting code
- Add comments for complex logic (especially FFmpeg commands and real-time flows)

## Questions?

Open an issue with the `question` label or start a discussion in the repository.

---

We appreciate high-quality contributions that help creators tell better stories with AI.
