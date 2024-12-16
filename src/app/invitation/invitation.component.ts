import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Invitation } from "../../invitation";
import { RsvpComponent } from "../rsvp/rsvp.component";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css'],
  animations: [
    trigger('cardAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('normal', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => normal', [
        animate('0.5s ease-in')
      ]),
      transition('normal => void', [
        animate('0.5s ease-out')
      ])
    ]),
    trigger('buttonAnimation', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active', style({
        transform: 'scale(1.1)'
      })),
      transition('inactive <=> active', animate('200ms ease-in-out'))
    ])
  ]
})
export class InvitationComponent implements OnInit {
  name: string = '';
  invitationImage = 'assets/images/saurya.jpg'; // The image path for the invitation
  invitationDate = 'February 1, 2025';
  invitationTime = '6:00 PM';
  invitationVenue = 'Celebration Hall';
  invitationTheme = 'Sweet Sixteen';
  personalizedMessage = "It's gonna be lit! Join us for Saurya's 16th Birthday Bash!";
  errorMessage: string = '';

  // RSVP related properties
  guestRsvp: string = '';
  guestCount: number = 1;
  rsvpMessage: string = '';

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private firebaseService: FirebaseService,
    public route: ActivatedRoute,
    public titleService: Title,
    public metaService: Meta
  ) {}

  ngOnInit(): void {
    // Set the page title
    this.titleService.setTitle('Saurya\'s Sweet Sixteen Party');

    // Set Open Graph and Twitter meta tags for social sharing
    const imageUrl = this.invitationImage; // Using the 'invitationImage' for social media thumbnail
    this.metaService.addTag({ property: 'og:title', content: 'Saurya\'s Sweet Sixteen Party' });
    this.metaService.addTag({ property: 'og:description', content: 'Join us for an epic celebration as Saurya turns 16!' });
    this.metaService.addTag({ property: 'og:image', content: imageUrl }); // Open Graph image

    this.metaService.addTag({ name: 'twitter:title', content: 'Saurya\'s Sweet Sixteen Party' });
    this.metaService.addTag({ name: 'twitter:description', content: 'Join us for an epic celebration as Saurya turns 16!' });
    this.metaService.addTag({ name: 'twitter:image', content: imageUrl }); // Twitter image

    // Fetch invitation details from Firebase
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firebaseService.getInvitation(id).subscribe(
        (invitation: Invitation) => {
          if (invitation) {
            this.name = invitation.name;
            this.guestRsvp = invitation.rsvp || '';
            this.guestCount = invitation.guestCount || 1;
          }
        },
        error => {
          this.errorMessage = error.message;
        }
      );
    }
  }

  onRsvpChange() {
    if (this.guestRsvp !== 'Accepted') {
      this.guestCount = 1;
    }
  }

  submitRsvp() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.guestRsvp) {
      const updateData: Partial<Invitation> = {
        rsvp: this.guestRsvp,
        guestCount: this.guestRsvp === 'Accepted' ? this.guestCount : undefined,
      };

      this.firebaseService.updateRSVP(id, updateData)
        .then(() => {
          this.rsvpMessage = "Sweet! You're in for a blast!";
        })
        .catch(error => {
          console.error('Error submitting RSVP:', error);
          this.errorMessage = 'Oops! RSVP failed. Try again, fam!';
        });
    }
  }

  openRSVPDialog(): void {
    const dialogRef = this.dialog.open(RsvpComponent, {
      width: '250px',
      data: { rsvp: this.guestRsvp, guestCount: this.guestCount }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guestRsvp = result.rsvp;
        this.guestCount = result.guestCount;
        this.submitRsvp();
      }
    });
  }
}
