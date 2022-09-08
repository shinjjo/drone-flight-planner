import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormProps } from "../form/form.component";

/**
 * @title Dialog title
 * @content Dialog contnet
 */

@Component({
  selector: 'shared-dialog',
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDialogComponent {

  formValue: any;

	constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      content: string,
      formProps: FormProps[],
    }, 
    private dialogRef: MatDialogRef<SharedDialogComponent>
  ) {}

  cancel() {
    this.close(false)
  }

  close = (value: any) => { this.dialogRef.close(value) }

  confirm = () => { this.close(this.formValue) }

  getFormValues(formValue: any){
    this.formValue = formValue
  }
}