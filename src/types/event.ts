
export interface LoggedUser {
  id: string;
  name: string;
  type: 'person' | 'vendor';
}

export interface GuestEvent {
  id: string;
  name: string;
  event_date: string;
  event_type: string;
}
