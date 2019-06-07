/**
 * Coordinate system for the fret-board. The x-coordinate is indicated by the fret number and the y-coordinate by the string number.
 */
export class FBCoordinate {
    private _fret : number;
    private _str : number;

    constructor( fret: number, str : number ) {
        this.fret = fret; this.str = str;
    }

    get fret() : number {
        return this._fret;
    }
    get str() : number {
        return this._str;
    }

    set fret( fret : number ) {
        if(fret < 0) {
            throw new Error('Error: Invalid fret number.');
        }
        this._fret = fret;
    }

    set str( str : number ) {
        if(str < 0) {
            throw new Error('Error: Invalid string number.');
        }
        this._str = str;
    }
}
