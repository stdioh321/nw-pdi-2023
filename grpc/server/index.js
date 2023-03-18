const dotenv = require('dotenv')
const grpc = require('@grpc/grpc-js');
dotenv.config()

const { grpcPackageDefinition,implementation } = require('./services/yugioh/yugioh-service')

const SERVER_URL = `0.0.0.0:${process.env.PORT || 50051}`;

const server = new grpc.Server();
server.addService(grpcPackageDefinition.yugioh.YuGiOhService.service,implementation);

server.bindAsync(SERVER_URL,grpc.ServerCredentials.createInsecure(),() => {
  server.start();
  console.log(`Server started at: ${SERVER_URL}`);
});
