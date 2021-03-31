import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Rental } from 'src/app/rental/service/rental.model';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';


//t = current time
//b = start value
//c = change in value
//d = duration
var easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
}
@Component({
    selector: 'app-bottom-navbar',
    templateUrl: './navbar-bottom.component.html',
    styleUrls: ['./navbar-bottom.component.scss']
})
export class NavbarBottomComponent implements OnInit {
    @Input() rental: Rental;
    private headerOffset: number = -200; // want to replace like DEFINE HEADER_OFFSET
    private innerHeight: number // Browser width


    constructor(
        public location: Location, 
        private element : ElementRef,
        public auth: MyOriginAuthService,
        ) {}

    ngOnInit() {
        this.innerHeight = window.innerHeight;
    }

    smoothScroll(target) {
        let targetScroll = document.getElementById(target);
        this.scrollTo(document.scrollingElement || document.documentElement, targetScroll.offsetTop + (this.innerHeight + this.headerOffset), 625); // Updated by Creative Tim support!
      }
      scrollTo(element, to, duration) {
        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20
  
        var animateScroll = function() {
            currentTime += increment;
            var val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        }
        animateScroll();
    }

    @HostListener('window:resize')
    onResize() {
      this.innerHeight = window.innerHeight;
    }
}
