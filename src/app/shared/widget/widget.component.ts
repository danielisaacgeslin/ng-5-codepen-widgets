import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import { WidgetModels } from '../../models';

import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent {
  @ViewChild('iframe') iframe: ElementRef;
  @Input() set data(widget: WidgetModels.Widget) {
    this.widget = widget;
    this.processWidget();
  }
  private widget: WidgetModels.Widget;

  private processWidget(): void {
    const nativeElement: HTMLIFrameElement = this.iframe.nativeElement;
    const iframeDocument: Document = nativeElement.contentWindow.document;

    this.resetIframe(iframeDocument);

    iframeDocument.write(`
      <head>
        <style>${this.widget.css}</style>
      </head>
      <body>
        ${this.widget.html}
        <script>${this.widget.js}</script>
      </body>
    `);
  }

  private resetIframe(dom: Document): void {
    dom.head.innerHTML = dom.body.innerHTML = '';
  }
}
