import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { ArticleService, IDummyResponse } from '../services/api';
import { Article, ProgressModels } from '../models';
import { articleActions, progressActions } from '../actions';


@Injectable()
export class ArticleEffects {
  @Effect()
  create$: Observable<Action> = this.actions$
    .ofType(articleActions.articleActionTypes.CREATE)
    .switchMap((action: articleActions.Create) => this.articleService.create(action.payload.article)
      .map(progress => ({ progress, action }))
    )
    .map((stream: { progress: IDummyResponse<ProgressModels.Progress | Article>, action: articleActions.Create}) => {
      const progressKey: string = stream.action.payload.progressKey;
      const progress: IDummyResponse<ProgressModels.Progress | Article> = stream.progress;
      if (ProgressModels.Progress.isProgress(progress.data)) {
        if (progress.type === HttpEventType.DownloadProgress) {
          return new progressActions.Update({ key: progressKey, progress: progress.data });
        }
      } else {
        return new articleActions.CreateSuccess(<Article>progress.data);
      }
    });

  constructor(private actions$: Actions, private articleService: ArticleService) { }
}
