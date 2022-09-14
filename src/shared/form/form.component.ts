import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  SharedDialogFormControls,
  SharedDialogFormProperty
} from 'src/models/shared-dialog';

/**
 * Shared form component for dialog input
 * @title Dialog title
 * @content Dialog contnet
 */

@Component({
  selector: 'shared-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFormComponent implements OnInit {
  @Input() formProps: SharedDialogFormProperty[] = [];
  @Output() updateForm = new EventEmitter();

  forms!: FormGroup;

  ngOnInit() {
    const controls = this.formProps.reduce(
      (prev, current) => this.collectForm(prev, current),
      {}
    );
    this.forms = new FormGroup(controls);
    this.emitFormValue();
  }

  private collectForm(
    prev: SharedDialogFormControls,
    current: SharedDialogFormProperty
  ) {
    const required = current.required ? Validators.required : null;
    prev[current.name] = new FormControl(current.value, required);
    return prev;
  }

  private emitFormValue() {
    if (this.forms.valid) {
      this.updateForm.emit(this.forms.getRawValue());
    }
    this.forms.valueChanges.subscribe(() => {
      this.updateForm.emit(this.forms.getRawValue());
    });
  }
}