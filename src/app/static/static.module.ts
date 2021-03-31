import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BookingDemoModule } from "../common/booking-demo/booking-demo.module";
import { TopComponent } from "./top/top.component";
import { LineupComponent } from "./lineup/lineup.component";
import { LandingSaasComponent } from "./landing-saas/landing-saas.component";
import { LandingAptrainerComponent } from "./landing-aptrainer/landing-aptrainer.component";
import { AboutusComponent } from "./aboutus/aboutus.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { Page404Component } from "./page404/page404.component";
import { Page422Component } from "./page422/page422.component";
import { Page500Component } from "./page500/page500.component";
import { TermsComponent } from "./terms/terms.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { ELearningComponent } from "./e-learning/e-learning.component";
import { TermsTextModule } from "./terms/helpers/terms-text/terms-text.module";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";

const routes: Routes = [
  { path: "", component: TopComponent },
  { path: "lineup", component: LineupComponent },
  { path: "saas", component: LandingSaasComponent },

  { path: "aboutus", component: AboutusComponent },
  { path: "terms", component: TermsComponent },
  { path: "privacy", component: PrivacyComponent },
  // { path: 'faq',          component: FAQComponent },

  { path: "ap-trainer", component: LandingAptrainerComponent },
  { path: "maintenance", component: MaintenanceComponent },
  { path: "e-learning", component: ELearningComponent },
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: Page404Component }
];

@NgModule({
  declarations: [
    TopComponent,
    LineupComponent,
    LandingSaasComponent,
    LandingAptrainerComponent,
    AboutusComponent,
    MaintenanceComponent,
    Page404Component,
    Page422Component,
    Page500Component,
    TermsComponent,
    PrivacyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    JwBootstrapSwitchNg2Module,
    TermsTextModule,
    BookingDemoModule,
  ],
  exports: [],
  providers: [],
})
export class StaticModule {}
