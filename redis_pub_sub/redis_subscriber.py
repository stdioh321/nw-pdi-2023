import threading

class RedisSubscriber(threading.Thread):
    def __init__(self, redis_client, channel):
        threading.Thread.__init__(self)
        self.pubsub = redis_client.pubsub()
        self.pubsub.subscribe(channel)

    def run(self):
        for message in self.pubsub.listen():
            if message['type'] == 'message':
                print(f"\nMensagem: {message['data'].decode('utf-8')}")