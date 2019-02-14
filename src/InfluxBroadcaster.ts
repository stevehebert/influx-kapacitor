interface InfluxBroadcaster {
  hash_value(): string;
  send(lines: string[]): void;
}

export { InfluxBroadcaster };
