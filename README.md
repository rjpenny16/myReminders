# Ultrawide To-Do App

A **polished desktop To-Do application** optimized for **8.8″ ultrawide displays** (resolutions: 1920×480, 1280×400, 1024×256), featuring **scheduling**, **reminders**, **local AI integration via Ollama**, and a **gorgeous, customizable UI**.

Built with **Tauri** (Rust + TypeScript), **React**, and **Tailwind CSS**.

---

## ✨ Features

- 🎨 **Beautiful, full-screen UI** with three curated theme presets (Slate Glass, Noir Neon, Paper Warm)
- 📅 **Task scheduling & reminders** with cron-like recurrence
- 🤖 **Local AI email drafting** via Ollama (embedded or external mode)
- ⚡ **Keyboard-first workflow** with command palette (Cmd/Ctrl+K)
- 🎯 **Horizontal scrolling sections** (Today / Upcoming / Someday)
- 🔔 **Native desktop notifications** with snooze support
- 🎨 **Full theme customization** with live preview
- 💾 **Local-first** with SQLite persistence
- 🔐 **Privacy-focused** - all data stays on your machine

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18+)
2. **Rust** (latest stable)
3. **Tauri CLI** dependencies for your platform:
   - **macOS**: Xcode Command Line Tools
   - **Windows**: Visual Studio Build Tools with C++ workload
   - **Linux**: See [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)
4. **Ollama** (optional, for AI features)

### Installation

**Option 1: Automated Setup (Recommended)**

```bash
# Linux/macOS
./setup.sh

# Windows (PowerShell)
.\setup.ps1
```

The setup script will automatically check for prerequisites, install Rust if needed, and set up all dependencies.

**Option 2: Manual Installation**

```bash
# Clone the repository
cd ultrawide-todo

# Install dependencies
npm install

# Run in development mode
npm run tauri:dev
```

### Building for Production

```bash
npm run tauri:build
```

The compiled app will be in `src-tauri/target/release/`.

---

## 🤖 Setting Up Ollama

For AI email drafting to work, you need **Ollama** running locally.

### Install Ollama

