import { ChangeDetectionStrategy, Component,EventEmitter,Inject, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface FormProps {
    name: string,
    type: string | number | Date
}

/**
 * @title Dialog title
 * @content Dialog contnet
 */

@Component({
  selector: 'shared-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormComponent implements OnInit {

  @Input() formProps: FormProps[] = []
	@Output() updateForm = new EventEmitter();

  forms!: FormGroup;
  constructor() {}

	ngOnInit(){
    const controls = this.formProps.reduce((prev, current) => this.collectForm(prev, current), {});
    this.forms = new FormGroup(controls);
		this.forms.valueChanges.subscribe(() => {
			this.updateForm.emit(this.forms.getRawValue());
		})
  }

	private collectForm = (prev: any, current: any) => {
    prev[current.name] = new FormControl();
    return prev;
  }



    
}