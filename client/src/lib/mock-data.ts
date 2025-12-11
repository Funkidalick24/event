export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  price: string;
  image: string;
  category: string;
  organizerId: number;
  isPublic: boolean;
}

export interface Registration {
  id: number;
  eventId: number;
  userId: number;
  fullName: string;
  email: string;
  ticketType: string;
  registrationDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  bio?: string | null;
}

// API helper function
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  // Get auth token from localStorage if available
  const authToken = localStorage.getItem('authToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const getEvents = async (): Promise<Event[]> => {
  return fetchAPI<Event[]>('/api/events?publicOnly=true');
};

export const getAllEvents = async (): Promise<Event[]> => {
  return fetchAPI<Event[]>('/api/events?publicOnly=false');
};

export const getEvent = async (id: number): Promise<Event | undefined> => {
  try {
    return await fetchAPI<Event>(`/api/events/${id}`);
  } catch (error) {
    return undefined;
  }
};

export const createRegistration = async (data: Omit<Registration, "id" | "registrationDate" | "userId">): Promise<Registration> => {
  // Default to user ID 1 for now (in a real app, this would come from auth)
  return fetchAPI<Registration>('/api/registrations', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      userId: 1,
    }),
  });
};

export const getRegistration = async (id: number): Promise<Registration | undefined> => {
  try {
    return await fetchAPI<Registration>(`/api/registrations/${id}`);
  } catch (error) {
    return undefined;
  }
};

export const getUser = async (id: number): Promise<User | undefined> => {
  try {
    return await fetchAPI<User>(`/api/users/${id}`);
  } catch (error) {
    return undefined;
  }
};

export const getUserRegistrations = async (userId: number): Promise<(Registration & { event?: Event })[]> => {
  const registrations = await fetchAPI<Registration[]>(`/api/registrations/user/${userId}`);
  
  // Fetch events for all registrations
  const eventIds = Array.from(new Set(registrations.map(r => r.eventId)));
  const events = await Promise.all(
    eventIds.map(id => getEvent(id))
  );
  
  // Create a map for quick lookup
  const eventMap = new Map(events.filter(e => e !== undefined).map(e => [e!.id, e!]));
  
  // Join registrations with events
  return registrations.map(r => ({
    ...r,
    event: eventMap.get(r.eventId)
  }));
};

export const getOrganizerEvents = async (organizerId: number): Promise<Event[]> => {
  return fetchAPI<Event[]>(`/api/events/organizer/${organizerId}`);
};

export const getEventRegistrations = async (eventId: number): Promise<Registration[]> => {
  return fetchAPI<Registration[]>(`/api/registrations/event/${eventId}`);
};

export const createEvent = async (eventData: Omit<Event, "id">): Promise<Event> => {
  return fetchAPI<Event>('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};

export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  return fetchAPI<User>(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};
