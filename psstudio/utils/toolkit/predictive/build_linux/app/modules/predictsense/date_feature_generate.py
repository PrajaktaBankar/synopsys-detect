import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

from .build_schema import DataFrameSchema
from .custom_exceptions import InvalidSchema


class DateTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, logger, date_obj):
        self.logger = logger
        self.input_schema = []
        self.output_schema = []
        self.input_features = date_obj['featureNames']
        self.columns = {}

    def fit(self, X, y=None):

        # self.input_schema = DataFrameSchema(self.logger) \
        #     .get_formatted_data_and_schema(X)[0]
        return self

    def transform(self, X, y=None):
        transformed_cols = []
        if len(self.columns) == 0:
            for column in self.input_features:
                col_dict = {}
                if X[column].dt.year.std() > 0:
                    X[column + "__year"] = pd.to_numeric(X[column].dt.year,
                                                         downcast='integer')
                    col_dict['year'] = column + "__year"
                if X[column].dt.quarter.std() > 0:
                    X[column + "__quarter"] = pd.to_numeric(
                        X[column].dt.quarter,
                        downcast='integer')
                    col_dict['quarter'] = column + "__quarter"
                if X[column].dt.month_name().nunique() > 1:
                    X[column + "__month_name"] = X[column].dt.month_name()
                    col_dict['month_name'] = column + "__month_name"
                if X[column].dt.day.std() > 0:
                    X[column + "__day"] = pd.to_numeric(X[column].dt.day,
                                                        downcast='integer')
                    col_dict['day'] = column + "__day"
                if X[column].dt.day_name().nunique() > 1:
                    X[column + "__day_name"] = X[column].dt.day_name()
                    col_dict['day_name'] = column + "__day_name"
                if X[column].dt.hour.std() > 0:
                    X[column + "__hour"] = pd.to_numeric(X[column].dt.hour,
                                                         downcast='integer')
                    col_dict['hour'] = column + "__hour"
                if X[column].dt.minute.std() > 0:
                    X[column + "__minute"] = pd.to_numeric(X[column].dt.minute,
                                                           downcast='integer')
                    col_dict['minute'] = column + "__minute"
                if X[column].dt.second.std() > 0:
                    X[column + "__second"] = pd.to_numeric(X[column].dt.second,
                                                           downcast='integer')
                    col_dict['second'] = column + "__second"
                transformed_cols.extend(list(col_dict.values()))
                self.columns[column] = col_dict

        else:
            for column in self.input_features:
                col_dict = {}
                if 'year' in self.columns[column].keys():
                    X[column + "__year"] = pd.to_numeric(X[column].dt.year,
                                                         downcast='integer')
                    col_dict['year'] = column + "__year"
                if 'quarter' in self.columns[column].keys():
                    X[column + "__quarter"] = pd.to_numeric(
                        X[column].dt.quarter,
                        downcast='integer')
                    col_dict['quarter'] = column + "__quarter"
                if 'month_name' in self.columns[column].keys():
                    X[column + "__month_name"] = X[column].dt.month_name()
                    col_dict['month_name'] = column + "__month_name"
                if 'day' in self.columns[column].keys():
                    X[column + "__day"] = pd.to_numeric(X[column].dt.day,
                                                        downcast='integer')
                    col_dict['day'] = column + "__day"
                if 'day_name' in self.columns[column].keys():
                    X[column + "__day_name"] = X[column].dt.day_name()
                    col_dict['day_name'] = column + "__day_name"
                if 'hour' in self.columns[column].keys():
                    X[column + "__hour"] = pd.to_numeric(X[column].dt.hour,
                                                         downcast='integer')
                    col_dict['hour'] = column + "__hour"
                if 'minute' in self.columns[column].keys():
                    X[column + "__minute"] = pd.to_numeric(X[column].dt.minute,
                                                           downcast='integer')
                    col_dict['minute'] = column + "__minute"
                if 'second' in self.columns[column].keys():
                    X[column + "__second"] = pd.to_numeric(X[column].dt.second,
                                                           downcast='integer')
                    col_dict['second'] = column + "__second"
                transformed_cols.extend(list(col_dict.values()))
                self.columns[column] = col_dict

        X.drop(self.input_features, axis=1, inplace=True)

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
