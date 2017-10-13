import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../../states';
import { userDomain } from '../../../states/user';
import { User } from '../../../entities/User';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public users$: Observable<User[]> = this.store.select(userDomain.queries.getUsers);

  constructor(private store: Store<AppState>) { }

  public ngOnInit() {
    console.log(this);
  }
}
