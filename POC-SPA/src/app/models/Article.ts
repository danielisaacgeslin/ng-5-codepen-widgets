export class Article {
  public title: string = null;
  public description: string = null;

  constructor (args?: Article) {
    Object.assign(this, args);
  }
}
