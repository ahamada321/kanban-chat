import { Component, OnInit, ElementRef } from "@angular/core";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { MyOriginAuthService } from "src/app/auth/service/auth.service";
import { SocialAuthService } from "angularx-social-login";
import { Router } from "@angular/router";
import { LoginPopupComponent } from "src/app/auth/login-popup/login-popup.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  private toggleButton: any;
  private sidebarVisible: boolean = false;

  constructor(
    public location: Location,
    private element: ElementRef,
    private modalService: NgbModal,
    public auth: MyOriginAuthService,
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName("html")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    html.classList.add("nav-open");
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    // console.log(html);
    this.toggleButton.classList.remove("toggled");
    html.classList.remove("nav-open");
    this.sidebarVisible = false;
  }

  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  modalLoginOpen() {
    this.sidebarClose();
    this.modalService.open(LoginPopupComponent, { backdrop: "static" });
  }

  isHome() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee === "/home") {
      return true;
    } else {
      return false;
    }
  }

  isDocumentation() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee === "/documentation") {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.socialAuthService.signOut();
    this.auth.logout();
    this.sidebarClose();
    this.router.navigate(["/"]);
  }
}
