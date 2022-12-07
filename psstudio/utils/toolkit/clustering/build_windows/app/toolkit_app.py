try:
    import predictsense
except:
    import sys

    sys.path.append(
        "/usr/local/lib/python3.7/site-packages/predictsense-0.1-py3.7.egg"
        "/modules")
    import predictsense

import json
import logging
import warnings

from flask import Flask, request, jsonify, render_template

warnings.filterwarnings(action='ignore', category=DeprecationWarning)
from modules.ps_util import GetPrediction

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
    print('file', file)
    from modules import ps_util

    try:
        response = ps_util.upload_file(file)
        import lxml.html
        if isinstance(response, str):
            if not lxml.html.fromstring(response).find('.//*') is not None:
                return jsonify(
                    {
                        "Status": "Failed",
                        "Message": "{}".format(response),
                        "Results": '<h4 style="color:red">' +\
                             response + '</h4>'
                    }), 400
            else:
                return jsonify(
                    {
                        "Status": "Success",
                        "Message": "Prediction has been completed",
                        "Results": response
                    })
        else:
            return jsonify(
                {
                    "Status": "Success",
                    "Message": "Prediction has been completed",
                    "Results": response
                })

    except Exception as e:
        logger.exception('error at uploading file: {}'.format(e))
        return None

@app.route('/api/prediction', methods=['POST', 'GET'])
def perform_prediction():
    prediction_data = request.get_json()

    result_type = request.args.get('result')

    logger.info('Prediction data: {}'.format(prediction_data))

    try:
        with open('config.json', 'r') as con:
            config = json.load(con)
    except FileNotFoundError as e:
        # logger.exception('Config file does not exist: {}'.format(e))
        return 'Config file does not exist'

    # reading metadata for imputation
    try:
        with open(config['metaDataFilePath'], 'r', encoding="utf-8") as meta:
            metadata = json.load(meta)
    except FileNotFoundError as e:
        # logger.exception('Metadata file does not exist: {}'.format(e))
        return 'Metadata file does not exist'

    prediction_obj = dict(
        logger=logger,
        metadata=metadata,
        config=config,
        resultType=result_type
    )

    response = GetPrediction(prediction_obj).get_prediction(prediction_data)

    if isinstance(response, str):
        return jsonify(
            {
                "Status": "Failed",
                "Message": "{}".format(response),
                "Results": '<h4 style="color:red">' + response + '</h4>'
            }), 400
    else:
        return jsonify(
            {
                "Status": "Success",
                "Message": "Prediction has been completed",
                "Results": response
            })


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
