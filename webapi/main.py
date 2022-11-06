from fastapi import FastAPI, UploadFile, File
import os
import wave
import shutil

app = FastAPI() 

@app.get("/")
def default():
  return {"status" : "working"} 

@app.get("/about")
def about():
  return {
    "about" : "This api helps to compare two voices passed from frontend"
  }

@app.post("/upload")
async def upload(file : UploadFile = File(...)):
  try:
    with open("./saved_audio/{}".format(file.filename), "wb") as buffer:
      shutil.copyfileobj(file.file, buffer)
  finally:
        file.file.close()
  return file.filename