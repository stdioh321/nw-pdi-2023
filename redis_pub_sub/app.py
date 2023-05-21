import redis
import sys
import time

from redis_subscriber import RedisSubscriber

if len(sys.argv) < 2:
    print('Deve passar o nome do canal (Ex: nome_canal)')
    sys.exit(1)

channel = sys.argv[1]

def connect_redis():
    try:
      redis_client = redis.Redis(host='0.0.0.0', port=6379)
    except:
        print('Falha ao conectar no Redis')
        sys.exit(1)
    return redis_client


def publish_message(channel, message):
    redis_client.publish(channel, message)

redis_client = connect_redis()

if __name__ == '__main__':
    subscriber = RedisSubscriber(redis_client, channel)
    subscriber.start()

    while True:
        user_input = input(f"Entre com a mensagem para o canal: {channel} ('exit' para sair): ")

        if user_input == 'exit':
            break
        publish_message(channel, user_input)
        time.sleep(1)

    subscriber.pubsub.unsubscribe()
    subscriber.join()
