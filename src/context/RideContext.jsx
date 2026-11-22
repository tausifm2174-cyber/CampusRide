import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { rideReducer, RIDE_ACTIONS } from '../reducers/rideReducer';
import { initialRides, initialBookings } from '../data/mockRides';

export const RideContext = createContext(null);

const STORAGE_KEY_RIDES = 'campusride_rides';
const STORAGE_KEY_BOOKINGS = 'campusride_bookings';

function loadInitialState() {
  let loadedRides = initialRides;
  let loadedBookings = initialBookings;

  try {
    const storedRides = localStorage.getItem(STORAGE_KEY_RIDES);
    if (storedRides) {
      const parsed = JSON.parse(storedRides);
      if (Array.isArray(parsed) && parsed.length > 0) {
        loadedRides = parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored rides:', err);
  }

  try {
    const storedBookings = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (storedBookings) {
      const parsed = JSON.parse(storedBookings);
      if (Array.isArray(parsed) && parsed.length > 0) {
        loadedBookings = parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored bookings:', err);
  }

  return {
    rides: loadedRides,
    bookings: loadedBookings
  };
}

export function RideProvider({ children }) {
  const [state, dispatch] = useReducer(rideReducer, null, loadInitialState);

  // Synchronize rides to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RIDES, JSON.stringify(state.rides));
    } catch (err) {
      console.error('Failed to save rides to localStorage:', err);
    }
  }, [state.rides]);

  // Synchronize bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(state.bookings));
    } catch (err) {
      console.error('Failed to save bookings to localStorage:', err);
    }
  }, [state.bookings]);

  /**
   * Action Dispatchers
   */
  const addRide = (newRide) => {
    dispatch({ type: RIDE_ACTIONS.ADD_RIDE, payload: newRide });
  };

  const editRide = (updatedRide) => {
    dispatch({ type: RIDE_ACTIONS.EDIT_RIDE, payload: updatedRide });
  };

  const cancelRide = (rideId) => {
    dispatch({ type: RIDE_ACTIONS.CANCEL_RIDE, payload: rideId });
  };

  const joinRide = (rideId, seatsToBook = 1, user = null) => {
    dispatch({
      type: RIDE_ACTIONS.JOIN_RIDE,
      payload: { rideId, seatsToBook, user }
    });
  };

  const cancelBooking = (bookingId) => {
    dispatch({ type: RIDE_ACTIONS.CANCEL_BOOKING, payload: bookingId });
  };

  const rateRide = (bookingId, rideId, rating) => {
    dispatch({
      type: RIDE_ACTIONS.RATE_RIDE,
      payload: { bookingId, rideId, rating }
    });
  };

  const contextValue = {
    rides: state.rides,
    bookings: state.bookings,
    addRide,
    editRide,
    cancelRide,
    joinRide,
    cancelBooking,
    rateRide
  };

  return (
    <RideContext.Provider value={contextValue}>
      {children}
    </RideContext.Provider>
  );
}

export default RideContext;
