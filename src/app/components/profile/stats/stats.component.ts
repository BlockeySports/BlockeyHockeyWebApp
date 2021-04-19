import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/Member';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

  @Input() member: Member;

  constructor() { }

  ngOnInit(): void {
  }

}
