import { FBCoordinate } from './fbcoordinate';

/**
 * Class representing a guitar chord.
 */
export class Chord {
    
    private _name : string;
    private _startFret : number = -1;
    private _endFret : number = -1;
    private _barFret : number = -1;
    private _barCount : number = 6;
    private _fingers : FBCoordinate[];
    private _noStrumStrings : Array<boolean>;
    private _hasBar : boolean = false;
    private _tuning : string[];

    constructor() {
        this._fingers = [null, null, null, null];
        this._noStrumStrings = [false, false, false, false, false, false];
        this.tuning = [];
    }

    get name() : string {
        return this._name;
    }
    get startFret() : number {
        return this._startFret;
    }
    get endFret() : number {
        return this._endFret;
    }
    get barFret() : number {
        return this._barFret;
    }
    get barCount() : number {
        return this._barCount;
    }
    get fingers() : FBCoordinate[] {
        return this._fingers;
    }
    get noStrumStrings() : boolean[] {
        return this._noStrumStrings;
    }
    get fretCount() : number {
        return Math.abs(this._startFret - this._endFret + 1);
    }
    get hasBar() : boolean {
        return this._hasBar;
    }
    get tuning() : string[] {
        return this._tuning;
    }

    set name( name : string ) {
        this._name = name;
    }
    set startFret( startFret : number ) {
        if(startFret < 0) {
            throw new Error('Error: Fret number cannot be negative.');
        }
        else {
            this._startFret = startFret;
        }
    }
    set endFret( endFret : number ) {
        if(endFret < 0) {
            throw new Error('Error: Fret number cannot be negative.');
        }
        else {
            this._endFret = endFret;
        }
    }
    set barFret( barFret : number ) {
        if(barFret < 0) {
            throw new Error('Error: Fret number cannot be negative.');
        }
        else {
            this._barFret = barFret;
            this.hasBar = true;
        }
    }
    set barCount( barCount : number ) {
        if(barCount < 2) {
            throw new Error('Error: Fret number cannot be negative.');
        }
        else {
            this._barCount = barCount;
            this.hasBar = true;
        }
    }
    set hasBar( hasBar : boolean ) {
        this._hasBar = hasBar;
    }
    set tuning( tuning : string[] ) {
        this._tuning = tuning;
    }

    /**
     * Adds a note to the chord.
     * @param fret The fret number of the note.
     * @param str The string number of the note.
     * @param finger The number of the finger to be used on the note.
     */
    public addNote( fret : number, str : number, finger : number ) : void {
        if( finger < 1 || finger > 4 ) {
            throw new Error('Error: Invalid finger number.');
        }
        finger--;
        if( fret < 1 ) {
            throw new Error('Error: Invalid fret number.');
        }
        fret--;
        if( str < 1 || str > 6) {
            throw new Error('Error: Invalid string number.');
        }
        str--;
        
        let fbc : FBCoordinate;
        try {
            fbc = new FBCoordinate( fret, str );
        }
        catch(e) {
            console.log(e);
            return;
        }
        this._fingers[finger] = fbc;
        this.startFret = this.startFret == -1 || this.startFret > fret ? fret : this.startFret;
        this.endFret = this.endFret == -1 || this.endFret < fret ? fret : this.endFret;
    }

    /**
     * Adds a bar to the chord.
     * @param fret The fret number of the bar.
     * @param stringCount The number of strings to bar.
     */
    public addBar( fret : number , stringCount : number ) : void {
        fret--;
        if( fret < 0 || (this._startFret!=-1 && this.startFret <= fret)) {
            throw new Error('Error: Invalid fret number.');
        }
        if( stringCount < 1 || stringCount > 6) {
            throw new Error('Error: Invalid string count.');
        }
        this.barFret = fret;
        this.barCount = stringCount;
        this.startFret = fret;
        this.hasBar = true;
    }

    /**
     * Toggles whether a string is to be strummed or not.
     * @param stringNumber The number of the string.
     */
    public toggleNoStrumStrings( stringNumber : number ) : void {
        if( stringNumber < 1 || stringNumber > 6) {
            throw new Error('Error: Invalid string number.');
        }
        stringNumber--;
        this._noStrumStrings[stringNumber] = !this._noStrumStrings[stringNumber];
    }

    /**
     * Parses a JSON object conforming to project standards and loads content into this object.
     * @param json The JSON object to be parsed.
     */
    public loadChordFromJson( json : any ) : void {
        
        // Parsing name
        if(json.hasOwnProperty('name')) {
            this.name = json['name'];
        }

        // Parsing fingers
        if(json.hasOwnProperty('fingers')) {
            let fingers : any = json['fingers'];
            let i : number = 0;
            for(; i <= 4; i++){
                if(fingers.hasOwnProperty(i + "")) {
                    let f : any = fingers[i + ""];
                    if(f.hasOwnProperty("fret") && f.hasOwnProperty("string")){
                        try{
                            this.addNote(parseInt(f["fret"]), f["string"], i);
                        }
                        catch(e) {
                            throw e;
                        }
                    }
                    else {
                        throw new Error('Error: Invalid JSON object.');
                    }
                }
            }
        }
        else {
            throw new Error('Error: Invalid JSON object.');
        }

        // Parsing nostrum
        if(json.hasOwnProperty('noStrumStrings')) {
            try{
                let f : Array<number> = json['noStrumStrings'];
                for(let i : number=0; i<f.length; i++){
                    if(f[i] < 1 || f[i] > 6) {
                        throw new Error('Error: Invalid JSON object.');
                    }
                    this._noStrumStrings[f[i]-1] = true;
                }
            }
            catch(e) {
                throw e;
            }
        }

        // Parsing bar
        if(json.hasOwnProperty('barFret')){
            if(json.hasOwnProperty('barCount')){
                this.addBar(json['barFret'], json['barCount']);
            }
            else {
                this.addBar(json['barFret'], 6);
            }
        }
    }

    /**
     * Parses the JSON in string form and loads content into the object.
     * @param jsonString The JSON string to be parsed.
     */
    public loadChordFromJsonString( jsonString : string ) {
        try{
            this.loadChordFromJson(JSON.parse(jsonString));
        }
        catch(e) {
            throw e;
        }
    }
}