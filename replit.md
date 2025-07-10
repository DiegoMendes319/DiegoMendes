# Doméstica Angola - Portal de Diaristas

## Overview

Doméstica Angola is a full-stack web application designed to connect families with qualified domestic workers in Angola. The platform provides a comprehensive solution for finding, filtering, and contacting domestic service providers based on location, services offered, and contract preferences.

## Recent Updates (Janeiro 2025)

✓ **Complete Footer Pages Implementation**: All footer pages now exist with real content (Sobre Nós, Como Funciona, Ajuda, Termos de Serviço, Política de Privacidade, Segurança)
✓ **Portuguese (Portugal) Localization**: All interface text updated to use Portuguese from Portugal terminology
✓ **Google OAuth Integration**: Proper Supabase OAuth implementation with setup instructions
✓ **Three Authentication Methods**: Email/Password, Google OAuth, and Simple Name/Password login
✓ **Enhanced Error Handling**: Proper authentication error messages and validation
✓ **Navbar Enhancement**: Modern responsive navbar with Angola colors and mobile support
✓ **Removed Cookie Policy**: As requested, completely removed cookie policy references

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern React features
- **Styling**: Tailwind CSS for utility-first styling with custom Angola-themed color scheme
- **UI Components**: Shadcn/ui component library for consistent, accessible UI elements
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript for consistent typing across the stack
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Planned integration with Supabase Auth (currently mocked)
- **API Design**: RESTful API with CRUD operations for user management

### Data Storage Solutions
- **Primary Database**: PostgreSQL for structured data storage
- **ORM**: Drizzle ORM with schema-first approach
- **File Storage**: Planned Supabase storage for profile images (currently mocked)
- **In-Memory Storage**: Fallback memory storage implementation for development

## Key Components

### Database Schema
- **Users Table**: Comprehensive user profiles including personal information, location (province/municipality/neighborhood), services offered, contract preferences, and availability
- **Location Data**: Hierarchical location structure for Angola (provinces → municipalities → neighborhoods)
- **Services**: Array-based service categorization for flexible service offerings

### API Endpoints
- `GET /api/users` - Retrieve all users or search with filters
- `GET /api/users/:id` - Get specific user profile
- `POST /api/users` - Create new user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user profile

### Search & Filtering System
- **Geolocation**: Browser-based location detection for proximity-based search
- **Manual Location**: Cascading location selectors (Province → Municipality → Neighborhood)
- **Service Filters**: Filter by specific services offered
- **Contract Type**: Filter by employment arrangement preferences

### User Interface Components
- **Profile Cards**: Display user information with ratings and key details
- **Location Selector**: Three-tier cascading dropdown for Angola's administrative divisions
- **Contact Modal**: Secure contact information display
- **Profile Modal**: Detailed view of service provider information

## Data Flow

1. **User Discovery**: Users can find service providers through geolocation or manual location selection
2. **Search Processing**: Frontend sends search parameters to backend API
3. **Data Retrieval**: Backend queries database with filters and returns matching profiles
4. **Profile Display**: Frontend renders profile cards with essential information
5. **Contact Initiation**: Users can view detailed profiles and access contact information

## External Dependencies

### Current Integrations
- **Neon Database**: PostgreSQL hosting (@neondatabase/serverless)
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Icon library for consistent iconography

### Planned Integrations
- **Supabase**: Authentication and file storage (currently mocked)
- **Geolocation API**: Browser-based location services
- **Image Upload**: Profile picture management

## Deployment Strategy

### Development Environment
- **Build System**: Vite for fast development and building
- **Development Server**: Express server with Vite middleware
- **Hot Module Replacement**: Vite HMR for rapid development

### Production Considerations
- **Build Process**: Vite build for frontend, esbuild for backend bundling
- **Database**: PostgreSQL with connection pooling
- **Static Assets**: Vite-built frontend served as static files
- **Environment Variables**: Supabase configuration and database URL

### Key Features
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Angola Theme**: Custom color scheme using Angola's national colors (red, black, yellow)
- **Progressive Enhancement**: Graceful degradation for users without JavaScript
- **Performance**: Optimized bundle sizes and lazy loading for better user experience

The application is designed to be easily deployable on platforms like Replit, with all necessary configuration files and environment setup included.