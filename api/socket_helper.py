from api.utils.dataTether import pushMessageToUser
import json


def send_update(user_id, channel, data):
    message = {
        'data': data,
        'channel': channel
    }

    message_str = json.dumps(message)
    print(f'SENDING UPDATE-{channel}: {message}')
    pushMessageToUser(user_id, message_str)