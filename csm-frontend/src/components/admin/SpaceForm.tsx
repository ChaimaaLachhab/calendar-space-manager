import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  Space,
  Availability,
  Location,
  Media,
} from "../../types";
import {
  Category,
  Amenities,
} from "../../types";
import { spacesAPI } from "../../services/api";
import { toast } from "sonner";

const SpaceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Space>>({
    title: "",
    description: "",
    category: Category.Bureau,
    location: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    capacity: 1,
    amenities: [],
    price: 0,
    images: [],
    availability: [],
  });

  // For new availability slots
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState("08:00");
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState("20:00");

// Calendar state
const [currentDate, setCurrentDate] = useState(new Date());
const [view, setView] = useState('week');
const [selectedDates, setSelectedDates] = useState({ start: null, end: null });

  // Image preview
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  // Fetch space data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchSpace = async () => {
        try {
          setLoading(true);
          const response = await spacesAPI.getById(id);
          setFormData(response.data);
          if (response.data.images) {
            // Extract media URLs for preview
            setImagePreview(
              response.data.images.map((img: Media) => img.mediaUrl)
            );
          }
        } catch (err) {
          setError("Failed to load space data");
          toast.error("Failed to load space data");
        } finally {
          setLoading(false);
        }
      };

      fetchSpace();
    }
  }, [id, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested location properties
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...(prev.location as Location),
          [locationField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "capacity" || name === "price" ? Number(value) : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);

    // Generate preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    // If in edit mode, track the removed image IDs
    if (
      isEditMode &&
      formData.images &&
      index < (formData.images as Media[]).length
    ) {
      const imageToRemove = (formData.images as Media[])[index];
      setRemovedImageIds((prev) => [...prev, imageToRemove.mediaId]);
    }

    setImagePreview((prev) => prev.filter((_, i) => i !== index));

    // If removing a newly added image file
    if (index >= ((formData.images as Media[]) || []).length) {
      const adjustedIndex = index - ((formData.images as Media[]) || []).length;
      setImageFiles((prev) => prev.filter((_, i) => i !== adjustedIndex));
    } else {
      // If removing an existing image
      setFormData((prev) => ({
        ...prev,
        images: (prev.images as Media[]).filter((_, i) => i !== index),
      }));
    }
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

 // Check if date is already in availability slots
 const isDateInAvailability = (date) => {
  return formData.availability.some(slot => {
    const slotStart = new Date(slot.start);
    const slotEnd = new Date(slot.end);
    
    return date >= slotStart && date <= slotEnd;
  });
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
    if (!startDate) {
      setStartDate(date);
    } else if (!endDate && date > startDate) {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const addAvailabilitySlot = () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Please fill all availability fields");
      return;
    }

    if (!endDate && !endTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
  
      if (start >= end) {
        toast.error("End time must be after start time");
        return;
      }
  
      setFormData((prev) => ({
        ...prev,
        availability: [...(prev.availability || []), { start, end }],
      }));
    }  else if (endDate) {
      // Multiple day selection
      const currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);

      // Create availability slot for each day in the range
      while (currentDate <= lastDate) {
        const start = new Date(currentDate);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(currentDate);
        end.setHours(endHours, endMinutes, 0, 0);

        setFormData(prev => ({
          ...prev,
          availability: [...prev.availability, { start, end }]
        }));

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

    }

    // Reset fields
    setStartDate(null);
    setStartTime(null);
    setSelectedDates({ start: null, end: null });
  };

  const removeAvailabilitySlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Create a clean copy of the space data
      const spaceDataToSend = { ...formData };

      // Remove the images array as it will be handled separately
      delete spaceDataToSend.images;

      // Add the space data as a JSON string in the 'spaceData' field
      formDataToSend.append("spaceData", JSON.stringify(spaceDataToSend));

      // Add image files for upload
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Add removed image IDs if applicable
      if (removedImageIds.length > 0) {
        formDataToSend.append("removedImages", JSON.stringify(removedImageIds));
      }

      if (isEditMode && id) {
        await spacesAPI.update(id, formDataToSend);
        toast.success("Space updated successfully");
      } else {
        await spacesAPI.create(formDataToSend);
        toast.success("Space created successfully");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Failed to save space");
      toast.error("Failed to save space");
    } finally {
      setLoading(false);
    }
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

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Space" : "Add New Space"}
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min="1"
                value={formData.capacity || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (per hour)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="amenities"
                className="block text-sm font-medium text-gray-700"
              >
                Amenities
              </label>
              <select
                id="amenities"
                name="amenities"
                value={formData.amenities || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    amenities: selectedOptions,
                  }));
                }}
                multiple
                required
                className="form-input mt-1"
              >
                {Object.values(Amenities).map((amenity) => (
                  <option key={amenity} value={amenity}>
                    {amenity}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.
              </p>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1 w-full"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg font-medium mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="location.address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={(formData.location as Location)?.address || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="location.city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={(formData.location as Location)?.city || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="location.postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="number"
                id="location.postalCode"
                name="location.postalCode"
                value={(formData.location as Location)?.postalCode || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="location.country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="location.country"
                name="location.country"
                value={(formData.location as Location)?.country || ""}
                onChange={handleInputChange}
                required
                className="form-input mt-1"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-lg font-medium mb-4">Images</h2>

          <div className="mb-4">
            <label
              htmlFor="files"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Images
            </label>
            <input
              type="file"
              id="files"
              name="files"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="form-input"
            />
          </div>

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {imagePreview.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Availability Calendar */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Availability</h2>

          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  view === "day" ? "bg-blue-100 text-blue-700" : "bg-gray-100"
                }`}
                onClick={() => setView("day")}
              >
                Day
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  view === "week" ? "bg-blue-100 text-blue-700" : "bg-gray-100"
                }`}
                onClick={() => setView("week")}
              >
                Week
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  view === "month" ? "bg-blue-100 text-blue-700" : "bg-gray-100"
                }`}
                onClick={() => setView("month")}
              >
                Month
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => navigateCalendar("prev")}
              >
                &#8592;
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
                type="button"
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => navigateCalendar("next")}
              >
                &#8594;
              </button>
            </div>
          </div>

          {/* Calendar View */}
          <div className="border rounded-lg overflow-hidden mb-4">
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
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPastDay = day < today;

                  return (
                    <button
                      type="button"
                      key={i}
                      className={`h-12 border-t border-r ${
                        isPastDay
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isDateSelected(day)
                          ? "bg-blue-100 text-blue-800"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => !isPastDay && handleDateClick(day)}
                      disabled={isPastDay}
                    >
                      <time dateTime={day.toISOString()}>{day.getDate()}</time>
                    </button>
                  );
                })}
              </div>
            )}

            {(view === "week" || view === "day") && (
              <div className="overflow-y-auto max-h-96">
                {generateCalendarDays().map((day, dayIndex) => { 
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPastDay = day < today;
                  
                  return (
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
                      {generateTimeSlots(day).map((time, i) => {
                          const now = new Date();
                          const isPastTime = time < now;
                          
                          return (
                        <button type="button"
                          key={i}
                          className={`w-full py-1 px-2 text-left text-xs ${
                            isPastTime 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : isDateSelected(time)
                              ? "bg-blue-100 text-blue-800"
                              : "hover:bg-gray-100"
                        }`}
                          onClick={() => !isPastTime && handleDateClick(time)}
                          disabled={isPastTime}
                        >
                          {time.toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </button>
                      )})}
                    </div>
                  </div>
                )})}
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
                {startDate
                  ? new Date(startDate).toLocaleDateString()
                  : "Select on calendar"}
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
                {endDate
                  ? new Date(endDate).toLocaleDateString()
                  : "Select on calendar"}
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
            onClick={() => navigate("/admin/dashboard")}
            className="btn btn-secondary mr-3"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Space"
              : "Create Space"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpaceForm;
