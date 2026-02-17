# Dynamic Checklist Creator

A production-grade, industrial checklist creation web application built with React 18+, TypeScript, and modern architectural patterns.

## 🚀 Features

- **Dynamic Header Configuration**: Create up to 10 customizable columns
- **Nested Sub-Fields**: Add multiple sub-fields inside any cell
- **Image Upload**: Drag-and-drop image support with auto-compression
- **Cell Styling**: Customize font size, color, boldness, and background per cell
- **Drag & Drop**: Reorder rows with smooth animations
- **Live Preview**: Real-time industrial checklist preview
- **State Persistence**: Auto-save with localStorage
- **Undo/Redo**: Full history management
- **Dark/Light Theme**: Toggle between themes
- **Export**: JSON export (PDF/Excel ready for future)
- **Keyboard Shortcuts**: Ctrl+Z (Undo), Ctrl+Y (Redo)

## 🏗️ Architecture

Built using **Atomic Design Pattern**:
- **Atoms**: Button, Input, Select, Checkbox, Typography
- **Molecules**: ImageUploader, CellEditor, HeaderConfigurator
- **Organisms**: ChecklistTable, ChecklistFormPanel, ChecklistPreviewPanel
- **Templates**: TwoColumnLayout

## 🛠️ Tech Stack

- **React 18+** - UI Library
- **TypeScript** - Type Safety (Strict Mode)
- **Vite** - Build Tool
- **Zustand** - State Management with Persist Middleware
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **@dnd-kit** - Drag and Drop
- **React Dropzone** - Image Upload
- **React Hook Form** - Form Management
- **Zod** - Validation

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ChauhanDishant/Dynamic-Checklist-Creation.git

# Navigate to project directory
cd Dynamic-Checklist-Creation

# Install dependencies
yarn install

# Start development server
yarn dev
```

## 🚀 Scripts

```bash
yarn dev       # Start development server
yarn build     # Build for production
yarn preview   # Preview production build
yarn lint      # Run ESLint
yarn format    # Format code with Prettier
```

## 📁 Project Structure

```
src/
├── app/
│   └── App.tsx
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex components
│   └── templates/      # Page layouts
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🎨 Features in Detail

### Dynamic Headers
- Configure 1-10 columns
- Set custom labels and widths
- Apply styling per column
- Auto-balance column widths

### Row Management
- Add single or bulk rows
- Delete selected rows
- Duplicate rows
- Drag-and-drop reordering

### Cell Editing
- Rich text value
- Multiple sub-fields with bullets
- Image upload with compression
- Custom styling (font size, color, bold, background)

### Live Preview
- Industrial checklist styling
- Real-time updates
- Print-friendly layout
- Scrollable preview panel

## 🌐 Deployment

Deployed automatically to GitHub Pages on push to `main` branch.

**Live Demo**: [https://chauhandishant.github.io/Dynamic-Checklist-Creation/](https://chauhandishant.github.io/Dynamic-Checklist-Creation/)

## 🔮 Future Features

- PDF Export
- Excel Export
- Cloud Storage Integration
- Multiple Checklist Templates
- Share via URL
- Collaborative Editing

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Author

**Dishant Chauhan**

---

Built with ❤️ using React, TypeScript, and modern web technologies.