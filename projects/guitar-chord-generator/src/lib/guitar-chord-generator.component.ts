import { Component, OnInit, Input } from '@angular/core';
import { Chord } from './chord';
import { GCSGConfig } from './gcsgconfig';

@Component({
  selector: 'lib-guitar-chord-generator',
  templateUrl: './guitar-chord-generator.component.html',
  styles: ['./guitar-chord-generator.component.css']
})
export class GuitarChordGeneratorComponent implements OnInit {

  @Input('chord') chord : Chord;
  @Input('height') height : number;
  @Input('width') width : number;
  @Input('config') config : GCSGConfig=null;

  private endFret : number;
  private stringGap : number;
  private stringCount : number;
  private fretCount : number;
  private fretGap : number;
  private fretOffset : number;
  private tuning : string[];
  private barWidth : number;
  private verticalOffset : number;
  private horizontalOffset : number;
  public hasError : boolean = false;
  public errorMessage : string;
  public startFret : number;
  public stringTuningLocation : number;
  public fingerCircles : FingerCircle[];
  public strings : String[];
  public frets : Fret[];
  public bar : Bar;
  public fretLabelLocation : number;
  
  constructor() {
    this.strings = new Array<String>();
    this.tuning = new Array<string>();
    this.frets = new Array<Fret>();
    this.fingerCircles = new Array<FingerCircle>();
    this.bar = new Bar();
    this.errorMessage = "There is some problem rendering the component.";
  }

  ngOnInit() {
    
    // Validate chord
    if( this.chord==undefined || this.chord==null || this.height==NaN || this.height < 0 || this.width==NaN || this.width < 0) {
      this.hasError = true;
      return;
    }

    // Load default configuration
    if(this.config==undefined || this.config==null) {
      this.config = new GCSGConfig();
      this.config.loadConfig(null);
    }
    else {
      this.config.loadConfig(this.config);
    }

    // Loading values from configuration
    this.horizontalOffset = this.config.getConfigValue("offset.horizontal")==null ? 10 : this.config.getConfigValue("offset.horizontal");
    this.verticalOffset = this.config.getConfigValue("offset.vertical")==null ? 10 : this.config.getConfigValue("offset.vertical");
    this.barWidth = this.config.getConfigValue("bar.width")==null ? 15 : this.config.getConfigValue("bar.width");
    this.stringCount = this.config.getConfigValue("string.count")==null ? 6 : this.config.getConfigValue("string.count");
    this.fretOffset = this.config.getConfigValue("fret.offset")==null ? 7 : this.config.getConfigValue("fret.offset");
    this.stringTuningLocation = this.config.getConfigValue("string.labelLocation")==null ? 1 : this.config.getConfigValue("string.labelLocation");
    this.fretLabelLocation = this.config.getConfigValue("fret.labelLocation")==null ? 1 : this.config.getConfigValue("fret.labelLocation");
    
    // Load default tuning if chord has no tuning
    if(this.chord.tuning==undefined || this.chord.tuning==null || this.chord.tuning.length==0) {
      this.tuning = this.config.getConfigValue("string.tuning")==null ? ['e', 'B', 'G', 'D', 'A', 'E'] : this.config.getConfigValue("string.tuning");
    }
    else {
      this.tuning = this.chord.tuning;
    }

    if(this.tuning.length != this.stringCount) {
      throw new Error('Error: Mismatching string count to tuning.');
      this.hasError;
    }

    // Normalize tuning
    let t : string[] = [];
    for(let i:number=this.tuning.length-1; i>=0; i--){
      t.push(this.tuning[i]);
    }
    this.tuning = t;

    this.stringGap = Math.floor((this.height - (2 * this.verticalOffset)) / ( this.stringCount - 1 ));
    let fc : number = this.config.getConfigValue("fret.minimumFretCount")==null ? 3 : this.config.getConfigValue("fret.minimumFretCount");
    this.normalizeFretCount(fc);
    
    this.fretGap = Math.ceil((this.width - (2*this.horizontalOffset)) / this.fretCount);
    
    // Generating strings
    for(let i : number = 0, x1 : number = this.horizontalOffset, x2 : number = this.width - this.horizontalOffset; i<this.stringCount; i++) {
      let y : number = (i * this.stringGap) + this.verticalOffset;
      try{
        let s : String = new String(x1, y, x2, y, this.tuning[i]);
        s.strum = this.chord.noStrumStrings[this.stringCount-i-1];
        this.strings.push(s);
      }
      catch(e) {
      }
    }

    // Generating frets
    for(let i:number=0, y1:number=this.verticalOffset-this.fretOffset, y2:number=((this.stringGap*(this.stringCount-1))+this.verticalOffset)+this.fretOffset; i < this.fretCount; i++) {
      let x1 : number = this.horizontalOffset + (i * this.fretGap), x2 : number = x1 + this.fretGap;
      let left : Line = new Line(x1, y1, x1, y2);
      let right : Line = new Line(x2, y1, x2, y2);
      let fret : Fret = new Fret(left, right);
      if(i==this.fretCount-1) {
        fret.label = (this.chord.startFret + 1) + "fr";
        fret.showLabel = true;
      }
      this.frets.push(fret);
    }

    // Generating finger circles
    for(let i:number=0; i<this.chord.fingers.length; i++) {
      
      if( this.chord.fingers[i]!=null ) {
        // Fret number
        let x : number = this.frets[this.endFret-this.chord.fingers[i].fret].horizontalCenter;
        // String number
        let y : number = this.strings[this.stringCount-1-this.chord.fingers[i].str].p1.y;
        try {
          let fc : FingerCircle = new FingerCircle(i+1, x, y);
          this.fingerCircles.push(fc);
        }
        catch(e) {
          console.log(e);
        }
      }
    }

    // Generating bar
    if( this.chord.hasBar ) {
      let p : Point = new Point(0, 0);
      let bo : number = this.config.getConfigValue("bar.offset");
      p.x = this.frets[this.frets.length - 1 - this.chord.barFret + this.startFret].horizontalCenter - (this.barWidth/2);
      p.y = this.strings[this.strings.length - this.chord.barCount].p1.y - bo;
      this.bar.startPoint = p;
      this.bar.width = this.barWidth;
      this.bar.height = ((this.chord.barCount - 1) * this.stringGap) + (bo * 2);
    }
    else {
      this.bar = null;
    }
  }

