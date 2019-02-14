import { InfluxBroadcaster } from './InfluxBroadcaster';
import { InfluxKapacitorWriter } from './InfluxKapacitorWriter';
import { InsulatorImpl } from './InsulatorImpl';


class InfluxKapacitor {

  public static default?: InfluxKapacitorWriter;
  public static add(pipe: InfluxBroadcaster, broadcastInterval: number = 5000) {
    InfluxKapacitor.default = new InsulatorImpl(pipe, broadcastInterval, InfluxKapacitor.notificationCallback, InfluxKapacitor.exitCallback).writer;
  }

  public static setNotificationCallback(callback: (content: any, success: boolean) => void) {
    InfluxKapacitor.notificationCallback = callback;
  }

  public static setExitCallback(callback: () => void) {
    this.exitCallback = callback;
  }

  private static notificationCallback: (content: any, success: boolean) => void;
  private static exitCallback: () => void;

  private static notificationCaller(content: any, success: boolean): void {
    if (InfluxKapacitor.notificationCallback !== null) {
      InfluxKapacitor.notificationCallback(content, success);
    }
  }
  
  private static exitCaller(): void {
    if (InfluxKapacitor.exitCallback !== null) {
      InfluxKapacitor.exitCallback();
    }
  }
}

export { InfluxKapacitor }