# Appointment Booking Application

A modern appointment booking application built with React, TypeScript, and Firebase.

## Features

- Interactive calendar-based appointment booking
- Real-time availability checking
- Appointment management (view, modify, cancel)
- Firebase backend integration
- Responsive design
- User-friendly interface

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Environment Variables

Create a `.env` file in the root directory with the following Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd booking-app
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase
- **State Management**: TanStack Query (React Query)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/        # Reusable UI components
├── lib/              # Configuration and utilities
├── pages/            # Page components
└── utils/            # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.