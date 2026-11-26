# Little Lemon Restaurant

A responsive restaurant reservation web application developed
using React as part of the Meta Front-End Developer
Capstone Project.

## Project Overview

Little Lemon is a Mediterranean restaurant based in Chicago.
This application allows customers to explore restaurant
information and reserve a table through an accessible,
responsive booking interface.

## Features

- Responsive design for desktop, tablet and mobile devices.
- Restaurant homepage and navigation.
- Interactive table reservation form.
- Date-dependent reservation availability.
- Prevention of past-date and elapsed-time bookings.
- Guest selection for groups of 1 to 10 people.
- Special occasion selection.
- Customer name and email validation.
- Accessible form labels and validation messages.
- Reservation confirmation and form reset.
- Keyboard navigation and visible focus indicators.
- Simulated reservation API.
- Automated unit and integration tests.

## Technologies Used

- React
- JavaScript (ES6+)
- HTML5
- CSS3
- React Hooks
- Jest
- React Testing Library
- Git and GitHub

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone or download this repository.
2. Open the project directory in your terminal.
3. Install the project dependencies:

   npm install

4. Start the development server:

   npm start

5. Open http://localhost:3000 in your browser.

## Running Tests

To run all automated tests:

    npm test -- --watchAll=false

The project includes 19 unit and integration tests covering:

- Initialization of available reservation times.
- Date-dependent availability.
- Invalid and past reservation dates.
- Elapsed reservation times.
- Booking form validation.
- Invalid email addresses.
- Guest number restrictions.
- Accessible validation messages.
- Successful reservation submission.
- Reservation form reset.

## Production Build

To create an optimized production build:

    npm run build

The production files will be generated in the build directory.

## Project Structure

    little-lemon/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   ├── App.test.js
    │   ├── Header.js
    │   ├── BookingForm.js
    │   ├── ConfirmedBooking.js
    │   └── index.js
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    └── README.md

## Component Architecture

### App

Manages application state, reservation availability,
booking validation and submission.

### Header

Provides restaurant branding, navigation and an accessible
skip-navigation link.

### BookingForm

Displays reservation fields, available times and accessible
validation messages.

### ConfirmedBooking

Displays successful reservation details and allows customers
to make another reservation.

## Accessibility

The application incorporates accessibility practices including:

- Semantic HTML elements.
- Associated form labels.
- Alternative text for images.
- ARIA attributes for validation messages.
- Keyboard-accessible controls.
- Visible focus indicators.
- Skip-navigation functionality.
- Screen reader announcements.
- Focus management after successful submission.
- Reduced-motion support.

## API Simulation

The application uses local simulated API functions:

- fetchAPI: Returns available reservation times for a date.
- submitAPI: Validates and simulates reservation submission.

No backend server or database is required.
Reservations are not transmitted to a real restaurant
or permanently stored.

## Author

Ahmed Adel Youssef

Developed as part of the Meta Front-End Developer
Professional Certificate.
