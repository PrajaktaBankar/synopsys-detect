import numpy as np

from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.exceptions import NotFittedError


class OutlierHandling(BaseEstimator, TransformerMixin):
    def __init__(self, logger, detection_method="Factor Method",
                 handling_method='Mean', custom_dict={}, numeric_features=[]):
        self.config = {}
        # self.input_schema = {}
        # self.output_schema = {}
        self.detection_method = detection_method
        self.handling_method = handling_method
        self.custom_dict = custom_dict
        self.logger = logger
        self.numeric_features = numeric_features

    def fit(self, X, y=None):
        """
        :param X: X is data frame for training
        :param y:y is set of labels
        :return:transformed data frame
        """
        # self.input_schema, X = DataFrameSchema(self.logger) \
        #     .get_formatted_data_and_schema(X)

        self.config['outliers_exist'] = False
        if len(self.numeric_features) == 0:
            self.numeric_features = X.select_dtypes(include='number').columns
        for col in self.numeric_features:
            data_mean, data_std, data_median = X[col].mean(), \
                                               X[col].std(), \
                                               X[col].median()
            cut_off = data_std * 3.0
            if self.detection_method == 'Factor Method':
                lower, upper = data_mean - cut_off, data_mean + cut_off
            elif self.detection_method == 'Inter-Quartile Range':
                q25, q75 = np.percentile(X[col], 25), np.percentile(
                    X[col], 75)
                iqr = q75 - q25
                cut_off = iqr * 1.5
                lower, upper = q25 - cut_off, q75 + cut_off
            else:
                upper = lower = None

            self.config[col] = {
                "mean": data_mean,
                "std": data_std,
                "median": data_median,
                "lower": lower,
                "upper": upper
            }
            self.config['outliers_exist'] = True
        return self

    def transform(self, X, y=None):
        """
        :param self: instanance of the class
        :param X: X is data frame for training
        :return: transformed data frame
        """
        if len(self.config) == 0:
            raise NotFittedError(
                """This OutlierHandling instance is not fitted yet. 
        Call 'fit' with appropriate arguments before using this estimator.""")
        else:
            pass
            """temp_schema, temp_X = DataFrameSchema(self.logger) \
                .get_formatted_data_and_schema(X)
            if not DataFrameSchema.is_schema_valid(self.input_schema, temp_schema):
                raise InvalidSchema(
                    "Input schema is invalid for the transformer.")
            X = temp_X
            """
        for col, values in self.config.items():
            if col == 'outliers_exist':
                continue
            if self.config['outliers_exist'] == False:
                self.config[col]['outliers'] = []
                continue
            if values['lower'] is not None:
                outlier_index = X.loc[(X[col] < values['lower']) | (
                        X[col] > values['upper']), col].index.values
            else:
                zscore = (X[col] - values['mean']) / values['std']
                outlier_index = zscore.loc[zscore.map(abs) > 3].index.values

            self.config[col]['outliers'] = outlier_index

            if self.handling_method == 'Mean':
                X.loc[outlier_index, col] = values['mean']
            elif self.handling_method == 'Median':
                X.loc[outlier_index, col] = values['median']
            elif self.handling_method == 'Delete data':
                X = X.drop(outlier_index)
                # X.reset_index(drop=True, inplace=True)
            elif self.handling_method == 'Lower bound':
                X.loc[outlier_index, col] = values['lower']
            elif self.handling_method == 'Upper bound':
                X.loc[outlier_index, col] = values['upper']
            elif self.handling_method == 'No strategy':
                pass
            elif self.handling_method == 'Custom':
                X.loc[outlier_index, col] = self.custom_dict[col]

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
