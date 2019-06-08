import { Component } from '@angular/core';
import { Chord } from 'projects/guitar-chord-generator/src/lib/chord';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guitar-chord-app';
  public chord : Chord;

  constructor() {
    let c : any = {
      "name": "F major",
      "fingers": {
          "2": {
              "fret": "2",
              "string": "3"
          },
          "3": {
              "fret": "3",
              "string": "5"
          },
          "4": {
              "fret": "3",
              "string": "4"
          }
      },
      "noStrumStrings": [],
      "barFret": 1,
      "barCount": 6
    };
    this.chord = new Chord();
    this.chord.loadChordFromJson(c);
  }
}
