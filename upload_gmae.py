from fastapi import FastAPI, UploadFile, File, Response, Header
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import shutil
import hashlib
import base64
import mimetypes
import datetime

app = FastAPI()

# 允许跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 指定允许的前端域
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# 上传目录
UPLOAD_DIR = "static/roms"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

# 计算文件 MD5
async def calculate_md5(filepath: str) -> str:
    hash_md5 = hashlib.md5()
    async with aiofiles.open(filepath, "rb") as f:
        while chunk := await f.read(8192):
            hash_md5.update(chunk)
    return base64.b64encode(hash_md5.digest()).decode()

# 转换时间戳为 HTTP 日期格式
def format_http_date(timestamp: float) -> str:
    return datetime.datetime.utcfromtimestamp(timestamp).strftime("%a, %d %b %Y %H:%M:%S GMT")

# 📌 文件上传接口
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # 使用原始文件名
    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # 保存文件，如果存在同名文件则直接覆盖
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"/static/roms/{filename}"
    return {"filename": filename, "url": file_url}

# 📌 文件下载接口
@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        return Response(status_code=404, content="File not found")

    file_size = os.path.getsize(file_path)
    mime_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
    last_modified = format_http_date(os.path.getmtime(file_path))
    etag = f"\"{await calculate_md5(file_path)}\""

    async def file_iterator():
        async with aiofiles.open(file_path, "rb") as f:
            content = await f.read()
            yield content

    headers = {
        "Content-Type": "application/zip" if filename.endswith('.zip') else mime_type,
        "Content-Length": str(file_size),
        "Last-Modified": last_modified,
        "ETag": etag,
        "Cache-Control": "public, max-age=31536000",
        "Accept-Ranges": "bytes",
        "Content-Disposition": f'inline; filename="{filename}"; filename*=utf-8{filename}',
        "Content-Transfer-Encoding": "binary",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Expose-Headers": "*",
        "Vary": "Origin",
        "x-log": "X-Log",
        "x-m-log": "QNM:cdn-cache-dls-gddg1-dg-4;QNM3:29",
        "x-m-reqid": "JpDePW9EL",
        "x-qiniu-zone": "0",
        "x-qnm-cache": "Hit",
        "x-reqid": "yrQAAABrZ7WBKCcY",
        "x-svr": "IO",

    }

    return StreamingResponse(file_iterator(), headers=headers)

# 启动 FastAPI
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=7276, root_path="game")
