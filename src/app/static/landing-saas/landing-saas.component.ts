import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-landing-saas",
  templateUrl: "./landing-saas.component.html",
  styleUrls: ["./landing-saas.component.scss"],
})
export class LandingSaasComponent implements OnInit, OnDestroy {
  data: Date = new Date();
  innerWidth: number; // Browser width

  constructor(public el: ElementRef) {}

  ngOnInit() {
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");
    body.classList.add("presentation-page"); // temporary
    this.innerWidth = window.innerWidth;
  }
  ngOnDestroy() {
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
    if (navbar.classList.contains("nav-up")) {
      navbar.classList.remove("nav-up");
    }
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
    body.classList.remove("presentation-page"); // temporary
  }

  @HostListener("window:scroll")
  checkScroll() {
    const componentPosition = document.getElementsByClassName("add-animation");
    const scrollPosition = window.pageYOffset;

    for (var i = 0; i < componentPosition.length; i++) {
      var rec =
        componentPosition[i].getBoundingClientRect().top + window.scrollY + 100;
      if (scrollPosition + window.innerHeight >= rec) {
        componentPosition[i].classList.add("animated");
      } else if (scrollPosition + window.innerHeight * 0.8 < rec) {
        componentPosition[i].classList.remove("animated");
      }
    }
  }

  @HostListener("window:resize")
  onResize() {
    this.innerWidth = window.innerWidth;
  }
}
