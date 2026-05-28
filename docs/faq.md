# Frequently Asked Questions (FAQ)

## General

**Q: What is DesignXpress AI Story Video Studio?**  
A: It is a full-stack AI-powered video creation platform focused on cinematic storytelling. It combines a professional timeline editor, real-time collaboration, advanced FFmpeg rendering, and multiple AI generation tools.

**Q: Is this a production-ready app?**  
A: It is a highly advanced local development / prototype version. It includes production-grade patterns (BullMQ queues, proper error handling, Docker, etc.) but is primarily designed for Windows 11 local development.

**Q: Can I use real AI models?**  
A: Yes. Add your `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, and `STABILITY_API_KEY` to the root `.env` file. The system falls back to high-quality demo data when keys are missing or APIs fail.

---

## Setup & Running

**Q: The scripts won't run on Windows.**  
A: Run this once as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Q: Docker services won't start.**  
A: Make sure Docker Desktop is running and healthy before running `setup.ps1`.

**Q: FFmpeg is not found.**  
A: The app will still work (using demo renders). For real video exports, install FFmpeg and set `FFMPEG_PATH` in `.env`.

---

## Studio & Editing

**Q: Can I use real video files in my projects?**  
A: Yes. Upload video clips via the Media tab in the Studio. They become playable in the preview and are used directly by the FFmpeg renderer.

**Q: How do I collaborate with others?**  
A: Simply open the same project in multiple browser windows or with different users. You will see live cursors, real-time scene updates, and can chat in the Studio.

**Q: What happens when I publish a project as a template?**  
A: A copy of the project’s scenes is saved as a public template. Other users can load it into their own projects via the Templates marketplace.

---

## Rendering & Exports

**Q: Why is video export slow?**  
A: FFmpeg rendering is CPU and disk intensive. The app uses a professional BullMQ queue so the UI stays responsive. Progress is shown live.

**Q: Can I render with background music?**  
A: Yes. Select a music bed in the Export tab before starting the render. The system mixes it intelligently with voiceovers.

**Q: Where are exported videos saved?**  
A: In `uploads/exports/`. They are also available for re-download from the export history.

---

## Technical

**Q: How does real-time collaboration work?**  
A: Socket.IO rooms are created per project. Cursor movements, scene changes, and chat messages are broadcast to everyone in the room.

**Q: Is the data saved automatically?**  
A: Yes. Timeline changes are saved to PostgreSQL. Version history is automatically created on save.

**Q: Can I run this in production?**  
A: The project includes production Docker files and a detailed deployment guide. However, heavy video rendering should be offloaded to dedicated workers or cloud services at scale.

---

## AI Features

**Q: Why am I getting demo results instead of real AI output?**  
A: Either the relevant API key is missing from `.env`, or the API call failed (rate limit, network error, etc.). The system always provides useful fallback content.

**Q: Can I use my own prompts?**  
A: Currently the prompts are built into the AI service. You can extend `aiService.ts` to support custom prompts.

---

## Contribution & Roadmap

**Q: How can I contribute?**  
A: See the [Contributing Guide](contributing.md). High-value areas include testing, FFmpeg improvements, real-time features, and documentation.

**Q: Where is the project going next?**  
A: See the [Roadmap](roadmap.md) for current priorities and long-term vision.

---

Didn't find your question? Open an issue or check the [Troubleshooting guide](troubleshooting.md).
