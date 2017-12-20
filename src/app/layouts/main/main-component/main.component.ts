import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Article } from '../../../models';
import { State, queries } from '../../../reducers';
import { articleActions } from '../../../actions';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public articleList$: Observable<Article[]> = this.store.select(queries.article.getList);

  constructor(public store: Store<State>) {
    setInterval(() => {
      this.store.dispatch(new articleActions.CreateArticle(new Article({
        title: Date.now().toString(),
        description: Date.now().toString()
      })));
    }, 3000);
  }

}
