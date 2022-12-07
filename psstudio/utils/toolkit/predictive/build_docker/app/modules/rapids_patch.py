from cuml.solvers import QN

def __setstate__(self, state):
    super(QN, self).__init__(handle=None, verbose=state['verbose'])

    if 'coef_' in state and state['coef_'] is not None:
        if 'fit_intercept' in state and state['fit_intercept']:
            coef_size = (state['n_cols'] + 1, state['_num_classes'])
        else:
            coef_size = (state['n_cols'], state['_num_classes'])
        try:
            state['coef_'] = state['coef_'].to_gpu_array().reshape(coef_size)
        except ValueError:
            state['coef_'] = state['coef_'].to_gpu_array() \
                .reshape((coef_size[0], coef_size[1] - 1))

    self.__dict__.update(state)