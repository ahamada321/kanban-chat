import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.model';
import { Review } from 'src/app/common/review/service/review.model';
import { BookingService } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-user-mybookings-list-active',
  templateUrl: './user-mybookings-list-active.component.html',
  styleUrls: ['./user-mybookings-list-active.component.scss'],
})
export class UserMyBookingsListActiveComponent implements OnInit {
  @Input() filterFinished: boolean = false;
  @Input() bookings: Booking[];
  bookingDeleteIndex: number = undefined;

  constructor(
    private bookingService: BookingService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {}

  reviewHandler(index: number, review: Review) {
    this.bookings[index]['review'] = review; // Update Frontend
  }

  isExpired(startAt) {
    const timeNow = moment(); // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0;
  }
}
