
// User types
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Media model interface
export interface Media {
  _id?: string;
  mediaUrl: string;
  mediaId: string;
  type: 'PHOTO' | 'VIDEO';
  space?: string | Space;
  createdAt?: Date;
  updatedAt?: Date;
}

// Location structure
export interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Availability timeslot interface
export interface Availability {
  start: Date;
  end: Date;
}

// Space categories enum
export enum Category {
  Bureau = 'bureau',
  SalleReunion = 'salle de réunion',
  Evenementiel = 'espace événementiel',
  Coworking = 'coworking',
  Studio = 'studio'
}

export enum Amenities {
  WiFi = 'WiFi',
  Projecteur = 'projecteur',
  Cuisine = 'cuisine',
  Climatisation = 'climatisation',
  Parking = 'parking',
  Terrasse = 'terrasse'
}

// Space model interface
export interface Space {
  _id?: string;
  title: string;
  description: string;
  category: Category;
  location: Location;
  price: number;
  capacity: number;
  amenities: string[];
  images: Media[];
  availability: Availability[];
  createdBy: User | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Reservation types
export enum ReservationStatus {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}

export interface Reservation {
  id?: string;
  userId: string | User;
  spaceId: string | Space;
  startDate: Date;
  endDate: Date;
  status: ReservationStatus;
}

// Contact message types
export enum ContactStatus {
  Pending = 'pending',
  Answered = 'answered',
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  message: string;
  response?: string;
  status: ContactStatus;
}

// Filter types
export interface SpaceFilters {
  category?: Category;
  capacity?: number;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
}
