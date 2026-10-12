import axios, { AxiosInstance } from "axios";
import fs from "node:fs";
import FormData from "form-data";

import type { Transport, SubscribeOptions, Subscription } from './transport.js'
import type { CreateDeploymentResponse } from './types.js'
import { RegisterOptions, Worker } from "./worker.js";

export interface ClientOptions {
    baseUrl: string;
    transport: Transport;
}

export class Client {

    readonly opts: ClientOptions;
    readonly transport: Transport;
    readonly axios: AxiosInstance;

    constructor(opts: ClientOptions) {
        this.opts = opts;
        this.transport = opts.transport;
        this.axios = axios.create({
            baseURL: opts.baseUrl,
        });
    }

    /**
     * 
     * @param resources 
     * @returns 
     */
    async createDeployment(resources: string[]): Promise<CreateDeploymentResponse> {

        const formData = new FormData();

        for (const resource of resources) {        
            formData.append("resources", fs.createReadStream(resource));
        }

        const response = await this.axios.post<CreateDeploymentResponse>(
            "/deployments",
            formData,
            {
                headers: formData.getHeaders(),
            }
        );

        return response.data
    }

    /**
     * 
     * @param opts 
     * @returns 
     */
    createWorker(opts: RegisterOptions): Promise<Subscription> {
        const worker = new Worker(this, this.transport);
        return worker.register(opts)
    }

    async createProcessInstanceWithResult(){
        const response = await this.axios.post('/');
        return response.data
    }

}
