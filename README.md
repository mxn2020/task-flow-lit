# Task Flow Lit

A modern task management application built with Lit, TypeScript, and Vite.

## Features

- 🔐 User authentication with Supabase
- 📱 Responsive design with Shoelace components
- 🌙 Dark/Light theme support
- 📧 Email confirmation flow
- 🎯 Scope-based task organization
- ⚡ Fast development with Vite

## Tech Stack

- **Frontend**: Lit, TypeScript
- **Styling**: Shoelace Design System
- **Backend**: Supabase
- **Build Tool**: Vite
- **State Management**: Custom controllers

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mxn2020/task-flow-lit.git
cd task-flow-lit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file and fill in your Supabase credentials
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   └── pages/           # Page components
├── controllers/         # State and router controllers
├── services/           # External service integrations
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
