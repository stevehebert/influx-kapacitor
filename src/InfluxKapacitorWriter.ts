import converter = require('json-to-line-protocol');
import { InfluxKapacitor } from './InfluxKapacitor';
import { Insulator } from './Insulator';

export class InfluxKapacitorWriter {
  private insulator: Insulator;
  constructor(pipe: Insulator) {
    this.insulator = pipe;
  }
  public simple_record(measurement: string, key: string, value: any, timestamp?: number): void {
    const map: object = new Object({
      [key]: value,
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
      ts: this.getTimestamp(timestamp),
    };

    const formattedMessage = converter.convert(message);

    this.insulator.send(formattedMessage);
  }

  public shutdown(): void {
    this.insulator.shutdown();
  }

  public getTimestamp(timestamp?: number): number {
    if (timestamp === undefined) {
      return Date.now() * InfluxKapacitor.timestampScalingFactor;
    } else {
      return timestamp;
    }
  }
}
