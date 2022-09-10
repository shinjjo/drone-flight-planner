import { FormControl } from '@angular/forms';

export interface SharedDialogFormProperty {
  name: string;
  required: boolean;
  value?: string;
}

export interface SharedDialogOptions {
  title: string;
  description?: string;
  formProps?: SharedDialogFormProperty[];
}

export interface SharedDialogFormControls {
  [key: string]: FormControl;
}