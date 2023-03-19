const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()

const packageDefinition = protoLoader.loadSync(path.join(__dirname,'proto/yugioh.proto'),{
  keepCase: true,
  arrays: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).yugioh;
const client = new protoDescriptor.YuGiOhService(`${process.env.BASE_URL || 'localhost'}:${process.env.PORT || 50051}`,grpc.credentials.createInsecure(),{
  'grpc.max_receive_message_length': 1024 * 1024 * 50
});
const request = {
  searchQuery: process.argv.slice(2)
};

client.searchCards(request,(err,data) => {
  if (err) {
    console.log(err?.message);
    return
  }
  console.log(
    JSON.stringify(data,null,2)
  );
})