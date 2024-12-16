import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvitationComponent } from './invitation/invitation.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { RsvpComponent } from './rsvp/rsvp.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Add Firestore
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    AppComponent,
    InvitationComponent,
    AdminComponent,
    RsvpComponent,
    LoginComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule, // For form fields
        MatSelectModule, // For select dropdowns
        MatInputModule, // For input fields within form fields
        MatButtonModule, // For buttons
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        MatIconModule,
        // Ensure FirestoreModule is added if using Firestore
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
