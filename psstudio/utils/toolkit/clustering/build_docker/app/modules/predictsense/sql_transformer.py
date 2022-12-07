import pymssql

import mysql.connector
import pandas as pd
import psycopg2
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.exceptions import NotFittedError

from .custom_exceptions import InvalidSchema
from .build_schema import DataFrameSchema


class SqlTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, logger, sql_object):

        self.logger = logger
        self.input_schema = []
        self.output_schema = []
        self.task_type = sql_object['task_type']
        self.server = sql_object['server']
        self.port = str(sql_object['port'])
        self.database = sql_object['database']
        self.username = sql_object['username']
        self.password = sql_object['password']
        self.trusted = sql_object['username'] is None
        self.driver = sql_object['driver']
        self.query = sql_object['query']

    def _get_schema(self, cursor):
        '''
        Calculates schema of the dataset such as datatypes of column
        :param cursor: database connection object to execute sql
        :return: dictionary in form of field_name and field_type
        '''
        if self.task_type != "mongo":
            return [{"colName": column[0], "dataType": column[1]} for column
                    in cursor]
        else:
            pass

    def _get_config(self):
        """
        Return the configuration of the transformer.
        """
        return {
            "input_schema": self.input_schema,
            "output_schema": self.output_schema
        }

    def _create_connection(self):
        '''
        creates database connect with different database sources
        :return: cursor and db connection object
        '''
        if self.task_type == 'mssql':

            db_connection = pymssql.connect(server=self.server,
                                            port=self.port,
                                            user=self.username,
                                            password=self.password,
                                            database=self.database)
            cursor = db_connection.cursor()
        elif self.task_type == 'mysql':
            db_connection = mysql.connector.connect(user=self.username,
                                                    password=self.password,
                                                    host=self.server,
                                                    port=self.port,
                                                    database=self.database)
            cursor = db_connection.cursor(buffered=True)
        elif self.task_type == 'postgresql':
            db_connection = psycopg2.connect(database=self.database,
                                             user=self.username,
                                             password=self.password,
                                             host=self.server,
                                             port=self.port
                                             )
            cursor = db_connection.cursor()
        elif self.task_type == 'mongodb':
            pass
        return cursor, db_connection

    def fit(self, X=None, y=None):

        cursor, db_connection = self._create_connection()
        cursor.execute(self.query)
        self.input_schema = self._get_schema(cursor.description)
        cursor.close()
        return self

    def transform(self, X=None, y=None):

        if len(self.input_schema) == 0:
            raise NotFittedError("""This SqlTransformer instance is not fitted yet. 
                                Call 'fit' method with appropriate arguments before using this estimator.""")
        else:
            cursor, db_connection = self._create_connection()
            cursor.execute(self.query)
            if not DataFrameSchema.is_schema_valid(self.input_schema,
                                                   self._get_schema(
                                                       cursor.description
                                                   )):
                raise InvalidSchema(
                    "Input schema is invalid for the transformer.")

        cursor.close()
        df = pd.read_sql_query(self.query, db_connection)
        self.output_schema, df = DataFrameSchema(
            self.logger).get_formatted_data_and_schema(df)
        return df
