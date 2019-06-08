# GuitarChordApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.
This is a library to generate an SVG within an Angular component to display a specific guitar chord. The `lib-guitar-chord-generator` directive can be used in the template of any component to display the SVG. 

## Installation
### NPM
`npm i dl-guitar-svg-chord-generator`
### Manual
Simply copy the `guitar-chord-generator` directory, which is a library, in the `projects` direcotry and add it to the `projects` directory of your angular application. To use the component, you would have to add the import code in relevant components/modules.

## Chord Object

### Initialization Using JSON

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

### Initialization Using Chord object

You can also use the `addNote(<fret-number>: number, <string-number: number>, <finger-number>: number)` method, which is self-explanatory, to add a note and the `addBar(<fret-number>: number, <bar-count>: number)` method to add a bar. To toggle between strumming a string or not use the `toggleNoStrumStrings(<string-number>: number)` method. The following code creates a chord object for `F major` similar to the above example:

    let c : Chord = new Chord();
    c.addNote(2, 3, 2);
    c.addNote(3, 5, 3);
    c.addNote(3, 4, 4);
    c.addBar(1,6);
 
## API

### @Inputs()
| Input | Type | Required | Description |
|--|--|--|--|
| width | number | **Yes** | the width of the SVG component. |
| height | number | **Yes** | the height of the SVG component. |
| chord | object | **Yes** | object of type **Chord** which is configured with the required chord. |
| config | object | Optional, default: default | config object of type **GCSGConfig** which has the required configuration. |

### Configuration
The `config` input can be used to send configuration input to the component.

    "offset": {
	    "horizontal":  30,
	    "vertical":  30
    },
    "string": {
	    "count":  6,
	    "labelLocation":  1,
	    "tuning": ['e', 'B', 'G', 'D', 'A', 'E']
    },
    "fret": {
	    "minimumFretCount":  3,
	    "offset":  7,
	    "labelLocation":  -1
    },
    "bar": {
	    "offset":  7,
	    "width":  10
    }
| Key | Description |
|--|--|
| offset.horizontal | the horizontal padding from the top and bottom borders of the SVG |
| offset.vertical | the vertical padding from the right and left borders of the SVG |
| string.count | the default number of strings |
| string.labelLocation | 1 - right, -1 - left of the fret board |
| string.tuning | the default tuning of the strings |
| fret.minimumFretCount | the minimum number of frets that will be displayed irrespective of how many fret(s) is required by a chord |
| fret.offset | the offset of the top and bottom edges of the fret lines from the edge strings |
| fret.labelLocation | 1 - bottom, -1 - top of the fret board |
| bar.offset | the offset of the top and bottom edges of the bar lines from the strings |
| bar.width | the width of the bar |

In case if you want to change only some of the configurations, say `fret.offset` to `10` you can try the following code:
```typescript
let c : GCSGConfig = new GCSGConfig();
c.setConfig('fret.offset', 10);
```
The rest of the configuration will be set to default values by default (at the constructor of the configuration object).

### Style
The default style is specified in `guitar-chord-generator\src\lib\guitar-chord-generator.component.css` stylesheet file. You can edit this file for your own style preferences.

## Usage
 1. Register the `GuitarChordGeneratorModule` in your app-module by adding the following import:
`import { GuitarChordGeneratorModule } from  'projects/guitar-chord-generator/src/public-api';`
2. Add the module to the `imports` of the `@NgModule` decorator
```typescript
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		GuitarChordGeneratorModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
```
3. Import `Chord` class to the component which will display the SVG and configure the chord object to pass as input to the component.
4. 4. Use the `lib-guitar-chord-generator` directive in your component's template with the above mentioned inputs.

## Example\Demo
The angular app specified in this repository will display the `F major` chord. Check out the `app.component.ts` (or app component) and the template file to see the code for the example.
Run `ng serve` in the application directory to see the output in your browser.

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
