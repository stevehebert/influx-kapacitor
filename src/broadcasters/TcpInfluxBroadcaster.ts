import * as net from 'net';
import { empty, from, Observable } from 'rxjs';

import { BroadcastStatus } from '../BroadcastStatus';
import { BroadcasterUtilities } from './BroadcasterUtilities';
import { KapacitorResponse } from './HttpInfluxBroadcaster';
import { InfluxBroadcaster } from './InfluxBroadcaster';

class TcpInfluxBroadcaster implements InfluxBroadcaster {
  private client = new net.Socket();
  constructor(private url: string, private port: number) {}

  public send(lines: string[]): any {
    if (lines.length === 0) {
      return empty();
    }

    const response: Observable<KapacitorResponse> = from(
      new Promise<KapacitorResponse>((resolve, reject) => {
        if (this.client.remoteAddress == null) {
          this.client.connect(this.port, this.url);
          this.client.on('error', error => {
            reject(new KapacitorResponse(BroadcastStatus.Unreachable, error, 500));
          });
        }

        this.client.write(BroadcasterUtilities.combine_lines(lines), undefined, (info: any) => {
          resolve(new KapacitorResponse(BroadcastStatus.Success, info, 200));
        });
      }),
    );

    return response;
  }
}

export { TcpInfluxBroadcaster };
