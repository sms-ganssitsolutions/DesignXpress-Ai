# Security

This document outlines the security considerations and practices for **DesignXpress AI Story Video Studio**.

## Authentication & Authorization

- All sensitive routes are protected using JWT-based authentication.
- Passwords are hashed using bcrypt (12 rounds).
- Tokens are stored client-side in `localStorage` (suitable for this local development / demo setup).
- User-scoped queries are enforced at the database level (e.g., users can only access their own projects and exports).

## Data Protection

- Uploaded media is stored in the `uploads/` directory with user/project context.
- No sensitive data is logged in production mode.
- AI prompts and generated results are stored in the database for history purposes (users own their data).

## Secrets & Environment Variables

- Never commit real API keys or secrets to the repository.
- Use `.env` and `.env.local` files (already gitignored).
- In production deployments:
  - Use platform secret management (Railway, AWS Secrets Manager, etc.)
  - Rotate keys regularly
  - Restrict access to production environment variables

## File Uploads

- File types are currently not strictly validated on the backend (for development flexibility).
- In a production environment, you should add:
  - MIME type validation
  - File size limits
  - Virus scanning (recommended for user-uploaded content)
  - Storage isolation (e.g., S3 with proper bucket policies)

## Real-time Communication (Socket.IO)

- Rooms are isolated per project (`project:{id}`).
- No authentication is currently performed on WebSocket connections beyond the initial JWT (improvement opportunity).
- Consider adding token validation on `join-project` events in production.

## Recommended Production Hardening

1. **HTTPS only** — Enforce TLS in all environments.
2. **Rate limiting** — Add rate limiting on auth and export endpoints.
3. **Input sanitization** — Sanitize user prompts sent to AI models.
4. **Dependency scanning** — Regularly run `npm audit` and update packages.
5. **Monitoring & Logging** — Use tools like Sentry or Datadog for error tracking.
6. **Least privilege** — Database users and API keys should have minimal required permissions.

## Reporting Security Issues

If you discover a security vulnerability, please report it privately by opening a security advisory on GitHub or contacting the maintainers directly. Do not open a public issue.

---

Security is an ongoing process. Contributions that improve the security posture of the project are highly valued.
