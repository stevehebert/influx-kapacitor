import { BroadcastStatus } from './BroadcastStatus';

class KapacitorResponse {
  constructor(public broadcastStatus: BroadcastStatus, public errorDetails: any, public statusCode?: number) {}
}

export { KapacitorResponse };
