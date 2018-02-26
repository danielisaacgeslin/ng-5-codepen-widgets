import { Component, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

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
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();
  private widget: WidgetModels.Widget;

  public onRemove(): void {
    this.remove.next();
  }

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
