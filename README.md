# Mortgage Team Portal

An internal secure portal for mortgage teams to access Standard Operating Procedures (SOPs), internal scripts, training guides, submission forms, and various reference materials. Built with React, TypeScript, TailwindCSS, and shadcn UI components.

## 🌟 [Live Demo](https://tirlap.github.io/mortgage-portal/)

## 🛠️ Features

- **Authentication**: Secure login with role-based access control
- **Content Protection**: Measures to prevent unauthorized copying/downloading of sensitive material
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **SOPs Management**: Create, view, edit, and delete Standard Operating Procedures
- **Scripts Management**: Manage call scripts and training materials
- **Forms Management**: Access and manage internal forms
- **Complete Tools Suite**:
  - Mortgage Calculator
  - Rate Comparison Tool
  - Document Finder
  - Closing Cost Estimator
  - Property Lookup Tool
  - Scheduling Assistant
  - Loan Program Finder
  - Data Export Tool

## 🔒 Mock Login Credentials

- **Admin**: admin@mortgage.com / admin123
- **Loan Officer**: lo@mortgage.com / lo123
- **Loan Officer Assistant**: loa@mortgage.com / loa123

## 💻 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: TailwindCSS 3.4.3
- **UI Components**: shadcn
- **Routing**: React Router v6
- **Authentication**: Local context-based auth (can be replaced with backend auth)

## 🚀 Deployment

This project is deployed using GitHub Pages. Each push to the main branch triggers a GitHub Actions workflow that builds and deploys the application.

## 🧩 Project Structure

- `/src/components`: Reusable UI components
- `/src/contexts`: Context providers (Auth, etc.)
- `/src/hooks`: Custom React hooks
- `/src/layouts`: Layout components (MainLayout)
- `/src/pages`: Page components organized by feature
- `/src/utils`: Utility functions (content protection, etc.)

## 📝 Development

```bash
# Clone the repository
git clone https://github.com/TirlaP/mortgage-portal.git

# Navigate to the project directory
cd mortgage-portal

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## 📋 Implementation Status

The frontend of the Mortgage Team Portal is feature-complete with all pages and tools implemented, using mock data for demonstration purposes. The next phase will focus on backend integration and API connectivity.

## 📄 License

This project is proprietary and confidential.
