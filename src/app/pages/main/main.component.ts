import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  isExpanded = false;
  element: HTMLElement;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  // toggleActive(event: any) {
  //   // debugger;
  //   event.preventDefault();
  //   if (this.element !== undefined) {
  //     this.element.style.backgroundColor = 'white';
  //   }
  //   const target = event.currentTarget;
  //   target.style.backgroundColor = 'green';
  //   target.style.color = 'white';
  //   this.element = target;
  // }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
