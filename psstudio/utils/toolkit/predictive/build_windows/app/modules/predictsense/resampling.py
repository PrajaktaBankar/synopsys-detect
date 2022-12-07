from sklearn.base import BaseEstimator, TransformerMixin


class ResamplingTransformer(BaseEstimator, TransformerMixin):
    '''
    Resampling is necessary when you’re given a data set recorded in some
    time interval and you want to change the time interval to something else.
    For example, you could aggregate monthly data into yearly data,
    or you could upsample hourly data into minute-by-minute data.
    '''

    # B         business day frequency
    # C         custom business day frequency (experimental)
    # D         calendar day frequency
    # W         weekly frequency
    # M         month end frequency
    # SM        semi-month end frequency (15th and end of month)
    # BM        business month end frequency
    # CBM       custom business month end frequency
    # MS        month start frequency
    # SMS       semi-month start frequency (1st and 15th)
    # BMS       business month start frequency
    # CBMS      custom business month start frequency
    # Q         quarter end frequency
    # BQ        business quarter endfrequency
    # QS        quarter start frequency
    # BQS       business quarter start frequency
    # A         year end frequency
    # BA, BY    business year end frequency
    # AS, YS    year start frequency
    # BAS, BYS  business year start frequency
    # BH        business hour frequency
    # H         hourly frequency
    # T, min    minutely frequency
    # S         secondly frequency --
    # L, ms     milliseconds --
    # U, us     microseconds --
    # N         nanoseconds --

    def __init__(self, logger, resampling_obj):
        self.logger = logger
        self.aggregation_function = resampling_obj['aggregationFunction']
        self.resampling_method = resampling_obj['resamplingMethod']
        self.get_index = []

    def fit(self, X, y=None):
        return self

    def fit_transform(self, X, y=None, **fit_params):
        _ = self.fit(X=X, y=y)
        return self.transform(X=X, y=y)

    def _resampling(self, X):
        '''
        Resampling input dataframe based on the resampling rule and
        aggregate function
        :param X: Input Dataframe
        :return: Resampled Dataframe
        '''

        if self.aggregation_function == 'mean':
            X = X.resample(self.resampling_method).mean()
        elif self.aggregation_function == 'median':
            X = X.resample(self.resampling_method).median()
        elif self.aggregation_function == 'min':
            X = X.resample(self.resampling_method).min()
        elif self.aggregation_function == 'max':
            X = X.resample(self.resampling_method).max()
        elif self.aggregation_function == 'std':
            X = X.resample(self.resampling_method).std()
        elif self.aggregation_function == 'sum':
            X = X.resample(self.resampling_method).sum()
        elif self.aggregation_function == 'count':
            X = X.resample(self.resampling_method).count()
        elif self.aggregation_function == 'nunique':
            X = X.resample(self.resampling_method).nunique()
        elif self.aggregation_function == 'bfill':
            X = X.resample(self.resampling_method).bfill()
        elif self.aggregation_function == 'ffill':
            X = X.resample(self.resampling_method).ffill()
        elif self.aggregation_function == 'first':
            X = X.resample(self.resampling_method).first()
        elif self.aggregation_function == 'last':
            X = X.resample(self.resampling_method).last()
        elif self.aggregation_function == 'var':
            X = X.resample(self.resampling_method).var()
        elif self.aggregation_function == 'pad':
            X = X.resample(self.resampling_method).pad()
        else:
            X = X.resample(self.resampling_method).ohlc()
        # dropping rows if we have missing values after resampling
        X.dropna(inplace=True)
        self.get_index = X.index
        return X

    def transform(self, X=None, y=None):
        return self._resampling(X)
