# 🚀 Krishna Kit

<p align="center">
  <b>A modern project starter and file organization CLI for developers.</b>
</p>

<p align="center">
  Create clean project structures, organize existing files, install Bootstrap, analyze projects, find duplicates, clean projects and generate README files — directly from your terminal.
</p>

<p align="center">

![npm](https://img.shields.io/npm/v/krishna-kit?style=for-the-badge&color=cb3837)
![npm downloads](https://img.shields.io/npm/dm/krishna-kit?style=for-the-badge&color=blue)
![Node](https://img.shields.io/node/v/krishna-kit?style=for-the-badge&color=green)
![License](https://img.shields.io/npm/l/krishna-kit?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/krishna-kit?style=for-the-badge)

</p>

---

## ✨ What is Krishna Kit?

**Krishna Kit** is a command-line utility designed to make starting and maintaining web projects easier.

Instead of manually creating folders, moving files, checking project health, finding duplicate files and writing README files, Krishna Kit provides simple commands to handle these tasks.

### ⚡ With Krishna Kit you can:

- 📁 Generate a clean project structure
- 🗂️ Organize an existing project
- 🔍 Analyze project files
- 🩺 Check project health
- 🔁 Find duplicate files
- 🧹 Find unnecessary files and folders
- 📝 Generate a README
- 🎨 Install Bootstrap
- ⭐ Install Bootstrap Icons
- 👀 Preview changes before applying them
- 💪 Force overwrite conflicting files
- 📦 Work directly through `npx`

---

# 📦 Installation

You don't need to install Krishna Kit globally.

Simply use:

```bash
# 📦 Installation

Krishna Kit is designed to work directly with `npx`, so there is **no global installation required**.

### Start Krishna Kit

```bash
npx krishna-kit
```

### Create a project directly

```bash
npx krishna-kit my-project
```

> 💡 **Tip:** If you already know your project name, use the second command.

---

# ⚡ Quick Start

The simplest way to create a new project:

```bash
npx krishna-kit my-project
```

Then:

```bash
cd my-project
npm install
```

That's it. 🎉

Your project is ready for development.

---

# 🛠️ Command Center

Krishna Kit provides commands for creating, organizing, analyzing and maintaining projects.

| Command | What it does |
|---|---|
| 🚀 Create | Create a new project |
| 📁 Organize | Organize an existing project |
| 👀 Dry Run | Preview changes |
| 💪 Force | Overwrite conflicts |
| 🔍 Analyze | Analyze a project |
| 🩺 Doctor | Check project health |
| 🔁 Duplicates | Find duplicate files |
| 🧹 Clean | Find unnecessary files |
| 📝 README | Generate README |
| ❓ Help | Show available commands |
| 🔢 Version | Show Krishna Kit version |

---

# 🚀 1. Create a New Project

Create a new project with Krishna Kit's default structure.

### Command

```bash
npx krishna-kit my-project
```

### Example

```bash
npx krishna-kit website
```

Krishna Kit will ask which optional dependencies you want:

```text
🚀 Krishna Kit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✔ What do you want to install?

❯ Bootstrap
  Bootstrap + Icons
  Bootstrap Icons only
  Nothing
```

### After creation

```bash
cd website
npm install
```

### When should I use this?

Use this when you're:

- Starting a new website
- Starting a new HTML/CSS/JavaScript project
- Creating a clean project structure
- Starting a project from scratch

---

# 📁 2. Organize an Existing Project

Already have a project with files scattered everywhere?

Krishna Kit can organize it automatically.

### Command

```bash
npx krishna-kit my-project ./existing-folder
```

### Example

```bash
npx krishna-kit my-website ./t
```

Where:

```text
my-website  → destination project
./t         → existing project
```

Krishna Kit scans the existing project and determines where the files belong.

### Before

```text
t/
├── index.html
├── about.html
├── style.css
├── main.css
├── app.js
├── logo.png
├── image.webp
└── document.pdf
```

### After

```text
my-website/
│
├── index.html
│
├── Src/
│   ├── Pages/
│   │   └── about.html
│   │
│   ├── CSS/
│   │   ├── style.css
│   │   └── main.css
│   │
│   └── JS/
│       └── app.js
│
└── Public/
    ├── Images/
    │   ├── logo.png
    │   └── image.webp
    │
    └── Doc/
        └── document.pdf
```

### When should I use this?

Use it when:

- Your project has become messy
- Files are sitting in the root folder
- You want a cleaner structure
- You inherited an old project
- You want to organize a project quickly

---

# 🗂️ 3. Explicit Organize Command

You can also explicitly use the `organize` command.

### Command

```bash
npx krishna-kit organize ./source ./destination
```

### Example

```bash
npx krishna-kit organize ./t ./my-project
```

This means:

```text
Source
  ↓
./t

Destination
  ↓
./my-project
```

Krishna Kit analyzes the source project and organizes the files inside the destination.

---

# 👀 4. Dry Run

Want to know what Krishna Kit will do **before it changes anything?**

Use:

```bash
--dry-run
```

### Command

```bash
npx krishna-kit organize ./t ./my-project --dry-run
```

Example:

```text
🔍 Found 27 file(s).

→ about.html → Src\Pages\about.html [CREATE]
→ style.css → Src\CSS\style.css [CREATE]
→ app.js → Src\JS\app.js [CREATE]
→ logo.png → Public\Images\logo.png [CREATE]

Summary:
27 new
0 renamed
0 overwritten
0 unchanged

ℹ️ Dry run complete. No files were changed.
```

### What does Dry Run do?

It **does not modify your files**.

It only shows what would happen.

### Perfect for:

- Large projects
- Important projects
- First-time users
- Checking file destinations
- Checking possible conflicts

> ⭐ **Recommended:** Use `--dry-run` before organizing an important project.

---

# 💪 5. Force Mode

Sometimes the destination already contains files.

Use `--force` when you want Krishna Kit to overwrite conflicting files.

### Command

```bash
npx krishna-kit organize ./t ./my-project --force
```

You can also use:

```bash
npx krishna-kit my-project ./t --force
```

### ⚠️ Be careful

Force mode can overwrite existing files.

A safer workflow is:

```bash
npx krishna-kit organize ./t ./my-project --dry-run
```

Review the changes.

Then:

```bash
npx krishna-kit organize ./t ./my-project --force
```

---

# 🔍 6. Analyze Project

Get information about an existing project.

### Command

```bash
npx krishna-kit analyze ./t
```

The analyzer can show information such as:

- 📁 Number of files
- 📦 Project type
- 💾 Project size
- 📄 File types
- 📊 File distribution
- 📦 Dependencies

### Example

```text
🚀 Project Analyzer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Project Type: Web
📁 Files: 27
💾 Size: 2.4 MB
```

### When should I use it?

Use Analyze when you want to understand an unfamiliar project before making changes.

A useful workflow is:

```bash
npx krishna-kit analyze ./t
```

then:

```bash
npx krishna-kit organize ./t ./my-project --dry-run
```

---

# 🩺 7. Project Doctor

Check the overall health of your project.

### Command

```bash
npx krishna-kit doctor ./t
```

### Example

```text
🚀 Project Doctor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Valid package.json
✓ index.html found
⚠ Git repository not initialized
✓ README.md found
✓ No duplicate files
✓ No unusually large files

🩺 Project Health: 95/100

💡 Recommendations
   • Initialize Git
```

### Doctor checks

```text
✓ package.json
✓ index.html
✓ Git repository
✓ README.md
✓ Duplicate files
✓ Large files
```

### When should I use it?

Run Doctor when:

- You finish organizing a project
- You receive an existing project
- You want a quick health check
- You want to find possible project problems

---

# 🔁 8. Duplicate Finder

Find duplicate files inside a project.

### Command

```bash
npx krishna-kit duplicates ./t
```

### Example

```text
🚀 Duplicate Finder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ No duplicate files found.
```

If duplicates are found, Krishna Kit reports the matching files.

### Useful for finding:

- 🖼️ Duplicate images
- 🎨 Duplicate CSS
- ⚙️ Duplicate JavaScript
- 📄 Duplicate documents
- 📦 Unnecessary copies

### Recommended

Run it after organizing:

```bash
npx krishna-kit duplicates ./my-project
```

---

# 🧹 9. Project Cleaner

Check your project for unnecessary files and folders.

### Command

```bash
npx krishna-kit clean ./t
```

The cleaner can detect things such as:

- 🗑️ Temporary files
- 📂 Empty folders
- ⚡ Cache folders
- 📦 Build folders
- 🧹 Unnecessary generated files

---

# 👀 10. Cleaner Dry Run

Want to preview cleaning operations first?

Use:

```bash
npx krishna-kit clean ./t --dry-run
```

This allows you to review the cleanup before applying it.

### Recommended workflow

First:

```bash
npx krishna-kit clean ./t --dry-run
```

Review the result.

Then:

```bash
npx krishna-kit clean ./t
```

---

# 📝 11. README Generator

Automatically generate a README for an existing project.

### Command

```bash
npx krishna-kit readme ./t
```

Krishna Kit analyzes the project and generates:

```text
README.md
```

### Example

```text
🚀 README Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Analyzing project...
📝 Generating README...

✅ README generated successfully.
```

### Perfect for:

- Projects without documentation
- Old projects
- Personal projects
- GitHub repositories
- Quick project documentation

---

# ❓ 12. Help

Forgot a command?

Use:

```bash
npx krishna-kit --help
```

Short version:

```bash
npx krishna-kit -h
```

This displays the available commands and options.

---

# 🔢 13. Version

Check your Krishna Kit version.

### Full command

```bash
npx krishna-kit --version
```

### Short command

```bash
npx krishna-kit -v
```

---

# 🎨 Bootstrap Options

When creating a project, Krishna Kit gives you four options.

### 🅱️ Bootstrap

```text
Bootstrap
```

Installs Bootstrap.

---

### 🎨 Bootstrap + Icons

```text
Bootstrap + Icons
```

Installs:

```text
Bootstrap
Bootstrap Icons
```

---

### ⭐ Bootstrap Icons Only

```text
Bootstrap Icons only
```

Installs Bootstrap Icons without Bootstrap.

---

### 🚫 Nothing

```text
Nothing
```

Creates the project without additional packages.

---

# ⚙️ Options & Flags

Krishna Kit supports additional flags.

| Flag | Description |
|---|---|
| `--dry-run` | Preview changes without modifying files |
| `--force` | Overwrite conflicting files |
| `--help` | Show available commands |
| `-h` | Short version of help |
| `--version` | Show current version |
| `-v` | Short version of version |

---

# 📋 Command Cheat Sheet

If you just need the commands, here they are:

```bash
# 🚀 Create
npx krishna-kit my-project

# 📁 Organize existing project
npx krishna-kit my-project ./t

# 🗂️ Explicit organize
npx krishna-kit organize ./t ./my-project

# 👀 Preview organization
npx krishna-kit organize ./t ./my-project --dry-run

# 💪 Force organization
npx krishna-kit organize ./t ./my-project --force

# 🔍 Analyze
npx krishna-kit analyze ./t

# 🩺 Project health
npx krishna-kit doctor ./t

# 🔁 Find duplicates
npx krishna-kit duplicates ./t

# 🧹 Clean project
npx krishna-kit clean ./t

# 👀 Preview cleaning
npx krishna-kit clean ./t --dry-run

# 📝 Generate README
npx krishna-kit readme ./t

# ❓ Help
npx krishna-kit --help

# 🔢 Version
npx krishna-kit --version
```

---

# 🧩 File Organization Rules

Krishna Kit automatically detects file types and places them into the appropriate folders.

| File Type | Destination |
|---|---|
| `.html` | `Src/Pages` |
| `.css` | `Src/CSS` |
| `.scss` | `Src/CSS` |
| `.js` | `Src/JS` |
| `.ts` | `Src/JS` |
| 🖼️ Images | `Public/Images` |
| 🎬 Videos | `Public/Videos` |
| 🔊 Audio | `Public/Audio` |
| 🔤 Fonts | `Public/Fonts` |
| 📄 Documents | `Public/Doc` |
| 💻 Programming files | `Src/Code` |
| ⚙️ Config files | `Src/Config` |

### 📌 Root files

Important files remain in the project root:

```text
index.html
package.json
package-lock.json
README.md
.gitignore
```

---

# 🛡️ Recommended Workflow

Working with an existing project?

Here's the safest workflow.

### 01 — 🔍 Analyze

```bash
npx krishna-kit analyze ./t
```

Understand your project first.

### 02 — 👀 Preview

```bash
npx krishna-kit organize ./t ./my-project --dry-run
```

Check what Krishna Kit wants to change.

### 03 — 📁 Organize

```bash
npx krishna-kit organize ./t ./my-project
```

Apply the organization.

### 04 — 🩺 Check Health

```bash
npx krishna-kit doctor ./my-project
```

Check the project.

### 05 — 🔁 Find Duplicates

```bash
npx krishna-kit duplicates ./my-project
```

Find duplicate files.

### 06 — 🧹 Check Cleanup

```bash
npx krishna-kit clean ./my-project --dry-run
```

Preview unnecessary files.

### 07 — 📝 Generate Documentation

```bash
npx krishna-kit readme ./my-project
```

Generate project documentation.

---

# 💻 Requirements

Krishna Kit requires:

- **Node.js 16+**
- **npm**

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

# 🌐 Documentation

Want a visual documentation experience?

Visit:

👉 **https://krishna-kit.netlify.app**

---

# 📦 NPM

Run Krishna Kit directly through npm:

```bash
npx krishna-kit
```

No global installation required.

---

# ❤️ Build Faster. Organize Smarter.

Without Krishna Kit:

```text
Create folders
      ↓
Move files
      ↓
Organize CSS
      ↓
Organize JavaScript
      ↓
Move images
      ↓
Find duplicates
      ↓
Check project health
      ↓
Write README
```

With Krishna Kit:

```bash
npx krishna-kit my-project
```

Or organize an existing project:

```bash
npx krishna-kit my-project ./existing-project
```

### 🚀 One command.

### 📁 Clean structure.

### ⚡ Faster development.

---

<p align="center">

<strong>Made with ❤️ by Krishna</strong>

<br><br>

⭐ If Krishna Kit is useful to you, consider giving the repository a star!

</p>
