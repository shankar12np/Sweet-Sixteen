import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationComponent } from './invitation/invitation.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component'; // Login page component

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route points to login
  { path: 'login', component: LoginComponent }, // Login page route
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }, // Admin route, guarded
  { path: 'invitation', component: InvitationComponent}, // Invitation page, protected route
  { path: 'invitation/:id', component: InvitationComponent }, // Dynamic Invitation route, guarded
  { path: '**', redirectTo: 'login' }, // Wildcard, fallback to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
