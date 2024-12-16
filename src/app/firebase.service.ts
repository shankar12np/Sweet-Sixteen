import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Invitation } from "../invitation";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}
  private baseUrl = 'https://saurya-sweet16.web.app';

  addInvitation(invitation: Omit<Invitation, 'id'>): Promise<{ id: string, link: string }> {
    return this.firestore.collection('invitations').add(invitation).then(docRef => {
      const shareableLink = `${this.baseUrl}/invitation/${docRef.id}`;
      return { id: docRef.id, link: shareableLink };
    });
  }

  updateRSVP(guestId: string, rsvpData: Partial<Invitation>): Promise<void> {
    return this.firestore.collection('invitations').doc(guestId).update(rsvpData);
  }

  getInvitation(id: string): Observable<Invitation> {
    return this.firestore.collection<Invitation>('invitations').doc(id).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Omit<Invitation, 'id'>;
        return { id: a.payload.id, ...data, invitationLink: `/invitation/${a.payload.id}` };
      })
    );
  }

  getAllInvitations(): Observable<Invitation[]> {
    return this.firestore.collection<Invitation>('invitations').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Omit<Invitation, 'id'>;
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getAllInvitationsWithRSVP(): Observable<Invitation[]> {
    return this.firestore.collection<Invitation>('invitations', ref =>
      ref.where('rsvp', '!=', null) // assuming null means no RSVP yet
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Omit<Invitation, 'id'>;
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }
}
