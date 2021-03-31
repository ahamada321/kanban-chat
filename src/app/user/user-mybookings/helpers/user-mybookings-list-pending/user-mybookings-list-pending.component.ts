import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.model';
import { Review } from 'src/app/common/review/service/review.model';
import { BookingService } from 'src/app/rental/rental-detail/rental-detail-booking/services/booking.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment-timezone';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-pending-dialog',
  templateUrl: './user-pending-dialog.html',
})
export class UserPendingDialog {
  @Input() booking: Booking;

  constructor(
    private bookingService: BookingService,
    private dialogService: MatDialog
  ) {}

  onBookingReady(newBooking: Booking) {
    Swal.fire({
      title: '以下の日時で再提案します',
      text:
        moment(newBooking.startAt).format('YYYY/MM/DD/HH:mm') +
        '〜' +
        moment(newBooking.endAt).format('HH:mm') +
        'で提案しなおしますか？',
      input: 'textarea',
      inputPlaceholder: '任意でメッセージを伝えられます...',
      confirmButtonClass: 'btn btn-primary btn-lg',
      cancelButtonClass: 'btn btn-gray btn-lg',
      // cancelButtonText: "キャンセル",
      showCancelButton: true,
      buttonsStyling: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (!result.dismiss) {
        let bookingData = this.booking;
        bookingData.oldStartAt = bookingData.startAt;
        bookingData.oldEndAt = bookingData.endAt;
        bookingData.startAt = newBooking.startAt;
        bookingData.endAt = newBooking.endAt;
        bookingData.status = 'pending';
        if (result.value) {
          bookingData.comment = result.value;
        }
        this.bookingService.updateBooking(bookingData).subscribe(
          (updatedBooking) => {
            // this.booking = updatedBooking
            this.showSwalSuccess();
          },
          (errorResponse) => {
            // this.errors = errorResponse.error.errors
          }
        );
      }
    });
  }

  private showSwalSuccess() {
    Swal.fire({
      type: 'success',
      title: '予約日時を再提案しました！',
      confirmButtonClass: 'btn btn-primary btn-lg',
      buttonsStyling: false,
      allowOutsideClick: false,
      timer: 5000,
    }).then((result) => {
      this.dialogService.closeAll();
    });
  }
}

@Component({
  selector: 'app-user-mybookings-list-pending',
  templateUrl: './user-mybookings-list-pending.component.html',
  styleUrls: ['./user-mybookings-list-pending.component.scss'],
})
export class UserMyBookingsListPendingComponent implements OnInit {
  @Input() bookings: Booking[];
  bookingDeleteIndex: number = undefined;

  constructor(
    private bookingService: BookingService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {}

  acceptPayment(payment) {
    const body = {
      _id: payment,
    };
  }

  deleteConfirmation(bookingId: string) {
    Swal.fire({
      type: 'warning',
      title: '予約をキャンセルしますか?',
      text: '承認前なのでキャンセルが可能です',
      confirmButtonClass: 'btn btn-primary btn-lg',
      cancelButtonClass: 'btn btn-gray btn-lg',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonText: 'はい',
      cancelButtonText: 'いいえ',
      // allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.deleteBooking(bookingId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  private deleteBooking(bookingId: string) {
    this.bookingService.deleteBooking(bookingId).subscribe(
      (deletedBooking) => {
        Swal.fire({
          type: 'error',
          title: '予約キャンセルされました',
          text: '承認前なので請求はされません。',
          confirmButtonClass: 'btn btn-primary btn-lg',
          buttonsStyling: false,
          allowOutsideClick: false,
        });
        this.bookings.splice(this.bookingDeleteIndex, 1); // Update Frontend UI
      },
      (errorResponse) => {}
    );
  }

  openDialog(booking) {
    const dialogRef = this.dialogService.open(UserPendingDialog);
    dialogRef.componentInstance.booking = booking;
    dialogRef.afterClosed().subscribe((result) => {
      // this.getUserBookings() // Update frontend UI
    });
  }

  isExpired(startAt) {
    const timeNow = moment(); // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0;
  }
}
