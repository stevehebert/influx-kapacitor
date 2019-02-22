import { HttpInfluxBroadcaster } from '../HttpInfluxBroadcaster';
import { InfluxKapacitor } from '../InfluxKapacitor';
import { InfluxKapacitorWriter } from '../InfluxKapacitorWriter';


describe('InfluxKapacitor', () => {
  it('adds a broadcaster', () => {
    InfluxKapacitor.add(new HttpInfluxBroadcaster('http://localhost:8086'),0);

    expect(InfluxKapacitor.default).not.toBeNull();
    expect(InfluxKapacitor.defaultBroadcaster).not.toBeNull();
  })

  it('communicates over the exit callback', () => {
    let value = 0;
    
    InfluxKapacitor.setExitCallback(() => {
      value += 1;
    });

    InfluxKapacitor.exitCaller();

    expect(value).toBe(1);
  });

  it('properly clears the exit callback', () => {
    let value = 0;

    InfluxKapacitor.setExitCallback(() => {
      value += 1;
    });

    InfluxKapacitor.exitCaller();
    InfluxKapacitor.exitCaller();

    InfluxKapacitor.setExitCallback(null);

    InfluxKapacitor.exitCaller();
    expect(value).toBe(2);
  });

  it('properly clears the exit callback with undefined', () => {
    let value = 0;

    InfluxKapacitor.setExitCallback(() => {
      value += 1;
    });

    InfluxKapacitor.exitCaller();
    InfluxKapacitor.exitCaller();

    InfluxKapacitor.setExitCallback(undefined);

    InfluxKapacitor.exitCaller();
    expect(value).toBe(2);
  });

  it('communicates over the notification callback', () => {
    let value = 0;

    InfluxKapacitor.setNotificationCallback(() => {
      value += 1;
    });

    InfluxKapacitor.notificationCaller(null, null);

    expect(value).toBe(1);
  });

  it('properly clears the notification callback', () => {
    let value = 0;

    InfluxKapacitor.setNotificationCallback(() => {
      value += 1;
    });

    InfluxKapacitor.notificationCaller(null, null);
    InfluxKapacitor.notificationCaller(null, null);

    InfluxKapacitor.setNotificationCallback(null);

    InfluxKapacitor.notificationCaller(null, null);
    expect(value).toBe(2);
  });

  it('properly clears the notification callback with undefined', () => {
    let value = 0;

    InfluxKapacitor.setNotificationCallback(() => {
      value += 1;
    });

    InfluxKapacitor.notificationCaller(null, null);
    InfluxKapacitor.notificationCaller(null, null);

    InfluxKapacitor.setNotificationCallback(undefined);

    InfluxKapacitor.notificationCaller(null, null);
    expect(value).toBe(2);
  });
});