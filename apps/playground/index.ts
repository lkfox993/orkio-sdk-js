import { Client } from "@orkio/sdk";
import { PulsarTransport } from "@orkio/transport-pulsar"
import Pulsar from 'pulsar-client'

const client = new Pulsar.Client({
  serviceUrl: 'pulsar://localhost:6650',
});

const transport = new PulsarTransport(client);

const orkio = new Client({
  baseUrl: "http://localhost:3232",
  transport,
});

const start = async () => {

  const worker = await orkio.createWorker({
    taskType: 'hello',
    async handler(job) {
        console.log('------->', job);
    },
  });

  const producer = await client.createProducer({
    topic: 'persistent://public/default/hello', // or 'my-tenant/my-namespace/my-topic' to specify topic's tenant and namespace
  });

  setTimeout(async () => {
    const id = await producer.send({
      data: Buffer.from("Hello, Pulsar"),
    });

    console.log(id);

  }, 2000);


}

start();
