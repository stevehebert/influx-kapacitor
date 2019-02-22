interface InfluxBroadcaster {
  send(lines: string[]): any;
}

export { InfluxBroadcaster };
