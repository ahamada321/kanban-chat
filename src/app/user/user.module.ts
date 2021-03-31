import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthGuard } from "../auth/service/auth.guard";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { ImageUploadModule } from "../common/image-upload/image-upload.module";
import { ImageUploadMyverModule } from "../common/image-upload-myver/image-upload-myver.module";
import { ReviewModule } from "../common/review/review.module";
import { MaterialModule } from "../common/modules/matmodule/matmodule";
import { BookingSelecterModule } from "../common/booking-selecter/booking-selecter.module";

import { UserComponent } from "./user.component";
import { UserActivatorComponent } from "./user-activator/user-activator.component";
import { UserMyBookingsComponent } from "./user-mybookings/user-mybookings.component";
import { UserMyFavouriteComponent } from "./user-myfavourite/user-myfavourite.component";
import { MyfavouriteListItemComponent } from "./user-myfavourite/myfavourite-list-item/myfavourite-list-item.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import {
  UserMyBookingsListPendingComponent,
  UserPendingDialog,
} from "./user-mybookings/helpers/user-mybookings-list-pending/user-mybookings-list-pending.component";
import { UserMyBookingsListActiveComponent } from "./user-mybookings/helpers/user-mybookings-list-active/user-mybookings-list-active.component";
import { UserMyBookingsListFinishedComponent } from "./user-mybookings/helpers/user-mybookings-list-finished/user-mybookings-list-finished.component";
import { UserMyBookingsListReviewedComponent } from "./user-mybookings/helpers/user-mybookings-list-reviewed/user-mybookings-list-reviewed.component";
import { UserMyBookingsListExpiredComponent } from "./user-mybookings/helpers/user-mybookings-list-expired/user-mybookings-list-expired.component";

const routes: Routes = [
  {
    path: "user",
    component: UserComponent,
    children: [
      {
        path: "myfavourite",
        component: UserMyFavouriteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "mybookings",
        component: UserMyBookingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "activator",
        component: UserActivatorComponent,
        canActivate: [AuthGuard],
      },
      { path: "", component: UserSettingsComponent, canActivate: [AuthGuard] },
    ],
  },
];

@NgModule({
  declarations: [
    UserComponent,
    UserActivatorComponent,
    MyfavouriteListItemComponent,
    UserMyFavouriteComponent,
    UserMyBookingsComponent,
    UserPendingDialog,
    UserMyBookingsListPendingComponent,
    UserMyBookingsListActiveComponent,
    UserMyBookingsListFinishedComponent,
    UserMyBookingsListReviewedComponent,
    UserMyBookingsListExpiredComponent,
    UserSettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    JwBootstrapSwitchNg2Module,
    ImageUploadModule,
    ImageUploadMyverModule,
    MaterialModule,
    ReviewModule,
    BookingSelecterModule,
  ],
  entryComponents: [
    // UserPendingDialog
  ],
  providers: [],
})
export class UserModule {}
