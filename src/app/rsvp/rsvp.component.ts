import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {
  rsvp: string = '';
  guestCount: number = 1;
  showThankYou: boolean = false; // New property to control visibility of thank you message

  constructor(
    public dialogRef: MatDialogRef<RsvpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rsvp: string, guestCount: number }
  ) {
    this.rsvp = data.rsvp || '';
    this.guestCount = data.guestCount || 1;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rsvp) {
      this.showThankYou = true; // Show thank you message immediately on submit
      setTimeout(() => {
        this.showThankYou = false; // Hide thank you message after 3 seconds
        this.dialogRef.close({ rsvp: this.rsvp, guestCount: this.guestCount });
      }, 3000);
    } else {
      alert('Please choose an RSVP status.');
    }
  }

  onRsvpChange() {
    if (this.rsvp !== 'Accepted') {
      this.guestCount = 1;
    }
  }
}
