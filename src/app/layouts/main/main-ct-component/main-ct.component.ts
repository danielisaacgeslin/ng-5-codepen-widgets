import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { Article, ProgressModels } from '../../../models';
import { State, States, queries } from '../../../reducers';
import { articleActions } from '../../../actions';
import { MainFormComponent } from '../main-form-component/main-form.component';

@Component({
  templateUrl: './main-ct.component.html',
  styleUrls: ['./main-ct.component.scss']
})
export class MainContainerComponent {
  @ViewChild('mainForm') mainForm: MainFormComponent;
  public readonly newArticleProgressKey: string = 'new-article';
  public articleList$: Observable<Article[]> = this.store.select(queries.article.getList);
  public articleProgress$: Observable<ProgressModels.Progress> = this.store.select(queries.progress.getState)
    .map((state: States.progress) => state[this.newArticleProgressKey])
    .do(progress => progress && progress.status === ProgressModels.ProgressStatus.COMPLETE && this.mainForm.reset());

  constructor(public store: Store<State>) { }

  public onSubmit(article: Article): void {
    const progressKey: string = this.newArticleProgressKey;
    this.store.dispatch(new articleActions.Create({ article, progressKey }));
  }

}
