import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/Member';

@Component({
  selector: 'app-boxscore',
  templateUrl: './boxscore.component.html'
})
export class BoxScoreComponent implements OnInit {

  public rosterHome: Member[] = [
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
    {
      username: 'Flashee'
    },
  ];

  public rosterAway: Member[] = [
    {
      username: 'DNP_10'
    },
    {
      username: 'DNP_10'
    },
    {
      username: 'DNP_10'
    },
    {
      username: 'DNP_10'
    },
    {
      username: 'DNP_10'
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
