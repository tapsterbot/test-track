# Test Track - Interactive Demo Platform

A comprehensive interactive demo platform featuring advanced UI components, 3D simulations, and games. Built with modern web technologies to showcase cutting-edge frontend development techniques and provide engaging user experiences.

## 🚀 Features

### 🏁 3D Chess (Raumschach)
Experience the classic 3D chess variant with modern web technology:
- **5×5×5 3D Board**: Play on a three-dimensional chess board with 125 squares
- **Full Piece Movement**: All traditional chess pieces with adapted 3D movement rules
- **Interactive Controls**: 
  - Mouse drag-and-drop for piece movement
  - Keyboard navigation (WASD + QE for 3D movement)
  - Arrow keys for board rotation and navigation
- **Game Features**:
  - Fullscreen mode for immersive gameplay
  - HUD displays showing game state and controls
  - Pause/resume functionality
  - Game timer and move tracking
  - Promotion dialog for pawn advancement
- **Visual Experience**: 
  - Smooth 3D animations
  - Piece highlighting and valid move indicators
  - Dynamic camera controls

### 🎮 Other Interactive Demos
- **Interactive UI Components**: Buttons, forms, modals, dropdowns, and more
- **Mission Control**: Retro-styled control panels with working switches and indicators
- **Vehicle Simulator**: 3D physics-based vehicle simulation with joystick controls
- **File Upload/Download**: Test file handling scenarios
- **Dynamic Content**: Elements that change state for testing dynamic interactions
- **Multi-window Support**: Test scenarios involving multiple browser windows
- **Responsive Design**: Mobile and desktop layouts for cross-device testing

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **3D Graphics**: Three.js + React Three Fiber
- **Routing**: React Router DOM
- **State Management**: React Query + React Hooks
- **Icons**: Lucide React

## 📦 Local Development Setup

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/test-track.git
   cd test-track
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will auto-reload on file changes

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── mission-control/ # Mission control components
│   └── simulator/      # Vehicle simulator components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## 🧪 Testing Scenarios

This demo site provides various scenarios for testing automation:

### Basic UI Testing
- Form submissions and validation
- Button interactions and state changes
- Modal dialogs and overlays
- Dropdown menus and selections

### Advanced Interactions
- Drag and drop functionality
- File upload/download operations
- Multi-step workflows
- Dynamic content updates

### Responsive Testing
- Mobile viewport interactions
- Touch gestures (joystick controls)
- Orientation changes
- Cross-device compatibility

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add/update tests if applicable
   - Ensure the app builds without errors

4. **Test your changes**
   ```bash
   npm run build    # Ensure production build works
   npm run lint     # Check code style
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Open a PR from your fork to the main repository
   - Provide a clear description of your changes
   - Link any related issues

### Code Style Guidelines

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS classes instead of custom CSS
- Keep components small and focused
- Add proper TypeScript types for all props and functions

### Commit Message Convention

We use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [test-track.lovable.app](https://test-track.lovable.app)
- **Issues**: [GitHub Issues](https://github.com/your-username/test-track/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/test-track/discussions)
