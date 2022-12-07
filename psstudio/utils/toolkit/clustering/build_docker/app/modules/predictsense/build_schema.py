import re

import numpy as np
import pandas as pd


class DataFrameSchema:

    def __init__(self, logger, text_length=100, word_length=10):
        self.logger = logger
        self.text_length = text_length
        self.word_length = word_length

    @staticmethod
    def is_schema_valid(original_schema, transformed_schema):
        '''
        Validates original and transformed schema
        :param original_schema: input schema of a dataset
        :param transformed_schema: output schema of a dataset
        :return: True if original and transformed schema is same else False
        '''
        original_schema = pd.DataFrame(original_schema)
        transformed_schema = pd.DataFrame(transformed_schema)
        if hasattr(original_schema.dataType, "str"):
            original_schema.dataType = original_schema.dataType.replace(
                "Decimal", "Number").replace("Integer", "Number")

            transformed_schema.dataType = transformed_schema.dataType.replace(
                "Decimal", "Number").replace("Integer", "Number")
        original_schema['df_type'] = 'original'
        transformed_schema['df_type'] = 'transformed'

        check_schema = pd.merge(
            original_schema, transformed_schema,
            on=["colName", "dataType"],
            how='left'
        )

        return check_schema.isnull().sum().sum() == 0

    def reduce_mem_usage(self, df):
        """
        Downcast features to reduce memory usage.
        :param df: The input data-frame.
        :return: Downcasted data-frame.
        """

        start_mem_usg = df.memory_usage().sum() / 1024 ** 2
        self.logger.info(
            'memory usage of properties dataframe is : {} mb'.format(
                start_mem_usg))
        try:
            numerical_columns = list(
                df.select_dtypes(include=['number']).columns)

            for col in numerical_columns:
                if isinstance(df[col], pd.DataFrame):
                    temp_df = df[col].copy()
                    temp_df.columns = ['srs_' + str(ind) for ind in range(len(
                        temp_df.columns))]
                    temp_df[col] = temp_df.sum(axis=1)
                    df.drop(col, inplace=True, axis=1)
                    df[col] = temp_df[col]
                    print("Check")
                if df[col].isnull().any().any():
                    df[col] = pd.to_numeric(df[col], downcast='float')
                    continue
                if np.array_equal(df[col], df[col].astype(np.uint64)):
                    df[col] = pd.to_numeric(df[col], downcast='unsigned')
                elif np.array_equal(df[col], df[col].astype(int)):
                    df[col] = pd.to_numeric(df[col], downcast='integer')
                elif np.array_equal(df[col], df[col].astype(float)):
                    df[col] = pd.to_numeric(df[col], downcast='float')

            self.logger.info('___memory usage after completion:___')
            mem_usg = df.memory_usage().sum() / 1024 ** 2
            self.logger.info("Memory usage is: {} mb".format(mem_usg))
            self.logger.info("this is {} % of the initial size".format(
                100 * mem_usg / start_mem_usg))

        except Exception as e:
            self.logger.exception(
                "Couldn't typecast from higher to lower datatype %s" % e)

        return df

    @staticmethod
    def normalize_column_names(columns):
        """
        :param columns: name of the normalized columns from the dataset
        :return: normalized columns
        """
        """
        Normalize column names
        """
        # columns = columns.str.replace(
        #     '[^a-zA-Z0-9_@\-!#$%^&*()<>?/\|}{~:+=]+', '')
        columns = columns.str.replace('.', '')
        columns = [re.sub(r"\s+", "_", str(x)).lower().strip() for x in
                   columns]
        return columns

    def get_formatted_data_and_schema(self, dataFrame):
        """
        :param dataFrame: input data frame
        :return: data types and data frame
        """
        """
        Format the dataframe and return the extracted schema and casted dataframe.
            1. Normalize the column names
            2. Downcast the columns
            3. Remove the special characters.
            4. Identify the type of the actual data and format it accordingly
        :params dataFrame: pandas dataframe
        :return two dataframes
            1. with each column and its type
            2. transformed dataframe
        """
        self.logger.info("Started extracting dataframe schema.")

        # Normalize the column names
        dataFrame.columns = self.normalize_column_names(dataFrame.columns)

        # Downcast the numericals
        dataFrame = self.reduce_mem_usage(dataFrame)

        # Identify the storage type
        dtypes = dataFrame.dtypes.map(str)
        dtypes = dtypes.reset_index()
        dtypes.columns = ['colName', 'memType']
        numerics = dtypes[(dtypes.memType.str.find("int") > -1) | \
                          (dtypes.memType.str.find(
                              "float") > -1)].colName.to_list()
        objects = dtypes[dtypes.memType == 'object'].colName.to_list()
        dates = dtypes[
            dtypes.memType.str.find("datetime") > -1].colName.to_list()
        bools = dtypes[dtypes.memType == 'bool'].colName.to_list()
        dtypes['dataType'] = None
        dtypes.loc[dtypes.colName.isin(dates), "dataType"] = "Datetime"
        dtypes.loc[dtypes.colName.isin(bools), "dataType"] = "Boolean"

        # Check for boolean
        for numeric_col in numerics:
            if set(dataFrame[numeric_col].unique()) == {0, 1}:
                if dataFrame[numeric_col].isnull().sum() == 0:
                    dataFrame[numeric_col] = dataFrame[
                        numeric_col].astype("uint8")
                dtypes.loc[
                    dtypes.colName == numeric_col, "dataType"] = "Boolean"
            else:
                dtype = str(dataFrame[numeric_col].dtype)
                dtypes.loc[dtypes.colName == numeric_col, "dataType"] = \
                    "Integer" if dtype.find("int") > -1 else "Decimal"

        # Check for date, numeric and text type
        for obj_col in objects:
            try:
                if dataFrame[obj_col].dropna().map(
                    lambda x: isinstance(x, bool)).value_counts()[True]:
                    dataFrame.loc[dataFrame[obj_col].isnull() == False, 
                        obj_col] = dataFrame.loc[
                            dataFrame[obj_col].isnull() == False, obj_col] \
                                .astype(bool)
                    dtypes.loc[
                        dtypes.colName == obj_col, "dataType"] = "Boolean"
                    continue
            except:
                pass
            try:
                dataFrame[obj_col] = pd.to_datetime(dataFrame[obj_col])
                dtypes.loc[
                    dtypes.colName == obj_col, "dataType"] = "Datetime"
            except:
                try:
                    temp_df = dataFrame[obj_col].replace(
                        '[\,]', '', regex=True).astype(float)
                    dtypes.loc[
                        dtypes.colName == obj_col, "dataType"] = "Decimal"
                    dataFrame[obj_col] = temp_df
                except:
                    cp_mean = dataFrame[obj_col].dropna().map(
                        lambda x: len(str(x))).mean()
                    cp_words = dataFrame[obj_col].dropna().map(
                        lambda x: len(str(x).split(" "))).mean()

                    if cp_mean >= self.text_length or \
                            cp_words >= self.word_length:
                        dtypes.loc[
                            dtypes.colName == obj_col, "dataType"] = "Text"
                    else:
                        dtypes.loc[dtypes.colName == obj_col,
                                   "dataType"] = "Categorical"

        # Priyanka - moving the clean up after date has been identified
        # Remove the special characters from string type columns
        dataFrame[dtypes.loc[dtypes.memType == 'object', 'colName']] = \
            dataFrame[dtypes.loc[dtypes.memType == 'object', 'colName']] \
                .replace(r'[@_\-!#$%^&*()<>?/\|}{~+=]', '', regex=True)

        self.logger.info("Done extracting dataframe schema: \n{}" \
                         .format(dtypes.to_csv()))

        return dtypes, dataFrame

    def format_data_by_schema(self, dataFrame, schema):
        """
        Format the provided dataframe as per the provided schema.
        :return formatted dataframe as per the schema and the updated schema.
        """
        schema['castingDone'] = True
        # Normalize the column names
        dataFrame.columns = self.normalize_column_names(dataFrame.columns)

        # Format as date
        try:
            dataFrame[schema.loc[schema.dataType == 'Datetime',
                                 'colName'].tolist()] = \
                dataFrame[schema.loc[schema.dataType == 'Datetime',
                                     'colName'].tolist()].apply(pd.to_datetime)
        except Exception as msg:
            self.logger.exception("Could not update datatype to datetime")
            schema.loc[schema.dataType == 'Datetime', 'castingDone'] = False

        # Format as integer
        try:
            dataFrame[schema.loc[schema.dataType == 'Integer',
                                 'colName'].tolist()] = \
                dataFrame[schema.loc[schema.dataType == 'Integer',
                                     'colName'].tolist()].apply(
                    lambda x: pd.to_numeric(
                        x.astype("int"), downcast="integer"))
        except Exception as msg:
            self.logger.exception("Could not update datatype to integer")
            schema.loc[schema.dataType == 'Integer', 'castingDone'] = False

        # Format as float
        try:
            dataFrame[schema.loc[schema.dataType == 'Decimal',
                                 'colName'].tolist()] = \
                dataFrame[schema.loc[schema.dataType == 'Decimal',
                                     'colName'].tolist()].apply(
                    lambda x: pd.to_numeric(
                        x.astype("float"), downcast="float"))
        except Exception as msg:
            self.logger.exception("Could not update datatype to float")
            schema.loc[schema.dataType == 'Decimal', 'castingDone'] = False

        # Format as boolean
        try:
            dataFrame[schema.loc[schema.dataType == 'Boolean',
                                 'colName'].tolist()] = \
                dataFrame[schema.loc[schema.dataType == 'Boolean',
                                     'colName'].tolist()].apply(
                    lambda x: x[x.isnull() == False].astype('uint8'))

        except Exception as msg:
            self.logger.exception("Could not update datatype to boolean")
            schema.loc[schema.dataType == 'Boolean', 'castingDone'] = False

        # Format as text/categorical
        try:
            object_types = schema.loc[
                schema.dataType.isin(
                    ["Categorical", "Text"]), 'colName'].tolist()
            if len(object_types) > 0:
                dataFrame[object_types] = dataFrame[object_types].apply(
                    lambda x: np.where(pd.isnull(x), x, x.astype(str)))
        except Exception as msg:
            self.logger.exception(
                "Could not update datatype to categorical or text")
            schema.loc[
                schema.colName.isin(object_types), 'castingDone'] = False

        # Update the schema
        schema.loc[schema.castingDone == False, "dataType"] = \
            schema.loc[schema.castingDone == False, "memType"]

        return dataFrame, schema

    @staticmethod
    def formulate_schema(df, generated_columns=[]):
        '''
        formulate the dataframe into schema dict object
        :param df: inpiut dataframe
        :param generated_columns: columns which are autogenerated
        :return: dictionary having key colName, dataType and isAutoGenerated
        '''
        df['isAutoGenerated'] = df['colName'].apply(
            lambda col: True if col in generated_columns else False)

        schema = df.to_dict(orient='records')
        return schema

    @staticmethod
    def get_output_schema(df):
        """
        Just get the info of the df.
        :param df: Input dataframe
        :return: Dataframe with schema
        """
        dtypes = df.dtypes.to_frame("dataType")
        dtypes.reset_index(inplace=True)
        dtypes.columns = ["colName", "dataType"]
        get_dtype = lambda x: "Object" if str(x) == 'object' else "Datetime" \
            if str(x).find("date") > -1 else "Number"
        dtypes.dataType = dtypes.dataType.map(get_dtype)
        return dtypes
