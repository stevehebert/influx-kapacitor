// src/_tests__/HttpInfluxBroadcaster.test.ts

import { HttpInfluxBroadcaster } from '../HttpInfluxBroadcaster';
import { from } from 'rxjs';
import { BroadcastStatus } from '../BroadcastStatus';
import { KapacitorResponse } from '../KapacitorResponse';

describe('HttpInfluxCapacitor', () => {
  let Server = null;

  beforeAll(() => {
    let http = require('http');
    this.Server = http.createServer(function (req, res) {
      req.on('data', chunk => {
        // console.log('A chunk of data has arrived: ', chunk.toString('utf8'));
      });
      req.on('end', () => {
        // console.log('No more data');
      });
      // console.log('received the call', req.post);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello, World!\n');
    });
    this.Server.listen(8087);
    console.log('Server running on port 8087');
  });



  it('combines strings into a single linefeed delimited string', () => {
    const output = HttpInfluxBroadcaster.combine_lines(["a", "b", "c"]);
    expect(output).toBe('a\nb\nc');
  });


  it('writes', (done) => {
    const b = new HttpInfluxBroadcaster('http://localhost:8087/write');
    b.send(["a", "b", "c"])
      .subscribe(x => {
        expect(x.broadcastStatus).toBe(BroadcastStatus.Success);
        expect(x.statusCode).toBe(200);
        done();
      })
  });

  it('errors correctly when not being listened to', done => {
    const b = new HttpInfluxBroadcaster('http://localhost:8088/write');
    b.send(["a", "b", "c"])
      .subscribe(x => {
        expect(x.broadcastStatus).toBe(11);  // ensure this breaks because we should never have a listener on 8088
        done();
      }, e => {
        expect(e.broadcastStatus).toBe(BroadcastStatus.Unreachable);
        done();
      });
  });

  it('returns an empty observable when no items are sent', done => {
    new HttpInfluxBroadcaster('http://localhost:8088/write')
      .send([])
      .subscribe(x => {
        expect(1).toBe(2);
      }, e => {
        expect(1).toBe(2);
      }, () => {
        done();
      });
  });
});