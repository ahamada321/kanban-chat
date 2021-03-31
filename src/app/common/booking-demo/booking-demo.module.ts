import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BookingDemoComponent } from "./booking-demo.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../modules/matmodule/matmodule";
import { BookingSelecterModule } from "../booking-selecter/booking-selecter.module";

@NgModule({
  declarations: [BookingDemoComponent],
  imports: [
    CommonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BookingSelecterModule,
  ],
  exports: [BookingDemoComponent],
  providers: [],
})
export class BookingDemoModule {}
