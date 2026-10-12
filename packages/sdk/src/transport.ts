import { Job } from './job.js'

export interface MessageAcknowledger {
  ack(): Promise<void>;
  nack(): Promise<void>;
}

export interface Subscription {
  close(): Promise<void>;
}

export interface SubscribeOptions {
  taskType: string;
  handler: (message: unknown, acknowledger: MessageAcknowledger) => Promise<void>;
}

export interface Transport {
    publish(topic: string, message: unknown): Promise<void>;
    subscribe(opts: SubscribeOptions): Promise<Subscription>;
    close(): Promise<void>;
}