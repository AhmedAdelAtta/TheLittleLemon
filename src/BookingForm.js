import React from "react";

// Reusable validation error component
function FieldError({ field, errors }) {
  if (!errors[field]) return null;

  return (
    <span className="error-message" id={`${field}-error`} role="alert">
      {errors[field]}
    </span>
  );
}

function BookingForm({
  formData,
  times,
  errors,
  today,
  isSubmitting,
  handleChange,
  handleSubmit,
}) {
  // Associate invalid fields with their error messages
  function accessibilityProps(field) {
    return {
      "aria-invalid": !!errors[field],
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
    };
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <h3>Reservation Details</h3>
        <p>Choose your preferred date and time.</p>
      </div>

      {errors.submission && (
        <p className="error-message" role="alert">
          {errors.submission}
        </p>
      )}

      <div className="form-grid">
        {/* Reservation Date */}

        <div className="form-group">
          <label htmlFor="date">Choose Date</label>

          <input
            type="date"
            id="date"
            name="date"
            min={today}
            value={formData.date}
            onChange={handleChange}
            required
            {...accessibilityProps("date")}
          />

          <FieldError field="date" errors={errors} />
        </div>

        {/* Reservation Time */}

        <div className="form-group">
          <label htmlFor="time">Choose Time</label>

          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            disabled={!formData.date || times.length === 0}
            {...accessibilityProps("time")}
          >
            <option value="" disabled>
              {!formData.date
                ? "Select a date first"
                : times.length === 0
                  ? "No available times"
                  : "Select a time"}
            </option>

            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          {formData.date && times.length === 0 && !errors.time && (
            <span className="error-message" role="status">
              No times are available. Please choose another date.
            </span>
          )}

          <FieldError field="time" errors={errors} />
        </div>

        {/* Number of Guests */}

        <div className="form-group">
          <label htmlFor="guests">Number of Guests</label>

          <select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
            {...accessibilityProps("guests")}
          >
            {Array.from({ length: 10 }, (_, index) => {
              const number = index + 1;

              return (
                <option key={number} value={number}>
                  {number} {number === 1 ? "Guest" : "Guests"}
                </option>
              );
            })}
          </select>

          <FieldError field="guests" errors={errors} />
        </div>

        {/* Occasion */}

        <div className="form-group">
          <label htmlFor="occasion">Occasion</label>

          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            {...accessibilityProps("occasion")}
          >
            <option value="None">No special occasion</option>

            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Engagement">Engagement</option>
            <option value="Other">Other</option>
          </select>

          <FieldError field="occasion" errors={errors} />
        </div>

        {/* Customer Name */}

        <div className="form-group">
          <label htmlFor="name">Your Name</label>

          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
            {...accessibilityProps("name")}
          />

          <FieldError field="name" errors={errors} />
        </div>

        {/* Customer Email */}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            {...accessibilityProps("email")}
          />

          <FieldError field="email" errors={errors} />
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Confirm Your Reservation →"}
      </button>

      <p className="form-note">
        No payment required. We look forward to seeing you!
      </p>
    </form>
  );
}

export default BookingForm;
