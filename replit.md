# Jikulumessu - Portal de Diaristas

## Overview

Jikulumessu is a full-stack web application designed to connect families with qualified domestic workers in Angola. The platform provides a comprehensive solution for finding, filtering, and contacting domestic service providers based on location, services offered, and contract preferences. "Jikulumessu" means "open your eyes" or "stay alert" in Angolan languages, representing awareness and vigilance in choosing domestic services.

## Recent Updates (Janeiro 2025)

✓ **Complete Rebranding**: Changed from "Casa Rápida" to "Jikulumessu" across all components and pages
✓ **Custom "Abre o Olho" Icon**: Created personalized icon representing awareness/alertness as per brand meaning
✓ **Dark/Light Mode Toggle**: Implemented theme switching functionality visible in header for all screen sizes  
✓ **Full Responsiveness**: Enhanced mobile-first responsive design across all components and sections
✓ **Improved Search UX**: Made search and filter sections fully responsive with proper spacing and layout
✓ **Fixed Container Responsiveness**: Resolved geolocation prompt overflow issues and improved mobile layout
✓ **Enhanced Icon Design**: Updated to represent black person with "abre o olho" gesture using finger pointing to eye
✓ **Portuguese Language Consistency**: Ensured proper Portuguese from Portugal across all interface elements
✓ **Header Duplication Fix**: Removed duplicate navbar appearing on home page
✓ **Fake Data Elimination**: Completely removed all sample/fake user profiles - only real registered users displayed
✓ **Custom Favicon Creation**: Added "abre o olho" symbol favicon with custom SVG design
✓ **Icon Update (Janeiro 2025)**: Substituído ícone genérico amarelo por design baseado na imagem fornecida pelo utilizador, com fundo vermelho suave (em vez de azul) mantendo o conceito "abre o olho"
✓ **Supabase SQL Script**: Created complete database setup script for Supabase SQL Editor
✓ **Authentication Improvements**: Enhanced session management with proper cookie handling
✓ **Social Media Integration**: Added dedicated social media tab in user profiles with Facebook, Instagram, TikTok links
✓ **Location Input Enhancement**: Manual neighborhood input option alongside dropdown selection
✓ **Portuguese (Portugal) Localization**: Complete interface using Portuguese from Portugal terminology
✓ **Comprehensive Rating & Review System**: Implemented 5-star rating system with detailed feedback categories (quality, punctuality, communication, value), review modals, and reviews display
✓ **Enhanced Profile Interactions**: Added tabbed profile modal with dedicated sections for details, reviews, and contact information
✓ **Real-time Rating Updates**: Automatic calculation and display of average ratings and review counts across all user profiles
✓ **Complete Local Authentication System**: Implemented full authentication flow with registration, login, and session management
✓ **Comprehensive Profile Management**: Created complete user profile system with editing capabilities, social media integration, and account management
✓ **Fixed Authentication Redirects**: Resolved post-login/registration redirect issues with proper session handling
✓ **Authentication System Complete**: Full registration, login, session management, and profile editing functionality working correctly
✓ **Data Persistence Resolved**: MemStorage implementation with proper user data handling and session management
✓ **Profile Management Working**: Complete user profile editing with date validation, location selection, and data persistence
✓ **Clean Database**: Removed all fake/sample data - only real registered users displayed
✓ **API Endpoints Functional**: All CRUD operations for users, authentication, and profile management working correctly

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