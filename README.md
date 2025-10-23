# BlogsIO

A modern blog management platform built with React and Vite. BlogsIO provides a clean interface for writers to create, edit, and manage their blog posts with rich text editing capabilities and role-based access control.

## Features

### Content Management
- Rich text editor with formatting options
- Create, edit, and publish blog posts
- Draft and published post management
- Comment system for reader engagement
- Search functionality across all posts

### User Management
- User registration and authentication
- Role-based access (Reader, Author, Admin)
- Password reset functionality
- User profile management

### Admin Dashboard
- User management and role assignment
- Content moderation tools
- Platform statistics and analytics
- System administration features

### Design
- Responsive design for all device sizes
- Dark and light theme support
- Modern, clean interface
- Smooth animations and transitions
- Accessibility features included

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Rich Text Editor**: React Quill
- **Authentication**: JWT-based auth system

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/madtitan1712/BlogsIOFrontend.git
cd BlogsIOFrontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Setup

The application is configured to work with a backend API. Update the API base URL in `src/services/api.js` to match your backend server.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer)
│   ├── posts/          # Post-related components
│   └── comments/       # Comment system components
├── pages/              # Page components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── utils/              # Utility functions
└── styles/             # CSS and styling files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

### Reader
- Browse and read blog posts
- Leave comments on posts
- Basic account management

### Author
- All Reader permissions
- Create and edit own blog posts
- Manage post drafts and published content
- Access to author dashboard

### Admin
- All Author permissions
- User management and role assignment
- Content moderation across all posts
- Platform administration tools

## API Integration

The frontend connects to a REST API backend with the following main endpoints:

- Authentication: `/api/auth/*`
- Posts: `/api/posts/*`
- Comments: `/api/comments/*`
- User Management: `/api/admin/*`

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please open an issue in the GitHub repository.