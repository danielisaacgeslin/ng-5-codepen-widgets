export class Widget {
  public id: string = null;
  public title: string = null;
  public description: string = null;
  public html: string = '';
  public js: string = '';
  public css: string = '';

  constructor (args: Widget) {
    Object.assign(this, args);
  }
}
