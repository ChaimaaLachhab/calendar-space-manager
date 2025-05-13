import React, { useState } from "react";
import { Calendar } from "lucide-react";

const SpaceForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: "Sample Space",
    description: "This is a sample space description.",
    availability: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // For availability slot selection
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Generate calendar days based on current view and date
  const generateCalendarDays = () => {
    const days = [];
    let startDay;
    let endDay;
    
    if (view === 'day') {
      startDay = new Date(currentDate);
      endDay = new Date(currentDate);
    } else if (view === 'week') {
      // Start from Sunday of current week
      startDay = new Date(currentDate);
      startDay.setDate(currentDate.getDate() - currentDate.getDay());
      
      // End on Saturday of current week
      endDay = new Date(startDay);
      endDay.setDate(startDay.getDate() + 6);
    } else { // month view
      startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
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
  const generateTimeSlots = (date) => {
    const slots = [];
    const start = new Date(date);
    start.setHours(8, 0, 0, 0); // Start at 8 AM
    
    const end = new Date(date);
    end.setHours(20, 0, 0, 0); // End at 8 PM
    
    let current = new Date(start);
    
    while (current <= end) {
      slots.push(new Date(current));
      // Add 1 hour
      current.setHours(current.getHours() + 1);
    }
    
    return slots;
  };
  
  // Handle navigation between calendar periods
  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else { // month view
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };
  
  // Handle date selection in calendar
  const handleDateClick = (date) => {
    if (!selectedDates.start) {
      setSelectedDates({ start: date, end: null });
      
      // Format the date for the time inputs
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setStartDate(`${year}-${month}-${day}`);
      setEndDate(`${year}-${month}-${day}`);
    } else if (!selectedDates.end && date > selectedDates.start) {
      setSelectedDates({ ...selectedDates, end: date });
      
      // Format the end date
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setEndDate(`${year}-${month}-${day}`);
    } else {
      // Reset selection and start over
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      setSelectedDates({ start: date, end: null });
      setStartDate(`${year}-${month}-${day}`);
      setEndDate(`${year}-${month}-${day}`);
    }
  };
  
  // Add availability slot to form data
  const addAvailabilitySlot = () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      alert("Please select both dates and times for availability");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (start >= end) {
      alert("End time must be after start time");
      return;
    }

    setFormData(prev => ({
      ...prev,
      availability: [...prev.availability, { start, end }]
    }));

    // Reset fields
    setStartDate(null);
    setEndDate(null);
    setStartTime("");
    setEndTime("");
    setSelectedDates({ start: null, end: null });
  };
  
  // Remove availability slot
  const removeAvailabilitySlot = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    console.log("Form submitted", formData);
    alert("Space saved with " + formData.availability.length + " availability slots");
  };
  
  // Check if a date is selected for highlighting in calendar
  const isDateSelected = (date) => {
    if (!selectedDates.start) return false;
    
    if (selectedDates.end) {
      // Check if date is within range
      return date >= selectedDates.start && date <= selectedDates.end;
    } else {
      // Check if same day
      return date.toDateString() === selectedDates.start.toDateString();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Space</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
          </div>
        </div>
 
        {/* Availability Calendar */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Availability</h2>
          
          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => navigateCalendar('prev')}
              >
                &#8592;
              </button>
              <span className="text-sm font-medium">
                {view === 'day' && currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                {view === 'week' && `${new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                {view === 'month' && currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => navigateCalendar('next')}
              >
                &#8594;
              </button>
            </div>
          </div>
          
          {/* Calendar View */}
          <div className="border rounded-lg overflow-hidden mb-4">
            {/* Calendar Header */}
            {view !== 'day' && (
              <div className="grid grid-cols-7 bg-gray-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="px-2 py-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
            )}
            
            {/* Calendar Body */}
            {view === 'month' && (
              <div className="grid grid-cols-7">
                {generateCalendarDays().map((day, i) => (
                  <button
                    key={i}
                    className={`h-12 border-t border-r ${
                      isDateSelected(day)
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <time dateTime={day.toISOString()}>
                      {day.getDate()}
                    </time>
                  </button>
                ))}
              </div>
            )}
            
            {(view === 'week' || view === 'day') && (
              <div className="overflow-y-auto max-h-96">
                {generateCalendarDays().map((day, dayIndex) => (
                  <div key={dayIndex} className="border-t">
                    {view === 'week' && (
                      <div className="bg-gray-50 px-2 py-1 sticky top-0">
                        <div className="text-xs font-medium text-gray-500">
                          {day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    )}
                    <div className="divide-y">
                      {generateTimeSlots(day).map((time, i) => (
                        <button
                          key={i}
                          className={`w-full py-1 px-2 text-left text-xs ${
                            isDateSelected(time)
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleDateClick(time)}
                        >
                          {time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="p-2 border rounded bg-gray-50">
                {startDate ? new Date(startDate).toLocaleDateString() : 'Select on calendar'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="p-2 border rounded bg-gray-50">
                {endDate ? new Date(endDate).toLocaleDateString() : 'Select on calendar'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={addAvailabilitySlot}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
          >
            Add Availability Slot
          </button>

          {/* Availability Slots List */}
          {formData.availability && formData.availability.length > 0 ? (
            <ul className="border rounded-md divide-y">
              {formData.availability.map((slot, index) => (
                <li
                  key={index}
                  className="p-3 flex justify-between items-center"
                >
                  <span>
                    {new Date(slot.start).toLocaleString()} -{" "}
                    {new Date(slot.end).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAvailabilitySlot(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No availability slots added yet.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded mr-3 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Space"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaceForm;