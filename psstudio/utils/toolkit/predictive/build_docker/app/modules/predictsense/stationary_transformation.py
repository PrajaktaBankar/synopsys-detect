import numpy as np
from sklearn.base import TransformerMixin, BaseEstimator


class StationaryTransformation(BaseEstimator, TransformerMixin):
    '''Perform Stationarity Correction'''

    def __init__(self, stationarity_obj):
        self.stationarity_obj = stationarity_obj
        self.stationary_method = stationarity_obj['stationaryMethod']
        self.period = stationarity_obj['period']
        self.scalar = stationarity_obj['scalar']

    def _data_correction(self, input_series):
        '''
        performs differencing, log based on the input from ui
        :param X: input dataframe
        :return: transformed output series
        '''
        if self.stationary_method.lower() == 'differencing':
            input_series = input_series - input_series.shift(self.period)
        elif self.stationary_method.lower() == 'log_transformation':
            input_series = np.log(input_series + self.scalar)
        else:
            input_series = np.log(input_series + self.scalar)
            input_series = input_series - input_series.shift(self.period)
        return input_series

    def fit(self, X=None, y=None):
        self.input_features = [col for col in X.columns if
                               col in self.stationarity_obj[
                                   'stationaryColumns']]

        return self

    def fit_transform(self, X, y=None, **fit_params):
        _ = self.fit(X=X, y=y)
        return self.transform(X=X, y=y)

    def transform(self, X=None, y=None):
        X[self.input_features] = X[self.input_features].apply(
            self._data_correction)
        # dropping missing rows if we have any after perfoming above methods
        X.dropna(inplace=True)
        return X
