FROM python:3.10
WORKDIR /app
RUN apt-get update && apt-get install -y libgl1-mesa-glx
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8082"]