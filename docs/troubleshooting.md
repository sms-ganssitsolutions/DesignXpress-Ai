# Troubleshooting Guide

This document covers common issues when running DesignXpress AI locally on Windows.

## Docker & Database Issues

### PostgreSQL not ready
**Symptom**: `setup.ps1` fails or backend can't connect.

**Solutions**:
- Make sure Docker Desktop is fully started
- Run `docker compose down -v` then `.\scripts\setup.ps1` again
- Check logs: `docker compose logs postgres`

### Prisma migration errors
**Solution**:
```powershell
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

## FFmpeg Problems

### "FFmpeg not found" warnings
This is expected on fresh Windows setups.

**Fix**:
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract and place `ffmpeg.exe` in `C:\ffmpeg\bin\`
3. Update `.env`:
   ```env
   FFMPEG_PATH=C:\\ffmpeg\\bin\\ffmpeg.exe
   ```
4. Restart the backend

Real video exports will use demo fallback until FFmpeg is available.

## PowerShell / Script Issues

### Scripts are blocked
Run as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Port Conflicts

Common conflicting ports: 3000, 5000, 5432, 6379, 8080

**Quick fix**:
```powershell
# Find process using a port (example: 3000)
netstat -ano | findstr :3000
# Kill the PID
taskkill /PID <PID> /F
```

## Real-time Collaboration Not Working

- Make sure both users are on the same project (same `projectId`)
- Check browser console for WebSocket connection errors
- Restart the backend (Socket.IO sometimes needs a full restart)
- Verify Redis is running (used for some internal coordination)

## AI Features Not Working

- Confirm your API keys are correctly set in the root `.env` file
- Backend must be restarted after changing `.env`
- Check backend logs for OpenAI / ElevenLabs errors
- The system gracefully falls back to demo data when APIs fail

## Media Upload Issues

- Uploaded files go to `uploads/` folder
- Very large files may need increased limits in Express (currently set high)
- Make sure the `uploads` folder has write permissions

## General Debugging Tips

1. Always check the terminal windows for backend/frontend logs
2. Use PgAdmin (http://localhost:8080) to inspect the database
3. Use Redis CLI or a GUI to inspect job queues when debugging exports
4. Clear browser cache / hard refresh when UI changes don't appear

---

If you encounter a new issue, please describe:
- Exact error message
- Which script/command you ran
- Whether Docker is running
- Any recent changes you made

This will help diagnose problems quickly.
