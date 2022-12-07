import logging
import pickle
import warnings

from flask import Flask, request, jsonify, render_template

warnings.filterwarnings(action='ignore', category=DeprecationWarning)
import json
from operation import Operation

logger = logging.getLogger('PredictSense Toolkit')
logging.basicConfig(level=logging.DEBUG)
# logging.basicConfig(level=logging.DEBUG, filename='toolkit_app.log',
# filemode='w')

from tensorflow.keras.models import load_model

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


@app.route('/')
def render_ui():
    return render_template('index.html')


@app.route('/api/prediction', methods=['POST', 'GET'])
def toolkit_prediction():
    api_data = request.get_json()
    logger.debug('Reading data from api {}'.format(api_data))

    try:
        with open('config.json', 'r') as con:
            config = json.load(con)
        metadata_filepath = config['metaDataFilePath']
        model_filepath = config['modelFilePath']
        target_inverse_filepath = config['targetInverseFilePath']
        nlp_pipeline_filepath = config['trainPipeFilePath']
        scalar_obj_filepath = config['scalerObjFilePath']
        decomposition_obj_filepath = config['decompostionObjFilePath']
        normalization_obj_filepath = config['normalizationObjFilePath']
        feature_filepath = config['featureListFilePath']
    except FileNotFoundError as e:
        logger.exception('Config file does not exist: {}'.format(e))
        # return('Config file does not exist, please place the Config file.')
        return jsonify({
            "Status": "Failed",
            "Message": "Config file does not exist, please place the config file."}), 400

    # reading metadata for imputation
    try:
        with open(metadata_filepath, 'r') as meta:
            metadata = json.load(meta)
        imputation_strategy = metadata['edaStrategies']
        training_columns = metadata['indepVariable']
        target_variable = metadata['depVariable']
        algorithm = metadata['algorithm']
        problem_type = metadata['problemType']
        project_id = metadata['projectId']
        model_id = metadata['modelId']
        training_id = metadata['trainingId']

        logger.debug('Trained Model {}'.format(algorithm))

        if 'multilabelClassNames' in metadata.keys():
            multilabel_classess = metadata['multilabelClassNames']
        else:
            multilabel_classess = None

    except FileNotFoundError as e:
        logger.exception('Metadata file does not exist: {}'.format(e))
        # return ('Metadata file does not exist, please place the Metadata file.')
        return jsonify({
            "Status": "Failed",
            "Message": "Metadata file does not exist, please place the metadata file."
        }), 400

    # reading model for prediction
    try:
        if algorithm in ['Artificial Neural Network Classification',
                         'Artificial Neural Network Regression']:
            model = load_model(model_filepath)
        else:
            model = pickle.load(open(model_filepath, 'rb'))
    except FileNotFoundError as e:
        logger.exception("Error in loading the model from config file", e)
        # return ('Model file does not exist, please place the Model file.')
        return jsonify({
            "Status": "Failed",
            "Message": "Model file does not exist, please place the model file."
        }), 400

    # reading feature list for prediction
    try:
        feature_list = pickle.load(open(feature_filepath, 'rb'))
    except FileNotFoundError as e:
        logger.exception("Error in loading the feature list from config "
                         "file", e)
        # return ('Model file does not exist, please place the Model file.')
        return jsonify({
            "Status": "Failed",
            "Message": "Feature list file does not exist, please "
                       "place the feature file."
        }), 400

    # reading scalar object for prediction
    try:
        if scalar_obj_filepath is not None:
            scalar_obj = pickle.load(open(scalar_obj_filepath, 'rb'))
        else:
            scalar_obj = None
    except FileNotFoundError as e:
        logger.exception(
            "Error in loading the standard object from config file", e)
        # return ('Model file does not exist, please place the Model file.')
        return jsonify({
            "Status": "Failed",
            "Message": "Standard scalar file does not exist,"
                       " please place the scalar object file."
        }), 400

    # reading normalization object for prediction
    try:
        if normalization_obj_filepath is not None:
            normalization_obj = pickle.load(
                open(normalization_obj_filepath, 'rb'))
        else:
            normalization_obj = None
    except FileNotFoundError as e:
        logger.exception(
            "Error in loading the normalization object from config file", e)
        # return ('Model file does not exist, please place the Model file.')
        return jsonify({
            "Status": "Failed",
            "Message": "normalization file does not exist,"
                       " please place the normalization object file."
        }), 400

    try:
        if decomposition_obj_filepath is not None:
            decomposition_obj = pickle.load(
                open(decomposition_obj_filepath, 'rb'))
        else:
            decomposition_obj = None
    except FileNotFoundError as e:
        logger.exception(
            "Error in loading the decomposition object from config file", e)
        # return ('Model file does not exist, please place the Model file.')
        return jsonify({
            "Status": "Failed",
            "Message": "decomposition file does not exist,"
                       " please place the decomposition object file."
        }), 400

    # reading pipeline object for nlp
    if problem_type == 'NLP':
        try:
            nlp_pipeline = pickle.load(open(nlp_pipeline_filepath, 'rb'))
        except Exception as e:
            logger.exception("Error in loading the pipeline from config file",
                             e)
            return jsonify({
                "Status": "Failed",
                "Message": "Pipeline file does not exist,"
                           " please place the pipeline file."
            }), 400
    else:
        nlp_pipeline = None

    # reading target inverse object
    if target_inverse_filepath is not None:
        target_inverse = pickle.load(open(target_inverse_filepath, 'rb'))
    else:
        target_inverse = None

    result = Operation(logger, project_id, training_id, model_id, model,
                       scalar_obj, normalization_obj, decomposition_obj,
                       target_variable, target_inverse, algorithm,
                       imputation_strategy, training_columns, feature_list,
                       multilabel_classess=multilabel_classess,
                       nlp_pipeline=nlp_pipeline).read_data(api_data)

    if type(result) == str:
        return jsonify(
            {
                "Status": "Failed",
                "Message": "{}".format(result)
            }), 400
    else:
        return jsonify(
            {
                "Status": "Success",
                "Message": "Prediction has been completed",
                "Results": result
            })


if __name__ == '__main__':
    logger.info(
        '********PredictSense Toolkit is ready...********')
    host = '0.0.0.0'
    port = 5005
    logger.info(' * Toolkit running on Host={} and Port={}'.format(host,
                                                                   port))
    logger.warning(
        'Please mention the file encoding while passing the filepath.')

    app.run(host=host, port=port, debug=False)
