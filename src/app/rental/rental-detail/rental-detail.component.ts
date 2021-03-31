import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoginPopupComponent } from 'src/app/auth/login-popup/login-popup.component';
import { RentalBookingComponent } from './rental-detail-booking/rental-booking.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Rental } from '../service/rental.model';
import { Review } from 'src/app/common/review/service/review.model';
import { Booking } from './rental-detail-booking/services/booking.model';
import { RentalService } from '../service/rental.service';
import { ReviewService } from 'src/app/common/review/service/review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss'],
})
export class RentalDetailComponent implements OnInit, OnDestroy {
  currentId: string;
  rental: Rental;
  rating: number;
  reviews: Review[] = [];
  safeUrl: SafeResourceUrl;

  headerOffset: number = 75; // want to replace like DEFINE HEADER_OFFSET

  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService,
    private reviewService: ReviewService,
    private modalService: NgbModal,
    public router: Router,
    public auth: MyOriginAuthService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('presentation-page');

    this.route.params.subscribe((params) => {
      this.getRental(params['rentalId']);
    });
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('presentation-page');
    if (navbar.classList.contains('nav-up')) {
      navbar.classList.remove('nav-up');
    }
  }

  isYourRental() {
    return this.rental.user._id === this.auth.getUserId();
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe((rental: Rental) => {
      this.rental = rental;
      // this.getAvgRating(rental._id)
      this.getReviews(rental._id);
      this.getSafeUrl(rental.course1Img);
    });
  }

  getSafeUrl(url: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getAvgRating(rentalId: string) {
    this.reviewService.getAvgRating(rentalId).subscribe((rating: number) => {
      this.rating = rating;
    });
  }

  getReviews(rentalId: string) {
    this.reviewService.getRentalReviews(rentalId).subscribe(
      (reviews: Review[]) => {
        this.reviews = reviews;
      },
      () => {}
    );
  }

  modalLoginOpen() {
    this.modalService.open(LoginPopupComponent);
  }

  modalBookingOpen(selectedCourseTime: number) {
    const modalRef = this.modalService.open(RentalBookingComponent, {
      scrollable: true,
    });
    modalRef.componentInstance.rental = this.rental;
    modalRef.componentInstance.selectedCourseTime = selectedCourseTime;
  }

  onLineClicked(url) {
    Swal.fire({
      title: 'QRコードを保存してLineの友達追加から読み込ませられます',
      text: 'Aeru（会える）を見たと伝えて会話を始めましょう',
      imageUrl: url,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'Custom image',
      confirmButtonClass: 'btn btn-primary btn-lg',
      buttonsStyling: false,
    }).then(() => {
      // window.open(url, "_blank");
    });
  }

  onInstagramClicked(instagramId) {
    Swal.fire({
      type: 'info',
      text: 'Aeru（会える）を見たと伝えてDMするとスムーズです',
      confirmButtonClass: 'btn btn-primary btn-lg',
      buttonsStyling: false,
    }).then((result) => {
      if (!result.dismiss) {
        window.open(
          'https://www.instagram.com/' + instagramId,
          '_blank' // Open in a new window.
        );
      }
    });
  }
}
