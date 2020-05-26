import { Component } from '@angular/core';

export interface Card {
  subjName: string;
  classNum: number;
  buildNum: number;
  groupNum: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'test-project';

  toggle = true;

  cards: Card[] = [
    { subjName: 'Name 1', classNum: 1, buildNum: 1, groupNum: 123 },
    { subjName: 'Name 2', classNum: 2, buildNum: 1, groupNum: 1233 },
    {
      subjName: 'Very looooooooong name',
      classNum: 3,
      buildNum: 2,
      groupNum: 1123,
    },
  ];

  toggleCrads() {
    this.toggle = !this.toggle;
  }
}
