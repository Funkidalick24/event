# EventHorizon

## Overview

EventHorizon is a comprehensive event management platform that connects event organizers with attendees worldwide. The application allows users to discover, register for, and organize events ranging from conferences and workshops to meetups and networking events. Built as a full-stack web application, it provides a seamless experience for both event attendees and organizers.

To start a test server on your computer, run `npm run dev` in the project root directory. This will start the development server on port 5000. Then open your web browser and navigate to `http://localhost:5000` to see the first page of the app, which is the landing page showcasing the platform's features.

The purpose of writing this software was to deepen my understanding of full-stack web development, particularly focusing on modern React patterns, TypeScript, and backend API design. By building EventHorizon, I aimed to create a practical application that demonstrates real-world development skills while solving a common problem in event management.

[Software Demo Video](http://youtube.link.goes.here)

## Web Pages

### Landing Page
The landing page serves as the entry point to EventHorizon, featuring a hero section with the platform's tagline "Connect. Learn. Grow Together." It includes:
- Dynamic background images and animations using Framer Motion
- Feature highlights for global networking, real-time analytics, and seamless management
- Call-to-action buttons directing users to browse events or become organizers
- A section encouraging users to start organizing their own events

### Events Page
This page displays a curated list of upcoming events with filtering capabilities:
- Grid layout of event cards showing event images, titles, dates, locations, and prices
- Date-based filtering using a calendar picker
- Event categories displayed as badges
- Registration buttons linking to the event registration flow
- Responsive design that adapts to different screen sizes

### User Profile Page
A comprehensive dashboard for authenticated users with three main tabs:
- **Attending Tab**: Shows events the user has registered for, with ticket viewing capabilities
- **Organizing Tab**: Allows event organizers to manage their events, view attendee lists, and create new events through a modal dialog
- **Settings Tab**: Profile management form for updating user information

### Registration Pages
- **Login/Register**: Authentication pages for user sign-in and account creation
- **Event Registration**: Form for registering attendees with ticket type selection
- **Confirmation**: Success page after event registration

### Additional Pages
- **Not Found**: 404 error page for invalid routes
- **Confirmation**: Post-registration confirmation page

The app transitions between pages using client-side routing with Wouter, providing smooth navigation without full page reloads. Dynamic content is loaded based on user authentication status and route parameters.

## Development Environment

### Tools Used
- **VS Code**: Primary code editor with TypeScript support
- **Git**: Version control for tracking changes and collaboration
- **Node.js**: Runtime environment for the JavaScript backend
- **npm**: Package manager for dependency management

### Programming Language and Libraries
- **TypeScript**: Primary programming language for type safety and better developer experience
- **React 19**: Frontend framework for building the user interface with modern hooks and concurrent features
- **Express.js**: Backend web framework for API development
- **SQLite with Drizzle ORM**: Database solution for data persistence and querying
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component library for consistent UI elements
- **React Query (TanStack Query)**: Data fetching and state management library
- **Framer Motion**: Animation library for smooth UI transitions
- **Passport.js**: Authentication middleware for user sessions
- **Wouter**: Lightweight routing library for React
- **Vite**: Build tool and development server for fast hot reloading

## Useful Websites

* [React Documentation](https://react.dev/)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)
* [Express.js Guide](https://expressjs.com/en/guide/routing.html)
* [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
* [Radix UI Components](https://www.radix-ui.com/)
* [Framer Motion Documentation](https://www.framer.com/motion/)
* [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)

## Future Work

* Implement real-time notifications for event updates and reminders
* Add payment processing integration for paid events
* Enhance the analytics dashboard with more detailed metrics and charts
* Implement event search and advanced filtering options
* Add social features like event sharing and user following
* Create a mobile app version using React Native
* Implement email notifications for registrations and event updates
* Add event categories management and custom fields
* Integrate with calendar applications for event scheduling
* Add bulk operations for organizers (mass email, attendee management)