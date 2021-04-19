import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html'
})
export class TrophiesComponent implements OnInit {

  @Input() trophies: any;

  constructor() { }

  ngOnInit(): void {
  }

}
