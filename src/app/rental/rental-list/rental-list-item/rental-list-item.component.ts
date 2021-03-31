import { Component, OnInit, Input } from "@angular/core";
import { MyOriginAuthService } from "src/app/auth/service/auth.service";
import { RentalService } from "../../service/rental.service";
import { Rental } from "../../service/rental.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginPopupComponent } from "src/app/auth/login-popup/login-popup.component";

@Component({
  selector: "app-rental-list-item",
  templateUrl: "./rental-list-item.component.html",
  styleUrls: ["./rental-list-item.component.scss"],
})
export class RentalListItemComponent implements OnInit {
  @Input() rental: Rental;
  isFavourite: boolean;

  constructor(
    public auth: MyOriginAuthService,
    private modalService: NgbModal,
    private rentalService: RentalService
  ) {}

  ngOnInit() {
    this.initFavourite();
  }

  private initFavourite() {
    const index = this.rental.favouritesFrom.indexOf(this.auth.getUserId());
    this.isFavourite = index >= 0;
  }

  toggleFavourite() {
    this.rentalService.toggleFavourite(this.rental._id).subscribe(
      (index) => {
        if (index >= 0) {
          this.rental.favouritesFrom.splice(index, 1); // Dlete user from array.
        } else {
          this.rental.favouritesFrom.push(this.auth.getUserId());
        }
        this.isFavourite = !(index >= 0); // Be careful. Need to return opposite.
      },
      (error) => {}
    );
  }

  modalLoginOpen() {
    this.modalService.open(LoginPopupComponent, { backdrop: "static" });
  }
}
