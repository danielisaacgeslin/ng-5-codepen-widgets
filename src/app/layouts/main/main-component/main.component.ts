import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Article, ProgressModels } from '../../../models';
import { State, States, queries } from '../../../reducers';
import { articleActions } from '../../../actions';

import 'rxjs/add/operator/takeUntil';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  public articleList$: Observable<Article[]> = this.store.select(queries.article.getList);
  public progress: States.progress;
  public newArticleFormGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });
  private articleProgress$: Observable<States.progress> = this.store.select(queries.progress.getState);
  private destroy$: Subject<void> = new Subject();

  constructor(public store: Store<State>) { }

  public ngOnInit(): void {
    this.articleProgress$
      .takeUntil(this.destroy$)
      .subscribe(data => this.progress = data);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public onSubmit(): void {
    this.store.dispatch(new articleActions.Create(new Article({
      title: this.newArticleFormGroup.controls.title.value,
      description: this.newArticleFormGroup.controls.description.value
    })));
  }

}
