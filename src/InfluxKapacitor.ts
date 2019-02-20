import { InfluxBroadcaster } from './InfluxBroadcaster';
import { InfluxKapacitorWriter } from './InfluxKapacitorWriter';
import { InsulatorImpl } from './InsulatorImpl';
import { TimestampScalingFactor } from './TimestampScalingFactor';


class InfluxKapacitor {
  public static timestampScalingFactor: TimestampScalingFactor = TimestampScalingFactor.UnixTimestamp;

  public static defaultBroadcaster?: InfluxBroadcaster;
  public static default?: InfluxKapacitorWriter;
  public static add(pipe: InfluxBroadcaster, broadcastInterval: number = 5000) {
    InfluxKapacitor.defaultBroadcaster = pipe;
    InfluxKapacitor.default = new InsulatorImpl(pipe, broadcastInterval, InfluxKapacitor.notificationCaller, InfluxKapacitor.exitCaller).writer;
  }


  public static setNotificationCallback(callback: (content: any, success: boolean) => void) {
    InfluxKapacitor.notificationCallback = callback;
  }

  public static setExitCallback(callback: () => void) {
    this.exitCallback = callback;
  }

  public static exitCaller(): void {
    if (!(InfluxKapacitor.exitCallback == null)) {
      InfluxKapacitor.exitCallback();
    }
  }

  public static notificationCaller(content: any, success: boolean): void {
    if (!(InfluxKapacitor.notificationCallback == null)) {
      InfluxKapacitor.notificationCallback(content, success);
    }
  }

  private static notificationCallback: (content: any, success: boolean) => void;
  private static exitCallback: () => void;
}

export { InfluxKapacitor }