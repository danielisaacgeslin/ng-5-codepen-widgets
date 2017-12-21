import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ProgressModels } from '../../models';

import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() progress: ProgressModels.Progress;
  public readonly status = ProgressModels.ProgressStatus;
}
