import { Component, Input, OnInit } from '@angular/core';
import { Punishment } from 'src/app/models/Punishment';

@Component({
  selector: 'app-infractions',
  templateUrl: './infractions.component.html'
})
export class InfractionsComponent implements OnInit {

  @Input() punishments: Punishment[];

  constructor() { }

  ngOnInit(): void {
  }

}
