import { Injectable } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Article, ProgressModels } from '../../models';

export interface IDummyResponse<T> {
  type: HttpEventType;
  data: T;
}

@Injectable()
export class ArticleService {

  public create(article: Article): Observable<IDummyResponse<ProgressModels.Progress | Article>> {
    /** to simulate an ajax call */
    const dummy: Subject<IDummyResponse<ProgressModels.Progress | Article>> = new Subject();
    setTimeout(() => dummy.next({
      type: HttpEventType.DownloadProgress,
      data: new ProgressModels.Progress({ status: ProgressModels.ProgressStatus.IN_PROGRESS, percentage: 0 })
    }), 0);
    setTimeout(() => dummy.next({
      type: HttpEventType.DownloadProgress,
      data: new ProgressModels.Progress({ status: ProgressModels.ProgressStatus.IN_PROGRESS, percentage: 25 })
    }), 100);
    setTimeout(() => dummy.next({
      type: HttpEventType.DownloadProgress,
      data: new ProgressModels.Progress({ status: ProgressModels.ProgressStatus.IN_PROGRESS, percentage: 50 })
    }), 200);
    if (Math.random() > .5) {
      setTimeout(() => dummy.next({
        type: HttpEventType.DownloadProgress,
        data: new ProgressModels.Progress({ status: ProgressModels.ProgressStatus.COMPLETE, percentage: 100 })
      }), 500);
      setTimeout(() => {
        dummy.next({ type: HttpEventType.Response, data: article });
        dummy.complete();
      }, 500);
    } else {
      setTimeout(() => {
        dummy.next({
          type: HttpEventType.DownloadProgress,
          data: new ProgressModels.Progress({ status: ProgressModels.ProgressStatus.ERROR, percentage: 75 })
        });
        dummy.complete();
      }, 500);
    }
    return dummy;
  }

}
