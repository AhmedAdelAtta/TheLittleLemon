import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import App, {
  fetchAPI,
  initializeTimes,
  updateTimes,
  validateBooking,
  submitAPI,
} from "./App";

// Generate a future date for testing.
function futureDate(days = 1) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Generate valid reservation details.
function validBooking() {
  const date = futureDate();
  const times = fetchAPI(new Date(`${date}T00:00:00`));

  return {
    date,
    time: times[0],
    guests: "2",
    occasion: "None",
    name: "Ahmed Adel",
    email: "ahmed@example.com",
  };
}

// Complete the reservation form with valid information.
function fillBookingForm() {
  const booking = validBooking();

  fireEvent.change(screen.getByLabelText("Choose Date"), {
    target: { value: booking.date },
  });

  fireEvent.change(screen.getByLabelText("Choose Time"), {
    target: { value: booking.time },
  });

  fireEvent.change(screen.getByLabelText("Number of Guests"), {
    target: { value: booking.guests },
  });

  fireEvent.change(screen.getByLabelText("Occasion"), {
    target: { value: booking.occasion },
  });

  fireEvent.change(screen.getByLabelText("Your Name"), {
    target: { value: booking.name },
  });

  fireEvent.change(screen.getByLabelText("Email Address"), {
    target: { value: booking.email },
  });

  return booking;
}

// BOOKING LOGIC UNIT TESTS

describe("Reservation availability", () => {
  test("initializeTimes returns an array of available times", () => {
    expect(initializeTimes()).toEqual(fetchAPI(new Date()));
  });

  test("updateTimes returns availability for the selected date", () => {
    const date = futureDate();

    const result = updateTimes([], {
      type: "UPDATE_TIMES",
      date,
    });

    expect(result).toEqual(fetchAPI(new Date(`${date}T00:00:00`)));

    expect(result.length).toBeGreaterThan(0);
  });

  test("past dates have no available reservation times", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    expect(fetchAPI(yesterday)).toEqual([]);
  });

  test("invalid dates return no available times", () => {
    expect(fetchAPI(new Date("invalid"))).toEqual([]);
  });

  test("elapsed time slots are excluded", () => {
    const now = new Date(2030, 5, 15, 19, 0);
    const date = new Date(2030, 5, 15);

    const times = fetchAPI(date, now);

    expect(times.every((time) => time > "19:00")).toBe(true);
  });
});

describe("Booking validation", () => {
  test("valid booking information passes validation", () => {
    const booking = validBooking();

    const times = fetchAPI(new Date(`${booking.date}T00:00:00`));

    expect(validateBooking(booking, times)).toEqual({});
  });

  test("an invalid email address is rejected", () => {
    const booking = {
      ...validBooking(),
      email: "invalid-email",
    };

    const errors = validateBooking(booking, [booking.time]);

    expect(errors.email).toBe("Please enter a valid email address.");
  });

  test("more than 10 guests is rejected", () => {
    const booking = {
      ...validBooking(),
      guests: "11",
    };

    const errors = validateBooking(booking, [booking.time]);

    expect(errors.guests).toBe("Please select between 1 and 10 guests.");
  });

  test("an unavailable reservation time is rejected", () => {
    const booking = {
      ...validBooking(),
      time: "03:00",
    };

    const errors = validateBooking(booking, []);

    expect(errors.time).toBe("Please select an available reservation time.");
  });

  test("a blank customer name is rejected", () => {
    const booking = {
      ...validBooking(),
      name: "   ",
    };

    const errors = validateBooking(booking, [booking.time]);

    expect(errors.name).toBe("Please enter your name.");
  });

  test("submitAPI accepts a valid reservation", () => {
    expect(submitAPI(validBooking())).toBe(true);
  });

  test("submitAPI rejects invalid reservation details", () => {
    const booking = {
      ...validBooking(),
      email: "invalid-email",
    };

    expect(submitAPI(booking)).toBe(false);
  });
});

// BOOKING FORM INTEGRATION TESTS

describe("Booking form functionality", () => {
  test("renders the booking form", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Book a Table" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Choose Date")).toBeInTheDocument();

    expect(screen.getByLabelText("Your Name")).toBeInTheDocument();

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
  });

  test("time selection is disabled until a date is chosen", () => {
    render(<App />);

    const timeSelect = screen.getByLabelText("Choose Time");

    expect(timeSelect).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Choose Date"), {
      target: { value: futureDate() },
    });

    expect(timeSelect).toBeEnabled();
  });

  test("changing the date resets the selected time", () => {
    render(<App />);

    fillBookingForm();

    fireEvent.change(screen.getByLabelText("Choose Date"), {
      target: { value: futureDate(2) },
    });

    expect(screen.getByLabelText("Choose Time")).toHaveValue("");
  });

  test("empty required fields display validation errors", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /confirm your reservation/i,
      }),
    );

    expect(
      screen.getByText("Please select a valid reservation date."),
    ).toBeInTheDocument();

    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();

    expect(
      screen.getByText("Please enter your email address."),
    ).toBeInTheDocument();
  });

  test("invalid email displays an accessible error", () => {
    render(<App />);

    fillBookingForm();

    const emailInput = screen.getByLabelText("Email Address");

    fireEvent.change(emailInput, {
      target: { value: "invalid-email" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /confirm your reservation/i,
      }),
    );

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();

    expect(emailInput).toHaveAttribute("aria-invalid", "true");

    expect(emailInput).toHaveAttribute("aria-describedby", "email-error");
  });

  test("valid reservation displays the confirmation screen", async () => {
    render(<App />);

    fillBookingForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: /confirm your reservation/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Reservation Successful!",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Thank you, Ahmed Adel!/i)).toBeInTheDocument();
  });

  test("making another reservation resets the form", async () => {
    render(<App />);

    fillBookingForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: /confirm your reservation/i,
      }),
    );

    const resetButton = await screen.findByRole("button", {
      name: "Make Another Reservation",
    });

    fireEvent.click(resetButton);

    expect(screen.getByLabelText("Choose Date")).toHaveValue("");
    expect(screen.getByLabelText("Choose Time")).toBeDisabled();
    expect(screen.getByLabelText("Your Name")).toHaveValue("");
    expect(screen.getByLabelText("Email Address")).toHaveValue("");
  });
});
