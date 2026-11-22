import { useContext } from 'react';
import { RideContext } from '../context/RideContext';

/**
 * Custom Hook: useRides
 * Provides direct access to ride/booking state and reducer dispatchers
 */
export function useRides() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
}

export default useRides;
