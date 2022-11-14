import os
import shutil
import wave
from os import walk
from pathlib import Path

import boto3
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from resemblyzer import VoiceEncoder, preprocess_wav
import librosa 
from pydub import AudioSegment

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
  "http://localhost:8000",
  "http://localhost:3000"
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

  print(wav1)

  fpath2 = Path(path2)
  wav2 = preprocess_wav(fpath2)

  encoder = VoiceEncoder()
  embed1 = encoder.embed_speaker(wav1)
  embed2 = encoder.embed_speaker(wav2)

  spk_sim_matrix = np.inner(embed1, embed2)
  
  # return spk_sim_matrix
  
@app.post("/upload")
def upload(file: UploadFile = File(...)):
  
  print(file.filename)
  with open(f'user_audio/{file.filename}.mp3', "wb") as f:
    shutil.copyfileobj(file.file, f)

  

  # # download user audio 
  path_1 = Path("./user_audio/{}.mp3".format(file.filename))
  sound = AudioSegment.from_mp3(path_1)
  sound.export(Path("./user_audio/{}.wav".format(file.filename)), format="wav")
  # path1.as_posix()
  path_1_new = Path("./user_audio/{}.wav".format(file.filename))

  path_2 = Path("../audio/Sentences/{}.wav".format(file.filename))

  # print(wav1)
  wave_1 = preprocess_wav(path_1_new)
  wave_2 = preprocess_wav(path_2)


  encoder = VoiceEncoder()

  embed_1 = np.array(encoder.embed_utterance(wave_1))
  embed_2 = np.array(encoder.embed_utterance(wave_2))
  
  utt_sim = np.inner(embed_1, embed_2)
  result = str(round(utt_sim * 100))
  print(result)

  return {"Similarity" : result}


