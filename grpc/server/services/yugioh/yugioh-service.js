const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { searchCards } = require('./yugioh-service-implementation');

const yugiohProtoPath = path.join(__dirname,'../../proto/yugioh.proto')
const packageDefinition = protoLoader.loadSync(yugiohProtoPath,{
  keepCase: true
});

const grpcPackageDefinition = grpc.loadPackageDefinition(packageDefinition);

const implementation = {
  searchCards: searchCards
};

module.exports = {
  grpcPackageDefinition: grpcPackageDefinition,
  implementation: implementation
}