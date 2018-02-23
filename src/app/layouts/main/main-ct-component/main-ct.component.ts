import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { WidgetModels } from '../../../models';
import { State, widgetActions, queries } from '../../../state-mgmt';

@Component({
  templateUrl: './main-ct.component.html',
  styleUrls: ['./main-ct.component.scss']
})
export class MainContainerComponent {
  public widgets$: Observable<WidgetModels.Widget[]> = this.store.select(queries.widget.getList);

  constructor(public store: Store<State>) { }

  public onSubmit(id: string): void {
    this.store.dispatch(new widgetActions.Fetch({ id }));
  }

}
