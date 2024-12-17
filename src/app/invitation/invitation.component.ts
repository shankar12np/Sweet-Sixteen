import { Component, OnInit, AfterViewInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Invitation } from "../../invitation";
import { RsvpComponent } from "../rsvp/rsvp.component";
import { Meta, Title } from "@angular/platform-browser";
import confetti from 'canvas-confetti';

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
export class InvitationComponent implements OnInit, AfterViewInit {
  name: string = '';
  invitationImage = 'assets/images/saurya.jpg';
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

  countdownDisplay: string = '';

  startCountdown() {
    const eventTime = new Date(`${this.invitationDate} ${this.invitationTime}`).getTime();
    setInterval(() => {
      const now = new Date().getTime();
      const distance = eventTime - now;
      if (distance < 0) {
        this.countdownDisplay = 'Event has started!';
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        this.countdownDisplay = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  }

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
    const imageUrl = this.invitationImage;
    this.metaService.addTag({ property: 'og:title', content: 'Saurya\'s Sweet Sixteen Bash' });
    this.metaService.addTag({ property: 'og:description', content: 'Party with us as Saurya turns 16 - it\'s gonna be epic!' });
    this.metaService.addTag({ property: 'og:image', content: imageUrl });

    this.metaService.addTag({ name: 'twitter:title', content: 'Saurya\'s Sweet Sixteen Bash' });
    this.metaService.addTag({ name: 'twitter:description', content: 'Party with us as Saurya turns 16 - it\'s gonna be epic!' });
    this.metaService.addTag({ name: 'twitter:image', content: imageUrl });

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

  ngAfterViewInit() {
    this.startCountdown();
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
          this.triggerConfetti();
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

  triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

}
