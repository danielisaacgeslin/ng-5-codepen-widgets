export class User {
    public id?: string = null;
    public name: string = null;
    public age: number = null;

    constructor(args: User) {
        args.id = Date.now().toString();
        Object.assign(this, args);
    }
}
