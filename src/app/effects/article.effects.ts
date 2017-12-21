import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { ArticleService } from '../services/api';
import { Article, ProgressModels } from '../models';
import { articleActions, progressActions } from '../actions';


@Injectable()
export class ArticleEffects {
  @Effect()
  create$: Observable<Action> = this.actions$
    .ofType(articleActions.articleActionTypes.CREATE)
    .switchMap((action: articleActions.Create) => this.articleService.create(action.payload))
    .map(stream => {
      if (ProgressModels.Progress.isProgress(stream.data)) {
        if (stream.type === HttpEventType.DownloadProgress) {
          return new progressActions.Update({ key: 'new-article', progress: <ProgressModels.Progress>stream.data });
        }
      } else {
        return new articleActions.CreateSuccess(<Article>stream.data);
      }
    });

  constructor(private actions$: Actions, private articleService: ArticleService) { }
}
