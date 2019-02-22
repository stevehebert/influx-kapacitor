import request = require('request');
import { empty, from, Observable } from 'rxjs';
import { BroadcastStatus } from './BroadcastStatus';
import { InfluxBroadcaster } from './InfluxBroadcaster';
import { KapacitorResponse } from './KapacitorResponse';

class HttpInfluxBroadcaster implements InfluxBroadcaster {
  public static combine_lines(lines: string[]): string {
    return lines.join('\n');
  }
  
  public url: string;

  constructor(url: string) {
    this.url = url;
  }

  public send(lines: string[]): Observable<KapacitorResponse> {
    if(lines.length === 0) {
      return empty();
    }

    const options = {
      body: HttpInfluxBroadcaster.combine_lines(lines),
      encoding: null,
      method: 'POST',
      url: this.url,
    };

    const response: Observable<KapacitorResponse> = from(new Promise<KapacitorResponse>((resolve, reject) => {
      request(options, (error: any, r1: any, body: any) => {
        if(error) {
          if( error.statusCode === undefined) {
            reject(new KapacitorResponse(BroadcastStatus.Unreachable, error));
          } else {
            reject(new KapacitorResponse(BroadcastStatus.Failure, error, error.statusCode));
          }
        } else {
          resolve(new KapacitorResponse(BroadcastStatus.Success, r1, r1.statusCode));
        }
      });
    }));

    return response;
  }
}

export { HttpInfluxBroadcaster, KapacitorResponse }
