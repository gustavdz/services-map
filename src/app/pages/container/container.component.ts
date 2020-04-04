import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  sidenavWidth = 5;
  sidenavStatus = true;
  constructor( private router: Router,
               private auth: AuthService) { }

  ngOnInit() {
  }

  toogleSidenav() {
    if (this.sidenavStatus === true) {
      this.sidenavStatus = true;
    } else {
      this.sidenavStatus = true;
    }
    if (this.sidenavWidth === 5) {
      this.increase();
    } else {
      this.decrease();
    }
  }

  increase() {
    this.sidenavWidth = 15;
    console.log('increase sidenav width');
  }
  decrease() {
    this.sidenavWidth = 5;
    console.log('decrease sidenav width');
  }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
