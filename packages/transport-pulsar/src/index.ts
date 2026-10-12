import type { Transport, Subscription, MessageAcknowledger, SubscribeOptions } from "@orkio/sdk";
import { Client, Consumer } from 'pulsar-client'

export class PulsarTransport implements Transport {

    private readonly consumers = new Set<Consumer>();
    private readonly subscriptions = new Set<Subscription>();

    constructor(private readonly client: Client) { }

    async publish(topic: string, message: unknown): Promise<void> {
        // Реализация публикации через Pulsar
    }

    async subscribe(opts: SubscribeOptions): Promise<Subscription> {

        const consumer = await this.client.subscribe({
            topic: `persistent://public/default/${opts.taskType}`,
            subscription: "orkio-workers",
            subscriptionType: "Shared",
        });

        this.consumers.add(consumer);

        let stopped = false;

        const subscription: Subscription = {
            close: async () => {
                
                stopped = true;

                this.subscriptions.delete(subscription);
                this.consumers.delete(consumer);

                await consumer.close();
            },
        };

        void (async () => {
            while (!stopped) {
                let message;

                try {
                    message = await consumer.receive();

                    if (stopped) {
                        consumer.negativeAcknowledge(message);
                        break;
                    }

                    const payload: unknown = JSON.parse(
                        message.getData().toString(),
                    );

                    let settled = false;

                    const acknowledger: MessageAcknowledger = {
                        ack: async () => {
                            if (settled) return;

                            consumer.acknowledge(message!);
                            settled = true;
                        },

                        nack: async () => {
                            if (settled) return;

                            consumer.negativeAcknowledge(message!);
                            settled = true;
                        },
                    };

                    await opts.handler(payload, acknowledger);

                } catch (error) {
                    if (stopped) break;

                    console.error("Task processing failed:", error);

                    if (message) {
                        consumer.negativeAcknowledge(message);
                    }
                }
            }
        })();

        return subscription;
        // Реализация подписки через Pulsar
    }

    async close(): Promise<void> {
        await Promise.all(
            [...this.subscriptions].map((subscription) => subscription.close()),
        );
    }
}