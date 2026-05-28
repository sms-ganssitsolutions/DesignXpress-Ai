# Environment Variables Reference

This document provides a complete reference for all environment variables used in DesignXpress AI.

## Root `.env` (Backend + Infrastructure)

| Variable              | Required | Description                                      | Example |
|-----------------------|----------|--------------------------------------------------|---------|
| `NODE_ENV`            | Yes      | Environment mode                                 | `development` or `production` |
| `PORT`                | No       | Backend server port                              | `5000` |
| `DATABASE_URL`        | Yes      | PostgreSQL connection string                     | `postgresql://user:pass@localhost:5432/designxpress_ai` |
| `REDIS_URL`           | Yes      | Redis connection string                          | `redis://localhost:6379` |
| `JWT_SECRET`          | Yes      | Secret key for signing JWT tokens                | `super-long-random-string-here` |
| `JWT_EXPIRES_IN`      | No       | JWT expiration time                              | `7d` |
| `OPENAI_API_KEY`      | No*      | OpenAI API key (for script/story generation)     | `sk-...` |
| `ELEVENLABS_API_KEY`  | No*      | ElevenLabs API key (voiceovers)                  | `...` |
| `STABILITY_API_KEY`   | No*      | Stability AI key (image generation)              | `...` |
| `UPLOAD_DIR`          | No       | Directory for uploaded files                     | `./uploads` |
| `FFMPEG_PATH`         | No       | Path to ffmpeg binary (Windows example)          | `C:\\ffmpeg\\bin\\ffmpeg.exe` |
| `CORS_ORIGIN`         | No       | Allowed frontend origin                          | `http://localhost:3000` |
| `FRONTEND_URL`        | No       | Public frontend URL (used for share links)       | `http://localhost:3000` |

> *AI features work in demo mode without keys.

## Frontend `frontend/.env.local`

| Variable                  | Required | Description                          | Example |
|---------------------------|----------|--------------------------------------|---------|
| `NEXT_PUBLIC_API_URL`     | Yes      | URL of the backend API               | `http://localhost:5000` |
| `NEXT_PUBLIC_APP_NAME`    | No       | Application display name             | `DesignXpress AI Story Video Studio` |

## Production Recommendations

- Use platform-native secret management (Railway Variables, AWS Secrets Manager, etc.)
- Never store real keys in `.env` files that are committed
- Use different keys for staging vs production
- Consider using short-lived tokens where possible

## Example `.env` (Development)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://designxpress:designxpress_dev_2026@localhost:5432/designxpress_ai"
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-long-random-secret-key-2026
OPENAI_API_KEY=sk-your-openai-key
ELEVENLABS_API_KEY=your-elevenlabs-key
STABILITY_API_KEY=your-stability-key
UPLOAD_DIR=./uploads
FFMPEG_PATH=C:\\ffmpeg\\bin\\ffmpeg.exe
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Copy from `.env.example` when setting up the project.
