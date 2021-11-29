import { Select2Value } from 'ng-select2-component';
export interface Select2Option {
    value: Select2Value;
    label: string;
    disabled?: boolean;
    component?: string; // the component
    classes?: string;
  }
  