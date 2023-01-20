import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uniform',
  templateUrl: './uniform.component.html',
})
export class UniformComponent implements OnInit {
  public helmetColor = undefined;
  public jerseyColor = undefined;
  public pantsColor = undefined;
  public socksColor = undefined;

  constructor() {}

  ngOnInit(): void {
    // set document title
    document.title = 'Uniform | Blockey Hockey Network';
  }
}
