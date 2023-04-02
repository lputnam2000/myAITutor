import os
from dotenv import load_dotenv

load_dotenv()
class Config:
    SECRET_KEY =  os.environ.get("SECRET_KEY")
    REDIS_HOST = os.environ.get("REDIS_HOST")
    REDIS_PORT =os.environ.get("REDIS_PORT")
    REDIS_DB =os.environ.get("REDIS_DB")
    REDIS_PASSWORD= os.environ.get("REDIS_PASSWORD")
