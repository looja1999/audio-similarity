from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import boto3
from os import walk
from pydantic import BaseModel

# AWS Accesskey
access_key = "AKIAYVCSIYKQODE3HR7S"
access_secret = "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"
bucket_name = "dalanggathering-audiostorage"

client_s3 = boto3.client(service_name = 's3', aws_access_key_id=access_key, aws_secret_access_key=access_secret)

app = FastAPI() 

# CORS 
origins = [
  "http://localhost:8101", 
  "http://localhost:8100",
  "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def default():
  return {"status" : "working"} 

@app.get("/get-files")
def get_files():
  path = "../audio/Sentences"
  filenames = next(walk(path), (None, None, []))[2] 
  print(filenames)
  return {"file names" : filenames}


class fileInfo(BaseModel):
  audio : str



@app.post("/check-similarity")
def check_audio_sim(file : fileInfo):

  bucket_name = "dalanggatheringbucket"

  # # download user audio 
  client_s3.download_file(bucket_name, file.audio, os.path.join("./user_audio", file.audio))
  
  # # download main audio 
  # client_s3.download_file(bucket_name, file.audio, os.path.join("./user_audio", file.audio))
  
  
  # client_s3.download_file(bucket_name, file_name, os.path.join("./saved_audio", file_name))
  return file.audio


