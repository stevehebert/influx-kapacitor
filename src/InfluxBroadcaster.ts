interface InfluxBroadcaster {
  hash_value(): string;
  send(lines: string[]): any;
}

export { InfluxBroadcaster };
