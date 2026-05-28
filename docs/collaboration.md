# Real-time Collaboration

DesignXpress includes a growing set of real-time collaboration features powered by **Socket.IO**.

## Current Features (v1.0)

### 1. Live Cursors
- Every user in a project sees floating cursors of other collaborators
- Cursors show the user's name and a unique color
- Updated in real time as people move their mouse in the preview area

### 2. Bidirectional Scene Synchronization
- When one user adds, edits, or deletes a scene, the change is broadcast to everyone else in the project
- Other clients apply the update optimistically
- Combined with Version History, this creates a safe collaborative editing experience

### 3. In-Studio Team Chat
- A dedicated "Chat" tab exists in the right sidebar of the Studio
- Messages are sent and received instantly via Socket.IO
- Simple and effective for quick coordination

### 4. Presence Indicators
- Active collaborators are shown with colored avatar circles in the top bar
- Shows who is currently working on the project

## How It Works

### Backend (Socket.IO)

Location: `backend/src/index.ts`

- Users join a room when opening a project: `project:{projectId}`
- The server tracks connected users in memory (for presence)
- Events are relayed to everyone else in the same room

Key events:
- `join-project`
- `cursor-move` → `cursor-update`
- `scene-update` → `scene-updated`
- `chat-message`

### Frontend

Socket connection is established in `app/studio/page.tsx`.

Important patterns:
- Cursor movement is throttled by sending on `mousemove`
- Scene changes are broadcast after local Zustand updates
- Chat messages are optimistic on the sender side

## Rooms & Isolation

Each project has its own isolated Socket.IO room. Users working on different projects never see each other's cursors or messages.

## Limitations & Future Work

Current limitations:
- No persistence of chat messages
- No scene-level comments/annotations
- No conflict resolution UI (last write wins)

Planned improvements:
- Per-scene comments with real-time updates
- Typing indicators
- Better conflict visualization
- Presence avatars with profile pictures

## Development Tips

When working on collaboration features:

- Test with multiple browser windows (or incognito)
- Use different users if possible
- Check the backend terminal for socket connection logs
- Remember that the frontend store must be updated when receiving remote events

---

Real-time features turn DesignXpress from a solo tool into a true team creation platform.
