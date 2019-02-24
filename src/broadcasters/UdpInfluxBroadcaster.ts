import * as dgram from 'dgram' 
import { empty, from, Observable } from 'rxjs';

import { BroadcastStatus } from '../BroadcastStatus';
import { KapacitorResponse } from "../KapacitorResponse";
import { BroadcasterUtilities } from "./BroadcasterUtilities";
import { InfluxBroadcaster } from "./InfluxBroadcaster";


enum DatagramType {
  udp4= "udp4",
  udp6= 'udp6'
}

class UdpInfluxBroadcaster implements InfluxBroadcaster {
  private client: dgram.Socket;
  constructor(private host: string, private port: number, private datagramType: DatagramType = DatagramType.udp4) {
    this.client = dgram.createSocket(this.datagramType);
  }

  public send(lines: string[]): Observable<KapacitorResponse> {
    if (lines.length === 0) {
      return empty();
    }

    const output = BroadcasterUtilities.combine_lines(lines);

    const response: Observable<KapacitorResponse> = from(
      new Promise<KapacitorResponse>((resolve, reject) => {

        this.client.send(output, this.port, this.host, (error, bytes) => {
          if(error) {
            reject(new KapacitorResponse(BroadcastStatus.Failure, error, 500));
          } else {
            resolve(new KapacitorResponse(BroadcastStatus.Success, bytes, 200));
          }
        });
      }));

    return response;
  }
}

export { UdpInfluxBroadcaster }