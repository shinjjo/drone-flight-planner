import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedFormModule } from '../form/form.module';
import { SharedDialogComponent } from './dialog.component';
import { SharedDialogService } from './dialog.service';

@NgModule({
  declarations: [SharedDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    SharedFormModule
  ],
  exports: [SharedDialogComponent],
  providers: [SharedDialogService],
  entryComponents: [SharedDialogComponent]
})
export class SharedDialogModule {}