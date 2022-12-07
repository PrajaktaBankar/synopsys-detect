import json

import numpy
import pandas as pd
from scipy import sparse
from sklearn.pipeline import _fit_transform_one, _transform_one
from sklearn.utils.validation import check_array, check_is_fitted


def json_encoder(self, obj):
    if isinstance(obj, (pd.datetime, pd.Timestamp)):
        return obj.isoformat()
    elif isinstance(obj, (numpy.int_, numpy.intc, numpy.intp, numpy.int8,
                          numpy.int16, numpy.int32, numpy.int64, numpy.uint8,
                          numpy.uint16, numpy.uint32, numpy.uint64,
                          numpy.integer)):
        return int(obj)
    elif isinstance(obj, (bool, numpy.bool, numpy.bool_)):
        return bool(obj)
    elif isinstance(obj, (numpy.float_, numpy.float16, numpy.float32,
                          numpy.float64, numpy.float)):
        return float(obj)
    elif isinstance(obj, numpy.ndarray):
        return obj.tolist()
    return json.JSONEncoder.default(self, obj)


# ******************Start Patch for ColumnTransformer*****************

def _check_X(X):
    """Use check_array only on lists and other non-array-likes / sparse"""
    if hasattr(X, '__array__') or sparse.issparse(X):
        return X
    return check_array(X, force_all_finite='allow-nan', dtype=numpy.object)


def fit_transform(self, X, y=None):
    """Fit all transformers, transform the data and concatenate results.

    Parameters
    ----------
    X : array-like or DataFrame of shape [n_samples, n_features]
        Input data, of which specified subsets are used to fit the
        transformers.

    y : array-like, shape (n_samples, ...), optional
        Targets for supervised learning.

    Returns
    -------
    X_t : array-like or sparse matrix, shape (n_samples, sum_n_components)
        hstack of results of transformers. sum_n_components is the
        sum of n_components (output dimension) over transformers. If
        any result is a sparse matrix, everything will be converted to
        sparse matrices.

    """
    # TODO: this should be `feature_names_in_` when we start having it
    if hasattr(X, "columns"):
        self._feature_names_in = numpy.asarray(X.columns)
        self._feature_names_in = sorted(self._feature_names_in)
        X = X[self._feature_names_in]
    else:
        self._feature_names_in = None

    # original index
    index = X.index
    X = _check_X(X)
    self._validate_transformers()
    self._validate_column_callables(X)
    self._validate_remainder(X)

    result = self._fit_transform(X, y, _fit_transform_one)

    if not result:
        self._update_fitted_transformers([])
        # All transformers are None
        return numpy.zeros((X.shape[0], 0))

    Xs, transformers = zip(*result)

    # determine if concatenated output will be sparse or not
    if any(sparse.issparse(X) for X in Xs):
        nnz = sum(X.nnz if sparse.issparse(X) else X.size for X in Xs)
        total = sum(X.shape[0] * X.shape[1] if sparse.issparse(X)
                    else X.size for X in Xs)
        density = nnz / total
        self.sparse_output_ = density < self.sparse_threshold
    else:
        self.sparse_output_ = False

    self._update_fitted_transformers(transformers)
    self._validate_output(Xs)

    if len(Xs) > 0:
        if isinstance(Xs[0], pd.DataFrame):
            Xdf = pd.concat(Xs, axis=1)
            Xdf.set_index(keys=index)
            return Xdf
    try:
        Xs = self._hstack(list(Xs))
        column_names = []
        _ = [column_names.extend(x[-1]) for x in self.transformers]
        if len(column_names) < X.shape[1]:
            column_names.extend(X.columns.difference(column_names))
        Xdf = pd.DataFrame(Xs, columns=column_names, index=index)
        dtypes = {x: str(X[x].dtype) for x in X.columns}
        for col, dtype in dtypes.items():
            if dtype.find("date") > 0 or dtype.find("time") > 0:
                Xdf[col] = pd.to_datetime(Xdf[col])
            elif dtype.find("str") > 0 or dtype.find("object") > 0:
                Xdf[col] = Xdf[col].astype('str')
            else:
                Xdf[col] = Xdf[col].astype(dtype)
    except TypeError:
        Xdf = pd.DataFrame(index=index)
    return Xdf


def transform(self, X):
    """Transform X separately by each transformer, concatenate results.
    Parameters
    ----------
    X : array-like or DataFrame of shape [n_samples, n_features]
        The data to be transformed by subset.
    Returns
    -------
    X_t : array-like or sparse matrix, shape (n_samples, sum_n_components)
        hstack of results of transformers. sum_n_components is the
        sum of n_components (output dimension) over transformers. If
        any result is a sparse matrix, everything will be converted to
        sparse matrices.
    """
    check_is_fitted(self, 'transformers_')
    np = numpy
    index = X.index
    X = X[sorted(X.columns)]
    X = _check_X(X)
    Xs = self._fit_transform(X, None, _transform_one, fitted=True)
    self._validate_output(Xs)

    if not Xs:
        # All transformers are None
        return np.zeros((X.shape[0], 0))

    Xs = self._hstack(list(Xs))
    column_names = []
    _ = [column_names.extend(x[-1]) for x in self.transformers]
    if len(column_names) < X.shape[1]:
        column_names.extend(X.columns.difference(column_names))
    Xdf = pd.DataFrame(Xs, columns=column_names, index=index)
    dtypes = {x: str(X[x].dtype) for x in X.columns}
    for col, dtype in dtypes.items():
        if dtype.find("date") > 0 or dtype.find("time") > 0:
            Xdf[col] = pd.to_datetime(Xdf[col])
        elif dtype.find("str") > 0 or dtype.find("object") > 0:
            Xdf[col] = Xdf[col].astype('str')
        else:
            Xdf[col] = Xdf[col].astype(dtype)
    return Xdf

# ******************End Patch for ColumnTransformer*****************
