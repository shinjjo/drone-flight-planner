import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedDialogComponent } from './dialog.component';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class SharedDialogService {  

	dialogRef!: MatDialogRef<SharedDialogComponent>;
	
	constructor(private dialog: MatDialog) { }

	open = (options: any) => {
  	this.dialogRef = this.dialog.open(SharedDialogComponent, {
      data: {
        title: options.title,
        content: options.content,
				formProps: [ ...options.formProps ]
    	}
  	})
	}

	confirmed = (): Observable<any> => {
		return this.dialogRef.afterClosed().pipe(
			take(1),
			map(res => res)
		)
	} 
}