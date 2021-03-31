import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-rental-bookings',
  templateUrl: './rental-bookings.component.html',
  styleUrls: ['./rental-bookings.component.scss'],
})
export class RentalBookingsComponent implements OnInit, OnDestroy {
  active: number = 1;
  payments: any[];

  constructor() {}

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('settings');

    this.getPaidPayments();
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    if (navbar.classList.contains('nav-up')) {
      navbar.classList.remove('nav-up');
    }
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('settings');
  }

  getPaidPayments() {}

  isExpired(startAt) {
    const timeNow = moment(); // Attention: just "moment()" is already applied timezone!
    return moment(startAt).diff(timeNow) < 0;
  }
}
