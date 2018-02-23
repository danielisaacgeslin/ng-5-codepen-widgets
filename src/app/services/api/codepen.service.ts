import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { map } from 'rxjs/operators';

import { WidgetModels, ProgressModels } from '../../models';

@Injectable()
export class CodepenService {
  private readonly codepenFetchRawUrl: string = 'https://codepen.io/chriscoyier/pen/';
  constructor(private httpClient: HttpClient) { }

  public fetch(id: string): Observable<WidgetModels.Widget> {
    const extensions: string[] = ['html', 'css', 'js'];

    const requests: Observable<string>[] = extensions
      .map(ext => this.httpClient.get(
        `${this.codepenFetchRawUrl}${id}.${ext}?nocache=${Date.now()}`,
        { responseType: 'text' })
      );

    return Observable.zip(...requests).pipe(
      map(data => {
        const args = { id };
        extensions.forEach((ext, index) => args[ext] = data[index]);
        const widget = new WidgetModels.Widget(<WidgetModels.Widget>args);
        return widget;
      })
    );
  }
}
