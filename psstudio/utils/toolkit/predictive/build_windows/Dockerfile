FROM python:3.13.0a2-slim
RUN mkdir -p /toolkit
WORKDIR /toolkit/
ADD requirements.txt /toolkit/
ADD app /toolkit/
RUN pip install -r requirements.txt
RUN python modules/setup.py install
CMD cd app
ENTRYPOINT ["python", "toolkit_app.py"]
