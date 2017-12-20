import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Article } from '../models';
import { articleActions } from '../actions';


@Injectable()
export class ArticleEffects {
  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(articleActions.articleActionTypes.CREATE_ARTICLE)
    .switchMap((action: articleActions.CreateArticle) => Observable.of(new Article(action.payload))) // some AJAX here
    .map((article: Article) => new articleActions.CreateArticleSuccess(article));

  constructor(private actions$: Actions) { }
}
