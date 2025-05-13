import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { spacesAPI, reservationsAPI } from "../services/api";
import type { Space, Availability } from "../types";
import { Category, Amenities, UserRole } from "../types";
import { useAuth } from "../context/AuthContext";
import ImageGallery from "../components/spaces/ImageGallery";

const SpaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reservation state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState<string | null>(null);
  const [isReserving, setIsReserving] = useState(false);

  // Reserved dates state
  const [reservedDates, setReservedDates] = useState<{startDate: string, endDate: string}[]>([]);
  const [loadingReservedDates, setLoadingReservedDates] = useState(false);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  // Fetch space data
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await spacesAPI.getById(id);
          setSpace(response.data);
        } else {
          setError("Space ID is missing");
        }
      } catch (err) {
        setError("Failed to load space details");
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [id]);

  // Fetch reserved dates
  useEffect(() => {
    const fetchReservedDates = async () => {
      if (!id) return;
      
      try {
        setLoadingReservedDates(true);
        const response = await reservationsAPI.getReservedDatesBySpaceId(id);
        setReservedDates(response.data);
      } catch (err) {
        console.error("Failed to fetch reserved dates:", err);
      } finally {
        setLoadingReservedDates(false);
      }
    };
    
    fetchReservedDates();
  }, [id, reservationSuccess]);

  // Check if a time slot is available
  const isTimeSlotAvailable = (date: Date): boolean => {
    if (!space) return false;

    // Convert date to local date for comparison
    const localDate = new Date(date);

    // First check if this date is reserved
    if (isDateReserved(localDate)) {
      return false;
    }

    // For month view, we want to check if ANY part of the day is available
    return space.availability.some((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      // Check if the entire slot is within our business hours (8 AM to 8 PM)
      const businessStartHour = 8;
      const businessEndHour = 20;

      // Create date objects for business hours on the given day
      const dayStart = new Date(localDate);
      dayStart.setHours(businessStartHour, 0, 0, 0);

      const dayEnd = new Date(localDate);
      dayEnd.setHours(businessEndHour, 0, 0, 0);

      return (
        (slotStart <= dayStart && slotEnd >= dayEnd) || // Entire day covered
        (slotStart < dayEnd && slotEnd > dayStart) // Partial day overlap
      );
    });
  };

  // Check if a date is reserved
  const isDateReserved = (date: Date): boolean => {
    if (reservedDates.length === 0) return false;
    
    // For hour view (day/week), check if this specific hour is reserved
    if (view === "day" || view === "week") {
      return reservedDates.some(reservation => {
        const reservationStart = new Date(reservation.startDate);
        const reservationEnd = new Date(reservation.endDate);
        
        // Check if the date falls within any reservation period
        return date >= reservationStart && date <= reservationEnd;
      });
    } 
    // For month view, check if any part of the day is reserved
    else {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      return reservedDates.some(reservation => {
        const reservationStart = new Date(reservation.startDate);
        const reservationEnd = new Date(reservation.endDate);
        
        // Check if any part of the day overlaps with reservation
        return (
          (reservationStart >= dayStart && reservationStart <= dayEnd) || // Reservation starts today
          (reservationEnd >= dayStart && reservationEnd <= dayEnd) || // Reservation ends today
          (reservationStart <= dayStart && reservationEnd >= dayEnd) // Reservation spans over today
        );
      });
    }
  };

  // Generate calendar days based on current view and date
  const generateCalendarDays = () => {
    const days = [];
    let startDay: Date;
    let endDay: Date;

    if (view === "day") {
      startDay = new Date(currentDate);
      endDay = new Date(currentDate);
    } else if (view === "week") {
      // Start from Sunday of current week
      startDay = new Date(currentDate);
      startDay.setDate(currentDate.getDate() - currentDate.getDay());

      // End on Saturday of current week
      endDay = new Date(startDay);
      endDay.setDate(startDay.getDate() + 6);
    } else {
      // month view
      startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
    }

    // Create array of days
    let tempDate = new Date(startDay);
    while (tempDate <= endDay) {
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return days;
  };

  // Generate time slots for a day
  const generateTimeSlots = (date: Date) => {
    const slots = [];
    const start = new Date(date);
    start.setHours(8, 0, 0, 0); // Start at 8 AM

    const end = new Date(date);
    end.setHours(20, 0, 0, 0); // End at 8 PM

    let current = new Date(start);
    const now = new Date(); // Current time

    // Check if the date is today
    const isToday =
      current.getFullYear() === now.getFullYear() &&
      current.getMonth() === now.getMonth() &&
      current.getDate() === now.getDate();

    while (current <= end) {
      slots.push({
        time: new Date(current),
        isPassed: isToday && current <= now,
      });

      current.setHours(current.getHours() + 1);
    }

    return slots;
  };

  // Handle reservation request
  const handleReservation = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      setReservationError(
        "Please select start and end times for your reservation"
      );
      return;
    }

    if (startDate >= endDate) {
      setReservationError("End time must be after start time");
      return;
    }

    setReservationError(null);
    setIsReserving(true);

    try {
      await reservationsAPI.create({
        spaceId: id,
        startDate,
        endDate,
      });

      setReservationSuccess("Reservation was successful!");
      setStartDate(null);
      setEndDate(null);

      setTimeout(() => {
        setReservationSuccess(null);
      }, 5000);
    } catch (err: any) {
      setReservationError(
        err.response?.data?.message || "Failed to make reservation"
      );
    } finally {
      setIsReserving(false);
    }
  };

  // Handle date selection in calendar
  const handleDateClick = (
    date: Date,
    view: "day" | "week" | "month" = "day"
  ) => {
    const now = new Date();
    const selectedDate = new Date(date);

    // Check if the selected date is today
    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    if (!startDate) {
      // First date selection
      if (view === "month" || isToday) {
        // For month view or today, set to correct current or business start time
        if (isToday && now.getHours() >= 20) {
          // If it's already past 8 PM, set to tomorrow morning
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          tomorrow.setHours(8, 0, 0, 0);
          selectedDate.setTime(tomorrow.getTime());
        } else if (isToday && now.getHours() < 8) {
          // If it's before 8 AM, set to 8 AM today
          selectedDate.setHours(8, 0, 0, 0);
        } else if (isToday) {
          // If it's between 8 AM and 8 PM, set to current hour
          selectedDate.setHours(Math.max(now.getHours() + 1, 8), 0, 0, 0);
        } else {
          // For future dates in month view, set to 8 AM
          selectedDate.setHours(8, 0, 0, 0);
        }
      }
      setStartDate(selectedDate);
    } else if (!endDate && selectedDate > startDate) {
      // End date selection
      if (view === "month") {
        // For month view, set to 8 PM of the selected date
        selectedDate.setHours(20, 0, 0, 0);
      }
      setEndDate(selectedDate);
    } else {
      // Reset selection
      if (view === "month" || isToday) {
        // Similar logic as first date selection
        if (isToday && now.getHours() >= 20) {
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          tomorrow.setHours(8, 0, 0, 0);
          selectedDate.setTime(tomorrow.getTime());
        } else if (isToday && now.getHours() < 8) {
          selectedDate.setHours(8, 0, 0, 0);
        } else if (isToday) {
          selectedDate.setHours(Math.max(now.getHours() + 1, 8), 0, 0, 0);
        } else {
          selectedDate.setHours(8, 0, 0, 0);
        }
      }
      setStartDate(selectedDate);
      setEndDate(null);
    }
  };

  // Handle navigation between calendar periods
  const navigateCalendar = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    if (view === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      // month view
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1)
      );
    }

    setCurrentDate(newDate);
  };

  // Mock space data for development
  const mockSpace: Space = {
    _id: "1a2b3c",
    title: "Modern Coworking Space",
    description: "A vibrant space for creative professionals.",
    category: Category.Coworking,
    location: {
      address: "123 Main Street",
      city: "Casablanca",
      postalCode: "20000",
      country: "Morocco",
    },
    price: 150,
    capacity: 20,
    amenities: [
      Amenities.WiFi,
      Amenities.Projecteur,
      Amenities.Cuisine,
      Amenities.Climatisation,
    ],
    images: [
      {
        _id: "img1",
        mediaUrl: "https://example.com/photo1.jpg",
        mediaId: "media123",
        type: "PHOTO",
        createdAt: new Date("2024-07-01T10:00:00Z"),
        updatedAt: new Date("2024-07-02T12:00:00Z"),
      },
    ],
    availability: [
      {
        start: new Date("2024-07-10T09:00:00Z"),
        end: new Date("2024-07-10T17:00:00Z"),
      },
    ],
    createdBy: {
      id: "user123",
      fullName: "Chaimaa Lachhab",
      email: "chaimaa@example.com",
      role: UserRole.User,
    },
    createdAt: new Date("2024-07-01T09:00:00Z"),
    updatedAt: new Date("2024-07-02T12:00:00Z"),
  };

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-500"
              >
                Go back to spaces
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use mock data for development since we don't have a real API yet
  const spaceData = space || mockSpace;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <ImageGallery spaceData={spaceData} />

      {/* Space Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Space Info */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {spaceData.category}
              </span>
              <span className="text-gray-600 text-sm">
                {spaceData.location.city}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {spaceData.title}
            </h1>

            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="ml-1 text-gray-600">
                  Capacity: {spaceData.capacity}
                </span>
              </div>
              <div className="ml-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ml-1 text-gray-600">
                  ${spaceData.price} / hour
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                About this space
              </h2>
              <p className="mt-4 text-gray-600">{spaceData.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
              <ul className="mt-4 grid grid-cols-2 gap-4">
                {Array.isArray(spaceData.amenities) &&
                  spaceData.amenities.map((amentie, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-600">{amentie}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Calendar & Booking */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Book this space
              </h2>

              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      view === "day"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setView("day")}
                  >
                    Day
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      view === "week"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setView("week")}
                  >
                    Week
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      view === "month"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setView("month")}
                  >
                    Month
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => navigateCalendar("prev")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">
                    {view === "day" &&
                      currentDate.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    {view === "week" &&
                      `${new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() - currentDate.getDay()
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })} - ${new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() - currentDate.getDay() + 6
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`}
                    {view === "month" &&
                      currentDate.toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                  </span>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => navigateCalendar("next")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar View */}
              <div className="border rounded-lg overflow-hidden">
                {/* Calendar Header */}
                {view !== "day" && (
                  <div className="grid grid-cols-7 bg-gray-50">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="px-2 py-2 text-center text-xs font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Calendar Body */}
                {view === "month" && (
                  <div className="grid grid-cols-7">
                    {generateCalendarDays().map((day, i) => {
                      const isAvailable = isTimeSlotAvailable(day);
                      const isReserved = isDateReserved(day);
                      const normalize = (date: Date) => {
                        const normalized = new Date(date);
                        normalized.setHours(0, 0, 0, 0);
                        return normalized;
                      };
                      
                      const isSelected =
                        startDate && endDate
                          ? normalize(day) >= normalize(startDate) && normalize(day) <= normalize(endDate)
                          : startDate
                          ? normalize(day).getTime() === normalize(startDate).getTime()
                          : false;
                      
                      // Determine button classes based on reservation status
                      let buttonClasses = "h-12 border-t border-r ";
                      
                      if (isSelected) {
                        buttonClasses += "bg-blue-100 text-blue-800";
                      } else if (isReserved) {
                        buttonClasses += "bg-red-100 text-red-800 cursor-not-allowed";
                      } else if (isAvailable) {
                        buttonClasses += "hover:bg-gray-100";
                      } else {
                        buttonClasses += "bg-gray-100 text-gray-400 cursor-not-allowed";
                      }
                      
                      return (
                        <button
                    key={i}
                    className={buttonClasses}
                    onClick={() => isAvailable && !isReserved && handleDateClick(day, "month")}
                    disabled={!isAvailable || isReserved}
                  >
                    <time dateTime={day.toISOString()}>
                      {day.getDate()}
                    </time>
                  </button>
                      );
                    })}
                  </div>
                )}

                {(view === "week" || view === "day") && (
                  <div className="overflow-y-auto max-h-96">
                    {generateCalendarDays().map((day, dayIndex) => (
                      <div key={dayIndex} className="border-t">
                        {view === "week" && (
                          <div className="bg-gray-50 px-2 py-1 sticky top-0">
                            <div className="text-xs font-medium text-gray-500">
                              {day.toLocaleDateString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        )}
                        <div className="divide-y">
                          {generateTimeSlots(day).map((slot, i) => {
                            const time = slot.time;
                            const isAvailable = isTimeSlotAvailable(time);
                            const isReserved = isDateReserved(time);
                            const isSelected =
                              startDate && endDate
                                ? time >= startDate && time <= endDate
                                : startDate
                                ? time.getTime() === startDate.getTime()
                                : false;
                                
                            // Determine button classes based on various conditions
                            let buttonClasses = "w-full py-1 px-2 text-left text-xs ";
                            
                            if (slot.isPassed) {
                              buttonClasses += "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50";
                            } else if (isSelected) {
                              buttonClasses += "bg-blue-100 text-blue-800";
                            } else if (isReserved) {
                              buttonClasses += "bg-red-100 text-red-800 cursor-not-allowed";
                            } else if (isAvailable) {
                              buttonClasses += "hover:bg-gray-100";
                            } else {
                              buttonClasses += "bg-gray-100 text-gray-400 cursor-not-allowed";
                            }

                            return (
                              <button
                          key={i}
                          className={buttonClasses}
                          onClick={() =>
                            !slot.isPassed &&
                            isAvailable &&
                            !isReserved &&
                            handleDateClick(time, view)
                          }
                          disabled={slot.isPassed || !isAvailable || isReserved}
                        >
                          {time.toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                          {slot.isPassed && (
                            <span className="ml-2 text-xs text-gray-500">
                              (Passed)
                            </span>
                          )}
                          {isReserved && (
                            <span className="ml-2 text-xs text-red-500">
                              (Reserved)
                            </span>
                          )}
                        </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Time Slot */}
              <div className="mt-4 space-y-2">
                <div>
                  <label className="block text-sm text-gray-700">
                    Start Time
                  </label>
                  <div className="mt-1 p-2 border rounded-md bg-gray-50">
                    {startDate
                      ? startDate.toLocaleString()
                      : "Select a start time"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    End Time
                  </label>
                  <div className="mt-1 p-2 border rounded-md bg-gray-50">
                    {endDate ? endDate.toLocaleString() : "Select an end time"}
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="mt-6">
                <button
                  onClick={handleReservation}
                  disabled={!startDate || !endDate || isReserving}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !startDate || !endDate || isReserving
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                >
                  {isReserving ? "Processing..." : "Book Now"}
                </button>

                {!isAuthenticated && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    You need to{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      log in
                    </Link>{" "}
                    to book this space
                  </p>
                )}
              </div>

              {/* Reservation Messages */}
              {reservationError && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{reservationError}</p>
                    </div>
                  </div>
                </div>
              )}

              {reservationSuccess && (
                <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        {reservationSuccess}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
