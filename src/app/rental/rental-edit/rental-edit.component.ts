import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { RentalService } from "../service/rental.service";
import { MyOriginAuthService } from "src/app/auth/service/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Rental } from "../service/rental.model";
import Swal from "sweetalert2";

@Component({
  selector: "app-rental-edit",
  templateUrl: "./rental-edit.component.html",
  styleUrls: ["./rental-edit.component.scss"],
})
export class RentalEditComponent implements OnInit {
  rental: Rental;
  isTouched: boolean = false;
  isClicked: boolean = false;
  focus: boolean;
  focus2: boolean;
  errors: any[] = [];

  data: Date = new Date();

  // Select category
  dropdownCategoryLists = [
    "経営者",
    "個人事業主",
    "士業",
    "営業",
    "社会人",
    "学生",
    "その他",
  ];

  // Select province
  dropdownPrefectureList = [
    { id: 1, itemName: "北海道" },
    { id: 2, itemName: "青森県" },
    { id: 3, itemName: "岩手県" },
    { id: 4, itemName: "宮城県" },
    { id: 5, itemName: "秋田県" },
    { id: 6, itemName: "山形県" },
    { id: 7, itemName: "福岡県" },
    { id: 8, itemName: "茨城県" },
    { id: 9, itemName: "栃木県" },
    { id: 10, itemName: "群馬県" },
    { id: 11, itemName: "埼玉県" },
    { id: 12, itemName: "千葉県" },
    { id: 13, itemName: "東京都" },
    { id: 14, itemName: "神奈川県" },
    { id: 15, itemName: "新潟県" },
    { id: 16, itemName: "富山県" },
    { id: 17, itemName: "石川県" },
    { id: 18, itemName: "福井県" },
    { id: 19, itemName: "山梨県" },
    { id: 20, itemName: "長野県" },
    { id: 21, itemName: "岐阜県" },
    { id: 22, itemName: "静岡県" },
    { id: 23, itemName: "愛知県" },
    { id: 24, itemName: "三重県" },
    { id: 25, itemName: "滋賀県" },
    { id: 26, itemName: "京都府" },
    { id: 27, itemName: "大阪府" },
    { id: 28, itemName: "兵庫県" },
    { id: 29, itemName: "奈良県" },
    { id: 30, itemName: "和歌山県" },
    { id: 31, itemName: "鳥取県" },
    { id: 32, itemName: "鳥根県" },
    { id: 33, itemName: "岡山県" },
    { id: 34, itemName: "広島県" },
    { id: 35, itemName: "山口県" },
    { id: 36, itemName: "徳島県" },
    { id: 37, itemName: "香川県" },
    { id: 38, itemName: "愛媛県" },
    { id: 39, itemName: "高知県" },
    { id: 40, itemName: "福岡県" },
    { id: 41, itemName: "佐賀県" },
    { id: 42, itemName: "長崎県" },
    { id: 43, itemName: "熊本県" },
    { id: 44, itemName: "大分県" },
    { id: 45, itemName: "宮崎県" },
    { id: 46, itemName: "鹿児島県" },
    { id: 47, itemName: "沖縄県" },
  ];
  dropdownPrefectureSettings = {
    singleSelection: true,
    text: "都道府県を選択",
    enableSearchFilter: true,
    searchPlaceholderText: "キーワード検索",
    filterSelectAllText: "検索結果一覧",
    filterUnSelectAllText: "検索結果一覧",
    noDataLabel: "検索結果無し",
    // primaryKey: "id",
    // labelKey: "itemName",
    classes: "",
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rentalService: RentalService,
    public auth: MyOriginAuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.getRental(params["rentalId"]);
    });

    let navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
    let body = document.getElementsByTagName("body")[0];
    body.classList.add("add-product");
  }
  ngOnDestroy() {
    let navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
    if (navbar.classList.contains("nav-up")) {
      navbar.classList.remove("nav-up");
    }
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("add-product");
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe(
      (rental: Rental) => {
        this.rental = rental;
      },
      (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        this.errors = errorResponse.error.errors;
      }
    );
  }

  unpublishRental() {
    this.rental.isShared = false;
    this.rentalService.updateRental(this.rental._id, this.rental).subscribe(
      (updatedRental) => {
        this.showSwalSuccess();
      },
      (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        this.errors = errorResponse.error.errors;
      }
    );
  }

  updateRental() {
    this.rental.isShared = true;
    this.isClicked = true;
    this.rentalService.updateRental(this.rental._id, this.rental).subscribe(
      (updatedRental) => {
        this.showSwalSuccess();
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
      // title: 'User infomation has been updated!',
      text: "商品情報を更新しました！",
      type: "success",
      confirmButtonClass: "btn btn-primary btn-lg",
      buttonsStyling: false,
      timer: 5000,
    }).then(() => {
      this.router.navigate(["/rentals/manage"]);
    });
  }
}
