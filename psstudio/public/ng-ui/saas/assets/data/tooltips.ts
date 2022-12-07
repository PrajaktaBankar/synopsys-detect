/**
 * Tootips data array
 */
export const TOOLTIP_ARRAY: Array<any> = [
  {
    name: 'development',
    info: 'Development is subset of the original dataset, which is used to perform cross validation and parameter tuning',
  },
  {
    name: 'crossValidation',
    info: 'Cross-validation is a technique used to prevent over-fitting in a predictive model That is, to use a limited sample in order to estimate how the model is expected to perform in general',
  },
  {
    name: 'holdout',
    info: 'Holdout is unseen subset of the original dataset on which model performance has been measured',
  },
  {
    name: 'scoringResult',
    info: 'Scoring is user specific dataset to check how model performs on unseen dataset by measuring performance metrics',
  },
  {
    name: 'overallScore',
    info: 'Quantification of the performance on various metrics',
  },
  {
    name: 'rSquared',
    info: "Statistical measure that represents the proportion of the variance for a dependent feature that's explained by an independent feature(s). If we have rSquared greater and less than 1, that has no logical meaning and may result from the small sample size",
  },
  {
    name: 'adjustedRsquared',
    info: 'Modified version of R-squared that has been adjusted for the number of predictors in the model. If we have more features (explanatory variables) than observations, the adjusted R squared will be negative',
  },
  {
    name: 'targetFeature',
    info: 'Target feature is a dependent feature whose values are to be predicted',
  },
  {
    name: 'explainedVarianceScore',
    info: 'Explained Variance Score is used to measure the discrepancy between a model and actual data, in other words it is a measure of how far observed values differ from the average of predicted values',
  },
  {
    name: 'regressionLine',
    info: 'Regression line means a connection between data points in a set, which is used to describe the interrelation of a dependent feature with one or many independent feature(s)',
  },
  {
    name: 'analysisReport',
    info: 'The process of exploring data and reports in order to extract meaningful insights, which can be used to better understand and improve business performance',
  },
  {
    name: 'learningCurve',
    info: 'Learning curve is deemed effective tools for monitoring the performance, a plot that shows the score/error on training set and validation set, which provides information on over-fitting of the model',
  },
  {
    name: 'trainingTime',
    info: 'Time taken in training',
  },
  {
    name: 'quickPrediction',
    info: 'Predict outcome',
  },
  {
    name: 'rocAucScore',
    info: 'Roc Auc score is performance measurement metrices for classification ROC is a probability curve and AUC represents degree or measure of separability It tells how much model is capable of distinguishing between classes',
  },
  {
    name: 'liftAndGain',
    info: 'Gain charts shows Predicted positive rates vs True positive rates. Lift is a measure of the effectiveness of a predictive model calculated as ratio between the results obtained with and without the predictive model. The greater the area between the lift curve and the baseline, the better the model',
  },
  {
    name: 'mathewCoeff',
    info: 'It takes into account true and false positives and negatives and is generally regarded as a balanced measure of classification. The MCC is in essence a correlation coefficient value between -1 and +1 A coefficient of +1 represents a perfect prediction, 0 an average random prediction and -1 an inverse prediction',
  },
  {
    name: 'classificationReport',
    info: 'The classification report visualizer displays the precision, recall, F1 and support scores for the model, it is a representation of the main classification metrics on a per-class basis',
  },
  {
    name: 'f1',
    info: 'F1 score combines precision and recall relative to a specific positive class, it score can be interpreted as a weighted average of the precision and recall, where an F1 score reaches its best value at 1 and worst at 0',
  },
  {
    name: 'confusionMatrix',
    info: 'A confusion matrix is a summary of prediction results on a classification problem, The number of correct and incorrect predictions are summarized with count values and broken down by each class',
  },
  {
    name: 'analysisReport',
    info: 'The process of exploring data and reports in order to extract meaningful insights, which can be used to better understand and improve business performance',
  },
  {
    name: 'modelScore',
    info: 'Performance of a model after training the dataset',
  },
  {
    name: 'Mean Square Error',
    info: 'MSE is a measure of the quality of an estimator, it is the average squared difference between the estimated values and the actual value',
  },
  {
    name: 'Mean Absolute Error',
    info: 'MAE measures the average magnitude of the errors in a set of predictions, an average of the absolute errors that measure of difference between two continuous variables',
  },
  {
    name: 'Root Mean Square Error',
    info: "RMSE is the square root of the variance of the residuals It indicates the absolute fit of the model to the data, how close the observed data points are to the model's predicted values",
  },
  {
    name: 'Median Square Error',
    info: 'The measure of the differences between values predicted by a model or an estimator and the values observed',
  },
  {
    name: 'Mean Square Log Error',
    info: 'The measure of the ratio between the true and predicted values',
  },
  {
    name: 'accuracy',
    info: 'The ratio of correct predictions to the total number of predictions',
  },
  {
    name: 'Log Loss',
    info: 'It measures the performance of a classification model where the prediction input is a probability value between 0 and 1',
  },
  {
    name: 'Hamming Loss',
    info: 'The fraction of labels that are incorrectly predicted, i.e. the fraction of the wrong labels to the total number of labels',
  },
  {
    name: 'randomSearch',
    info: 'Random search is a technique where random combinations of the hyper-parameters are used to find the best solution for the built model',
  },
  {
    name: 'parameterTuning',
    info: "Process of maximizing a model's performance by choosing the optimal parameters for a learning algorithm, so that model can optimally solve the business problem",
  },
  {
    name: 'bayesianOptimization',
    info: 'Bayesian Optimization helps to find a best model among many, this optimization technique is based on randomness and probability distributions',
  },
  {
    name: 'bagging',
    info: 'Bagging is designed to improve the stability and accuracy of ML models, it also reduces variance and helps to avoid over-fitting',
  },
  {
    name: 'boosting',
    info: 'Boosting refers to a family of algorithms which converts weak learner to strong learners, for improving the model predictions of any given learning algorithm. It also helps to reduce bias and variance',
  },
  {
    name: 'compareModels',
    info: 'Comparison of multiple models based on the various metrics',
  },
  {
    name: 'timeVsAccuracy',
    info: 'Graph represents the accuracy of model based on the training time',
  },
  {
    name: 'data',
    info: 'Data can be information and facts collected for further analysis',
  },
  {
    name: 'eda',
    info: 'EDA is process of performing initial investigations on data so as to discover patterns, to spot anomalies, to test hypothesis with the help of summary statistics and graphical representations',
  },
  {
    name: 'trainmodel',
    info: 'In train mode, model is generated based the target and machine learning algorithms selected by user for further predictions',
  },
  {
    name: 'auto',
    info: 'Auto eda handles missing value calculation and imputation strategy, calculates various statistics details, Handles outlier with auto defined strategies',
  },
  {
    name: 'manual',
    info: 'Manual eda handles missing value calculation and imputation strategy, calculates various statistics details, Handles outlier where user can select various strategies to handle all these processes',
  },
  {
    name: 'multivariateAnalysis',
    info: 'It shows graphical representation of features with statistical details. With more than one feature the comparison of different features in the form of bar plot, box plot, scatter plot, line etc is shown',
  },
  {
    name: 'edaReport',
    info: 'EDA report is a pandas profiling method which generates a basic report of the data having information about the dataframe overview, attributes of it, correlations, missing values, samples, etc',
  },
  {
    name: 'shareReport',
    info: 'Share the generated EDA report with other users working on the same project',
  },
  {
    name: 'edaSummary',
    info: 'It represents the summary of EDA with count of unique and missing values, mean, median, mode and various strategies to handle outlier and missing values',
  },
  {
    name: 'imputationPreview',
    info: 'It shows the dataset entries for which missing values are handled after EDA process',
  },
  {
    name: 'outlierPreview',
    info: 'It shows the dataset entries for which outliers are handled after EDA process',
  },
  {
    name: 'imputedDataset',
    info: 'Dataset with all imputation done during eda process, in which all missing values, datatype change and outliers are reflected',
  },
  {
    name: 'imputationFeature',
    info: 'If user knows target variable in advance then selecting that as imputation feature, all the operations of manual eda are handled according to the imputation feature',
  },
  {
    name: 'validationStrategy',
    info: 'Validation techniques are used to get the error rate of the ML model, which can be considered as close to the true error rate of the population',
  },
  {
    name: 'crossValidation',
    info: 'Cross-validation is used  to estimate the skill of a ML model on unseen data. That is, to use a limited sample in order to estimate how the model is expected to perform in general when used to make predictions on data not used during the training of the model',
  },
  {
    name: 'kFold',
    info: 'K-Fold CV is where a given data set is split into a K number of sections/folds where each fold is used as a testing set at some point',
  },
  {
    name: 'stratifiedKFold',
    info: 'Stratification is the process of rearranging the data as to ensure each fold is a good representative of the whole. For example in a binary classification problem where each class comprises 50% of the data, it is best to arrange the data such that in every fold, each class comprises around half the instances',
  },
  {
    name: 'stratifiedShuffleSplit',
    info: 'In ShuffleSplit, the data is shuffled every time, and then split. This means the test sets may overlap between the splits',
  },
  {
    name: 'timeSeriesSplit',
    info: 'In time Series cv, time series data samples that are splitted  at fixed time intervals, in train/test sets. In each split, test indices must be higher than before, and thus shuffling in cross validator is inappropriate',
  },
  {
    name: 'hyperParameterTuning',
    info: 'Hyper-parameter tuning refers to the automatic optimization of the hyper-parameters of a ML model. Hyper-parameters are all the parameters of a model which are not updated during the learning and are used to configure either the model or the algorithm used to lower the cost function',
  },
  {
    name: 'algorithmParameters',
    info: 'Algorithm parameters are the parameters whose values are used to control the learning process and for determining the model parameters that an algorithm ends up learning',
  },
  {
    name: 'dimensionalityReduction',
    info: 'Dimensionality reduction is the process of reducing the number of random variables under consideration, by obtaining a set of principal variables. It can be divided into feature selection and feature extraction',
  },
  {
    name: 'PCA',
    info: 'Principal Component Analysis(PCA) is one of  linear dimension reduction. PCA is a projection based method which transforms the data by projecting it onto a set of orthogonal axes',
  },
  {
    name: 'featureScaling',
    info: 'Feature Scaling is a technique to standardize the independent features present in the data in a fixed range. It is performed during the data pre-processing to handle highly varying magnitudes or values or units',
  },
  {
    name: 'standardScaler',
    info: 'Standard Scaler removes the mean and scales each feature/variable to unit variance and can be helpful in cases where the data follows a Normal/Gaussian distribution',
  },
  {
    name: 'robustScaler',
    info: 'The Robust Scaler uses the interquartile range for scaling, so that it is robust to outliers',
  },
  {
    name: 'normalizationMethod',
    info: 'The goal of normalization is to change the values of numeric columns in the dataset to a common scale, without distorting differences in the ranges of values and it is good to use when you know that the distribution of your data does not follow a Normal/Gaussian distribution',
  },
  {
    name: 'minmax_scaler',
    info: 'It transforms features by scaling each feature to a given range.Min max  scales and translates each feature individually such that it is in the given range on the training set, e.g. between 0 and 1',
  },
  {
    name: 'quantile_transform',
    info: 'It transforms the features to follow a uniform or a normal distribution. It  reduces the impact of outliers',
  },
  {
    name: 'power_transform',
    info: 'Power Transformer will apply zero-mean, unit-variance normalization to the transformed output by default',
  },
  {
    name: 'log_transform',
    info: 'It transforms the features to follow a uniform or a normal distribution. It reduces the impact of outliers',
  },
  {
    name: 'imbalanceDatasetHandling',
    info: 'Imbalanced data typically refers to classification tasks where the classes are not represented equally',
  },
  {
    name: 'overSampling',
    info: 'Oversampling can be defined as adding more copies of the minority class',
  },
  {
    name: 'underSampling',
    info: 'Undersampling can be defined as removing some observations of the majority class',
  },
  {
    name: 'trend',
    info: 'A general systematic linear or nonlinear component that changes over time and does not repeat',
  },
  {
    name: 'seasonal',
    info: 'A general systematic linear or nonlinear component that changes over time and does repeat      ',
  },
  {
    name: 'residuals',
    info: 'The “residuals” in a time series model are what is left over after fitting a model. Residuals are useful in checking whether a model has adequately captured the information in the data',
  },
  {
    name: 'observed',
    info: 'The Actual values of a feature in a dataset',
  },
  {
    name: 'summaryTable',
    info: 'It shows summary of forecasting with selected features with coefficient, std and z score',
  },
  {
    name: 'losses',
    info: 'Loss metrices for model',
  },
  {
    name: 'forecasting',
    info: 'Forecast/predict future values for specified date range',
  },
  {
    name: 'clusterVisualization',
    info: 'It shows the population or data points into a number of groups such that data points in the same groups are more similar to other data points in the same group and dissimilar to the data points in other groups',
  },
  {
    name: 'featureselection',
    info: 'Feature selection is a technique where we choose those features in our data that contribute most to the target variable',
  },
  {
    name: 'selectKbest',
    info: 'Select features according to the k highest scores',
  },
  {
    name: 'selectPercentile',
    info: 'Select features according to a percentile of the highest scores',
  },
  {
    name: 'scoringFunction',
    info: 'Based on the selected method score for each feature is calculated',
  },
  {
    name: 'factorAnalysis',
    info: 'Factor analysis is a technique that is used to reduce a large number of variables into fewer numbers of factors',
  },
  {
    name: 'featureScore',
    info: 'Feature score represents the score of different features, as well as in tabular view it shows what features are used for model training',
  },
  {
    name: 'createProject',
    info: 'Create a new project',
  },
  {
    name: 'importProject',
    info: 'Import an existing project into this instance and use it for experiment',
  },
  {
    name: 'projectTemplates',
    info: 'Choose and import sample projects',
  },
  {
    name: 'users',
    info: 'PredictSense Users',
  },
  {
    name: 'help',
    info: 'Help Section',
  },
  {
    name: 'settings',
    info: 'Settings',
  },
  {
    name: 'fileUpload',
    info: 'Upload a file from a local device',
  },
  {
    name: 'pullUrl',
    info: 'Pull data from URL where data is available in JSON or CSV format',
  },
  {
    name: 'msSql',
    info: 'Create a data connection from MSSQL database',
  },
  {
    name: 'mySql',
    info: 'Create a data connection from MySQL database',
  },
  {
    name: 'postgre',
    info: 'Create a data connection from PostgreSQL database',
  },
  {
    name: 'Sftp',
    info: 'Create a data connection from SFTP server',
  },
  {
    name: 'snowflake',
    info: 'Create a data connection from Snowflake database',
  },
  {
    name: 'amazons3',
    info: 'Create a data connection from Amazon S3 server',
  },
  {
    name: 'dataSources',
    info: 'Data Sources from which data connection will be created',
  },
  {
    name: 'dataSet',
    info: 'Data sets represents structured files which can be used for model building process',
  },
  {
    name: 'selectDataSetEda',
    info: 'Dataset of all the data points, on which EDA Summary will be computed',
  },
  {
    name: 'selectDataSetTraining',
    info: 'Dataset of all the data points, on which predictions will be computed',
  },
  {
    name: 'selectTarget',
    info: 'Target selection on which prediction will be computed',
  },
  {
    name: 'selectAlgorithm',
    info: 'Algorithm selection on which model will be trained',
  },
  {
    name: 'featureGeneration',
    info: 'Feature generation is the process of creating new features from one or multiple existing features',
  },
  {
    name: 'transformation',
    info: 'Transform features by applying different scaling and normalization techniques',
  },
  {
    name: 'featureReduction',
    info: 'Features reduction are done by selecting best features and applying dimensionality reduction techniques',
  },
  {
    name: 'sampling',
    info: 'Sampling is a process in which a predetermined number of observations are taken from a larger population',
  },
  {
    name: 'validationStr',
    info: ' Select validation strategy for splitting validation dataset',
  },
  {
    name: 'hpt',
    info: 'Algorithm parameters to use for training the model',
  },
  {
    name: 'trainTestSplit',
    info: 'Split dataset by selecting size of test data',
  },
  {
    name: 'pairWiseLinear',
    info: 'This generator generates A+B and A-B features, for each pair of numerical features',
  },
  {
    name: 'pairWisePolynomial',
    info: 'This generator generates A*B features, for each pair of numerical features',
  },
  {
    name: 'univariatePolynomial',
    info: 'This generator generates A^2 or A^3 features, for each numerical features based on the specified exponent',
  },
  {
    name: 'splitFeatureGeneration',
    info: 'This generator generates ABC_XYZ to ABC and XYZ as new features based on delimiter with specified number of count',
  },
  {
    name: 'explicitPairwiseCombination',
    info: 'This generator generates pairwise combination on the explicit features selected by the user',
  },
  {
    name: 'selectIndex',
    info: 'This selection lets you to make dataset with datetime index, as most of algorithm support datetime index for timeseries problem',
  },
  {
    name: 'visualiseComponent',
    info: 'Visualise component represents the timeseries components, which involves: Trend, Seasonal, Residuals and Observed',
  },
  {
    name: 'seasonalComponent',
    info: 'In the additive model, the behavior is linear where changes over time are consistently made by the same amount, like a linear trend. In the multiplicative model, trend and seasonal components are multiplied and then added to the error component. It is not linear',
  },
  {
    name: 'frequency',
    info: 'Frequency defines the periodicity of a datetime indexed dataset',
  },
  {
    name: 'stationarityTest',
    info: 'A timeseries data is stationary or not, stationarity means that the statistical properties of a process generating a time series do not change over time',
  },
  {
    name: 'resampling',
    info: 'Resampling involves changing the frequency of your time series observations',
  },
  {
    name: 'adf',
    info: 'The Dickey Fuller test is one of the most popular statistical tests. It can be used to determine if the series is stationary or not. If the test statistic is less than the critical value, we can reject the null hypothesis (aka the series is stationary)',
  },
  {
    name: 'resamplingFrequency',
    info: 'Rule/Frequency on which data will be resampled',
  },
  {
    name: 'resamplingMethod',
    info: 'Aggregate function to group the resampling frequency',
  },
  {
    name: 'startDate',
    info: 'Date from where the forecast is required',
  },
  {
    name: 'endDate',
    info: 'Date till where the forecast is required',
  },
  {
    name: 'precisionRecall',
    info: 'Precision-Recall is a useful measure of success of prediction when the classes are very imbalanced. In information retrieval, precision is a measure of result relevancy, while recall is a measure of how many truly relevant results are returned',
  },
  {
    name: 'retrain',
    info: ' Retraining  refers to re-running the process that generated the previously selected model on a new training set of data',
  },
  {
    name: 'featureImportance',
    info: 'Feature importance in tree based models is more likely to actually identify which features are most influential when differentiating your classes, provided that the model performs well',
  },
  {
    name: 'featureCoefficient',
    info: 'The feature coefficient in linear based models contain the coefficients for the prediction of each of the targets. It is also the same as if you trained a model to predict each of the targets separately',
  },
  {
    name: 'clusterScatterPlot',
    info: 'A Scatter plot shows the distribution of different clusters with cluster centroids of each cluster',
  },
  {
    name: 'clusterPieChart',
    info: 'The pie chart shows the percentage and total count of different clusters with respect to distribution of clusters',
  },
  {
    name: 'missingThreshold',
    info: 'Missing threshold sets the threshold value for number of missing values. If the number of missing values exceeds the threshold values, then the respective column would be dropped from the dataset',
  },
  {
    name: 'pipeline',
    info: 'A machine learning pipeline is used to help automate machine learning workflows. They operate by enabling a sequence of data to be transformed and correlated together in a model that can be tested and evaluated to achieve an outcome',
  },
  {
    name: 'metrics',
    info: 'Metrices are a calculation of model performance score based on a mathematical calculation of different parameters',
  },
  {
    name: 'silhouetteCoefficient',
    info: 'The Silhouette Coefficient is model performance score based on data points of clusters. The score is bounded between -1 for incorrect clustering and +1 for highly dense clustering. Scores around zero indicate overlapping clusters',
  },
  {
    name: 'daviesBouldinIndex',
    info: 'This index signifies the average ‘similarity’ between clusters, where the similarity is a measure that compares the distance between clusters with the size of the clusters themselves.  Values closer to zero indicate a better partition',
  },
  {
    name: 'calinskiHarabaszIndex',
    info: 'The score is defined as ratio between the within-cluster dispersion and the between-cluster dispersion. A higher Calinski-Harabasz score relates to a model with dense and well separated clusters. It is also known as the Variance Ratio Criterion',
  },
  {
    name: 'autoCorrelation',
    info: 'Auto correlation measures the linear relationship between lagged values  of a time series',
  },
  {
    name: 'pafcMethod',
    info: 'A partial autocorrelation is a summary of the relationship between an observation in a time series with observations at prior time steps with the relationships of intervening observations removed',
  },
  {
    name: 'ywunbiased',
    info: ' yule walker with bias correction in denominator for acovf',
  },
  {
    name: 'ywmle',
    info: 'yule walker without bias correction',
  },
  {
    name: 'ols',
    info: ' regression of time series on lags of it and on constant',
  },
  {
    name: 'nlags',
    info: 'Number of lags on which correlation will be computed',
  },
  {
    name: 'refit',
    info: 'It refers to refitting the data using pipeline on a new data, as data can have different distribution so pipeline should record those',
  },
  {
    name: 'transform',
    info: 'It refers to transforming the new data using pipeline, because data has similar distribution as existing',
  },
  {
    name: 'decisionTree',
    info: 'A decision tree is a flowchart-like structure in which each internal node represents a test on an attribute, each branch represents the outcome of the test, and each leaf node represents a class label (decision taken after computing all attributes)',
  },
  {
    name: 'limeReport',
    info: 'LIME (Local Interpretable Model-agnostic Explanations) is a novel explanation technique that explains the prediction of any regressor/ classifier in an interpretable and faithful manner by learning a interpretable model locally around the prediction',
  },
  {
    name: 'imputationFeature',
    info: 'Replacement of missing values by the most frequent category is the equivalent of mean/median imputation. It consists of replacing all occurrences of missing values within a variable by the mean of the categorical/boolean variable',
  },
  {
    name: 'evaluateForecast',
    info: 'Evaluation of the quality of a forecast by comparing the forecast values with actual values of the target value over a forecast period',
  },
  {
    name: 'mergeDataset',
    info: 'Data merging is the process of combining two or more data sets into a single data set. Most often, this process is necessary when you have raw data stored in multiple files, worksheets, or data tables, that you want to analyze all in one go',
  },
  {
    name: 'chi2',
    info: 'The  chi2(χ2)  test is used in statistics to test the independence of two events. More specifically in feature selection we use it to test whether the occurrence of a specific term and the occurrence of a specific class are independent',
  },
  {
    name: 'f_classif',
    info: 'Used only for categorical targets and based on the Analysis of Variance (ANOVA) statistical test',
  },
  {
    name: 'mutual_info_classif',
    info: 'Used only for categorical targets and based on the Analysis of Variance (ANOVA) statistical test',
  },
  {
    name: 'f_regression',
    info: 'The F value in regression is the result of a test where the null hypothesis is that all of the regression coefficients are equal to zero.  Basically, the f-test compares your model with zero predictor variables (the intercept only model), and decides whether your added coefficients improved the model',
  },
  {
    name: 'mutual_info_regression',
    info: 'Mutual information between two random variables is a non-negative value, which measures the dependency between the variables. It is equal to zero if and only if two random variables are independent, and higher values mean higher dependency',
  },
  {
    name: 'calculateFeatureScore',
    info: 'Calculate the relationship between each input variable and the target variable using statistics and selecting those input variables that have the strongest relationship with the target variable',
  },
  {
    name: 'mergeDatasetRowWise',
    info: 'Merge dataset by performing a database-style join operation by rows',
  },
  {
    name: 'mergeDatasetColumnWise',
    info: 'Merge dataset by performing a database-style join operation by columns',
  },
  {
    name: 'dataConnections',
    info: 'Data connection helps us to connect with different data sources and pull data to PredictSense',
  },
  {
    name: 'refit',
    info: 'It refers to refitting the data using pipeline on a new data, as data can have different distribution so pipeline should record those',
  },
  {
    name: 'transform',
    info: 'It refers to transforming the new data using pipeline, because data has similar distribution as existing',
  },
  {
    name: 'scalarValue',
    info: 'A numeric value which is getting added to the values of selected features to avoid infinite value',
  },
  {
    name: 'logTransformationColumns',
    info: 'Numeric features which will get  transformed',
  },
  {
    name: 'differencing',
    info: 'Differencing is a method which help to stabilise the mean of a time series by removing changes in the level of a time series, and therefore eliminating (or reducing) trend and seasonality',
  },
  {
    name: 'differencing_with_log_transformation',
    info: 'It is a method of making data stationary with the combination of log transformation followed by differening',
  },
  {
    name: 'period',
    info: 'Period represents the number of shifts to be made over the desired axis',
  },
  {
    name: 'scalar',
    info: 'Numeric value which is getting added to the feature values to avoid infinite value case',
  },
  {
    name: 'incomingStats',
    info: 'New data',
  },
  {
    name: 'baselineStats',
    info: 'Existing data',
  },
  {
    name: 'inputFeature',
    info: 'Analyze drift report for the particular feature',
  },
  {
    name: 'varianceIFactor',
    info: 'Explained variance (also called explained variation) is used to measure the discrepancy between a model and actual data',
  },
  {
    name: 'dropOriginal',
    info: 'Drop the existing numeric features from the dataset',
  },
  {
    name: 'stringTransformation',
    info: 'String transformation is the method to change a string value in a column to another desired value',
  },
  {
    name: 'samplingPercentage',
    info: 'Sampling percentage represents the percentage of classes present in the target feature',
  },
  {
    name: 'createDataGroup',
    info: 'Create your folder',
  },
  {
    name: 'createDataConnections',
    info: 'Choose data sources',
  },
  {
    name: 'customFeatureChecked',
    info: 'Decomposition to be performed on set of selected features',
  },
  {
    name: 'NLP',
    info: 'Natural Language Processing, or NLP for short, is broadly defined as the automatic manipulation of natural language, like speech and text, by software',
  },
  {
    name: 'countvectorizer',
    info: 'CountVectorizer is a great tool provided by the scikit-learn library in Python. It is used to transform a given text into a vector on the basis of the frequency (count) of each word that occurs in the entire text',
  },
  {
    name: 'tfidfvectorizer',
    info: ' TF*IDF, or TFIDF, short for term frequency–inverse document frequency, is a numerical statistic that is intended to reflect how important a word is to a document in a collection or corpus',
  },
  {
    name: 'nFeatureCount',
    info: 'A vocabulary that only consider the top max_features ordered by term frequency across the corpus',
  },
  {
    name: 'nlpLanguage',
    info: 'Language used in dataset',
  },
  {
    name: 'stripAccents',
    info: 'The parameter of removing accents and perform other character normalization during the preprocessing step',
  },
  {
    name: 'decodeError',
    info: 'Instruction on what to do if a byte sequence is given to analyze that contains characters not of the given encoding',
  },
  {
    name: 'nGram',
    info: 'An n-gram is a contiguous sequence of n items from a given sample of text or speech. The items can be phonemes, syllables, letters, words or base pairs according to the application. The n-grams typically are collected from a text or speech corpus',
  },
  {
    name: 'ascii',
    info: 'ASCII, abbreviated from American Standard Code for Information Interchange. ASCII is a character encoding that uses numeric codes to represent characters. These include upper and lowercase English letters, numbers, and punctuation symbols',
  },
  {
    name: 'unicode',
    info: 'An international encoding standard for use with different languages and scripts, by which each letter, digit, or symbol is assigned a unique numeric value that applies across different platforms and programs',
  },
  {
    name: 'strict',
    info: "The default decode error handler is 'strict' meaning that decoding errors raise ValueError (or a more codec specific subclass, such as UnicodeDecodeError ).",
  },
  {
    name: 'ignore',
    info: 'Ignore causes the decode error to skip over the invalid bytes',
  },
  {
    name: 'replace',
    info: 'Replace ensures that no error is raised, at the expense of pOk, will check itossibly losing data that cannot be converted to the requested encoding',
  },
  {
    name: 'textCleaning',
    info: 'To bring text into a form that is predictable and analyzable using operations like remove hyperlinks, numbers, words, stemming, lemmatization, etc',
  },
  {
    name: 'posTagging',
    info: 'Part-of-Speech (PoS) tagging,is a task of labelling each word in a sentence with its appropriate part of speech which include nouns, verb, adverbs, adjectives, pronouns, conjunction, etc and their sub-categories',
  },
  {
    name: 'ner',
    info: 'Named-entity recognition (NER) is a subtask of information extraction that seeks to locate and classify named entities mentioned in unstructured text into pre-defined categories such as person names, organizations, locations, medical codes, time expressions, quantities, monetary values, percentages, etc',
  },
  {
    name: 'phraseExtraction',
    info: 'Phrase Extraction is a method which applies syntactic analysis to detect key ideas and trends fast and accurately in any data set. Whether the text is standard, such as news or legislation, or colloquial, such as social media or a blog, analysis is able to extract the main concepts',
  },
  {
    name: 'sentimentAnalysis',
    info: "The process of computationally identifying and categorizing opinions expressed in a piece of text, especially in order to determine whether the writer's attitude towards a particular topic, product, etc. is positive, negative, or neutral",
  },
  {
    name: 'textSummarization',
    info: 'Text summarization refers to the technique of shortening long pieces of text. The intention is to create a coherent and fluent summary having only the main points outlined in the document',
  },
  {
    name: 'wordFrequency',
    info: "The word frequency distribution plot helps us to analyze the word and it's occurance in a set of words/feature from dataset",
  },
  {
    name: 'nlpFeatureConfig',
    info: 'The configuration of parameters used to convert text into a matrix(or vector) of features like Feature count, N-gram, language, etc',
  },
  {
    name: 'nlpFeatureExtractionMethod',
    info: 'Feature extraction method to extract and produce feature representations that are appropriate for the type of NLP techniques to convert text into a matrix(or vector) of features',
  },
  {
    name: 'splitDataset',
    info: 'Splitting the dataset is an essential part of the ML process where we split the dataset into sub parts such as training, validation and testing data',
  },
  {
    name: 'trainDataset',
    info: 'Train dataset is used for model training',
  },
  {
    name: 'devlopmentDataset',
    info: 'Development or Validation dataset is used to perform Cross Validation and Hyper Parameter Tuning',
  },
  {
    name: 'testDataset',
    info: 'Test dataset is used to evaluate the model',
  },
  {
    name: 'contiionalFiltering',
    info: 'Conditional filtering is the process to filter/remove the unwanted data from the dataset',
  },
  {
    name: 'rfe',
    info: 'Recursive feature elimination (RFE) is a feature selection method that fits a model and removes the weakest feature (or features) until the specified number of features is reached',
  },
  {
    name: 'unstructuredFeature',
    info: 'This feature is unstructured. Please process it using data flow or notebook',
  },
  {
    name: 'optimisedCluster',
    info: 'The “elbow” method is used to help data scientists select the optimal number of clusters by fitting the model with a range of values for K.If the line chart resembles an arm, then the “elbow” (the point of inflection on the curve) is a good indication that the underlying model.fits best at that point',
  },
  {
    name: 'clusterAnalysis',
    info: 'The analysis summarizes the properties of each cluster to better guide in assigning a descriptive label',
  },
  {
    name: 'samplePercentage',
    info: 'Percentage of samples in cluster compared to overall dataset',
  },
  {
    name: 'clusterRules',
    info: 'The interpretations describe the percentage change in feature mean for the cluster compared to the overall dataset. For eg. "age is 10% greater than overall dataset" can be interpreted as the mean of feature age in the cluster is 10% greater than that of the overall dataset',
  },
  {
    name: 'uploadScoringData',
    info: 'Upload data to use it for scoring',
  },
  {
    name: 'featureAnalysis',
    info: 'Univariate/multivariate feature analysis using different visualization techniques',
  },
  {
    name: 'Lineplot',
    info: 'A line plot is a timeseries graph that represents the correlation between a feature over certain time period',
  },
  {
    name: 'Barplot',
    info: 'A bar plot is a graph that represents the category of data with rectangular bars which are proportional to the values that they represent',
  },
  {
    name: 'Pieplot',
    info: 'A Pie Chart is a circular statistical plot which is divided into sectors to illustrate numerical proportion, each sector representing a proportion of the whole data',
  },
  {
    name: 'Histogram',
    info: 'A histogram is a graph showing frequency distributions of a numeric feature',
  },
  {
    name: 'Boxplot',
    info: 'A boxplot is a graph to summarize the distribution of a numeric variable for one or several groups to quickly get the median, quartiles, outliers etc in it',
  },
  {
    name: 'scatterplot',
    info: 'A scatter plot is a visual representation of how two variables relate to each other, for example by looking for any correlation between them.'
  },
  {
    name: 'splitDataDatewise',
    info: 'Sort the data with respect to selected date feature and split it in order of that feature instead of random splitting',
  },
  {
    name: 'changeDateFormat',
    info: 'Specify/change the date format of the selected feature which would be used for parsing it as date',
  },
  {
    name: 'target',
    info: 'Target',
  },
  {
    name: 'featureImpact',
    info: "Feature Impact graph displays a chart of model's most important features, ranked by importance.",
  },
  {
    name: 'bagging',
    info: 'Bagging is a homogeneous weak learners model that learns from each other independently in parallel and combines them for determining the model average',
  },
  {
    name: 'boosting',
    info: 'Boosting is also a homogeneous weak learners model but works differently from Bagging. In this model, learners learn sequentially and adaptively to improve model predictions of a learning algorithm',
  },
  {
    name: 'restoreAlgorithm',
    info: 'Restores the deleted algorithm',
  },
  {
    name: 'edAlgorithn',
    info: 'Enables/Disables the algorithm',
  },
  {
    name: 'wordEmbedding',
    info: 'Word Embedding is a language modeling technique used for mapping words to vectors of real numbers. In natural language processing, word embedding is used for the representation of words for Text Analysis, in the form of a vector that performs the encoding of the meaning of the word such that the words which are closer in that vector space are expected to have similar in mean.',
  },
  {
    name: 'ruleBasedMatching',
    info: 'Rule Based Matching allows us to extract the information in a document using a pattern or a combination of patterns. This helps us match token, phrases and entities of words and sentences according to some pre-set patterns along with the features such as parts-of-speech, entity types, dependency parsing, lemmatization and many more.'
  },
  {
    name: 'timeSeriesIds',
    info: 'Columns/features that identify the multiple time series or which are used to group different time series. These indicates which rows belong to each distinct time series'
  },
  {
    name: 'forecastHorizon',
    info: 'The number of time steps to predict after the end of the series'
  },
  {
    name: 'allowedGroups',
    info: 'Name of individual time series (groups) formed using the selected time series ids that were allowed in training based on length of each series and selected parameters'
  },
  {
    name: 'rejectedGroups',
    info: 'Name of individual time series (groups) formed using the selected time series ids that were rejected in training based on length of each series and selected parameters'
  },
  {
    name: 'selectGroup',
    info: 'Select one from the list of individual time series (groups) formed using the selected time series ids for which the following operation should happen'
  }
];
