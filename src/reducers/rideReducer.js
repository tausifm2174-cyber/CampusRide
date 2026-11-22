/**
 * CampusRide - Ride Reducer
 * Handles central state transitions for rides, bookings, and ratings using useReducer()
 */

export const RIDE_ACTIONS = {
  ADD_RIDE: 'ADD_RIDE',
  EDIT_RIDE: 'EDIT_RIDE',
  CANCEL_RIDE: 'CANCEL_RIDE',
  JOIN_RIDE: 'JOIN_RIDE',
  CANCEL_BOOKING: 'CANCEL_BOOKING',
  RATE_RIDE: 'RATE_RIDE',
  INIT_STATE: 'INIT_STATE'
};

export function rideReducer(state, action) {
  switch (action.type) {
    case RIDE_ACTIONS.INIT_STATE: {
      return {
        rides: action.payload.rides || state.rides,
        bookings: action.payload.bookings || state.bookings
      };
    }

    case RIDE_ACTIONS.ADD_RIDE: {
      const newRide = action.payload;
      return {
        ...state,
        rides: [newRide, ...state.rides]
      };
    }

    case RIDE_ACTIONS.EDIT_RIDE: {
      const updatedRide = action.payload;
      return {
        ...state,
        rides: state.rides.map((ride) =>
          ride.id === updatedRide.id ? updatedRide : ride
        )
      };
    }

    case RIDE_ACTIONS.CANCEL_RIDE: {
      const rideId = action.payload;
      return {
        ...state,
        rides: state.rides.map((ride) =>
          ride.id === rideId ? { ...ride, status: 'Cancelled' } : ride
        ),
        // Update associated active bookings to reflect cancelled ride
        bookings: state.bookings.map((booking) =>
          booking.rideId === rideId ? { ...booking, status: 'Cancelled' } : booking
        )
      };
    }

    case RIDE_ACTIONS.JOIN_RIDE: {
      const { rideId, seatsToBook = 1, user } = action.payload;
      const targetRide = state.rides.find((r) => r.id === rideId);
      if (!targetRide) return state;

      const availableSeats = (Number(targetRide.seats) || 0) - (Number(targetRide.bookedSeats) || 0);
      if (availableSeats < seatsToBook) return state;

      // 1. Update ride booked seats
      const updatedRides = state.rides.map((r) => {
        if (r.id === rideId) {
          return {
            ...r,
            bookedSeats: (Number(r.bookedSeats) || 0) + seatsToBook
          };
        }
        return r;
      });

      // 2. Create new booking record
      const newBooking = {
        id: Date.now(),
        rideId: targetRide.id,
        route: `${targetRide.from} → ${targetRide.to}`,
        driver: targetRide.driverName,
        driverId: targetRide.driverId,
        driverPhone: targetRide.driverPhone || '+91 98450 11223',
        date: targetRide.formattedDate || targetRide.date,
        time: targetRide.time,
        pickup: targetRide.pickupPoint || targetRide.from,
        dropoff: targetRide.dropoffPoint || targetRide.to,
        seatsBooked: seatsToBook,
        contribution: targetRide.contribution,
        status: 'Confirmed',
        vehicle: targetRide.vehicleModel || targetRide.vehicleType,
        passengerName: user?.name || 'Anonymous Student',
        passengerId: user?.id || 'guest',
        bookedAt: new Date().toISOString()
      };

      return {
        rides: updatedRides,
        bookings: [newBooking, ...state.bookings]
      };
    }

    case RIDE_ACTIONS.CANCEL_BOOKING: {
      const bookingId = action.payload;
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking || booking.status === 'Cancelled') return state;

      // 1. Mark booking as Cancelled
      const updatedBookings = state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'Cancelled' } : b
      );

      // 2. Restore available seat on corresponding ride
      const updatedRides = state.rides.map((r) => {
        if (r.id === booking.rideId) {
          return {
            ...r,
            bookedSeats: Math.max(0, (Number(r.bookedSeats) || 0) - (Number(booking.seatsBooked) || 1))
          };
        }
        return r;
      });

      return {
        rides: updatedRides,
        bookings: updatedBookings
      };
    }

    case RIDE_ACTIONS.RATE_RIDE: {
      const { bookingId, rideId, rating } = action.payload;

      // 1. Update the booking with ratingGiven
      const updatedBookings = state.bookings.map((b) =>
        b.id === bookingId ? { ...b, ratingGiven: rating } : b
      );

      // 2. Update the ride driver's rating and review count
      const updatedRides = state.rides.map((r) => {
        if (r.id === rideId) {
          const currentRating = Number(r.rating) || 4.8;
          const count = Number(r.reviewCount) || 12;
          const newRating = Number(((currentRating * count + rating) / (count + 1)).toFixed(1));
          return {
            ...r,
            rating: newRating,
            reviewCount: count + 1
          };
        }
        return r;
      });

      return {
        rides: updatedRides,
        bookings: updatedBookings
      };
    }

    default:
      return state;
  }
}

export default rideReducer;
