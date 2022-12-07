
class InvalidSchema(Exception):

    def __init__(self, err_args):
        super().__init__(self,
                         "The schema for the task is invalid. Arguments: {0}".format(
                             err_args))
        self.err_args = err_args


class CastingException(Exception):

    def __init__(self, err_args):
        super().__init__(self,
                         "The selected transformation cannot be applied to the feature. Arguments: {0}".format(
                             err_args))
        self.err_args = err_args
