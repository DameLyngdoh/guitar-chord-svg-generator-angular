import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuitarChordGeneratorComponent } from './guitar-chord-generator.component';

@NgModule({
  declarations: [GuitarChordGeneratorComponent],
  imports: [
    CommonModule
  ],
  exports: [GuitarChordGeneratorComponent]
})
export class GuitarChordGeneratorModule { }
