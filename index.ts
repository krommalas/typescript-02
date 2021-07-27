console.clear();
//OBJ : Type = Observer ส่งเข้า Fucntion
interface Observer {
  next: (value: any) => void;
  error: (err: any) => void;
  complete: () => void;
}

type TearDown = () => void;

//OBJ
const observer: Observer = {
  next: (value: any) => console.log('next :', value),
  error: (err: any) => console.log('error', err),
  complete: () => console.log('complete')
};

class Observable {
  subscriber: (observer: Observer) => TearDown;
  constructor(subscriber: (observer: Observable) => TearDown) {
    this.subscriber = subscriber;
  }
  subscribe(observer: Observer) {
    const teardown: TearDown = this.subscriber(observer);
    return { unsubscribe: () => teardown() };
  }
}
function Interval(millisec: number) {
  return new Observable(observer => {
    let i = 0;
    const index = setInterval(() => observer.next(i++), millisec);
    const teardown = () => clearInterval(index);
    return teardown;
  });
}

function of(...dataList: any[]) {
  return new Observable(observer => {
    dataList.forEach(data => observer.next(data));
    observer.complete();
    return () => {};
  });
}

function from(dataList: any[]) {
  return new Observable(observer => {
    dataList.forEach(data => observer.next(data));
    observer.next();
    return () => {};
  });
}

//const source = Interval(1000);
//const source = of(10,20,30,40,50,"60");
const source = from(["banana",'apple',50,]);
const subscription = source.subscribe(observer);
setTimeout(() => subscription.unsubscribe(), 5000);
