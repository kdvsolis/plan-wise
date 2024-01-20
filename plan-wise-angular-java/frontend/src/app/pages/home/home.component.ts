import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    document.title = "Plan Wise - Home";
  }
}
