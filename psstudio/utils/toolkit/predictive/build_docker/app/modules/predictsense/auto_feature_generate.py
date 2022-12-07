from itertools import combinations

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

from .build_schema import DataFrameSchema
from .custom_exceptions import InvalidSchema


class AutoGenerateTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, logger, feature_obj):
        self.logger = logger
        self.input_schema = []
        self.output_schema = []
        self.task_type = feature_obj['taskType']
        self.input_features = feature_obj['featureNames']
        self.power = feature_obj[
            'exponent'] if 'exponent' in feature_obj else None
        self.delimiter = feature_obj['delimiter'] if 'delimiter' in \
                                                     feature_obj else None
        self.feature_split_count = feature_obj['featureSplitCount'] if \
            'featureSplitCount' in feature_obj else None

    def fit(self, X, y=None):

        # self.input_schema = DataFrameSchema(self.logger) \
        #     .get_formatted_data_and_schema(X)[0]

        feature_combos = []
        self.feature_dict = {}

        if self.task_type in ('addition', 'subtraction', 'multiply'):
            feature_combos.extend(combinations(list(self.input_features), 2))
            self.feature_dict = {
                key: ("_" + self.task_type + "_").join(key) for key
                in feature_combos
            }

        elif self.task_type == 'power':
            feature_combos.extend(list(self.input_features))

            self.feature_dict = {
                key: key + '_' + self.task_type + str(self.power) for key
                in feature_combos
            }

        else:

            # split logic comes here
            feature_combos.extend(list(self.input_features))

            self.feature_dict = {
                key: [key + '_' + self.task_type + str(index) for index in
                      range(
                          self.feature_split_count)] for key in
                feature_combos
            }
        return self

    def fit_transform(self, X, y=None, **fit_params):
        _ = self.fit(X=X, y=y)
        return self.transform(X=X, y=y)

    def transform(self, X, y=None):

        for columns, col_name in self.feature_dict.items():
            if self.task_type == 'addition':
                series = X[list(columns)].apply(pd.to_numeric).sum(axis=1)
            elif self.task_type == 'subtraction':
                series = np.abs(
                    X[columns[0]].apply(pd.to_numeric).sub(X[columns[1]],
                                                           axis=0))
            elif self.task_type == 'multiply':
                series = X[list(columns)].apply(pd.to_numeric).prod(axis=1)
            elif self.task_type == 'power':
                series = X[columns].apply(pd.to_numeric) ** self.power
            elif self.task_type == 'split':

                series = X[columns].str.split(self.delimiter, expand=True)
                series = series[series.columns[0:len(col_name)]]
                series.dropna(axis=1, inplace=True)
                if self.delimiter in [char for values in X[
                    columns].values for char in values]:
                    col_name = col_name[0:len(series.columns)]
                else:
                    col_name = columns
            else:
                series = X[columns[0]].copy()
                for c in columns[1:]:
                    series = series - X[c].copy()
            X[col_name] = series.copy()

        if len(self.output_schema) == 0:
            self.output_schema = DataFrameSchema.get_output_schema(X.copy())
        else:
            if DataFrameSchema.is_schema_valid(
                    self.output_schema.copy(),
                    DataFrameSchema.get_output_schema(X.copy())):
                pass
            else:
                raise InvalidSchema(
                    "Output schema is invalid for the transformer.")

        return X
