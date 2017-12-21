import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Article, ProgressModels } from '../../../models';

import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent implements OnChanges {
  @Input() disabled: boolean = false;
  @Output() submitForm: EventEmitter<Article> = new EventEmitter();
  public newArticleFormGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  public ngOnChanges(changes): void {
    if (changes.disabled.currentValue === true) this.newArticleFormGroup.disable();
    else this.newArticleFormGroup.enable();
  }

  public onSubmit(): void {
    const article: Article = new Article({
      title: this.newArticleFormGroup.controls.title.value,
      description: this.newArticleFormGroup.controls.description.value
    });
    this.submitForm.emit(article);
  }

  public reset(): void {
    this.newArticleFormGroup.reset();
  }
}
