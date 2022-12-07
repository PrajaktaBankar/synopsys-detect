# -*- coding: utf-8 -*-
"""
created on Thr Jan 22 17:52:12 2020
Author: Saurabh
"""

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.exceptions import NotFittedError
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer

from .custom_exceptions import InvalidSchema
from .build_schema import DataFrameSchema


class TextExtractionTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, logger, text_extraction_obj, input_schema=None):
        self.logger = logger
        self.text_extraction_obj = text_extraction_obj
        self.input_schema = input_schema if input_schema is not None else []
        self.output_schema = []
        self.input_features = []
        self.vectorizer_obj = None
        self.columns = {}

    def _get_vectorizer(self):
        '''
        This function creates the vectorizer object CountVectorizer /
        TfIdfVectorizer class
        :return: vectorizer object
        '''
        vectorizer_obj = dict()
        for col in self.input_features:

            if self.text_extraction_obj[
                'nlpFeatureExtractionMethod'].lower() == 'countvectorizer':
                vectorizer = CountVectorizer(
                    max_features=self.text_extraction_obj['nFeatureCount'],
                    stop_words=self.text_extraction_obj['nlpLanguage'].lower(),
                    strip_accents='unicode',
                    analyzer='word')
            else:
                vectorizer = TfidfVectorizer(
                    max_features=self.text_extraction_obj['nFeatureCount'],
                    stop_words=self.text_extraction_obj['nlpLanguage'].lower(),
                    strip_accents='unicode',
                    analyzer='word')

            vectorizer_obj[col] = vectorizer
        return vectorizer_obj

    def _text_feature_extraction(self, X):

        '''
        Text feature extraction using  CountVectorizer / TfIdfVectorizer
        :param: input dataframe
        :return: dataframe having text extracted columns
        '''

        X_with_text_features = pd.DataFrame()

        if self.input_features:
            for column, vectorizer in self.vectorizer_obj.items():
                features_vector = vectorizer.transform(X[column])
                feature_names = vectorizer.get_feature_names()

                if X_with_text_features.shape[0] == 0 and \
                        X_with_text_features.shape[1] == 0:
                    X_with_text_features = pd.DataFrame(
                        features_vector.toarray(),
                        index=X.index,
                        columns=(
                            [column + '___' + f for f in
                             feature_names])).astype(
                        np.uint8)

                    self.columns[column] = [column + '___' + f for f in
                                            feature_names]

                else:
                    X_with_text_features = pd.concat([
                        X_with_text_features,
                        pd.DataFrame(features_vector.toarray(),
                                     index=X.index,
                                     columns=([column + '___' + f for f
                                               in feature_names]))],
                        axis=1).astype(np.uint8)
                    self.columns[column] = [column + '___' + f for f in
                                            feature_names]

        X_without_text_features = X.drop(self.input_features, axis=1)

        X = pd.concat([X_without_text_features,
                       X_with_text_features],
                      axis=1)

        return X

    def fit(self, X, y=None):
        if len(self.input_schema) == 0:
            self.input_schema = DataFrameSchema(self.logger) \
                .get_formatted_data_and_schema(X)[0]
        self.input_features = self.input_schema.loc[
            self.input_schema.dataType == 'Text', "colName"].to_list()

        self.vectorizer_obj = self._get_vectorizer()

        if self.input_features:

            for column, vectorizer in self.vectorizer_obj.items():
                _ = vectorizer.fit(X[column])

        return self

    def fit_transform(self, X, y=None, **fit_params):
        _ = self.fit(X, y=None)
        return self.transform(X, y=None)

    def transform(self, X, y=None):

        if len(self.input_schema) == 0:
            raise NotFittedError("""This TextExtractionTransformer instance is not fitted yet.
                                Call 'fit' with appropriate arguments before using this estimator.""")
        else:
            if len(set(self.input_features).difference(X.columns)) > 0:
                raise InvalidSchema(
                         "Input schema is invalid for the Text "
                         "Extraction transformer.")
            # if not DataFrameSchema.is_schema_valid(
            #         self.input_schema,
            #         DataFrameSchema(self.logger).get_formatted_data_and_schema(
            #             X)[0]):
            #     raise InvalidSchema(
            #         "Input schema is invalid for the transformer.")

        return self._text_feature_extraction(X)
