import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyOriginAuthService } from '../../auth/service/auth.service';


@Component({
  selector: 'app-landing-aptrainer',
  templateUrl: './landing-aptrainer.component.html',
  styleUrls: ['./landing-aptrainer.component.scss']
})

export class LandingAptrainerComponent implements OnInit, OnDestroy {
  footer : Date = new Date();
  
  constructor( 
    public auth: MyOriginAuthService, 
    ) { }

  ngOnInit() {
      let navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.add('navbar-transparent');
      let body = document.getElementsByTagName('body')[0];
      body.classList.add('presentation-page');
      body.classList.add('loading');
  }

  ngOnDestroy(){
      let navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.remove('navbar-transparent');
      if (navbar.classList.contains('nav-up')) {
          navbar.classList.remove('nav-up');
      }
      let body = document.getElementsByTagName('body')[0];
      body.classList.remove('presentation-page');
      body.classList.remove('loading');
  }
}
