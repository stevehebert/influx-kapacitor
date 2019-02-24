import request = require('request');
import { empty, from, Observable } from 'rxjs';
import { BroadcastStatus } from './../BroadcastStatus';
import { KapacitorResponse } from './../KapacitorResponse';
import { BroadcasterUtilities } from './BroadcasterUtilities';
import { InfluxBroadcaster } from './InfluxBroadcaster';

class HttpInfluxBroadcaster implements InfluxBroadcaster {
  public url: string;

  constructor(url: string) {
    this.url = url;
  }

  public send(lines: string[]): Observable<KapacitorResponse> {
    if (lines.length === 0) {
      return empty();
    }

    const options = {
      body: BroadcasterUtilities.combine_lines(lines),
      encoding: null,
      method: 'POST',
      url: this.url,
    };

    const response: Observable<KapacitorResponse> = from(
      new Promise<KapacitorResponse>((resolve, reject) => {
        request(options, (error: any, r1: any, body: any) => {
          if (error) {
            reject(new KapacitorResponse(BroadcastStatus.Unreachable, error));
          } else {
            resolve(new KapacitorResponse(BroadcastStatus.Success, r1, r1.statusCode));
          }
        });
      }),
    );

    return response;
  }
}

export { HttpInfluxBroadcaster, KapacitorResponse };
