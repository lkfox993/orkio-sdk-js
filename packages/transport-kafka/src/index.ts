import type { Transport } from "@orkio/sdk";

export class KafkaTransport implements Transport {

  async publish(topic: string, message: unknown): Promise<void> {
    // Реализация публикации через Kafka
  }

  async subscribe(opts: {
    taskType: string;
    handler: (message: unknown) => Promise<void>;
  }): Promise<void> {
    // Реализация подписки через Kafka
  }

  async close(): Promise<void> {
    // Закрытие Pulsar-клиента
  }
}