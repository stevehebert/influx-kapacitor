import converter = require('json-to-line-protocol');
import { Insulator } from './Insulator';

export class InfluxKapacitorWriter {
  private insulator: Insulator;
  constructor(pipe: Insulator) {
    this.insulator = pipe;
  }
  public simple_record(measurement: string, key: string, value: any, timestamp?: number): void {
    const map: object = new Object ({
      [key]: value
    });

    this.record(measurement, map, undefined, timestamp);
  }
  public record(measurement: string, values: object, tags?: object, timestamp?: number): void {
    if (tags == null) {
      tags = {};
    }

    const message = {
      fields: values,
      measurement,
      tags,
      ts: timestamp || Date.now() * 1000000,
    };

    const formattedMessage = converter.convert(message);

    this.insulator.send(formattedMessage);
  }
}
