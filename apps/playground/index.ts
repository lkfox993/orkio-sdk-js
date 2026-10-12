import { Client } from "@orkio/sdk";
import { PulsarTransport } from "@orkio/transport-pulsar"
import Pulsar from 'pulsar-client'

const client = new Pulsar.Client({
  serviceUrl: 'pulsar://localhost:6650',
});

console.log(PulsarTransport)

// const transport = new PulsarTransport(client);


// // const orkio = new Client({
// //   baseUrl: "https://orkio.example.com",
// //   transport,
// // });