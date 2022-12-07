from sklearn.base import BaseEstimator, TransformerMixin

from .build_schema import DataFrameSchema
from .custom_exceptions import InvalidSchema


class TypeTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, logger, strategies):
        self.output_schema = {}
        self.logger = logger
        self.strategies = strategies

    def fit(self, X, y=None):
        """
        :param X: X is data frame for training
        :param y:y is set of labels
        :return:transformed data frame
        """
        return self

    def transform(self, X, y=None):
        """
        :param self: instanance of the class
        :param X: X is data frame for training
        :return: transformed data frame
        """
        temp_X, temp_schema = DataFrameSchema(self.logger) \
            .format_data_by_schema(X, self.strategies.copy())

        if len(self.output_schema) == 0:
            self.output_schema = temp_schema
            X = temp_X
        else:
            if DataFrameSchema.is_schema_valid(self.output_schema.copy(),
                                               temp_schema.copy()):
                X = temp_X
                self.output_schema = temp_schema.copy()
            else:
                raise InvalidSchema(
                    "Output schema is invalid for the transformer.")

        return X
