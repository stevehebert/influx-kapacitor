import request = require('request');
import { InfluxBroadcaster } from './InfluxBroadcaster';

class HttpInfluxBroadcaster implements InfluxBroadcaster {
  public static combine_lines(lines: string[]): string {
    return lines.join('\n');
  }
  
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public hash_value(): string {
    return `http::${this.url}`;
  }

  public send(lines: string[]): string[] {
    
    if(lines.length === 0) {
      return [];
    }

    request({
      body: HttpInfluxBroadcaster.combine_lines(lines),
      encoding: null,
      method: 'POST',
      url: this.url,
    }, (error, response, body) => {
      if (error) {
        // console.log('HttpKapacitor: ', error);
      }
      else {
        // console.log(`metric write success ${response.statusCode}`);
      }
    });

    return lines;
  }
}

export { HttpInfluxBroadcaster }
