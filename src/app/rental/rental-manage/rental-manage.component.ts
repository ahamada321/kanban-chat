import { Component, OnInit, OnDestroy } from "@angular/core";
import { RentalService } from "src/app/rental/service/rental.service";
import { Rental } from "src/app/rental/service/rental.model";
import { HttpErrorResponse } from "@angular/common/http";
import { MyOriginAuthService } from "src/app/auth/service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-rental-manage",
  templateUrl: "./rental-manage.component.html",
  styleUrls: ["./rental-manage.component.scss"],
})
export class RentalManageComponent implements OnInit, OnDestroy {
  rentals: Rental[] = [];
  rentalDeleteIndex: number = undefined;

  pageIndex: number = 1;
  pageSize: number = 40; // Displaying contents per page.
  pageCollectionSize: number = 1;

  constructor(
    private rentalService: RentalService,
    public auth: MyOriginAuthService
  ) {}

  ngOnInit() {
    let navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
    let body = document.getElementsByTagName("body")[0];
    body.classList.add("settings");

    this.getOwnerRentals();
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
    if (navbar.classList.contains("nav-up")) {
      navbar.classList.remove("nav-up");
    }
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("settings");
  }

  onDelete(rentalId) {
    Swal.fire({
      title: "この操作は取り消せません",
      text: "この商品を削除します",
      type: "warning",
      confirmButtonClass: "btn btn-danger btn-lg",
      cancelButtonClass: "btn btn-gray btn-lg",
      confirmButtonText: "削除",
      cancelButtonText: "キャンセル",
      showCancelButton: true,
      buttonsStyling: false,
    }).then((result) => {
      if (!result.dismiss) {
        this.deleteRental(rentalId);
      }
    });
  }

  deleteRental(rentalId: string) {
    this.rentalService.deleteRental(rentalId).subscribe(
      () => {
        const index = this.rentals.findIndex((x) => x._id === rentalId);
        this.rentals.splice(index, 1);
        Swal.fire({
          text: "商品を削除しました",
          confirmButtonClass: "btn btn-danger btn-lg",
          buttonsStyling: false,
        });
      },
      (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse.error.errors);
        // Expecting to show error if try to dalete rental which has active bookings
        // this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!')
      }
    );
  }

  getOwnerRentals() {
    this.rentalService.getOwnerRentals(this.pageIndex, this.pageSize).subscribe(
      (result) => {
        this.rentals = result[0].foundRentals;
        this.pageCollectionSize = result[0].metadata[0].total;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  pageChange() {
    this.rentals = null;
    this.getOwnerRentals();
  }
}
