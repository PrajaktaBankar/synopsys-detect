# -*- coding: utf-8 -*-
"""
created on Thr Jan 27 15:43:43 2020
Author: Saurabh
"""
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

from .build_schema import DataFrameSchema


class CategoricalEncoderTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, logger, task_type=None):
        self.logger = logger
        self.input_schema = []
        self.output_schema = []
        self.task_type = task_type
        self.input_features = []

    def _get_class_names(self, X):
        '''
        This function calculates the classes present in particular column in a
        dataset
        :param X: input dataframe
        :return: dictionary with column name and respective classes as values
        '''
        class_dictionary = dict()
        for col in self.input_features:
            class_dictionary[col] = sorted(X[col].unique())
        return class_dictionary

    def fit(self, X, y=None):

        self.input_schema = DataFrameSchema(self.logger) \
            .get_formatted_data_and_schema(X)[0]
        self.input_features = self.input_schema.loc[
            self.input_schema.dataType == 'Categorical',
            "colName"
        ].to_list()
        self.class_names = self._get_class_names(X)

        return self

    def fit_transform(self, X, y=None, **fit_params):
        _ = self.fit(X=X, y=y)
        return self.transform(X=X, y=y)

    def transform(self, X, y=None):
        for col in self.class_names:
            if self.class_names[col] == sorted(X[col].unique()):
                df = pd.get_dummies(X[col],
                                    prefix=col,
                                    prefix_sep='___',
                                    drop_first=True).astype(np.uint8)
            else:
                df = pd.get_dummies(X[col],
                                    prefix=col,
                                    prefix_sep='___',
                                    drop_first=True)
                df = df.T.reindex(col + '___' + i for i in self.class_names[
                                                               col][
                                                           1:]).T.fillna(
                    0).astype(np.uint8)

            X = pd.concat([X, df], axis=1)

        X.drop(columns=self.class_names.keys(), axis=1, inplace=True)
        self.output_schema = DataFrameSchema.get_output_schema(X.copy())
        return X
