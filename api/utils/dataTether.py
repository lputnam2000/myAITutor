import os
import redis
import json

redisClient = None

def getRedisClient():
    global redisClient
    if redisClient == None:
        redisClient=redis.Redis(host=os.getenv('REDIS_HOST'), port=os.getenv('REDIS_PORT'), db=os.getenv('REDIS_DB'), password=os.getenv('REDIS_PASSWORD'))
    return redisClient

def pushMessageToUser(userid, content):
    redisClient = getRedisClient()
    data = {"userid": str(userid), "content": str(content)} #should be json
    json_data = json.dumps(data)
    redisClient.publish('push_to_user', bytes(json_data, encoding='utf-8'))