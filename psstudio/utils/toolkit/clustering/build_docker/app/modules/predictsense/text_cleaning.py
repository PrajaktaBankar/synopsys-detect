# -*- coding: utf-8 -*-
"""
created on Thr Jan 21 18:05:15 2020
Author: Saurabh
"""

import re
import string

import numpy as np
from contractions import contractions_dict
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import word_tokenize
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.exceptions import NotFittedError
from textblob import TextBlob

from .custom_exceptions import InvalidSchema
from .build_schema import DataFrameSchema

lemmatizer = WordNetLemmatizer()
ps = PorterStemmer()


class TextCleaningTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, logger, input_schema=None):
        self.logger = logger
        self.input_features = []
        self.input_schema = input_schema if input_schema is not None else []
        self.output_schema = []

    @staticmethod
    def _expand_contractions(text):
        '''
        expand the given text eg: couldn't -> could not
        :param text: input string
        :return: expanded string
        '''
        pattern = re.compile(
            "({})".format("|".join(contractions_dict.keys())),
            flags=re.DOTALL | re.IGNORECASE)

        def replace_text(t):
            txt = t.group(0)
            if txt.lower() in contractions_dict.keys():
                return contractions_dict[txt.lower()]

        expand_text = pattern.sub(replace_text, text)
        return expand_text

    @staticmethod
    def _remove_repeated_characters(word):
        '''
        this function removes the repeated chars in a word
        :param word: input string
        :return: clean words without repeating chars
        '''
        pattern = re.compile(r"(\w*)(\w)\2(\w*)")
        substitution_pattern = r"\1\2\3"
        while True:
            if wordnet.synsets(word):
                return word
            new_word = pattern.sub(substitution_pattern, word)
            if new_word != word:
                word = new_word
                continue
            else:
                return new_word

    def _text_processing(self, input_data):
        '''
        This function cleans the text as per below functions
        :param input_data: input string
        :return: clean text
        '''
        # setting to lower
        input_data = input_data.lower()

        # Removing small words
        words = ' '.join(word for word in input_data.split() if len(word) > 3)

        # removing urls from text
        # http matches literal characters
        # \S+ matches all non-whitespace characters (the end of the url)
        # we replace with the empty string
        input_data = re.sub(r"http\S+", "", words)

        # Fixes contractions such as `you're` to you `are`
        expanded_text = self._expand_contractions(input_data)

        # White spaces removal
        input_str = expanded_text.strip()

        # removing numbers
        number_free_text = re.sub(r'\d+', '', input_str)

        # Punctuation removal
        punctuation_free_text = number_free_text.translate(
            str.maketrans('', '', string.punctuation))

        # converting sentence into tokens
        tokens = word_tokenize(punctuation_free_text)

        # # removing stop words
        # stop_words = set(stopwords.words('english'))
        #
        # nostopwods = [word for word in tokens if not word in stop_words]

        # morphological analysis of the words studies->study
        # Now just remove along with stemming words
        nostemwords = [ps.stem(lemmatizer.lemmatize(word)) for word in
                       tokens]

        # keeping same order of text
        output = sorted(set(nostemwords), key=nostemwords.index)

        # removing repeated chars
        without_repeated_chars = [self._remove_repeated_characters(s) for s in
                                  output]

        # correcting the spelling of text
        correct_spelling_text = [str(TextBlob(words).correct()) for words in
                                 without_repeated_chars]

        clean_text = ' '.join(correct_spelling_text)

        return clean_text

    def fit(self, X=None, y=None):
        if len(self.input_schema) == 0:
            self.input_schema = DataFrameSchema(self.logger) \
                .get_formatted_data_and_schema(X)[0]
        self.input_features = self.input_schema.loc[
            self.input_schema.dataType == 'Text', "colName"].to_list()
        return self

    def fit_transform(self, X, y=None, **fit_params):
        _ = self.fit(X=X, y=y)
        return self.transform(X=X, y=y)

    def transform(self, X=None, y=None):

        if len(self.input_schema) == 0:
            raise NotFittedError("""This TextCleaningTransformer instance is not fitted yet.
                                Call 'fit' with appropriate arguments before using this estimator.""")
        else:
            if len(set(self.input_features).difference(X.columns)) > 0:
                raise InvalidSchema(
                    "Input schema is invalid for the Text "
                    "Cleaning transformer.")

        for col in self.input_features:
            X[col] = np.vectorize(self._text_processing)(X[col])

        return X
