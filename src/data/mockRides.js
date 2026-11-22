/**
 * CampusRide - Ride & Booking Data Architecture
 * Phase 2 Central Data Flow & State Defaults
 */

export const mockUserProfile = {
  name: "Arjun Verma",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  college: "SJB Institute of Technology (SJBIT)",
  course: "B.E. Computer Science & Engineering",
  year: "3rd Year (5th Semester)",
  email: "arjun.cs24@sjbit.edu.in",
  phone: "+91 98765 43210",
  studentId: "1JB24CS089",
  vehicle: "Maruti Suzuki Swift (White) • KA 05 MC 3321",
  rating: 4.9,
  totalTrips: 42,
  ridesOffered: 18,
  ridesTaken: 24,
  co2OffsetKg: 135,
  moneySaved: 4200
};

export const initialRides = [
  {
    id: 1,
    driverName: "Rahul Sharma",
    driverAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    college: "SJB Institute of Technology",
    department: "Computer Science, 3rd Year",
    from: "Yelahanka",
    to: "SJBIT Campus",
    pickupPoint: "Yelahanka Mother Dairy Circle",
    dropoffPoint: "SJBIT Main Gate",
    date: "2026-11-24",
    formattedDate: "24 Nov 2026",
    time: "08:00 AM",
    seats: 4,
    bookedSeats: 2,
    contribution: 50,
    vehicleType: "Car (Sedan)",
    vehicleModel: "Honda City (White)",
    vehicleNumber: "KA 04 MP 4219",
    rating: 4.8,
    reviewCount: 24,
    verifiedStudent: true,
    features: ["AC", "Luggage Space", "Music Allowed", "Female Co-rider Friendly"],
    notes: "Leaving strictly by 8:05 AM. Please be near the Mother Dairy circle on time.",
    status: "Active"
  },
  {
    id: 2,
    driverName: "Priya Nair",
    driverAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    college: "SJB Institute of Technology",
    department: "Information Science, 4th Year",
    from: "Yeshwanthpur",
    to: "SJBIT Campus",
    pickupPoint: "Yeshwanthpur Metro Station Gate 2",
    dropoffPoint: "SJBIT Mechanical Block",
    date: "2026-11-24",
    formattedDate: "24 Nov 2026",
    time: "08:15 AM",
    seats: 3,
    bookedSeats: 2,
    contribution: 45,
    vehicleType: "Car (Hatchback)",
    vehicleModel: "Hyundai i20 (Silver)",
    vehicleNumber: "KA 02 MH 8831",
    rating: 4.9,
    reviewCount: 38,
    verifiedStudent: true,
    features: ["AC", "Non-Smoking", "Female Co-passengers preferred"],
    notes: "Daily commute ride. Regular co-passengers welcome for weekly booking.",
    status: "Active"
  },
  {
    id: 3,
    driverName: "Aditya Hegde",
    driverAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    college: "SJB Institute of Technology",
    department: "Mechanical Engg, 3rd Year",
    from: "Nagarbhavi",
    to: "SJBIT Campus",
    pickupPoint: "Nagarbhavi BDA Complex",
    dropoffPoint: "SJBIT Main Parking",
    date: "2026-11-24",
    formattedDate: "24 Nov 2026",
    time: "08:30 AM",
    seats: 1,
    bookedSeats: 0,
    contribution: 30,
    vehicleType: "Bike / Scooter",
    vehicleModel: "TVS Jupiter Electric",
    vehicleNumber: "KA 05 EM 1190",
    rating: 4.7,
    reviewCount: 16,
    verifiedStudent: true,
    features: ["Helmet Provided", "Fast Route", "Zero Emissions"],
    notes: "Extra sanitized helmet available. Short and scenic ride through Uttarahalli road.",
    status: "Active"
  },
  {
    id: 4,
    driverName: "Kavya Murthy",
    driverAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    college: "SJB Institute of Technology",
    department: "Electronics & Comm, 2nd Year",
    from: "Kengeri",
    to: "SJBIT Campus",
    pickupPoint: "Kengeri Satellite Bus Stand",
    dropoffPoint: "SJBIT Admin Block",
    date: "2026-11-24",
    formattedDate: "24 Nov 2026",
    time: "08:40 AM",
    seats: 3,
    bookedSeats: 0,
    contribution: 25,
    vehicleType: "Car (Hatchback)",
    vehicleModel: "Tata Tiago EV (Teal)",
    vehicleNumber: "KA 41 EV 6712",
    rating: 5.0,
    reviewCount: 12,
    verifiedStudent: true,
    features: ["Electric Vehicle", "Quiet Ride", "AC"],
    notes: "Eco-friendly morning commute. Can pick up anywhere along Mysore Road junction.",
    status: "Active"
  },
  {
    id: 5,
    driverName: "Sanjay Rao",
    driverAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    college: "SJB Institute of Technology",
    department: "Civil Engineering, 4th Year",
    from: "Rajajinagar",
    to: "SJBIT Campus",
    pickupPoint: "Navrang Theatre Circle",
    dropoffPoint: "SJBIT Campus Arch",
    date: "2026-11-25",
    formattedDate: "25 Nov 2026",
    time: "07:50 AM",
    seats: 4,
    bookedSeats: 2,
    contribution: 60,
    vehicleType: "Car (Sedan)",
    vehicleModel: "Maruti Dzire (Grey)",
    vehicleNumber: "KA 01 MR 3094",
    rating: 4.6,
    reviewCount: 19,
    verifiedStudent: true,
    features: ["AC", "Spacious Boot", "Phone Charging"],
    notes: "Direct route via Outer Ring Road avoiding Vijayanagar traffic jams.",
    status: "Active"
  },
  {
    id: 6,
    driverName: "Deepak Gowda",
    driverAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    college: "SJB Institute of Technology",
    department: "Computer Science, 4th Year",
    from: "Peenya",
    to: "SJBIT Campus",
    pickupPoint: "Peenya 1st Stage Metro",
    dropoffPoint: "SJBIT Library Entrance",
    date: "2026-11-25",
    formattedDate: "25 Nov 2026",
    time: "07:45 AM",
    seats: 3,
    bookedSeats: 1,
    contribution: 55,
    vehicleType: "Car (Compact SUV)",
    vehicleModel: "Tata Nexon (Blue)",
    vehicleNumber: "KA 04 NX 7721",
    rating: 4.8,
    reviewCount: 31,
    verifiedStudent: true,
    features: ["AC", "Smooth Drive", "Verified ID"],
    notes: "Usually have regular college playlist playing. Punctual departure guaranteed.",
    status: "Active"
  },
  {
    id: 101,
    driverName: "Arjun Verma",
    driverAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    college: "SJB Institute of Technology",
    department: "Computer Science, 3rd Year",
    from: "Yelahanka",
    to: "SJBIT Campus",
    pickupPoint: "Yelahanka Mother Dairy",
    dropoffPoint: "SJBIT Main Parking",
    date: "2026-11-24",
    formattedDate: "24 Nov 2026",
    time: "08:00 AM",
    seats: 3,
    bookedSeats: 2,
    contribution: 50,
    vehicleType: "Car (Sedan)",
    vehicleModel: "Maruti Suzuki Swift (White)",
    vehicleNumber: "KA 05 MC 3321",
    rating: 4.9,
    reviewCount: 18,
    verifiedStudent: true,
    features: ["AC", "Music Allowed", "Punctual"],
    notes: "Regular morning commute. Will wait 5 minutes maximum at pickup point.",
    status: "Active"
  },
  {
    id: 102,
    driverName: "Arjun Verma",
    driverAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    college: "SJB Institute of Technology",
    department: "Computer Science, 3rd Year",
    from: "SJBIT Campus",
    to: "Yelahanka",
    pickupPoint: "SJBIT Main Gate",
    dropoffPoint: "Yelahanka Police Station Circle",
    date: "2026-11-24",
    formattedDate: "24 Nov 2026",
    time: "04:45 PM",
    seats: 3,
    bookedSeats: 3,
    contribution: 50,
    vehicleType: "Car (Sedan)",
    vehicleModel: "Maruti Suzuki Swift (White)",
    vehicleNumber: "KA 05 MC 3321",
    rating: 4.9,
    reviewCount: 18,
    verifiedStudent: true,
    features: ["AC", "Evening Return"],
    notes: "Evening return ride after lab hours. Direct drop to Yelahanka.",
    status: "Active"
  },
  {
    id: 103,
    driverName: "Arjun Verma",
    driverAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    college: "SJB Institute of Technology",
    department: "Computer Science, 3rd Year",
    from: "Yelahanka",
    to: "SJBIT Campus",
    pickupPoint: "Yelahanka Mother Dairy",
    dropoffPoint: "SJBIT Main Gate",
    date: "2026-11-20",
    formattedDate: "20 Nov 2026",
    time: "08:00 AM",
    seats: 3,
    bookedSeats: 3,
    contribution: 50,
    vehicleType: "Car (Sedan)",
    vehicleModel: "Maruti Suzuki Swift (White)",
    vehicleNumber: "KA 05 MC 3321",
    rating: 4.9,
    reviewCount: 18,
    verifiedStudent: true,
    features: ["AC"],
    notes: "Trip completed last week.",
    status: "Completed"
  }
];

