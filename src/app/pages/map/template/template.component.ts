import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  isExpanded = false;
  faMapMarkedAlt = faMapMarkedAlt;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