  /**
   * Generates an array of n elements, for loops in view-template.
   * @param n The number of elements in the array.
   */
  arrayLoop( n : number ) : Array<any> {
    return Array(n);
  }

  /**
   * Normalizes the fret count in case the number of frets involved in the chord is less than the minimum fret count specified in the configuration.
   * @param minFc The minimum fret count from the configuration.
   */
  private normalizeFretCount( minFc : number ) : void {
    this.startFret = this.chord.startFret;
    this.endFret = this.chord.endFret;
    this.fretCount = this.endFret - this.startFret + 1;
    let doStart : boolean = true;
    if(this.chord.fretCount < minFc) {
      while(this.fretCount < minFc ) {
        if(doStart && this.startFret > 0) {
          this.startFret--;
          this.fretCount++;
          continue;
        }
        else {
          this.endFret++;
          this.fretCount++;
        }
        doStart = !doStart;
      }
    }
    else {
      this.fretCount = this.chord.fretCount;
    }
  }
}

class Line {
  private _p1 : Point; 
  private _p2 : Point;

  constructor ( x1 : number, y1 : number, x2 : number, y2 : number ) {
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
  }

  get p1() : Point {
    return this._p1;
  }
  get p2() : Point {
    return this._p2;
  }

  set p1( p : Point ) {
    this._p1 = p;
  }
  set p2( p : Point ) {
    this._p2 = p;
  }
}

class Fret {
  private _left : Line;
  private _right : Line;
  private _label : string=null;
  private _showLabel : boolean=false;

  constructor( left : Line, right : Line) {
    this.left = left;
    this.right = right;
  }

  get left() : Line {
    return this._left;
  }
  get right() : Line {
    return this._right;
  }
  get label() : string {
    return this._label;
  }
  get showLabel() : boolean {
    return this._showLabel;
  }
  get horizontalCenter() : number {
    return Math.floor((this.right.p1.x - this.left.p1.x) / 2) + this.left.p1.x;
  }
  get verticalCenter() : number {
    return Math.floor(this.left.p2.y - this.left.p1.y / 2);
  }

  set left( left : Line ) {
    this._left = left;
  }
  set right( right : Line ) {
    this._right = right;
  }
  set label( label : string ) {
    this._label = label;
  }
  set showLabel( showLabel : boolean) {
    this._showLabel = showLabel;
  }
}

class String extends Line{
  private _label : string;
  private _strum : boolean = true;

  constructor ( x1 : number, y1 : number, x2 : number, y2 : number , label : string) {
   super(x1, y1, x2, y2);
   this.label = label;
  }

  get label() : string {
    return this._label;
  }
  get strum() : boolean {
    return this._strum;
  }

  set label ( label : string ) {
    this._label = label;
  }
  set strum( strum : boolean ) {
    this._strum = strum;
  }
}

class Point {
  private _x : number
  private _y : number;

  constructor ( x : number, y : number ) {
    this.x = x;
    this.y = y;
  }

  get x() : number {
    return this._x;
  }
  get y() : number {
    return this._y;
  }

  set x( x : number ) {
    if( x < 0 ) {
      throw new Error('Error: Invalid negative value for x.');
    }
    this._x = x;
  }
  set y( y : number ) {
    if( y < 0 ) {
      throw new Error('Error: Invalid negative value for y.');
    }
    this._y = y;
  }
}

class Bar {
  private _startPoint : Point;
  private _width : number;
  private _height : number;

  constructor() {

  }

  get startPoint() : Point {
    return this._startPoint;
  }
  get width() : number {
    return this._width;
  }
  get height() : number {
    return this._height;
  }

  set startPoint( startPoint : Point ) {
    this._startPoint = startPoint;
  }
  set height( height : number ) {
    this._height = height;
  }
  set width( width : number ) {
    this._width = width;
  }
}

class FingerCircle {
  private _n : number;
  private _x : number;
  private _y : number;
  
  constructor( n : number, x : number, y : number) {
      this.n = n;
      this.x = x;
      this.y = y;
  }

  get n() : number {
      return this._n;
  }
  get x() : number {
      return this._x;
  }
  get y() : number {
      return this._y;
  }
  
  set n( n : number) {
      if(n > 4 || n < 1) {
      throw new Error('Error: Invalid finger number.');
      }
      this._n = n;
  }
  set x( x : number) {
      if( x < 0 ) {
      throw new Error('Error: Invalid negative value for x coordinate.');
      }
      this._x = x;
  }
  set y( y : number) {
      if( y < 0 ) {
      throw new Error('Error: Invalid negative value for y coordinate.');
      }
      this._y = y;
  }
}