export const initialBookings = [
  {
    id: 201,
    rideId: 1,
    route: "Yelahanka → SJBIT Campus",
    driver: "Rahul Sharma",
    driverPhone: "+91 98450 11223",
    date: "2026-11-24",
    time: "08:00 AM",
    pickup: "Yelahanka Mother Dairy Circle",
    seatsBooked: 1,
    contribution: 50,
    status: "Confirmed",
    vehicle: "Honda City (White)",
    passengerName: "Arjun Verma",
    bookedAt: "2026-11-19T10:00:00.000Z"
  },
  {
    id: 202,
    rideId: 4,
    route: "Kengeri → SJBIT Campus",
    driver: "Kavya Murthy",
    driverPhone: "+91 97412 88990",
    date: "2026-11-24",
    time: "08:40 AM",
    pickup: "Kengeri Satellite Bus Stand",
    seatsBooked: 1,
    contribution: 25,
    status: "Confirmed",
    vehicle: "Tata Tiago EV (Teal)",
    passengerName: "Arjun Verma",
    bookedAt: "2026-11-19T14:30:00.000Z"
  }
];

export const mockStats = {
  ridesShared: "500+",
  students: "1,200+",
  routes: "50+",
  co2Saved: "2.5T"
};

export const mockHistory = [
  {
    id: 301,
    date: "18 Nov 2026",
    route: "Yeshwanthpur → SJBIT",
    driver: "Priya Nair",
    role: "Passenger",
    farePaid: 45,
    co2Saved: "3.2 kg",
    ratingGiven: 5,
    status: "Completed"
  },
  {
    id: 302,
    date: "15 Nov 2026",
    route: "SJBIT → Yelahanka",
    driver: "Arjun Verma (Self)",
    role: "Driver",
    fareCollected: 150,
    co2Saved: "4.8 kg",
    passengersCount: 3,
    status: "Completed"
  },
  {
    id: 303,
    date: "12 Nov 2026",
    route: "Peenya → SJBIT",
    driver: "Deepak Gowda",
    role: "Passenger",
    farePaid: 55,
    co2Saved: "3.6 kg",
    ratingGiven: 5,
    status: "Completed"
  },
  {
    id: 304,
    date: "08 Nov 2026",
    route: "Nagarbhavi → SJBIT",
    driver: "Aditya Hegde",
    role: "Passenger",
    farePaid: 30,
    co2Saved: "2.1 kg",
    ratingGiven: 4,
    status: "Completed"
  }
];

// Helper functions for dynamic calculation
export function getAvailableSeats(ride) {
  if (!ride) return 0;
  const total = Number(ride.seats) || 0;
  const booked = Number(ride.bookedSeats) || 0;
  return Math.max(0, total - booked);
}

export function getRideStatus(ride) {
  if (!ride) return 'Active';
  if (ride.status === 'Cancelled') return 'Cancelled';
  if (ride.status === 'Completed') return 'Completed';
  const available = getAvailableSeats(ride);
  if (available <= 0) return 'Full';
  return 'Active';
}

// Backward compatibility export
export const mockRides = initialRides;
export const mockBookings = initialBookings;
export const mockMyRides = initialRides.filter((r) => r.driverName === "Arjun Verma");
