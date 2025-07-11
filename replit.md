# Jikulumessu - Portal de Diaristas

## Overview

Jikulumessu is a full-stack web application designed to connect people with qualified service providers in Angola. The platform provides a comprehensive solution for finding, filtering, and contacting various "flash service" providers based on location, services offered, and contract preferences. "Jikulumessu" means "open your eyes" or "stay alert" in Angolan languages, representing awareness and vigilance in choosing service providers.

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
✓ **Image Upload System**: Implemented complete image upload functionality with validation and base64 storage
✓ **Multiple Authentication Methods**: Email-based and simple name-based registration and login systems
✓ **Real-time Profile Updates**: Profile editing with instant image preview and data persistence
✓ **Complete User Management**: Registration, login, profile editing, image upload, and logout functionality
✓ **Complete Text Neutralization**: Updated all platform text to position as neutral intermediary, not family-focused service
✓ **Phone Number Formatting**: Added automatic +244 prefix and three-digit grouping for Angola phone numbers
✓ **Comprehensive Policy Updates**: Updated privacy policy and terms of service to reflect intermediary role and data non-collection
✓ **Footer Corrections**: Updated footer description to reflect intermediary role instead of family-focused service
✓ **Portuguese Portugal Consistency**: Corrected "ônibus" to "autocarro" and "senha" to "palavra-passe" throughout the platform
✓ **Complete Terminology Update**: Changed all references from "famílias/profissionais" to "pessoas/prestadores de serviços" across all pages
✓ **Animated Onboarding Tutorial**: Implemented comprehensive tutorial with playful "Jiku" character guide featuring smooth animations, 6-step walkthrough, and localStorage persistence
✓ **Flash Services Expansion (Janeiro 2025)**: Expanded service offerings from domestic-only to comprehensive "flash services" including transport, events, maintenance, beauty, education, and security services
✓ **26+ Service Categories**: Added extensive service options including taxi drivers, collectors, decorators, security, electricians, beauticians, and more
✓ **Generic Service Terminology**: Updated all platform text to use "prestadores de serviços" instead of "prestadores de serviços domésticos" to reflect expanded service scope
✓ **Updated About & How-It-Works Pages**: Modified all informational pages to describe platform as general service intermediary rather than domestic-focused
✓ **Enhanced Service Categories**: Reorganized services into logical categories: general services, personal care, transport, events, maintenance, beauty, education, and others
✓ **Complete Site Rebrand Cleanup (Janeiro 2025)**: Removed all remaining references to "Doméstica Angola" from help, privacy, security, and terms pages
✓ **Contact Information Standardization**: Updated all contact references to use only email (no phone numbers) with proper email mapping: suporte@jikulumessu.com and contacto@jikulumessu.ao both redirect to d2413175@gmail.com
✓ **Footer Contact Optimization**: Removed phone number from footer, keeping only email contact with proper mailto functionality
✓ **Complete Social Media Removal (Janeiro 2025)**: Eliminated all social media references from platform - removed social media icons from footer, social media sections from profiles, and all social media-related text from help and other pages
✓ **Social Media Tab Removal**: Removed social media tab from user profiles, cleaned up form data and component imports
✓ **Email-Only Contact Policy**: Enforced strict email-only contact policy across all platform touchpoints

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