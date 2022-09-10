import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedDialogComponent } from './dialog.component';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedDialogOptions } from 'src/models/shared-dialog';

@Injectable()
export class SharedDialogService {
  dialogRef!: MatDialogRef<SharedDialogComponent>;

  constructor(private dialog: MatDialog) {}

  open(options: SharedDialogOptions) {
    this.dialogRef = this.dialog.open(SharedDialogComponent, {
      data: {
        title: options.title,
        description: options.description,
        formProps: [...(options.formProps || [])]
      }
    });
  }

  confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1),
      map((res) => res)
    );
  }
}