import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormService } from './service/contactform.service';
import { ContactFormComponent } from './contact-form.component';
import { ContactFormContactusComponent } from './contact-form-contactus/contact-form-contactus.component';
import { ContactFormTrialComponent } from './contact-form-trial/contact-form-trial.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

const routes: Routes = [
  {
    path: "form",
    component: ContactFormComponent,
    children: [
      { path: "contactus", component: ContactFormContactusComponent },
      { path: "trial", component: ContactFormTrialComponent },
    ],
  },
];

@NgModule({
  declarations: [
    ContactFormComponent,
    ContactFormContactusComponent,
    ContactFormTrialComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    JwBootstrapSwitchNg2Module
  ],
  providers: [ContactFormService]
})
export class ContactFormModule { }
