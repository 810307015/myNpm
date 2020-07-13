import { Subject } from 'rxjs';

class Service {
  constructor(initData = {}) {
    this.data = initData;
  }

  data$ = new Subject();

  subscribe = (callback) => {
    this.subscription = this.data$.subscribe(callback);
    this.next(this.data);

    return () => {
      this.subscription.unsubscribe();
    }
  }

  next = (data) => {
    this.data$.next(data);
  }

  set = (data) => {
    this.data = { ...this.data, ...data };
    this.next(this.data);
  }
}

export default Service;