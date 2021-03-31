import { Component, OnInit, OnDestroy } from "@angular/core";
import { Rental } from "../service/rental.model";
import { RentalService } from "../service/rental.service";
import { MyOriginAuthService } from "src/app/auth/service/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-rental-list",
  templateUrl: "./rental-list.component.html",
  styleUrls: ["./rental-list.component.scss"],
})
export class RentalListComponent implements OnInit, OnDestroy {
  rentals: Rental[] = [];
  pageIndex: number = 1;
  pageSize: number = 40; // Displaying contents per page.
  pageCollectionSize: number = 1;

  constructor(
    private rentalService: RentalService,
    public auth: MyOriginAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");

    this.getRentals();
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
    if (navbar.classList.contains("nav-up")) {
      navbar.classList.remove("nav-up");
    }
  }

  getRentals() {
    this.route.queryParams.subscribe((keywords) => {
      this.rentalService
        .getRentals(keywords, this.pageIndex, this.pageSize)
        .subscribe(
          (result) => {
            this.rentals = result[0].foundRentals;
            this.pageCollectionSize = result[0].metadata[0].total;
          },
          (err) => {
            console.error(err);
          }
        );
    });
  }

  filterByRentalName(rentalname: string) {
    this.router.navigate(["/rentals"], {
      queryParams: {
        rentalname,
      },
      queryParamsHandling: "merge", // Preserve current queryParams
    });
  }

  pageChange() {
    this.rentals = null;
    this.getRentals();
  }
}
