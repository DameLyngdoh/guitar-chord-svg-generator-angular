import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GuitarChordGeneratorModule } from 'projects/guitar-chord-generator/src/public-api';

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
export class AppModule { }
