import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.exceptions import NotFittedError

from .build_schema import DataFrameSchema


class FeatureWiseImputation(BaseEstimator, TransformerMixin):
    def __init__(self, logger, strategies, impute_by):
        self.config = {}
        self.input_schema = {}
        self.output_schema = {}
        self.impute_by = impute_by
        self.strategies = strategies
        self.logger = logger

    def _compute(self, strategy, srs_grp, dtype):
        """
        :param strategy: statistical strategy used
        :param srs_grp: grouping
        :param dtype: data type
        :return:
        """
        aggregation = None
        if strategy == 'mean':
            aggregation = srs_grp.mean()
        elif strategy == 'median':
            aggregation = srs_grp.median()
        elif strategy == 'mode':
            aggregation = srs_grp.apply(lambda x: pd.Series.mode(x).values[0])
        elif strategy == 'min':
            aggregation = srs_grp.min()
        elif strategy == 'max':
            aggregation = srs_grp.max()
        elif strategy == 'st.dev':
            aggregation = srs_grp.std()
        return aggregation.round(2) if dtype == 'Decimal' else \
            aggregation if dtype != "Integer" \
                else aggregation.round()

    def fit(self, X, y=None):
        """
        :param X: X is data frame for training
        :param y:y is set of labels
        :return:transformed data frame
        """
        self.input_schema, X = DataFrameSchema(self.logger) \
            .get_formatted_data_and_schema(X)

        grp = X.groupby(self.impute_by)

        temp_df = self.strategies[['colName', 'imputationStrategy']].copy()
        temp_df = pd.merge(temp_df, self.input_schema[['colName', 'dataType']])

        fill_config = temp_df[[
            'colName', 'imputationStrategy', 'dataType']].apply(
            lambda x: self._compute(
                x[1], grp[x[0]], x[2]),
            axis=1
        )
        fill_config.set_index(temp_df.colName, inplace=True)
        fill_config.columns = [x for x in fill_config.columns]
        self.config['fill_value'] = fill_config.to_dict()
        return self

    def transform(self, X, y=None):
        """
        :param self: instanance of the class
        :param X: X is data frame for training
        :return: transformed data frame
        """
        if len(self.config) == 0:
            raise NotFittedError(
                """This FeatureWiseImputation instance is not fitted yet. 
                Call 'fit' with appropriate arguments before using this estimator.""")
        else:
            pass
            """
            temp_schema, temp_X = DataFrameSchema(self.logger) \
                .get_formatted_data_and_schema(X)
            if not DataFrameSchema.is_schema_valid(self.input_schema, temp_schema):
                raise InvalidSchema(
                    "Input schema is invalid for the transformer.")
            X = temp_X
            """

        missing_cols = (X.isnull().sum()[
            X.isnull().sum() > 0]).index.values

        if len(missing_cols) == 0:
            self.output_schema = self.input_schema.copy()
            return X

        for impute_feature_value, fill_details in self.config[
            'fill_value'].items():
            for index_value, fill_value in fill_details.items():
                if index_value not in missing_cols:
                    continue
                X.loc[(X[self.impute_by] == impute_feature_value) & \
                      (X[index_value].isnull()), index_value] = fill_value

        """
        temp_schema, temp_X = DataFrameSchema(self.logger) \
            .get_formatted_data_and_schema(X)

        if len(self.output_schema) == 0:
            self.output_schema = temp_schema
            X = temp_X
        else:
            if DataFrameSchema.is_schema_valid(self.output_schema, temp_schema):
                X = temp_X
            else:
                raise InvalidSchema(
                    "Output schema is invalid for the transformer.")
        """
        return X
