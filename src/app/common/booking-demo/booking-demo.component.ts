import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { DateTimeAdapter } from "ng-pick-datetime";
import { BookingService } from "src/app/rental/rental-detail/rental-detail-booking/services/booking.service";
import { Rental } from "src/app/rental/service/rental.model";
import { Booking } from "src/app/rental/rental-detail/rental-detail-booking/services/booking.model";
import * as moment from "moment-timezone";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from "sweetalert2";
import { ContactFormService } from "src/app/contact-form/service/contactform.service";

@Component({
  selector: "app-booking-demo",
  templateUrl: "./booking-demo.component.html",
  styleUrls: ["./booking-demo.component.scss"],
})
export class BookingDemoComponent implements OnInit {
  isClicked: boolean = false;
  calendarItems: any[];
  isSelectedDateTime: boolean = false;
  isChangeBtnClicked: boolean = false;
  modalRef: NgbModalRef;
  errors: any[] = [];

  // Date picker params
  selectedDate: Date;
  minDate = new Date();
  maxDate = new Date();

  timeTables: any = [];
  contactusForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private contactformService: ContactFormService
  ) {}

  ngOnInit() {
    this.minDate.setDate(this.minDate.getDate() + 2);
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 16);
    this.maxDate.setHours(0, 0, 0, 0);

    this.initForm();
  }

  initForm() {
    this.contactusForm = this.formBuilder.group({
      bookingDate: [""],
      username: [""],
      email: [""],
      company: [""],
      position: [""],
      msg: [""],
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content);
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Sunday from being selected.
    return day !== 0;
  };

  onDateSelect(date: Date) {
    const selectedDay = date.getDay();
    let mTimeTables = [];
    let mEndAt = null;
    let mStartAt = null;

    mEndAt = moment({ hour: 20, minute: 30 }).set({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
    });
    mStartAt = moment({ hour: 9, minute: 0 }).set({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
    });

    while (mStartAt < mEndAt) {
      mTimeTables.push(moment(mStartAt));
      mStartAt.add(30, "minutes");
    }
    this.timeTables = mTimeTables;
  }

  isValidBooking(startAt) {
    return true;
  }

  selectDateTime(startAt, stepper) {
    this.isSelectedDateTime = true;
    this.contactusForm.patchValue({
      bookingDate: moment(startAt).set({
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth(),
        date: this.selectedDate.getDate(),
      }),
    });
    this.isClicked = false;
    stepper.next();
  }

  isInvalidForm(fieldname): boolean {
    return (
      this.contactusForm.controls[fieldname].invalid &&
      this.contactusForm.controls[fieldname].touched
    );
    //  (this.contactForm.controls[fieldname].dirty ||
    //  this.contactForm.controls[fieldname].touched)
  }

  sendBooking(contactusForm) {
    this.isClicked = true;
    if (!contactusForm.value.bookingDate) {
      this.errors = [{ detail: "デモ希望日時が選択されてません！" }];
      return;
    }
    this.contactformService.sendDemoRequest(contactusForm.value).subscribe(
      (Message) => {
        contactusForm.reset();
        this.modalRef.close();
        this.showSwalSuccess();
        this.isClicked = false;
      },
      (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        this.errors = errorResponse.error.errors;
        this.isClicked = false;
      }
    );
  }

  private showSwalSuccess() {
    Swal.fire({
      type: "success",
      title: "送信されました",
      text: "確認次第ZoomURLをお送りさせていただきます",
      confirmButtonClass: "btn btn-primary btn-lg",
      buttonsStyling: false,
    }).then(() => {
      // this.router.navigate(['/'])
    });
  }
}
