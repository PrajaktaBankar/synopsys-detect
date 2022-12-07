from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.exceptions import NotFittedError

from .build_schema import DataFrameSchema


class InterpolateTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, logger, interpolate_obj):
        self.logger = logger
        self.interpolate_obj = interpolate_obj

    def fit(self, X, y=None):
        """
        :param X: X is data frame for training
        :param y:y is set of labels
        :return:transformed data frame
        """
        self.input_schema, X = DataFrameSchema(self.logger) \
            .get_formatted_data_and_schema(X)

        return self

    def fit_transform(self, X, y=None, **fit_params):
        _ = self.fit(X=X, y=y)
        return self.transform(X=X, y=y)

    def transform(self, X=None, y=None):

        if len(self.interpolate_obj) == 0:
            raise NotFittedError(
                """This InterpolateTransformer instance is not fitted yet. 
        Call 'fit' with appropriate arguments before using this estimator.""")

        for data in self.interpolate_obj:
            X[data['colName']] = X[data['colName']].interpolate(
                method=data['method'], order=data['order'],
                limit_direction='both')
        return X
