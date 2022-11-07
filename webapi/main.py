from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import boto3

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

# Receives audio from front end 
@app.post("/upload_audio")
def upload_audio(file_name : str):

  bucket_name = "dalanggatheringbucket"

  client_s3.download_file(bucket_name, file_name, os.path.join("./saved_audio", file_name))
 


