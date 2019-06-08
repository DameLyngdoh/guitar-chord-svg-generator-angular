# GuitarChordApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Setting Up
**Manual**
Simply copy the `guitar-chord-generator` directory, which is a library, in the `projects` direcotry and add it to the `projects` directory of your angular application. To use the component, you would have to add the import code in relevant components/modules.
## Chord Object Creation

**Using JSON**
To create a new chord using a JSON object, simply create a new object of type `any` and then use the following key-value pairs:

    "name": <name of the chord>,
    "fingers": {
	    "<finger-number>": {
		    "fret": <fret number>,
		    "string": <string number>
	    }
    },
    "noStrumStrings": <list of strings to mark not for strumming>,
    "barFret": <fret number for the bar>,
    "barCount": <number of strings to bar starting from first string>
The fret number starts from 1 and follows conventional fret numbering. The string numbering starts from 1 and starts from the bottom most string or `e` string in standard tuning. Here is an example of a common variation of an `F major` chord:

    "name": "F major",
    "fingers": {
	    "2": {
		    "fret": 2,
		    "string": 3
	    },
	    "3": {
		    "fret": 3,
		    "string": 5
	    },
	    "4": {
		    "fret": 3,
		    "string": 4
	    }
    },
    "barFret": 1,
    "barCount": 6
In case if `barCount` is ommited and `barFret` is specified then the default value of `barCount` is 6. First finger (or finger 1 or index finger) will be used for the bar in case of a bar chord.
The `noStrumString` key takes an array of string numbers.
After setting up this JSON object, you can pass this object to the `loadChordFromJson` method or `loadChordFromJsonString` in case if the JSON is represented as a string. The methods will throw exceptions in case if there exists invalid fret numbers, string numbers or other inconsistencies.

**Using Chord object**
You can also use the `addNote(<fret-number>: number, <string-number: number>, <finger-number>: number)` method, which is self-explanatory, to add a note and the `addBar(<fret-number>: number, <bar-count>: number)` method to add a bar. To toggle between strumming a string or not use the `toggleNoStrumStrings(<string-number>: number)` method. The following code creates a chord object for `F major` similar to the above example:

    let c : Chord = new Chord();
    c.addNote(2, 3, 2);
    c.addNote(3, 5, 3);
    c.addNote(3, 4, 4);
    c.addBar(1,6);
 
 ## Using the Component
 To use the component in your angular application, simply add the following component in the template:

    <lib-guitar-chord-generator [width]="number" [height]="number" [chord]="chord-object" [config]="config-object"></lib-guitar-chord-generator>
The `config` input is optional but all the other inputs are mandatory to be specified. In case if the `config` input is ignored or not specified then the default configurations will be used.
## Configuration
The `config` input can be used to send configuration input to the component.
## Style
The default style is specified in `guitar-chord-generator\src\lib\guitar-chord-generator.component.css` stylesheet file. You can edit this file for your own style preferences.
## Example
The angular app specified in this repository will display the `F major` chord. Check out the `app.component.ts` (or app component) and the template file to see the code for the example.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
