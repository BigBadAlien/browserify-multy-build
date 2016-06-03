import Baz from './_Baz';

class Foobar {
  constructor(foo, bar) {
    this.foo = foo;
    this.bar = bar;
  }

  doSomething(param) {
    console.log(`logs: ${this.foo}, ${this.bar}`);
  }
}
