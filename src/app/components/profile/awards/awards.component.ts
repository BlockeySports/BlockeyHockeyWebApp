import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html'
})
export class AwardsComponent implements OnInit {

  @Input() awards: any;

  constructor() { }

  ngOnInit(): void {
  }

}
