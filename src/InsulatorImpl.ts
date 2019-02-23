import { interval, Observable, Subscriber } from 'rxjs';
import { bufferWhen, flatMap, map } from 'rxjs/operators';
import { InfluxBroadcaster } from './broadcasters/InfluxBroadcaster';
import { InfluxKapacitorWriter } from './InfluxKapacitorWriter';
import { Insulator } from './Insulator';

export class InsulatorImpl implements Insulator {
  public writer?: InfluxKapacitorWriter;
  public processor?: Subscriber<string>;
  constructor(pipe: InfluxBroadcaster, 
      broadcastInterval: number, 
      callback: (content: any, success: boolean) => void,
      exitCallback: () => void) {
    this.writer = new InfluxKapacitorWriter(this);
    
    const observable = new Observable<string>(sub => {
      this.processor = sub;
    });

    (broadcastInterval > 0 ?
      observable
        .pipe(bufferWhen(() => interval(broadcastInterval)))
        .pipe(flatMap(x => pipe.send(x))) :
      observable
        .pipe(flatMap(x => pipe.send([x]))))
      .subscribe(x => callback(x, true), 
          e => callback(e, false),
          () => exitCallback() );
  }

  public send(value: string): string {
    if (this.processor !== undefined) {
      this.processor.next(value);
    }
    return value;
  }

  public shutdown(): void {
    if(this.processor !== undefined) {
      this.processor.complete();
      this.processor = undefined;
    }
  }
}
