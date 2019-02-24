import * as net from 'net';
import { empty } from 'rxjs';
import { TcpInfluxBroadcaster } from '../broadcasters/TcpInfluxBroadcaster';
import { BroadcastStatus } from '../BroadcastStatus';
import { isMainThread } from 'worker_threads';

describe('TcpInfluxBroadcaster', () => {
  it('writes to properly open socket', done => {
    var server = net.createServer(function(socket) {
      socket.write('Echo server\r\n');
      socket.pipe(socket);
    });

    server.listen(5060, '127.0.0.1');

    const b = new TcpInfluxBroadcaster('127.0.0.1', 5060);
    b.send(['a', 'b', 'c']).subscribe(x => {
      server.close();
      expect(x.broadcastStatus).toBe(BroadcastStatus.Success);
      expect(x.statusCode).toBe(200);

      done();
    });
  });

  it('short-circuits on empty array', () => {
    const b = new TcpInfluxBroadcaster('127.0.0.1', 5070);
    expect(b.send([])).toBe(empty());
  });

  it('errors on missing server', done => {
    const b = new TcpInfluxBroadcaster('127.0.0.1', 5070);

    b.send(['a', 'b', 'c']).subscribe(
      x => {
        expect(1).toBe(2);
        done();
      },
      e => {
        expect(e.broadcastStatus).toBe(BroadcastStatus.Unreachable);
        done();
      },
    );
  });
});
