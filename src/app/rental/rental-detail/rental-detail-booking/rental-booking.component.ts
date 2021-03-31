import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormGroup} from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';
import { RentalService } from '../../service/rental.service';
import { BookingService } from './services/booking.service';
import { BookingHelperService } from './services/booking.helper.service';
// import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { Rental } from '../../service/rental.model';
import { Booking } from './services/booking.model';
import { HttpErrorResponse } from '@angular/common/http';

import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-rental-booking',
  templateUrl: './rental-booking.component.html',
  styleUrls: ['./rental-booking.component.scss']
})
export class RentalBookingComponent implements OnInit {
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    @ViewChild('stepper') stepper: MatStepper;

    isSelectedDateTime: boolean = false
    isChangeBtnClicked: boolean = false

    @Input() selectedCourseTime: number = 60
    @Input() rental: Rental
    newBooking: Booking
    paymentToken: string
    // stripeCustomerId: string = ""
    customer: any
    
    errors: any[] = []


    constructor(
        private route: ActivatedRoute,
        private rentalService: RentalService,
        private router: Router,
        private helper: BookingHelperService,
        private bookingService: BookingService,
        private auth: MyOriginAuthService,
        public activeModal: NgbActiveModal,
    ) { }

    ngOnInit() {
        // this.getStripeCustomerInfo()
    }

    getStripeCustomerInfo() {
        const userId = this.auth.getUserId()
        this.auth.getUserById(userId).subscribe(
            (user) => {
                this.customer = user.customer
                //this.getUserLast4()
            },
            (err) => { }
        )
    }

    onBookingReady(newBooking: Booking) {
        if (!newBooking) {
            this.isSelectedDateTime = false
        } else {
            this.newBooking = newBooking
            this.isSelectedDateTime = true
            this.stepper.next()
        }
    }

    onPaymentConfirmed(paymentToken: string) {
        this.paymentToken = paymentToken
        this.isChangeBtnClicked = false
    }

    createBooking() {
        if(this.paymentToken) {
            this.newBooking.paymentToken = this.paymentToken
        }

        this.newBooking.rental = this.rental
        this.bookingService.createBooking(this.newBooking).subscribe(
          (newBooking: any) => {
            this.addNewBookedDateTimes(newBooking) // Update front UI
            this.newBooking = new Booking()
            this.showSwalSuccess()
          },
          (errorResponse: HttpErrorResponse) => {
            console.error(errorResponse)
            this.errors = errorResponse.error.errors    
          }
        )
    }

    private addNewBookedDateTimes(bookingData: any) { // Update UI of frontend.
        this.rental.bookings.push(bookingData)
    }

    showSwalSuccess() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-primary btn-lg',
              cancelButton: 'btn btn-lg'
            },
            buttonsStyling: false,
          })

        swalWithBootstrapButtons.fire({
            title: '予約申込完了！',
            text: 'トレーナーからのお返事をお待ちください',
            type: 'success',
            // showConfirmButton: false,
            timer: 5000
        }).then((result) => {
            //this.newBookingCreated.emit(newBooking)
            this.activeModal.close('Close click')
            this.router.navigate(['/user/mybookings'])
        })
      }
}
