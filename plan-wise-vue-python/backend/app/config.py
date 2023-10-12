import os
import base64
from dotenv import load_dotenv

load_dotenv()

# Database env variables
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", default="127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", default=5432))
DB_SSL = os.getenv("DB_SSL", "")
SECRET_KEY = os.getenv("SECRET_KEY")
DB_URL=""
if DB_SSL != "":
    decoded = base64.b64decode(DB_SSL)
    output_file = open("server-ca.pem", "wb")
    output_file.write(decoded)
    output_file.close()
    DB_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=verify-ca&sslrootcert=server-ca.pem"
else:
    DB_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"