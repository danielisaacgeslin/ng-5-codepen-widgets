import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent {
  @Output() submitForm: EventEmitter<string> = new EventEmitter<string>();
  public formGroup: FormGroup = new FormGroup({ id: new FormControl('', Validators.required) });

  public onSubmit(): void {
    this.submitForm.emit(this.formGroup.getRawValue().id);
    this.formGroup.reset();
  }
}
