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

// Return simulated availability for the selected date.
export function fetchAPI(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  // Reservations cannot be made for past dates.
  if (selectedDate < today) {
    return [];
  }

  // Simulate different availability depending on the date.
  const times = availableTimes.filter((time, index) => {
    return (date.getDate() + index) % 3 !== 0;
  });

  // Remove elapsed time slots for same-day bookings.
  const now = new Date();

  return times.filter((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const reservationTime = new Date(selectedDate);

    reservationTime.setHours(hours, minutes, 0, 0);

    return reservationTime > now;
  });
}

// Simulate submitting a reservation.
export function submitAPI(formData) {
  const date = new Date(`${formData.date}T00:00:00`);

  const guests = Number(formData.guests);

  return (
    fetchAPI(date).includes(formData.time) &&
    Number.isInteger(guests) &&
    guests >= 1 &&
    guests <= 10 &&
    Boolean(formData.name?.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email?.trim() || "")
  );
}
