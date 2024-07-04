FROM python:3.13.0b2-slim
RUN apt-get update && \
    apt-get -y --no-install-recommends install \
    libgomp1
RUN mkdir -p /toolkit
WORKDIR /toolkit/
ADD requirements.txt /toolkit/
ADD app /toolkit/
RUN pip install -r requirements.txt
RUN python modules/setup.py install
CMD cd app
ENTRYPOINT ["python", "toolkit_app.py"]
