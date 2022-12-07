import pandas as pd


def compute_index(df, index_column, freq=None):
    """
        Creates datetime index in timeseries dataset
        ------
        Parameters:
            df : pandas dataframe
                input dataframe on which index will be set
            index_column: str
                user specified datetime column
            freq: str
                frequncy of datetime index

        Returns:
        ------
            df: pandas dataframe
                dataframe with datetime index
        Exceptions
        ------
            No exception
    """
    # dropping missing rows if index column contains any
    df.dropna(subset=[index_column], inplace=True)
    df = df.set_index(index_column).sort_index()
    # stripping timestamp from datetime index
    df.index = pd.to_datetime(df.index.date)
    # keeping last entires if we have duplicate after timestamp removal
    df = df.loc[~df.index.duplicated(keep='last')]
    # setting frequency
    df = df.asfreq(freq)
    return df