- **macOS/Linux**: [https://ollama.com/download](https://ollama.com/download)
- **Windows**: Download from the official site

### Pull the Default Model

```bash
ollama pull llama3.1
```

### Start Ollama Server

```bash
ollama serve
```

Ollama will run at `http://127.0.0.1:11434` by default.

### Configure the App

1. Open the app
2. Press **Cmd/Ctrl+K** → **Settings**
3. Under **AI**:
   - **Mode**: Choose `embedded` (in-app) or `external` (launch Ollama app)
   - **Model**: Enter your model name (e.g., `llama3.1`, `llama2`, `mistral`)
   - **Base URL**: Default is `http://127.0.0.1:11434`
   - **Temperature**: Adjust creativity (0.0–2.0, default 0.5)

---

## ⌨️ Keyboard Shortcuts

| Key                | Action                          |
| ------------------ | ------------------------------- |
| `N`                | New task (full form)            |
| `Enter`            | Quick add task (from quick-add bar) |
| `/`                | Quick search/filter (opens palette) |
| `Cmd/Ctrl+K`       | Command palette                 |
| `A`                | Theme editor                    |
| `Esc`              | Close modals                    |

### Quick Add Bar

The quick-add bar at the top of the app allows you to rapidly create tasks:
1. Type your task title in the input field
2. Select the section (Today/Upcoming/Someday) using the buttons
3. Press `Enter` to create the task instantly

---

## 🎨 Themes

The app comes with **three beautiful presets**:

1. **Slate Glass** - Dark, modern, with soft glass effects
2. **Noir Neon** - High-contrast cyberpunk aesthetic with neon accents
3. **Paper Warm** - Light, serif-based, warm tones inspired by paper

### Customizing Themes

1. Press `A` or use the command palette → **Theme Editor**
2. Adjust colors, border radius, opacity, blur, and spacing
3. Click **Apply Theme** to save

You can also export/import themes as JSON.

---

## 📐 Display Profiles

The app is optimized for ultrawide displays:

- **1920×480** (16:4 aspect ratio)
- **1280×400** (16:5)
- **1024×256** (4:1)

To adjust:

1. Open **Settings** (Cmd/Ctrl+K → Settings)
2. Under **Display**, choose your **Resolution Profile**
3. Adjust **Font Size Scale** if needed (0.5–2.0×)

---

## 📋 Task Management

### Task Structure

Each task can have:

- **Title** & **Notes**
- **Section**: Today / Upcoming / Someday
- **Due Date** & **Reminders** (multiple reminders supported)
- **Recurrence** (cron-like: e.g., `0 9 * * MON-FRI` for weekday standups)
- **Tags** (for filtering)
- **Priority** (1 = high, 3 = low)
- **Action**: None / Email Draft / Custom Command

### AI Email Drafting

For tasks with `action: "email_draft"`:

1. Click the **✨ Draft** button on the task card
2. The **AI Draft Panel** opens with a prefilled prompt
3. Edit the prompt if needed
4. Click **Draft with Ollama**
5. The AI streams the email draft in real-time
6. Click **Copy** or **Open in Email** to use it

### Embedded vs. External AI Mode

- **Embedded**: Streams AI responses directly in the app (default)
- **External**: Launches the Ollama app and copies the prompt to clipboard

---

## 🔔 Notifications & Scheduling

The app uses a **Rust-based scheduler** (Tokio + cron) to ensure reminders fire reliably, even when the app window is hidden.

- **Reminders** are checked every minute
- **Native notifications** appear with "Complete", "Snooze", and "Open Task" actions
- **Recurrence** supports cron syntax (e.g., `0 9 * * MON-FRI`)

---

## 🗂 Data & Privacy

All data is stored **locally** in SQLite:

- **Database location**: `~/.local/share/com.ultrawide.todo/` (Linux) or platform-specific app data directories
- **No cloud sync** - your tasks stay on your machine
- **Export/Import** tasks as JSON via the command palette

---

## 🛠 Development

### Project Structure

```
ultrawide-todo/
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── store/             # Zustand state management
│   ├── themes/            # Theme presets
│   ├── lib/               # Ollama client, utilities
│   └── hooks/             # Keyboard shortcuts, etc.
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands.rs    # Tauri commands (CRUD, settings, clipboard)
│   │   ├── db.rs          # Database layer & migrations
│   │   ├── scheduler.rs   # Tokio scheduler for reminders
│   │   ├── models.rs      # Data models
│   │   └── utils.rs       # OS-specific utilities (launch Ollama)
│   └── tauri.conf.json    # Tauri configuration
├── seed.json              # Example tasks
└── README.md
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Zustand
- **Backend**: Tauri 2.0, Rust, Tokio, SQLite
- **AI**: Ollama HTTP API

### Adding New Features

1. **Backend (Rust)**:
   - Add commands in `src-tauri/src/commands.rs`
   - Update `invoke_handler!` in `lib.rs`

2. **Frontend (React)**:
   - Add Zustand actions in `src/store/taskStore.ts`
   - Call via `invoke` from `@tauri-apps/api/core`

---

## 🐛 Troubleshooting

### Ollama not connecting

- Ensure Ollama is running: `ollama serve`
- Check the base URL in Settings matches your Ollama instance
- Verify the model is installed: `ollama list`

### App won't build

- Make sure you have all Tauri prerequisites: [https://tauri.app/v1/guides/getting-started/prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)
- Run `cargo clean` and try again

### Notifications not appearing

- Grant notification permissions in your OS settings
- Check that the scheduler is running (look for console logs)

---

## 📝 Design Tour

### UI Polish Details

1. **Horizontal kinetic scrolling**: Sections scroll smoothly with scroll-snap
2. **Micro-interactions**: Hover lifts, press scales, completion morph animations
3. **Custom scrollbars**: Styled to match the theme, auto-hide when idle
4. **Glass morphism**: Surface elements use backdrop-filter blur for depth
5. **Typography**: Tight letter-spacing optimized for ultrawide aspect ratios
6. **Color tokens**: All colors are CSS variables, updated live via theme system
7. **Spacing scale**: Base unit of 4px, all spacing is multiples for consistency
8. **Accessibility**: High-contrast theme option, keyboard navigation, ARIA labels

### Adapting to Different Resolutions

- **1920×480**: Default layout, optimal for most content
- **1280×400**: Slightly tighter spacing, smaller font scale recommended
- **1024×256**: Use Font Size Scale = 0.8–0.9× for best fit

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (dev mode + production build)
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- **Tauri** - for the amazing Rust+web framework
- **Ollama** - for local AI inference
- **Zustand** - for simple, elegant state management

---

**Enjoy your beautiful, ultrawide To-Do app!** 🎉

For issues or questions, please open a GitHub issue.
