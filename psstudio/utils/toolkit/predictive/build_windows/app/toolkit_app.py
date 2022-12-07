try:
    import predictsense
except Exception as e:
    import sys, os

    sys.path.append(
        "/usr/local/lib/python3.7/site-packages/predictsense-0.1-py3.7.egg/modules")
    import predictsense

import json
import logging
import warnings

from flask import Flask, request, jsonify, render_template

warnings.filterwarnings(action='ignore', category=DeprecationWarning)
from modules.ps_util import Toolkit

logger = logging.getLogger('PredictSense Toolkit')
logging.basicConfig(level=logging.DEBUG)
# logging.basicConfig(level=logging.DEBUG, filename='toolkit_app.log',
# filemode='w')

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


@app.route('/')
def render_ui():
    return render_template('index.html')


@app.route('/api/upload_file', methods=['POST'])
def upload_file():
    file = request.files['file']
    from modules import ps_util
    try:
        ps_util.upload_file(file)
        return 'File has been uploaded'
    except Exception as e:
        logger.exception('error at uploading file: {}'.format(e))
        return None


@app.route('/api/prediction', methods=['POST', 'GET'])
def perform_prediction():
    prediction_data = request.get_json()

    logger.info('Prediction data: {}'.format(prediction_data))

    try:
        with open('config.json', 'r') as con:
            config = json.load(con)
    except FileNotFoundError:
        # logger.exception('Config file does not exist: {}'.format(e))
        return 'Config file does not exist'

    # reading metadata
    try:
        with open(config['metaDataFilePath'], 'r', encoding="utf-8") as meta:
            metadata = json.load(meta)
    except FileNotFoundError:
        # logger.exception('Metadata file does not exist: {}'.format(e))
        return 'Metadata file does not exist'

    prediction_obj = dict(
        logger=logger,
        metadata=metadata,
        config=config
    )

    reponse = Toolkit(prediction_obj).get_prediction(prediction_data)

    if isinstance(reponse, str):
        return jsonify(
            {
                "Status": "Failed",
                "Message": "{}".format(reponse)
            }), 400
    else:
        return jsonify(
            {
                "Status": "Success",
                "Message": "Prediction has been completed",
                "Results": reponse
            })


# #Retraining API
@app.route('/api/retraining', methods=['POST'])
def perform_retraining():
    retraining_data = request.get_json()
    logger.info('Retraining Data: {}'.format(retraining_data))

    try:
        with open('config.json', 'r') as con:
            config = json.load(con)
    except FileNotFoundError:
        return 'Config file does not exist'

    # reading metadata
    try:
        with open(config['metaDataFilePath'], 'r', encoding="utf-8") as meta:
            metadata = json.load(meta)
    except FileNotFoundError:
        return 'Metadata file does not exist'

    retraining_obj = dict(
        logger=logger,
        metadata=metadata,
        config=config
    )
    performance_metrics, status, message = Toolkit(
        retraining_obj).retrain_model(retraining_data)

    if status.lower() == 'success':
        return jsonify(performanceMetrics=performance_metrics, status=status,
                       message=message)
    else:
        return jsonify(performanceMetrics=performance_metrics, status=status,
                       message=message), 400


if __name__ == '__main__':
    logger.info(
        '********PredictSense Toolkit is ready...********')
    host = '0.0.0.0'
    port = 5005
    logger.info(
        '********Toolkit running on Host={} and Port={}********'.format(host,
                                                                        port))
    logger.warning(
        '********Please mention the file encoding while passing the filepath.********')

    app.run(host=host, port=port, debug=False)
