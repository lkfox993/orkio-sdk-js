
import { Client } from './client.js'

export interface JobOptions<TVariables> {
    id: string;
    taskType: string;
    variables: TVariables;
}

export class Job<TVariables = unknown>{

    readonly id: string;
    readonly taskType: string;
    readonly variables: TVariables;

    constructor(private readonly client: Client, options: JobOptions<TVariables>) {
        this.id = options.id;
        this.taskType = options.taskType;
        this.variables = options.variables;
    }

    async complete(result?: unknown): Promise<void> {

        const id = encodeURIComponent(this.id);

        await this.client.axios.post(`/jobs/${id}/complete`, {
            result
        });
    }

    async fail(error: Error): Promise<void> {

        const id = encodeURIComponent(this.id);

        await this.client.axios.post(`/jobs/${id}/fail`, {
            error: {
                message: error.message,
                name: error.name,
            },
        });
    }
}