// src/sum.spec.ts
import { InfluxBroadcaster } from '../InfluxBroadcaster';
import { InfluxKapacitorWriter } from '../InfluxKapacitorWriter';
import { InfluxKapacitor } from '../InfluxKapacitor';
import { Insulator } from '../Insulator';


class InfluxPipeStub implements InfluxBroadcaster {
  public recorded_values: string[] = new Array();

  send(value: string[]): any {
    this.recorded_values.concat(value);

    return new Promise((resolve, reject) => {
      resolve({
        statusCode: 206,
        body: value
      });
    })
  }

  hash_value(): string {
    return 'asdf';
  }
}

class InsulatorStub implements Insulator {
  public recorded_values: string[] = new Array();
  public send(value: string): string {
    this.recorded_values.push(value);

    return value;
  }
}

describe('InfluxKapacitor', () => {
  it('accepts a simple message with one value', () => {
    var stub = new InsulatorStub();

    var impl = new InfluxKapacitorWriter(stub);

    impl.simple_record('myMeasure', 'clicks', 4);

    expect(stub.recorded_values.length).toEqual(1);
    expect(stub.recorded_values[0].length).toBeGreaterThan(20);
    expect(stub.recorded_values[0].substring(0, 18)).toEqual('myMeasure clicks=4');
  });

  it('accepts a standard message with one value', () => {
    var stub = new InsulatorStub();

    var impl = new InfluxKapacitorWriter(stub);
    var map = {
      'clicks': 5
    };

    impl.record('myMeasure', map);

    expect(stub.recorded_values.length).toEqual(1);
    expect(stub.recorded_values[0].length).toBeGreaterThan(20);
    expect(stub.recorded_values[0].substring(0, 19)).toEqual('myMeasure clicks=5 ');
  });

  it('accepts a standard message with two values', () => {
    var stub = new InsulatorStub();

    var impl = new InfluxKapacitorWriter(stub);

    impl.record('myMeasure', {'key1':4, 'key2': 7});

    expect(stub.recorded_values.length).toEqual(1);
    expect(stub.recorded_values[0].length).toBeGreaterThan(20);
    expect(stub.recorded_values[0].substring(0, 24)).toEqual('myMeasure key1=4,key2=7 ');
  });

  it('accepts a standard message with two values and tags', () => {
    var stub = new InsulatorStub();

    var impl = new InfluxKapacitorWriter(stub);


    impl.record('myMeasure', {'key1':4, 'key2': 7}, {'abcd': '12345678'});

    expect(stub.recorded_values.length).toEqual(1);
    expect(stub.recorded_values[0].length).toBeGreaterThan(20);
    expect(stub.recorded_values[0].substring(0, 38)).toEqual('myMeasure,abcd=12345678 key1=4,key2=7 ');
  });

  it('runs', () => {
    var stub = new InfluxPipeStub();

    InfluxKapacitor.add(stub, 0);

    InfluxKapacitor.default.simple_record('foo', 'door', 1);

    setTimeout(() => {
      expect(stub.recorded_values.length).toEqual(1);
      expect(stub.recorded_values[0].substr(0, 11)).toEqual('foo door=1 ');
    },100)
  
  });

  it('runs with datetime', () => {
    var stub = new InfluxPipeStub();

    InfluxKapacitor.add(stub, 0);
    
    InfluxKapacitor.default.simple_record('foo', 'door', 1, 1549405244614);

    
    setTimeout(() => {
      expect(stub.recorded_values.length).toEqual(1);
      expect(stub.recorded_values[0]).toEqual('foo door=1 1549405244614');
    }, 10)
  });

  it('callbacks work', () => {
    var stub = new InfluxPipeStub();
    var runSuccess = false;
    var runResult: any = null;

    InfluxKapacitor.add(stub, 0);

    InfluxKapacitor.default.simple_record('foo', 'door', 1, 1549405244614);

    InfluxKapacitor.setNotificationCallback( (content:any, success: boolean) => {
      runSuccess = success;
      runResult = content;
    })

    setTimeout(() => {
      expect(runSuccess).toBeTruthy();
      expect(runResult.length).toBe(1);
    }, 10)


  });
});
