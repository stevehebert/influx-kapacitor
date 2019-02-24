export interface Insulator {
  send(value: string): string;
  shutdown(): void;
}
