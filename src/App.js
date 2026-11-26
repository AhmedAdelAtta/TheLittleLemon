import React, { useReducer, useState } from "react";
import "./App.css";
import Header from "./Header";
import BookingForm from "./BookingForm";
import ConfirmedBooking from "./ConfirmedBooking";

// Available reservation time slots
const availableTimes = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

const occasions = ["None", "Birthday", "Anniversary", "Engagement", "Other"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Default reservation values
const initialFormData = {
  date: "",
  time: "",
  guests: "2",
  occasion: "None",
  name: "",
  email: "",
};

// Get today's date in local time
function getLocalToday(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert a booking date into a valid Date object
function parseBookingDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) || getLocalToday(date) !== value
    ? null
    : date;
}

// Simulated API for fetching reservation times
export function fetchAPI(date, now = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return [];
  }

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  return availableTimes.filter((time, index) => {
    const [hours, minutes] = time.split(":").map(Number);

    const slot = new Date(selectedDate);
    slot.setHours(hours, minutes, 0, 0);

    return (selectedDate.getDate() + index) % 3 !== 0 && slot > now;
  });
}

// Initialize available times
export function initializeTimes() {
  return fetchAPI(new Date());
}

// Reducer for reservation availability
export function updateTimes(state, action) {
  switch (action.type) {
    case "UPDATE_TIMES":
      return fetchAPI(parseBookingDate(action.date));

    case "RESET_TIMES":
      return initializeTimes();

    default:
      return state;
  }
}

// Validate reservation details
export function validateBooking(data, times, now = new Date()) {
  const errors = {};
  const selectedDate = parseBookingDate(data.date);

  if (!selectedDate) {
    errors.date = "Please select a valid reservation date.";
  } else if (data.date < getLocalToday(now)) {
    errors.date = "You cannot book a date in the past.";
  }

  if (!errors.date) {
    const currentTimes = fetchAPI(selectedDate, now);

    if (currentTimes.length === 0) {
      errors.time = "No times are available. Please choose another date.";
    } else if (
      !data.time ||
      !times.includes(data.time) ||
      !currentTimes.includes(data.time)
    ) {
      errors.time = "Please select an available reservation time.";
    }
  }

  const guests = Number(data.guests);

  if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
    errors.guests = "Please select between 1 and 10 guests.";
  }

  if (!occasions.includes(data.occasion)) {
    errors.occasion = "Please select a valid occasion.";
  }

  if (!data.name?.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!data.email?.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!emailPattern.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}

// Simulated reservation submission
export function submitAPI(data) {
  const now = new Date();

  const times = fetchAPI(parseBookingDate(data.date), now);

  return Object.keys(validateBooking(data, times, now)).length === 0;
}

function App() {
  const [times, dispatch] = useReducer(updateTimes, [], initializeTimes);

  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = getLocalToday();

  // Update form data and refresh available times
  function handleChange(event) {
    const { name, value } = event.target;
    const changingDate = name === "date";

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
      ...(changingDate ? { time: "" } : {}),
    }));

    if (changingDate) {
      dispatch({
        type: "UPDATE_TIMES",
        date: value,
      });
    }

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
      submission: "",
      ...(changingDate ? { time: "" } : {}),
    }));
  }

  // Validate and submit the reservation
  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateBooking(formData, times);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        guests: Number(formData.guests),
      };

      const success = await submitAPI(bookingData);

      if (success) {
        setFormData(bookingData);
        setConfirmed(true);
      } else {
        dispatch({
          type: "UPDATE_TIMES",
          date: formData.date,
        });

        setFormData((previousData) => ({
          ...previousData,
          time: "",
        }));

        setErrors({
          submission:
            "We couldn't complete your reservation. Please select an available time and try again.",
        });
      }
    } catch (error) {
      setErrors({
        submission: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset the reservation form
  function handleNewReservation() {
    setFormData({
      ...initialFormData,
    });

    dispatch({
      type: "RESET_TIMES",
    });

    setErrors({});
    setConfirmed(false);
  }

  return (
    <div className="App">
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}

        <section className="hero" id="home">
          <div className="hero-content">
            <span className="subtitle">CHICAGO · MEDITERRANEAN CUISINE</span>

            <h1>
              Good food.
              <br />
              <span>Good company.</span>
            </h1>

            <p>
              A little taste of the Mediterranean, right in your neighbourhood.
              Fresh ingredients, bright flavours, and a table waiting for you.
            </p>

            <a href="#booking" className="primary-button">
              Reserve Your Table →
            </a>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
              alt="Fresh Mediterranean food served at Little Lemon"
            />
          </div>
        </section>

        {/* Booking Section */}

        <section
          className="booking-section"
          id="booking"
          aria-labelledby="booking-title"
        >
          <div className="section-heading">
            <span className="subtitle">YOUR TABLE IS WAITING</span>

            <h2 id="booking-title" tabIndex={-1}>
              Book a Table
            </h2>

            <p>Make it a date. We'll take care of the rest.</p>
          </div>

          {confirmed ? (
            <ConfirmedBooking
              formData={formData}
              handleNewReservation={handleNewReservation}
            />
          ) : (
            <BookingForm
              formData={formData}
              times={times}
              errors={errors}
              today={today}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          )}
        </section>

        {/* Restaurant Information */}

        <section
          className="info-section"
          id="menu"
          aria-labelledby="restaurant-info-title"
        >
          <h2 id="restaurant-info-title" className="sr-only">
            Restaurant Information
          </h2>
          <div>
            <span aria-hidden="true">🍽️</span>
            <h3>Seasonal Menu</h3>
            <p>Fresh ingredients, always.</p>
          </div>

          <div>
            <span aria-hidden="true">🕒</span>
            <h3>Open Daily</h3>
            <p>11:00 AM – 10:00 PM</p>
          </div>

          <div>
            <span aria-hidden="true">❤️</span>
            <h3>Made for Sharing</h3>
            <p>Come as you are.</p>
          </div>
        </section>

        {/* About Section */}

        <section className="about-section" id="about">
          <div>
            <span className="subtitle">A NEIGHBOURHOOD FAVOURITE</span>

            <h2>
              A Little Lemon.
              <br />
              <span>A Lot of Flavour.</span>
            </h2>

            <p>
              At Little Lemon, we bring people together over honest
              Mediterranean cooking. From bright, fresh starters to comforting
              classics, every plate is made to be enjoyed.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}

      <footer>
        <div>🍋 LITTLE LEMON</div>

        <p>© {new Date().getFullYear()} Little Lemon. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
