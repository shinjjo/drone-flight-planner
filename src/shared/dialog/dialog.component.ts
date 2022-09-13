import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDialogFormProperty } from "src/models/shared-dialog";

/**
 * @title Dialog title text
 * @description Dialog description text
 * @formProps Form properties to display in the dialog: "name", "required", "value"(optional)
 */

@Component({
  selector: 'shared-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDialogComponent implements OnInit {

  formValue: any;

	constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      description?: string,
      formProps?: SharedDialogFormProperty[]
    }, 
    private dialogRef: MatDialogRef<SharedDialogComponent>
  ) {}

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.cancel();
      }
    });
  }

  cancel() {
    this.close(false)
  }

  close(value: any) { 
    this.dialogRef.close(value) 
  }

  confirm() { 
    this.close(this.formValue)
  }

  getFormValues(formValue: any){
    this.formValue = formValue
  }
}