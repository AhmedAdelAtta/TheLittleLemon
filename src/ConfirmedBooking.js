import React, { useEffect, useRef } from "react";

function ConfirmedBooking({ formData, handleNewReservation }) {
  const headingRef = useRef(null);

  // Move keyboard focus to the confirmation message.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="confirmation" aria-labelledby="confirmation-title">
      <div className="success-icon" aria-hidden="true">
        ✓
      </div>

      <h3 id="confirmation-title" ref={headingRef} tabIndex={-1}>
        Reservation Successful!
      </h3>

      <p role="status">
        Thank you, {formData.name}! Your reservation has been submitted
        successfully.
      </p>

      <p>
        <strong>Date:</strong> {formData.date}
      </p>

      <p>
        <strong>Time:</strong> {formData.time}
      </p>

      <p>
        <strong>Guests:</strong> {formData.guests}
      </p>

      <p>
        <strong>Occasion:</strong>{" "}
        {formData.occasion === "None"
          ? "No special occasion"
          : formData.occasion}
      </p>

      <p>
        <strong>Email:</strong> {formData.email}
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={() => {
          handleNewReservation();
          document.getElementById("booking-title")?.focus();
        }}
      >
        Make Another Reservation
      </button>
    </div>
  );
}

export default ConfirmedBooking;
