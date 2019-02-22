import { of, throwError } from 'rxjs'
import { InsulatorImpl } from '../InsulatorImpl'
import { InfluxBroadcaster } from '../InfluxBroadcaster';

class PipeMock implements InfluxBroadcaster {
  public values: Array<string> = new Array();

  hash_value(): string {
    return "42;"
  }

  send(lines: string[]): any {
    this.values = this.values.concat(lines);
    return of(lines);
  }
}

class ThrowMock implements InfluxBroadcaster {

  hash_value(): string {
    return "42;"
  }

  send(lines: string[]): any {
    return throwError("error");
  }
}


describe('InsulatorImpl', () => {
  it('execute success path with no time delay', done => {
    const pipeMock = new PipeMock();
    let successCount = 0;
    let failureCount = 0;
    let exitCount = 0;

    var impl = new InsulatorImpl(pipeMock, 0, (_content, success) => {
      if (success) {
        successCount += 1;
      } else {
        failureCount += 1;
      }
    }, () => {
      exitCount += 1;
    });

    impl.send('hello');
    impl.shutdown();

    setTimeout(() => {
      expect(failureCount).toBe(0);
      expect(successCount).toBe(1);
      expect(pipeMock.values.length).toBe(1);
      expect(pipeMock.values[0]).toBe('hello');

      expect(exitCount).toBe(1);
      done();
    }, 5);
  });

  it('execute failure path with no time delay', done => {
    const throwMock = new ThrowMock();
    let successCount = 0;
    let failureCount = 0;
    let exitCount = 0;

    var impl = new InsulatorImpl(throwMock, 0, (_content, success) => {
      if(success) {
        successCount += 1;
      } else {
        failureCount += 1;
      }
    }, () => {
      exitCount += 1;
    });

    impl.send('hello');
    impl.shutdown();
    
    setTimeout(() => {
      expect(failureCount).toBe(1);
      expect(successCount).toBe(0);

      done();
    }, 5);
  });

  it('execute success path with time delay', done => {
    const pipeMock = new PipeMock();
    let successCount = 0;
    let failureCount = 0;
    let exitCount = 0;

    var impl = new InsulatorImpl(pipeMock, 5, (_content, success) => {
      if (success) {
        successCount += 1;
      } else {
        failureCount += 1;
      }
    }, () => {
      exitCount += 1;
    });

    impl.send('hello');
    impl.shutdown();

    setTimeout(() => {
      expect(failureCount).toBe(0);
      expect(successCount).toBe(1);
      expect(pipeMock.values.length).toBe(1);
      expect(pipeMock.values[0]).toBe('hello');

      expect(exitCount).toBe(1);
      done();
    }, 15);
  });
})