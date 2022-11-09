from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import boto3
from os import walk
from pydantic import BaseModel
from resemblyzer import VoiceEncoder, preprocess_wav
from pathlib import Path
import numpy as np

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

def compare_sound(path1, path2):
  print(path1)
  print(path2)

  fpath1 = Path(path1)
  wav1 = preprocess_wav(fpath1)

  fpath2 = Path(path2)
  wav2 = preprocess_wav(fpath2)

  encoder = VoiceEncoder()
  embed1 = encoder.embed_speaker(wav1)
  embed2 = encoder.embed_speaker(wav2)

  spk_sim_matrix = np.inner(embed1, embed2)
  
  return spk_sim_matrix
  

@app.post("/check-similarity")
def check_audio_sim(file : fileInfo):

  bucket_name = "dalanggatheringbucket"

  # # download user audio 
  client_s3.download_file(bucket_name, file.audio, os.path.join("./user_audio", file.audio))
  
  # # download main audio 
  # client_s3.download_file(bucket_name, file.audio, os.path.join("./user_audio", file.audio))
  path1 = Path("./user_audio/{}".format(file.audio))
  path2 = Path("../audio/Sentences/{}".format(file.audio))

  result = compare_sound(path1, path2)

  
  # client_s3.download_file(bucket_name, file_name, os.path.join("./saved_audio", file_name))
  return file.audio


