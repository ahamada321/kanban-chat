import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Booking } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.model';
import { Review } from 'src/app/common/review/service/review.model';
import { BookingService } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-user-mybookings',
  templateUrl: './user-mybookings.component.html',
  styleUrls: ['./user-mybookings.component.scss'],
})
export class UserMyBookingsComponent implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];
  expiredBookings: Booking[] = [];
  acceptedBookings: Booking[] = [];
  finishedBookings: Booking[] = [];
  bookingDeleteIndex: number = undefined;

  constructor(
    private bookingService: BookingService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.getUserPendingBookings();
    this.getUserExpiredBookings();
    this.getUserAcceptedBookings();
    this.getUserFinishedBookings();
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    if (navbar.classList.contains('nav-up')) {
      navbar.classList.remove('nav-up');
    }
  }

  getUserPendingBookings() {
    this.bookingService.getUserPendingBookings().subscribe(
      (pendingBookings: Booking[]) => {
        this.pendingBookings = pendingBookings;
      },
      () => {}
    );
  }

  getUserExpiredBookings() {
    this.bookingService.getUserExpiredBookings().subscribe(
      (expiredBookings: Booking[]) => {
        this.expiredBookings = expiredBookings;
      },
      () => {}
    );
  }

  getUserAcceptedBookings() {
    this.bookingService.getUserAcceptedBookings().subscribe(
      (acceptedBookings: Booking[]) => {
        this.acceptedBookings = acceptedBookings;
      },
      () => {}
    );
  }

  getUserFinishedBookings() {
    this.bookingService.getUserFinishedBookings().subscribe(
      (finishedBookings: Booking[]) => {
        this.finishedBookings = finishedBookings;
      },
      () => {}
    );
  }

  reviewHandler(index: number, review: Review) {
    this.bookings[index]['review'] = review; // Update Frontend
  }

  isExpired(startAt) {
    const timeNow = moment(); // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0;
  }
}
