# Overview

FitAI Yogyakarta is a personalized fitness application that provides users with customized workout, diet, and sleep plans based on their individual profile data. The application features an interactive dashboard where users can track their progress, view detailed plans, and interact with an AI-powered chatbot for fitness guidance. Built as a full-stack web application with a React frontend and Express backend, it emphasizes user engagement through progress tracking and motivational feedback.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: Tailwind CSS with shadcn/ui component library built on Radix UI primitives
- **Component Structure**: Modular component-based architecture with reusable UI components
- **Styling**: CSS variables for theming with support for light/dark modes

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Data Storage**: In-memory storage with interface abstraction for future database integration
- **API Design**: RESTful API endpoints for profile management and data persistence
- **Schema Validation**: Zod for runtime type validation and schema enforcement
- **Build System**: ESBuild for production bundling

## Data Management
- **Database ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Schema Structure**: 
  - Users table for authentication data
  - User profiles table for fitness data (weight, body fat, muscle mass, age, goals)
  - JSON field for tracking completion status of activities
- **Data Validation**: Shared schema definitions between frontend and backend using Zod

## Key Features Architecture
- **Onboarding Flow**: Modal-based user data collection with form validation
- **Progress Tracking**: Weekly schedule with completion status and visual progress indicators
- **Plan Generation**: Simulated AI-based plan creation based on user goals (cutting, bulking, recomposition)
- **AI Chat Interface**: Simulated chatbot with predefined responses for fitness guidance
- **Motivational System**: Dynamic alerts and progress visualization to encourage user engagement

## Authentication & Session Management
- **Current State**: Demo user system without authentication (userId: "demo-user")
- **Future Ready**: User table structure prepared for full authentication implementation
- **Session Handling**: Basic session management infrastructure in place

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database driver

## UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Development Tools
- **vite**: Fast development server and build tool
- **typescript**: Static type checking
- **zod**: Runtime schema validation
- **date-fns**: Date manipulation utilities

## Database Infrastructure
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **Drizzle Kit**: Database migration and schema management tools

## Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration

## Additional Libraries
- **embla-carousel-react**: Carousel/slider components
- **cmdk**: Command palette interface
- **clsx & tailwind-merge**: Conditional CSS class management