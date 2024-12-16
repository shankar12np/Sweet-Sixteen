export interface Invitation {
  id?: string;
  name: string;
  imageSrc: string;
  thumbnailSrc: string;
  fixedDate: string;
  venue: string;
  phoneNumber: string;
  invitationLink: string;
  rsvp?: string;         // Optional
  guestCount?: number;   // Optional
}


