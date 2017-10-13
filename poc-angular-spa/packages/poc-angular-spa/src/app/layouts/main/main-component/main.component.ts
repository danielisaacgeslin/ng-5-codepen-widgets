import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  public newUserFormGroup: FormGroup = new FormGroup({
    name: new FormControl(),
    age: new FormControl(),
  });

  constructor(private store: Store<AppState>) { }

  public ngOnInit() {

  }

  public createNewUser(): void {
    const name: string = this.newUserFormGroup.controls.name.value;
    const age: number = this.newUserFormGroup.controls.age.value;
    const newUser: User = new User({ name, age });
    this.store.dispatch(new userDomain.actions.AddUser(newUser));
    this.newUserFormGroup.reset();
  }
}
