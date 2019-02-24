import { UdpInfluxBroadcaster} from '../broadcasters/UdpInfluxBroadcaster';
import { BroadcastStatus } from '../BroadcastStatus';
import { empty } from 'rxjs';
import { isMainThread } from 'worker_threads';


describe('UdpInfluxBroadcaster', () => {
  it('returns an empty observable when no items are sent', () => {
    var observable = new UdpInfluxBroadcaster('127.0.0.1', 4095).send([]);

    expect(observable).toBe(empty());
  });

  it('send the message as expected', done => {
    new UdpInfluxBroadcaster('127.0.0.1', 4095).send(['a','b','c'])
      .subscribe(x => {
        expect(x.broadcastStatus).toBe(BroadcastStatus.Success);
        done();
      } e => {
        expect(1).toBe(2);
        done();
      });
  });

  it('send the broken message', done => {
    new UdpInfluxBroadcaster('243.213.123.111.123', 4095).send(['a','b','c'])
      .subscribe(x => {
        expect(1).toBe(2); // we should never get here, so this line should never execute
        done();
      } e => {
        console.log(e);
        expect(e.broadcastStatus).toBe(BroadcastStatus.Failure);
        done();
      });
  });
})