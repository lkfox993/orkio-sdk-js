
import type { Client } from "./client.js";
import { Job } from "./job.js";
import type { Transport, Subscription } from "./transport.js";

export interface RegisterOptions<TVariables = unknown> {
    taskType: string;
    handler: (job: Job<TVariables>) => Promise<void>;
}

export class Worker {

    constructor(
        private readonly client: Client,
        private readonly transport: Transport,
    ) { }

    async register<TVariables = unknown>(opts: RegisterOptions<TVariables>): Promise<Subscription> {
        return this.transport.subscribe({
            taskType: opts.taskType,
            handler: async (message, acknowledger) => {

                const job = this.createJob<TVariables>(message);

                try {

                    await opts.handler(job);
                    await acknowledger.ack();
                    
                } catch (error) {

                    acknowledger.nack();
                    throw error;
                }
            },
        });
    }

    private createJob<TVariables>(message: unknown): Job<TVariables> {

        // Здесь нужно валидировать и преобразовать
        // сообщение транспорта в данные Job.
        const payload = message as {
            id: string;
            taskType: string;
            variables: TVariables;
        };

        const job = new Job<TVariables>(this.client, payload)

        return job;
    }
}