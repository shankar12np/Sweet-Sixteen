import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FirebaseService} from "../firebase.service";
import {Invitation} from "../../invitation";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  name = ''; // Guest's name input
  invitations: any[] = []; // List of invitations
  successMessage = ''; // Display success message after adding invitation
  invitationLink = ''; // Store the shareable invitation link
  firestore: any; // Firebase Firestore instance

  fixedDate: string = 'January 1, 2025';
  venue: string = 'Celebration Hall, City';
  phoneNumber: string = 'You know it';

  constructor(private router: Router, private firebaseService: FirebaseService) {}


  ngOnInit() {
    this.firebaseService.getAllInvitations().subscribe({
      next: (invitations) => {
        this.invitations = invitations;
      },
      error: (error) => {
        console.error('Error fetching invitations:', error);
        // Handle error, e.g., show a message to the user
      }
    });
  }

  addInvitation() {
    const invitation: Omit<Invitation, 'id'> = {
      name: this.name,
      imageSrc: 'assets/images/saurya.jpg',
      thumbnailSrc: 'assets/images/saurya.jpg',
      fixedDate: this.fixedDate,
      venue: this.venue,
      phoneNumber: this.phoneNumber,
      invitationLink: '' // This will be set after adding to the database
    };

    this.firebaseService.addInvitation(invitation).then(({ id, link }) => {
      this.successMessage = 'Invitation successfully added!';
      this.invitationLink = link;
      // Create the full invitation object with the returned id and link
      const fullInvitation: Invitation = {
        ...invitation,
        id: id,
        invitationLink: link
      };
      this.invitations.push(fullInvitation);
      this.name = '';
    }).catch(error => {
      console.error('Error adding invitation:', error);
      this.successMessage = 'Error adding invitation. Please try again.';
    });
  }
}
