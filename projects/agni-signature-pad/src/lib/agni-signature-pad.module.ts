import { NgModule } from '@angular/core';
import { SignaturePadContainerComponent } from './signature-pad-container/signature-pad-container.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    SignaturePadContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SignaturePadContainerComponent
  ]
})
export class AgniSignaturePadModule { }
