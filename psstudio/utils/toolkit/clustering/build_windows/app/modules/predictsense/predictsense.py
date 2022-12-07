# -*- coding: utf-8 -*-
"""
Support script for jupyter notebok
@author: Priyanka Deshpande
"""

import json
import pandas as pd
import requests


class PredictSense:
    """
    PredictSense wrapper class. It provides functionality to access PredictSense APIs in Jupyter Notebooks.

    ...

    Attributes
    ----------
    None

    Methods
    -------
    list_uploaded_datasets(file_filter, file_source)
        Lists the uploaded datasets.

    pull_dataset(
        source, connection_setting, name, encoding='utf-8')
        Pulls the dataset from source.

    load_project_detailsays()
        Loads current project related details.

    load_pandas_dataframe(file_name)
        Read the file in to a pandas dataframe.

    save_data(df, file_name)
        Save the pandas dataframe.

    list_shared_features()
        Get a list of available shared features with descriptions.

    share_features(df, feature_list, index_list, email_addy, feature_name, aggregate_strategy='', file_name='some_file_name.pkl')
        Adds the features in the data-frame to the feature repository.

    get_shared_feature(shared_feature_name)
        Loads the features from the repo with the specified name.

    share_function(function_object, description, email_addy)
        Share the function with the specified email.

    get_shared_function(function_name)
        Loads the function from the repo with the specified name.
    """

    def __init__(self):
        self.__getdetails__ = None
        self.__baseUrl = "http://localhost:5000"
        self.__load = "/api/data/read"
        self.__listFeatures = "/api/feature_repo/notebook/list_shared_features"
        self.__shareFeatures = "/api/feature_repo/notebook/share_features"
        self.__listData = "/api/notebook/data/list_datasets"
        self.__pullData = "/api/data/pull"
        self.__saveData = '/api/notebook/api/add_data'
        self.__featuredetails__ = {}
        self.__sharingFunction = \
            "/api/projects/:projectId/feature_repo/share_features/:userId/share_from_py?type=function"
        self.__registerFunction = "/api/feature_repo/register_function"
        self.__ui_url = "http://localhost:3000"


    def load_project_details(self, file_filter=".csv"):
        """
        Loads current project related details.

        Parameters
        ----------
        file_filter: str
            Filter for the files to be listed.

        Returns
        ----------
        list
            a list of files available with the project
        """
        import os, re
        available_files = []
        lst = []
        filters = r"(csv|xls|xlsx|pkl|json|feather|parquet){1}$" if file_filter == "all" else (
                r"" + file_filter + r"$")
        for root, dirs, files in os.walk(os.path.abspath(os.path.pardir)):
            for file_name in files:
                if len(re.findall(filters, file_name)) == 1:
                    lst.append(os.path.join(root, file_name))

        available_files = [os.path.split(x)[-1] for x in lst]
        print(len(available_files), " files found.")
        return available_files


    def load_pandas_dataframe(self, file_name):
        """
        Read the file in to a pandas dataframe.

        Parameters
        ----------
        file_name: str
            Name of the file to be loaded.

        Returns
        ----------
        pandas dataframe
            a dataframe with the associated file_name
        """
        import os
        if self.__getdetails__ is None:
            print("Run all the previous cells before loading the data.")
            return pd.DataFrame()
        if not os.path.exists(os.path.join(os.path.pardir, file_name)):
            print("Please select one of the available files.")
            return pd.DataFrame()
        file_path = os.path.join(os.path.pardir, file_name)
        encoding_codec = self.__getdetails__["fileEncoding"]
        if file_path.endswith('.csv'):
            temp_dataframe = pd.read_csv(file_path,
                                         encoding=encoding_codec,
                                         na_values=[' ', 'NAN', 'Nan',
                                                    'Null', 'N/a'])

        elif file_path.endswith('.xls') or file_path.endswith('.xlsx'):
            temp_dataframe = pd.read_excel(file_path,
                                           encoding=encoding_codec,
                                           na_values=[' ', 'NAN', 'Nan',
                                                      'Null', 'N/a'])
        elif file_path.endswith('.json'):
            temp_dataframe = pd.read_json(file_path)
        elif file_path.endswith('.pkl') or file_path.endswith(
                '.pk') or file_path.endswith('.pl'):
            temp_dataframe = pd.read_pickle(file_path)
        elif file_path.endswith('.feather'):
            temp_dataframe = pd.read_feather(file_path,
                                             encoding=encoding_codec)
        elif file_path.endswith('.parquet'):
            temp_dataframe = pd.read_parquet(file_path,
                                             encoding=encoding_codec)

        temp_dataframe.columns = normalizing_dataframe_columns(
            temp_dataframe.columns)
        return temp_dataframe


    def save_data(self, df, file_name):
        """
        Save the pandas dataframe.

        Parameters
        -----------
        df: pandas dataframe
            the dataframe to replace the original dataframe with
        file_name: str
            name of the file name. For using the file for training, please overwrite the previously opened file.

        Returns
        -----------
        Nothing
        """

        df.columns = normalizing_dataframe_columns(df.columns)
        import os
        if self.__getdetails__ is None:
            print("Run all the previous cells before loading the data.")
            return pd.DataFrame()
        file_path = os.path.join(os.path.pardir, file_name)
        self.__current_file = file_path
        df.to_pickle(os.path.abspath(self.__current_file))
        request_obj = {
            'filename': os.path.abspath(self.__current_file),
            'projectId': self.__getdetails__['_id'],
            'createdBy': self.__getdetails__['user_id']
        }
        headers = {'Content-Type': "application/json"}
        try:
            response = requests.request("POST",
                                        url=self.__baseUrl + self.__saveData,
                                        data=json.dumps(request_obj),
                                        headers=headers)
            if response.status_code != 200:
                print("Could not perform save on this data.")
            else:
                print ("File saved successfully.")
        except Exception as e:
            print("Could not perform save on this data.")


    def list_shared_features(self):
        """
        Get a list of available shared features with descriptions.

        Returns
        ----------
        list
            list of dictionaries with shared feature details
        """
        headers = {'Content-Type': "application/json"}
        try:
            response = requests.request(
                "POST", url=self.__baseUrl + self.__listFeatures,
                json={"userId": self.__getdetails__['user_id']},
                headers=headers)
            if response.status_code == 200:
                result = json.loads(response.text)
                if len(result[0]) > 0:
                    self.__featuredetails__['feature_details'] = result
                    result = pd.DataFrame(result)[[
                        'createdAt', 'name', 'type','sharedFeaturesList',
                        'sharedIndex', 'email']]
                    result['type'].fillna('feature', inplace=True)
                    return result
                else:
                    self.__featuredetails__['feature_details'] = {}
                    print("No features have been shared with you yet.")
            else:
                print("Could not list the available shared features.")
        except Exception as msg:
            print("Could not list the available shared features.")
            print(msg)

        return []


    def share_features(self, df, feature_list, index_list, email_addy,
                       feature_name, aggregate_strategy='',
                       file_name='some_file_name.pkl'):
        """
        Adds the features in the data-frame to the feature repository.

        Parameters
        -----------
        df: pandas data-frame
            data-frame with features to be shared
        feature_list: list
            list of feature names to be shared
        index_list: list
            list of column names to be set as index
        email_addy: str
            email address of the sharee
        feature_name: str
            name of the feature
        aggregateStrategy: str
            aggregation strategy for all the features in feature_list
        file_name: str
            name of the file to save the data-frame to

        Returns
        ----------
        bool
            true if feature is successfully added to the repo
        """
        import os
        if not (file_name.endswith(".csv") or file_name.endswith(".pkl") \
                or file_name.endswith(".pl") or file_name.endswith(".xls") \
                or file_name.endswith(".xlsx")):
            print(
                "Please specify an extension to the file name - either .csv/.pkl/.xls/.xlsx.")
            return False
        if aggregate_strategy not in [
            '', None, 'mean', 'min', 'max', 'mode', 'std']:
            print(
                "Please specify the aggregate strategy as either None/mean/max/mode/std")
        feature_list = normalizing_dataframe_columns(feature_list)
        index_list = normalizing_dataframe_columns(index_list)
        request_obj = {}
        request_obj["sharedFeaturesList"] = [{
            'colName': item,
            'aggregateStrategy': aggregate_strategy.lower()} for item in
            feature_list]
        request_obj['sharedIndex'] = index_list
        request_obj['feature_name'] = feature_name
        try:
            self.__current_file
        except AttributeError:
            self.save_data(df, file_name)

        request_obj['filePath'] = os.path.abspath(self.__current_file)
        request_obj['projectId'] = self.__getdetails__['_id']
        request_obj['createdBy'] = self.__getdetails__['user_id']
        request_obj['emailId'] = email_addy
        headers = {'Content-Type': "application/json"}
        try:
            response = requests.request(
                "POST", url=self.__baseUrl + self.__shareFeatures,
                data=json.dumps(request_obj), headers=headers)
        except:
            print("Could not add this feature to the repo.")
            return {}
        response = json.loads(response.text)
        return response


    def get_shared_feature(self, shared_feature_name):
        """
        Loads the feature from the repo with the specifie name.

        Parameters
        ----------
        shared_feature_name: str
            name of the shared feature file

        Returns
        ----------
        pandas dataframe
            shared feature dataframe
        """
        temp_dataframe = pd.DataFrame()
        if self.__featuredetails__ is None:
            if (self.list_shared_features() is None):
                return temp_dataframe
        if len(self.__featuredetails__) == 0:
            return temp_dataframe

        details = pd.DataFrame(self.__featuredetails__['feature_details'])
        feature = details[(details.name == shared_feature_name) & \
            (details['type'] == 'feature')]
        if len(feature) > 1:
            print("Selected Features")
            print(feature.drop([
                'feature_id', '__v'], axis=1))
            feature = feature.loc[
                int(input(
                    "\nPlease enter the index of the required feature: "))]
        elif len(feature) == 1:
            pass
        else:
            print(
                "Make sure you have selected the name"
                "of one of the available feature names.")
            return None

        feature = feature.sharedFileName
        feature = feature if isinstance(feature, str) else \
            feature.values[0]
        import os
        file_path = os.path.join(
            os.path.pardir, os.path.pardir, os.path.pardir, feature)
        if not os.path.exists(file_path):
            print("Something went wrong while loading the path.")
            return temp_dataframe

        if file_path.endswith(".pkl") or file_path.endswith(".pl"):
            temp_dataframe = pd.read_pickle(file_path)
        temp_dataframe.columns = normalizing_dataframe_columns(
            temp_dataframe.columns)
        return temp_dataframe


    def get_shared_function(self, function_name):
        """
        Loads the feature from the repo with the specifie name.

        Parameters
        ----------
        function_name: str
            name of the shared function

        Returns
        ----------
        python function
            if successful returns a python function. else returns None
        """
        func = None
        if self.__featuredetails__ is None:
            if (self.list_shared_features() is None):
                return func
        if len(self.__featuredetails__) == 0:
            return func

        details = pd.DataFrame(self.__featuredetails__['feature_details'])
        
        feature = details[(details.name == function_name) & \
            (details['type'] == 'function')]
        if len(feature) > 1:
            print("Selected Functions")
            print(feature.drop([
                'feature_id', '__v'], axis=1))
            feature = feature.loc[
                int(input(
                    "\nPlease enter the index of the required function: "))]
        elif len(feature) == 1:
            pass
        else:
            print(
                "Make sure you have selected the name"
                "of one of the available feature names.")
            return None

        feature = feature.functionDefinition
        feature = feature if isinstance(feature, str) else \
            feature.values[0]
        try:
            func = string_to_function(feature, function_name)
            print ("Function loaded successfully.\n\n{}" \
                .format(feature))
            return func
        except Exception as e:
            print ("Could not load the shared function.", str(e))
        return None


    def list_uploaded_datasets(self, file_filter=".csv", file_source='file'):
        """
        Loads the list of files uploaded in current project.

        Parameters
        ----------
        file_filter: str
            Filter for the files to be listed. Allowed values are .csv, .xlsx, .json or all.

        file_source: str
            Filter for the files to be listed by data source. Allowed values are file, mssql, mysql or all.

        Returns
        ----------
        pandas DataFrame
            DataFrame with available file information
        """
        available_files = pd.DataFrame()
        request_obj = {'projectId': self.__getdetails__["_id"]}
        headers = {'Content-Type': "application/json"}
        try:
            response = requests.request("POST",
                                        url=self.__baseUrl + self.__listData,
                                        data=json.dumps(request_obj),
                                        headers=headers)
            if response.status_code == 200:
                available_files = pd.DataFrame(json.loads(response.text))
                if file_filter != 'all':
                    available_files = available_files[
                        available_files.filename.str.endswith(file_filter)
                    ]
                if file_source != 'all':
                    available_files = available_files[
                        available_files.fileSource == file_source
                        ]
                print(len(available_files), " files found.")
            else:
                print(json.loads(response.text)['message'])
                print(json.loads(response.text)['err'])
        except Exception as e:
            print(e)
            print("Could not list available data.")

        return available_files


    def pull_dataset(
            self, source, connection_setting, name, encoding='utf-8'):
        """
        Pulls loads data from specified source.

        Parameters
        ----------
        source: str
            Source specifying the data source.
            Allowed values are mssql, mysql or url.

        connection_setting: dictionary
            If the source is mssql or mysql,
                connection_setting must contain,
                {
                    driver
                    server
                    port
                    username
                    password
                    "query": ""
                }
            If source is url,
                connection_setting must contain,
                {
                    "url": "",
                    "dataFormat": "" #csv or xlsx
                }

        encoding: str
            Default value is utf_8.

        Returns
        ----------
        pandas DataFrame
            Processed dataframe.
        """
        pull_config = dict(
            projectId=self.__getdetails__["_id"],
            createdBy=self.__getdetails__["user_id"],
            source=source,
            name=name,
            fileEncoding=encoding
        )
        if source == "url":
            pull_config['url'] = connection_setting['url']
            pull_config['dataFormat'] = connection_setting['dataFormat']
        else:
            pull_config['connection'] = {
                "driver": connection_setting['driver'],
                "address": connection_setting['server'],
                "port": connection_setting['port'],
                "username": connection_setting['username'],
                "password": connection_setting['password']
            }
            pull_config['database'] = connection_setting['database']
            pull_config['query'] = connection_setting['query']

        try:
            response = requests.request("POST",
                                        url=self.__baseUrl + self.__pullData,
                                        json=pull_config,
                                        params={"isAsync": False})
            if response.status_code == 200:
                dataFrame = pd.DataFrame(
                    json.loads(response.text)['dataFrame'])
                dataFrame.columns = normalizing_dataframe_columns(
                    dataFrame.columns)
                return dataFrame
            else:
                print("Could not pull data from ", source)
        except Exception as e:
            print("Could not pull data from ", source, "\n", e)

        return None


    def share_function(self, function_object, description, email_addy):
        """
        Share the function you created with the provided email

        Parameters
        ----------
        function_object: python object
            Function object
        description: str
            Function description
        email_addy: str
            Email ID of the person with whom function is to be shared.

        Returns
        ----------
        python function
            if successful returns a python function. else returns None
        """

        import inspect
        function_definition = inspect.getsource(function_object)
        request_obj = {
            'name': function_object.__name__,
            'functionDefinition': function_definition,
            'type': 'function',
            'description': description,
            'createdBy': str(self.__getdetails__['user_id']),
            'status': 'Success',
            'isShared': 'true'}

        headers = {'Content-Type': "application/json"}

        try:
            register_result = requests.request(
                "POST", url=self.__ui_url + self.__registerFunction,
                data=json.dumps(request_obj), headers=headers
            )
            if register_result.status_code == 200:
                request_obj = {}
                request_obj['sharedFeatures'] = [register_result.json()['_id']]
                request_obj['email'] = email_addy
                sharing_result = requests.request(
                    "POST", url=self.__ui_url + self.__sharingFunction.replace(
                        ':projectId', self.__getdetails__['_id']) \
                        .replace(':userId', self.__getdetails__['user_id']),
                    data=json.dumps(request_obj),
                    headers=headers, params={"?type": "function"})
                if sharing_result.status_code != 200:
                    return sharing_result.json()['message']
            else:
                return "Could not register the function."
        except Exception as e:
            return "Error while sharing the feature."
        return "Function shared successfully."


def normalizing_dataframe_columns(columns):
    # # removing any special characters from dataframe column names
    # dataframe.columns = [re.sub('[^a-zA-Z0-9]+', '_', _) for _ in
    #                      dataframe.columns]

    # removing white space and special characters from dataframe columns
    import re
    norm_columns = [
        re.sub(r'[^a-zA-Z0-9_@\-!#$%^&*()<>?/\|}{~:+=]+', '', col).lower() for
        col in columns]

    return norm_columns


def string_to_function(string, func_name):
    import sys
    a = {}
    exec(string, {}, a)
    return a[func_name]