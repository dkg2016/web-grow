export class Subject {
  constructor() {
    this.value = null;
    this.observers = [];
  }

  subscribe(ob) {
    this.observers.push(ob);
    ob(this.value);
  }

  next(val) {
    this.value = val;
    this.observers.forEach(ob => {
      ob(this.value)
    });
  }

}