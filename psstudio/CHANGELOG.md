## Predictsense 5.0.1 has been released with the following headline features 12/10/2022 to 21/10/2022:
-**Bug fixes**:fixed the below listed issues or bugs.		
		*Bug 50760: docker toolkit_lite: for 1st time perdiction is getting fail and for same model working at 2nd time
		*Bug 50877: showing only 1 rbm compoenent in saved experiment added multiple components
		*Bug 50851: number of days left msg is not getting displayed for the users in enterprise build.
		*Bug 51290: for user settings, validity value is not maintaining if it is set to current date or next date in update option
## Predictsense 5.0.0 has been released with the following headline features 19/09/2022 to 11/10/2022:
-**Added user enable/disable and user validity for saas and enterprise** - now sudo user can enable and disbale any user from settings using this feature and also can set the validity for any user for both saas 										  and enterprise.
-**Seperated server for text analysis from backend** - using ps-mono repo seperated the server for text analysis , so if we do any operations for text analysis it will happen from text analysis container or 							       server.
-**Bug fixes**:fixed the below listed issues or bugs.		
		*Bug 50258: save and apply button is taking time to save experiment for text analysis
		*Bug 48239: for old projects, model and QP are not getting disable if algorithm in enabled state is deleted from algorithm setting
		*Bug 49226: For sftp settings, update functionality is not working properly
		*Bug 49454: for attach predictive maintenance project, confusion matrix is not getting properly plotting
		*Bug 49560: quick prediction is not working for predictive modelling projects
		*Bug 49674: abstractive text summarization is failing
		*Bug 49763: merge dataset is not working after clicking on merge button nothing is happened
		*Bug 49767: text summarization and word embedding is not working in text anlysis
		*Bug 50019: for text analysis, save and apply button is not working properly
		*Bug 50026: field validation for firstname, lastname in user settings need to be consistent
		*Bug 50034: getting server error in eda for multi ts while selecting the valid ts id
		*Bug 50119: update functionality is not working properly for users in setting
		*Bug 50179: for attach projects QP and lime report is failing for Text analysis generated file
		*Bug 50343: lime report is failing in models and QP for text.zip project
		*Bug 47557: for deleted algorithm module, letter 'g' is missing from word 'algorithm' in restore confirmation window
		*Bug 47845: for timeseries project if hpt of sarimax and prophet algorithm is disable or enable in settings algorithm it is not getting reflect on models pages
		*Bug 47865: for algorithm module in setting, allow to create new algorithm if name field or algorithm field is kept blank
		*Bug 48198: validation message need to change if algorithm name in settings is updated with deleted algorithm name
		*Bug 48672: reset functionality is not properly working while creating new algorithm in algorithm settings
		*Bug 48415: discarded feature should not get visible for feature distribution dropdown in feature impact
		*Bug 49471: cannot access celery due to indirect dependency issue
		*Bug 49472: cannot read data after integration with tabular_data lib in text analysis
		*Bug 49793: celery was unable to connect to broker on UAT
		*Bug 50062: pscore is not starting after dependency cleanup
		*Bug 50071: ner and pos do not return all tags if drop down is left empty
		*Bug 48548: fix the data conversion for multi-label datasets
		*Bug 48549: data split fails if minority classes are less than 3 samples
		*Bug 48608: data config validation is failing for valid binary classification
		*Bug 48789: issues with celery version after integration of app factory in NLP
		*Bug 48806: add missing requirements for reading excel files in tabular data lib
		*Bug 50387: qp for clustering sample project is failing getting continuous loader
		*Bug 50462: prediciton is failing for ClusteringTA project in both toolkit and toolkit_lite
		*Bug 50409: prediction are not working for both toolkit and toolkit_lite
## Predictsense 4.9.1 has been released with the following headline features 30/08/2022 to 16/09/2022:
   -**Enhanced the high cardinaltiy plot check in feature analysis** - added aggregation method to handle high cardinality problem for two categorical feature like if there is feature a, b,c, d 									       if a is occring 3 times and b is 10 times and c is 1 so by applying the aggregation method it count the repetative count for 									       each and add all rest data in others
   -**Added download prediction button in inference engine**- user can download the predicted result for fileupload option for predictive and clustering model in inference engine.
   -**Bug fixes**:fixed the below listed issues or bugs.		
		*Bug 46344: for multi timeseries eda getting stuck if we change the imputation strategy(except linear, custom, mode, delete)
		*Bug 46391: for feature score graph, labels are getting cut for exam dataset
		*Bug 46415: field validation is missing for select database dropdown in New Database Connection in settings
		*Bug 46512: data connection page pendo guide are not working
		*Bug 46571: for both toolkit, download button and predicted_value column should be consistent
		*Bug 46624: for both toolkit, dashboard training losses table gets break if we have 0 value
		*Bug 46647: for both toolkit, download button is getting visible for form input prediction after file upload prediction is perform and come back to form input prediction
		*Bug 24029: heatmap is not generating properly for clustering
		*Bug 46039: showing wrong tooltip for scoring function is train model advanced option
		*Bug 23394: all db connection form (Mssql, mysql, postgresql), sftp, snowflake, s3 are accepting wrong ps password
		*Bug 46313: for new bigquery connection in settings, connection name input field box width can be increased like we have for new sftp connection
## Predictsense 4.9.0 has been released with the following headline features 02/08/2022 to 29/08/2022:
   -**Added linear regression ts algortihm for multiple timeseries**- this model is from darts python library and it supports multiple timeseries, multivariate, univariate all kinds of forecasting use 						                              cases. this model is  wrapped around linear regressor of scikit-learn.  
   -**Added reject group option for multiple timeseries in models page**-  name of individual time series (groups) formed using the selected timeseries ids that were rejected in training based on length of 										   each series and selected parameters
   -**Added systematic sampling and high cardinality change for feature analysis** - 1.added systamtic sampling for two numeric feature like if user has data which is having 50K rows so it will calculate using 												systamatic sampling by 3 step. so it will take 15K rows records to show the plot.
										     2.added aggregation method to handle high cardinality problem for two categorical feature like if there is feature a, b,c, d 											       if a is occring 3 times and b is 10 times and c is 1 so by applying the aggregation method it count the repetative count for 											       each and add all rest data in others.  
 
   -**Bug fixes**:fixed the below listed issues or bugs.		
		*Bug 38934: seleced target is not visible in feature analysis dropdown list after eda is performed
		*Bug 38223: for toolkit lite, features are getting overlap when form input prediction is selected in construction cost prediction model
		*Bug 38220: for toolkit lite, models are not getting upload, if invalid zip is upload and then try to upload valid model zip
		*Bug 41661: for normal timeseries, in algorithm dropdown getting 4 algorithm instead of 2
		*Bug 41662: for df_2_sku_new , loss table, evaluate forescast, forecast and analysis report is giving error while plotting
		*Bug 41665: for linear regression, on train page steps field is accepting values more that mention value
		*Bug 37872: ridge classification with cross validation is failing if cv is set to 1 in algorithm parameter
		*Bug 37469: for eda, url are detected as text feature in eda summary
		*Bug 37216: eda is failing for single timeseries
		*Bug 37160: In models page plots resampling frequency is not showing proper
		*Bug 30596: validation message for auto correlation needs to change
		*Bug 41743: for normal timeseries, resampling method- same as forward fill giving error while previewing
		*Bug 42312: restrict eda if train and test data has samples less than what we have decided, after applying all transformations
		*Bug 42377: for all project type, generated string from string transformation not getting reflected in analysis report
		*Bug 20489: for cross-validation there should be validation message while selecting dev dataset size on eda page
		*Bug 29234: validation msg in upload model when we select the task type as rule based matching is incorect.
		*Bug 35755: eda tabs for eda report are not working
		*Bug 37345: for clustering agglomerative algorithm fail if wminkowski, haversine, kulsinki distance metric passed in algorithm parameter
		*Bug 39680: QP- keyboard input is failing giving error as url in attached project
		*Bug 39771: QP is failing in attached project giving model url issue
		*Bug 39867: normal timeseries display pop up for select identifier on eda page
		*Bug 40064: for multi-timeseries, in feature analysis getting "there is an error while plotting" message
		*Bug 40277: for new diamond dataset training is getting failed for agglomerative algorithm
		*Bug 40469: for analysis report if column is moved out of table then that column is getting deleted
		*Bug 41122: for model upload through my computer, should only accept zip file format and upload button should not get enable if file is not present
		*Bug 42044: for conditional filtering getting error message for previewing date feature
		*Bug 42183: for multi ts component graph giving "Server Error - Http failure response" message while plotting
		*Bug 42415: for attach pm project lime report is not getting generated
		*Bug 42940: for ridge classification with cv algo retraining is failing for attached project
		*Bug 43132: for single timeseries, after hpt is performed getting continuous loader
		*Bug 43044: feature distribution graph label are getting cut in drift report
		*Bug 43142: for both toolkit, getting continuous loader for prediction if file is not present and clicked on submit
		*Bug 43178: forecast is not working for attached multiple timeseries dataset
		*Bug 43383: labels are getting cut in feature analysis for attach movie dataset
		*Bug 43615: for meal delivery sample project , getting error for analysis report		
		*Bug 43627: docker toolkit is not running showing modulenotfounderror: no module named 'modules.graphs'
		*Bug 43748: analysis report is coming empty for wallmart project		
		*Bug 43837: meal delivery sample project is not getting imported
		*Bug 39864: scheduler is getting stop automatically after first pull .It occurs only once (when machine is started in morning)
		*Bug 41003: for uat instance (http://192.168.0.106:3000) getting "Started file analysing and saving..." snackbar after file gets uploaded
		*Bug 22888: for netflix title dataset in feature analysis plot label is cutting
## Predictsense 4.8.0 has been released with the following headline features 04/07/2022 to 01/08/2022:
   -**Enhanced feature analysis module** - added 3d scatter plot for three numeric combination. It is mathematical representation of three dimensional plotting used to display properties of data.
   -**Multiple timeseries enhancement**- 
					*Updated the multiple timeseries flow for training, evaluating and forecasting.
					*Introduced multi-index so that now along with date, timeseries_ids would be set as index which solved indexing and selecting data issue in case of multiple timeseries.
					*Training flow got changed as trained the model on train data and evaluated on test data for each groups. Then again trained the model on entire data to get forecast 					   	 after entire data's end date.
					*Added validation for forecast horizone (n steps).
					*Updated resampling to avoid changing of original timeseries_ids values.
   -**Clustering model enhancement**- added downloaded svg format option for scatter text plot. 
   -**Bug fixes**:fixed the below listed issues or bugs.
		*Bug 37216: eda is failing for single timeseries
		*Bug 37029: validation message text is showing wrong if we try to activate the license using invalid serial key
		*Bug 36931: activate data json file is not encrypting
		*Bug 37028: license issue in 4.8.0: if machine date is tempered to back date gdm file is getting created and after page refresh showing the login page
		*Bug 37030: when system date is set to future date and again comeback to current date then it is showing license portal
		*Bug 37081: for future date need to show the license deactivated message instead of system date tempered message
		*Bug 35414: for multi timeseries resampling is coming blank in pipeline
		*Bug 36200: Timeseries id got resampled for count of values and sum of values method
		*Bug 36198: eda is failing while using month start frequency and number of unique value in resampling
		*Bug 36283: resampling preview is failing if backward fill or forward fill is selected as method in multi timeseries
		*Bug 36397: for timeseries resampling preview is failing for all methods
		*Bug 37036: for mutlits in models page under pipeline for resampling preview showing wrong value in aggregate function
		*Bug 37039: for multits project for smooth_demand dataset categorical pipeline preview is showing blank
		*Bug 37165: selected ts id is showing in feature dropdown for conditional filtering and string transformation eda advanced options
		*Bug 37217: for single timeseries in train model page under component tab plots are not working showing error in python terminal
		*Bug 37219: autocorrelation plot is not working for single timeseries getting error in python
		*Bug 34102: getting TypeError: unsupported operand type(s) for *: 'NoneType' and 'float' for get forecast plot for time.zip project
		*Bug 35033: for multi timeseries, training is failing for smooth demand dataset
		*Bug 36214: Timeseries_ids are not coming for decomposition, stationarity, auto correlation
		*Bug 36736: training returns nan loss and model does not appear on leaderboard
		*Bug 36781: training fails if target is transformed for smooth demand data
		*Bug 37041: for multi ts in model page timeseris group dropdown coming blank
		*Bug 37229: for multi timeseries number of steps are not coming
		*Bug 37385: forecast is failing and giving error as attached(refer project)
		*Bug 37386: analysis report is giving rename () got unexpected error in attached project
		*Bug 37447: training is failing for multiple ts when selecting text feature
		*Bug 37383: losses required scroll option in model page in multi timeseries
		*Bug 34606: after changing date to future date in core.utils. js getting showing license portal in ui and getting this message in node terminal after every min {"level":"error","message":"Could 				    not find scheduler with that id"}
		*Bug 34111: frequency is not showing in plot in both toolkit and toolkit_lite
		*Bug 33930: for meal sample project analysis report forcasted_value column is coming blank
		*Bug 36648: groupwise outlier detection is not happening correctly
		*Bug 37982: QP is not working for all project type in both toolkit and toolkit_lite
		*Bug 38053: GroupwiseTransformer cannot be imported in both toolkits
		*Bug 38054: Docker build fails due to the requirements formatting for both toolkits
		*Bug 38056: requirements.json in toolkit_lite build is empty
## Predictsense 4.7.0 has been released with the following headline features 06/06/2022 to 01/07/2022:
   -**Enhanced sample project form and sample project in settings module**-
								*added tag option in sample project creation under settings module
								*added search option in sample project form to search project using tags name, project name etc.
								*added domain wise filter dropdown so user can search project for specific domain.
								*to search project minimum three words are required.
								*for tags min. 3 and max. 20 characters are allowed in one tag.
   -**Enhanced the feature analysis plots**-enhanced the cutting label problem for numerical and categorical features.
   -**Enhanced the eda model**-
				*it required 30 rows to perform eda for regression, clustering and timeseries
				*for classification minimum 20 row are required for each class.
   -**Multiple timeseries enhancement**-
					*added validation if any grp do not have enough samples and al 
					*enhanced loss table with value like loss name, count of groups, min, 25th percentile, 50th percentile, 75th percentile, mean, standard deviation, max etc.
					*added frequency for multi-timeseries- so if resampling is not done, then send the original frequency detected. If resampling is done, then send the resampled freq.
					*added download and deploy option in model page for random forest model
   -**Added form validation for algorithm parameter in train model**- added for all the project type like predictive modeling, clustering and timeseries
   -**Added random forest algorithm in both for toolkit and toolkit_lite**- user can evaluate multi-timeseries model in both toolkit
   -**Added limit restriction for data fetch in saas**-
							*user can only fetch 150k row from entire table for mssql, mysql, postgresql etc.
							*user can use limt and top in sql query to fetch first 10 or 20 rows.
-**Bug fixes**:fixed the below listed issues or bugs.
		*Bug 33454: toolkit servers do not start due to missing groupWisetransformer
		*Bug 33084: analysis report shows categorical encoded columns instead of original columns
		*Bug 31181: incorrect rounding off in resampling preview
		*Bug 31182: evaluation and forecasting issue when more than 1 timeseries ids are selected
		*Bug 31651: getting validation message for lumpy_demand and empty dataset
		*Bug 31930: for multiple timeseries, training is failing for smooth demand dataset
		*Bug 32045: rounded value is not showing in resampling preview for standard deviation of values and variance of values method
		*Bug 32525: for multiple timeseries training is failing for attach datasets
		*Bug 33083: evaluate forecast and forecasting is failing when transformation techniques are applied
		*Bug 33362: analysis report is failing for random forest algorithm
		*Bug 31807: update validation message under conditional filtering when eda fails in predictive - insurance data set
		*Bug 33594: model training fail using nornal datset in(multip -ts )
		*Bug 33597: training is failing for multiple time series as attached project
		*Bug 33654: training is failing for text analysis project- sentiment data set
		*Bug 27028: project name should display when we download it (and use to import)
		*Bug 27148: required page refresh logic if user delete all model(one by one) and click on pipline or qp.
		*Bug 28331: in cluster-advanced- algorithm parameters- application does not maintain valueswe set
		*Bug 31439: project import fails when projectid(1) or projectname(1) imported
		*Bug 31951: showing zero and blank values in time series (models page)
		*Bug 31992: for tuned model default values are maintained in input fields and changes are not reflected
		*Bug 31996: training is failing for older projects and cannot submit algo params in train model page for older projects
		*Bug 32038: for text analysis output is not showing for word embedding component while selecting glove model and most similar word method
		*Bug 32084: in toolkit and toolkit_lte prediction is failing for notebook geneated dataset
		*Bug 32117: qp is failing for older models
		*Bug 32122: text analysis in word embedding component new feature are coming blank for both models (glove and word2vec)
		*Bug 32134: analysis report is not generating for project type it is only working for multi ts
		*Bug 32137: in text analysis for cloned experiment method is not showing for glove model in word embedding component
		*Bug 32154: import project is not working for mssql project zip
		*Bug 32308: Eda is failing for timeseries while changing the vartype decimal to int and int to categorical getting valueerror
		*Bug 32309: for timeseries, feature scaling in pipeline is blank
		*Bug 32316: apply to target in timeseries is always showing checked for 2nd datasets
		*Bug 32321: for timeseries, in pipeline categorical encoding preview is showing wrong
		*Bug 32427: delete confirmation popup is missing for database settings and sftp settings in setting module
		*Bug 32499: pendo guide steps not showing for data connection page
		*Bug 32623: eda is failing when development dataset is selected in eda advance option for testrepeat3classes dataset
		*Bug 32657: evaluate, forecast, analysis report failing for older sarimax model (version issue)
		*Bug 32683: for multiple timeseries eda is failing for attach dataset
		*Bug 33138: for multiple timeseries eda is getting stuck for train dataset
		*Bug 33357: getting server error while selecting the ts id's from dropdown
		*Bug 33418: validation message words need to be consistent.
		*Bug 33452: text extraction columns are not showing proper values in pipeline on models page
		*Bug 33453: training gets fail if any field kept empty in nlp in advance option
		*Bug 33587: evaluate forecast for group display blank graph (total-price and sku id in eda)
		*Bug 33596: analysis report in multiple timeseries give prediction for 1st record
		*Bug 33611: barplot is not generating for integer/decimal and boolean combination instead giving snackbar
		*Bug 33632: graph is getting overlap on frequency scale for timeseries
		*Bug 33765: multiple timeseries getting 404 bad request for resampling preview
		*Bug 33761: for multiple timeseries training is failing (because after resampling, samples in each group were very less)
		*Bug 33804: toolkit build is giving error for docker and without docker it's still installling on my system
		*Bug 33867: for s3 connection retraining is failing
		*Bug 33889: creating new scheduler is not working in toolkit
		*Bug 33891: qp is failing for notebook project in both ps and toolkit getting kernelspec error
		*Bug 33595: model traing done but the model can not be visible on model page for my end (in multi-ts)
		*Bug 33888: toolkit-for multi ts algo in prediction form submit button should be disable it should only enable if value is selected from dropdown
		*Bug 31786: license activation is not allowing to use the same product key 2nd time
		*Bug 32187: after license is expired scheduler is working in backend
		*Bug 33897: for meal sample project categorical encoding coming blank in pipeline
		*Bug 33370: training was failed when i try to split data using week column
		*Bug 33893: training is failing for newly added sample dataset when ordinal encoder is selected(no. of steps as 12)
		*Bug 33217: disable submit button in algorithm parameter if field contain validation
		*Bug 33930: for meal sample project analysis report forcasted_value column is coming blank
		*Bug 33216: for scatter text plot in clustering need to add color indicator, FAQ, download option
## Predictsense 4.6.0 has been released with the following headline features 20/04/2022 to 03/06/2022:
   -**Enhanced the inference module**- added the card details for both the toolkit and toolkit lite , listed the supported functionality for both and also updated the images and added download button for both in 					       card details.
   -**Added scatter plot support for text feature in clustering model**-scattertext is a scatter plot for text features to visualize words or phrases that are characteristic to 2 categories. It helps to inspect 										words or phrases based on their frequencies in each category.
   -**Added google bigquery connection in settings and data connection module**- User can setup the google bigquery connection from settings module by filling all the required field like connection name, ps 											 password, google cloud project id, client email, service account key and user can create the data connection to pull the data from 											 data connection module to use it for eda and model building.
   -**Installed and updated the library**- Darts 0.18.0 and updated holidays(0.9.12 -> 0.13), statsmodels(0.11.1 ->0.13.2)
   -**Added multiple timeseries in timeseries model**-  
		                * multiple timeseries is basically a timeseries having multiple individual timeseries. Traditionally, if we wanted to forecast for this data, we had to 							  train multiple models for individual timeseries data. But using this functionality, we can do it using single model. This can be used for demand forecast 								  and many more use cases where user have multiple data in one and wants to forecast for all.
   			                             
                                                        * Random Forest:this model is from darts and it supports multiple timeseries, multivariate, univariate all kinds of forecasting use cases. This model is 								  wrapped around random forest regressor of scikit-learn.
   -**Enhanced timeseries model**- Added resampling advance option on eda page and HPT option for prophet model on models page
   -**Bug fixes**:fixed the below listed issues or bugs.
		*Bug 10100: an additional black box appears in the tree output in the obfuscated build.
		*Bug 27095: hpt pop up is freeze and continuously loading on demo and app.
		*Bug 27096: http 400 bad request pop up display when user sign up and direclty add sample project and open models page or any graph.
		*Bug 27138: all instances-import project for s3,snowflake, mssql, mysql and postgresql, sftp and nested folders is giving error as project server error(although project get imported once page is 				    refreshed)
		*Bug 27147: s3 scheduler is not working on demo and app
		*Bug 30281: clustering- for attach dataset scatter text plot is coming blank.
		*Bug 30306: scatter text fails for older trainings.
		*Bug 27177: scatter plot fix.
		*Bug 26764: handle the scenario for sftp connection, if we don't have any data on sftp server
		*Bug 26819: data pull in bigquery is coming into a single column
		*Bug 26733: encrypted password should be saved in db for sftp connection
		*Bug 27238: loader is missing for settings-connections list for database, sftp, snowflake, s3, bigquery
		*Bug 29460: for enterprise version for report user role while clicking on login button it is redirecting to 404 page
		*Bug 30210: model training is failing for random forest algorithm for timeseries.
		*Bug 30211: getting error for auto correlation plot in training advanced option for timeseries.
		*Bug 30230: eda is failing for dailyactivity.csv for timeseries.
		*Bug 30231: need to show the rounded value in resampling preview table.
		*Bug 30240: forecasting, autocorrelation, evaluate forecast, stationary test are failing for index with timestamp
		*Bug 30253: eda is failing for regular timeseries dataset getting keyerror: invalid frequency for stock price dataset
		*Bug 30335: for attached dataset component graph, auto-correlation, analysis report, hpt is failing.
		*Bug 30351: showing the dateformat validation toaster while doing the eda for weather dataset
		*Bug 30354: when conditional formatting is used, then some apis on training page are failing
		*Bug 30409: evaluate forecast plot is not working for random forest getting server error
		*Bug 30433: selected index feature is showing in conditional filtering dropdown before eda and after eda only it is not showing if we refresh the page or switch between other page
		*Bug 30491: need to disable the evaluate and get forecast button for random forest if some value is selected then only enable the buttons
		*Bug 30522: In train model page for no of steps field value is not retaining and also need to change the default value 1 because in models page plots coming blank
		*Bug 30353: if conditional formatting returns < 50 rows, block eda
		*Bug 30545: training is failing for daily_activity.csv dataset
		*Bug 30565: plot are failing for evaluate forecast and forecast tab while training model using advanced options like standard scaler
		*Bug 30570: training is failing for random forest while using quantile transform advanced option
		*Bug 30574: need to disable tunning option from both models and train model advanced options if we select random forest for timeseries.
		*Bug 30579: for models page need to disable get forecast button
		*Bug 30581: for multiple timeseries, on train page- no of steps field accepting decimal and value more than 10
		*Bug 30584: on model page, pipeline is blank for resampling
		*Bug 30590: for multiple timeseries- on models page getting error while clicking on pipeline
		*Bug 30680: training is failing for sarimax
		*Bug 30681: eda is failing for weather dataset
		*Bug 30802: timeseries metrics are appearing as na if their values are 0
		*Bug 27368: handle date feature with nat value when changing dateformat
		*Bug 30233: forecast fails for fbprophet model
		*Bug 30255: data preview and eda report preview issue for weather predcition sample project
		*Bug 30268: for get forecast plot for sarimax getting value error
		*Bug 30578: enterprise- multiple time series does not display algorithm in training page
		*Bug 25921: In docker toolkit for clustering graph option qp is failing
		*Bug 30815: reset password policy is missing under user creation (sudo user enterprise build)
		*Bug 24765: if we use more than 2 ngram value getting below error in celery app
		*Bug 25538: hpt form validation issues
		*Bug 25746: hpt validation issue for classification algorithm
		*Bug 26635: training is failing for car segmentation sample project
		*Bug 27030: model page is freezing when we change the model tuning method for tuned model
		*Bug 27296: pulling data before the schedule time added in scheduler
		*Bug 27701: project list is not getting display on project management page if all projects are deleted from last page
		*Bug 27711: project count is not getting updated after submitting feedback for 1st time
		*Bug 27717: re-captcha is not visible on register page
		*Bug 27725: setting-sample dataset-after update validation message is not proper
		*Bug 27784: share report page is getting stuck in local
		*Bug 27846: import project for bigquery is giving error as project server error (although project get imported once page is refreshed)
		*Bug 27898: model are getting downloaded despite of having ent badge for free trial user-saas
		*Bug 28029: In timeseries for prophet hpt getting field validation message for default values
		*Bug 28031: the feature distribution for categorical feature shows incorrect validation message
		*Bug 28288: enterprise type issue added for import project, scheduler
		*Bug 28625: file is getting upload but started analyzing and saving toaster showing continuously
		*Bug 28630: In drift report loader is continuously showing
		*Bug 28650: issue in saas-404 page display for sudo user(session is maintain for old saas user)
		*Bug 28768: loader issue for save text analysis experiment after saving it is showing the loader continuously
		*Bug 28853: for saas-validation message for rows and column restriction is missing for all data sources(file upload, db connections, snowflake, s3, big query)
		*Bug 28959: In model page under cv tab for recall, precision, f1score metrics learning curve is showing blank
		*Bug 28984: loader is showing continuously while clicking on share report in eda page
		*Bug 29259: rule based matching - error occur while click on submit
		*Bug 29387: sign out is continuously loading and user need to refersh page
		*Bug 29428: getting data connection sever error validation if db connection name is duplicate
		*Bug 29499: lime report is not getting generate for attach dataset
		*Bug 29916: hpt is getting stuck for all algorithms tunned model
		*Bug 30058: for feedback - getting "congratulations you earn 2 project" message whenever we submit feedback
		*Bug 30171: getting keyerror while saving the text analysis experiment
		*Bug 30202: training is failing for timeseries projects after getting latest for darts changes
		*Bug 30206: for timeseries in train model page under advacned option for component while clicking on show plots getting error
		*Bug 30490: for mlp classification hpt is getting failed if bayesian optimization model tuning method is selected
		*Bug 25849: for timeseries hpt validations are missing
		*Bug 26871: decision tree is not getting generate for lightgbm classification algorithm
		*Bug 26944: data pull is not working using scheduler for s3, snowflake and bigquery
		*Bug 26948: data pull is not working for snowflake getting error toaster in UI for incorrect username and password
		*Bug 26987: pendo steps for data connection page are breaking from step 2
		*Bug 26988: eda getting stuck for attach dataset
		*Bug 27103: xgboost decision tree is not generating for attached project
		*Bug 27407: password is getting reset without otp verification for reset password functionality
		*Bug 27864: clustering project- application display both graph in optimal cluster(agglomerative and kmeans)- required refresh page logic
		*Bug 27870: decision tree in random forest and decision tree is not getting generated and downloaded for attached project
		*Bug 27872: new user Sign up is not working after taking latest( on 10 may 2022 )
		*Bug 27888: captch is invalid message display even when user added valid credential on login page
		*Bug 27897: In setting & data connection ent badge is missing on big query for saas-free trial user
		*Bug 27932: saas-free trail user after clicking on drift analysis containing ent badge in not redirecting to 404 page
		*Bug 28026: for timeseries validation message is missing for prophet hpt
		*Bug 28247: for s_admin invitee user button is redirecting to 404 page
		*Bug 28658: model are not getting generated if decimal number is passed in optimal number of clusters input field
		*Bug 28661: drift setting- for create new drift setting, create button is disable
		*Bug 28689: pagination count is not getting update
		*Bug 28781: for saas invitee user role assigned is admin instead of (s_admin)
		*Bug 28843: update validation message for reports module
		*Bug 29059: admin user is unable to create new user(developer) and getting user limit reached validation
		*Bug 29409: settings manage-report, report is not getting displayed after sharing
		*Bug 29442: saas-ent badges are not working for retrain and model deploy on models page
		*Bug 29490: for Saas- getting pro badge on cross validation
		*Bug 29512: for profile password update- hide button should work separately for each field
		*Bug 29555: iotsense option need to remove from plans page
		*Bug 29967: feature distribution- select cluster dropdown is not showing all cluster from analysis tab
## Predictsense 4.5.0 has been released with the following headline features 14/03/2022 to 19/04/2022:
   -**Enhanced the models page ui**-handled models expansion it should not expand when we click on any action button, if clicked anywhere else it should expand. Also moved the position of upload scoring button.
   -**Added deleted algorithm  list  in algorithm module**- added the deleted algorithm list form. User can see the list of all the deleted algorithm and also can restore the algorithms using restore action button.
   -**Added the hpt form validation for all three project type**- added the hpt form validation for paramter tuning, random search, bayesian optimization.
		*Parameter tuning- added required field, value is greater than maximum, value type is not proper.
		*Random search- added required field, value is greater than maximum, value type is not proper, comma separated value in field.
		*Bayesian optimization- added required field, value is greater than maximum, value type is not proper, not to allow more than 2 comma separated values in field.
   -**Updated the scikit-learn library version**- scikit-learn version update from 0.22.2 to 1.0.2
   -**Disabled the algorithms for saas**-disabled the few regression and classification algorithms for saas while setup the predictsense. 
   -**Bug fixes**:fixed the below listed issues or bugs.
		*Bug 20485: drift report is not getting generated for text nlp data set
		*Bug 13400: for timeseries, model are not generating for both algorithm
		*Bug 17856: UI need to consistent in all validation message .
		*Bug 18738: lime report display message for text analysis issue
		*Bug 19803: for saas on models page for pipeline and lime report we have badge but it is clickable
		*Bug 19910: In gpu instane or local first time user land on sign up dipsplay mutliple validations
		*Bug 20472: issues in drift report - is cardinal is display only when it occurs hide text option if not present
		*Bug 20528: app build- application display user limit reached validation for 1st user itself.
		*Bug 20537: demo- report user did not received share report
		*Bug 20549: demo, app-pendo for settings is displaying wrong list.
		*Bug 20620: clustering Training is failing for text features
		*Bug 20773: feature distribution graph is not generating for text and combination of text feature.
		*Bug 20821: lime report failing when training with text features
		*Bug 21189: sample data and sample project new creation issue(pagination)
		*Bug 21357: decision tree in clustering for kmean algorithum is not generating
		*Bug 21416: OK button need to be consistent in all toaster throughout application
		*Bug 21501: password input field should not accept blank space or symbol in starting
		*Bug 21502: for already existing user details, getting two toaster on sign up page
		*Bug 21658: SVM Classification algorithm is not getting generated and application stuck
		*Bug 21667: model page not getting loaded when bagging/bosting added on page
		*Bug 21747: algorithm page - when user disabled algorithm then retaining, bagging,boosting and other dependent need to be hide too.
		*Bug 22033: remove underscore form sample project and sample dataset names whereever exists
		*Bug 22057: demo- eda page sometime doesnot load and give attached error in console
		*Bug 22063: training stuck for algomerative cluster graph and gives error in console and terminal(commodity data set)
		*Bug 22071: retraining issue on model page as attached screenshot
		*Bug 22235: demo-cluster agglomerative graph is givining below error for attached project
		*Bug 22313: for train page advance option algorithm parameter should only display the selected algorithm
		*Bug 22500: algorithm parameters inside the advanced options shows all the algorithms instead of just the selected ones
		*Bug 22501: text analysis rendering issue for rulebased matching showing the token which we added in patten 2 in pattern 1.
		*Bug 22502: QP is failing for random forest regression tuning -1 model in demo
		*Bug 22503: In clustering feature distribution for single numeric feature, showing fileSchema key error
		*Bug 22931: for youtube.csv dataset in train model under feature reduction tab feature list is not showing in custom feature dropdown
		*Bug 22934: value is not retaining in feature reduction advanced option in train model page
		*Bug 22943: cross validation failed for youtube dataset
		*Bug 22983: In text analysis for word embedding and rule based matching tooltip should have more description
		*Bug 22984: In feature impact, for feature distribution graph bins input field accepting value below 5 and above 50
		*Bug 23139: for sftp need to add validation message if someone try to fetch specific file
		*Bug 23207: analysis report failing for clustering model after applying text analysis
		*Bug 23272: replace sample template by sample project in sample project pendo description
		*Bug 23280: After updating the cluster name while checking in qp that model is missing
		*Bug 23305: S3 connector data pull error when specifying file path ends with '/'
		*Bug 23337: backward compatibility issues
		*Bug 23339: custom transformers related issues, qp is failing
		*Bug 23427: pipeline preview details is not showing for outlier handling option
		*Bug 23428: for qp, prediction result are not getting update if user switch from file upload to single input or vice versa
		*Bug 23472: boosting is failing for svm classification
		*Bug 23474: eda page is continuously loading when internet speed is slow
		*Bug 23831: auto feature pipeline preview issue showing error in python terminal
		*Bug 23846: lime report issue in ted talk dataset(lime report is not generating in QP)
		*Bug 23847: training is failing for regression problem while using log transformation advanced option
		*Bug 23848: In feature reduction advanced option under custom feature dropdown target feature is showing
		*Bug 23855: confusion matrix in svm classification giving error as attached (import insurance project)
		*Bug 23856: In train model under log transformation under feature dropdown showing the target feature as well
		*Bug 23860: upload fails if columns (clean/original) have duplicate column names
		*Bug 23863: In hpt table value should contain na or none if we have none value in input field
		*Bug 23878: eda stuck for timeseries project for attached dataset
		*Bug 23963: feature importance graph, table view is blank for attached dataset.
		*Bug 23986: text analysis experiment taking more than 5 mins to save
		*Bug 24049: training is failing if we configure nlp in advance option on train model page for clustering
		*Bug 24140: qp is failing for clustering if date format has changed
		*Bug 24374: select strategy is not retaining value for date feature
		*Bug 24428: for clustering, if we upload wrong file in QP it is continuously loading for attach project
		*Bug 24441: nlp model upload button does not get enabled even after all fields are filled
		*Bug 24449: Polynomial Regression from older projects fails in apis related to prediction
		*Bug 24460: for cokestudio dataset training is failing with key error
		*Bug 24488: for multilabel problem models page plots not working
		*Bug 24492: decision tree is failing for multi-label decision tree model
		*Bug 24573: file upload qp is failing for weather dataset
		*Bug 24577: scatter plot is failing after applying feature decomposition in clustering
		*Bug 24599: pendo steps not coming properly in sftp.
		*Bug 24729: import button position for sample project need to be consistent as we have for sample dataset
		*Bug 24731: In random search tuning getting error while clicking on submit passing the , in text field
		*Bug 24746: add validation to disable the submit button in hpt form, if the form is invalid.
		*Bug 24766: In clustering feature distribution plot, if we select single feature and there are not enough samples in the cluster, the error message is not appropriate.
		*Bug 24826: decision tree plot is not working for decision tree classification algo for movies dataset
		*Bug 24878: eda stuck for attached dataset
		*Bug 19285: Issue in qp for text analysis(enterprise and gpu)
		*Bug 20280: in automation script- classification insurance model training is failed(conditional filtering applied in adv option)
		*Bug 17759: change password policy in invite user and user creation page( also mantain same whenever password setting reflect)
		*Bug 17761: password mismatched error in invite user(although added same password in both fileds)
		*Bug 17852: UI - keep images consistent throughout page header and left pane(notebook and notebook page)
		*Bug 17994: date format should be consistent in application
		*Bug 23080: for timeseries, eda is getting stuck for attach dataset
		*Bug 23861: for timeseries, eda is get stuck for attach file
		*Bug 24118: cluster name is not updating in analysis report and qp showing the old cluster name
		*Bug 24693: feature configure window gets blank if we change var type and do nlp for second time
		*Bug 24816: dev dataset checkbox is not reseting in eda advanced option under split dataset if we change the dataset
		*Bug 24838: for parameter tuning for decision tree regression validation message is missing for one field
		*Bug 24879: resampling dropdown list is not coming for attach dataset
		*Bug 25795: sample project- exam dataset model page is blank and eda is also stuck
		*Bug 25797: all sample project EDA is getting stuck
		*Bug 25849: for timeseries and clustering hpt validations are missing
		*Bug 25746: hpt validation issue for classification algorithm
		*Bug 25794: hpt is stuck and giving error
		*Bug 25845: docker toolkit issue for file upload QP , retraining
		*Bug 21310: decision tree and feature distribution graph not generating for attached dataset
		*Bug 25538: hpt form validation issues
		*Bug 20454: S3 connection is giving too many value to unpack (expected 2)
		*Bug 18950: feedback page tooltip and message must be dynamic for extra project count
		*Bug 19070: values are not getting retain for plans page
		*Bug 19331: If text analysis save and apply fails, we are not showing the error message received from backend
		*Bug 19378: Do not show plans page under setting for enterprise build
		*Bug 20335: Retraining failing for dataset having date columns
		*Bug 20607: lime report in qp failing when date column is present
		*Bug 20644: for sarimax in db hpt value is true but in ui showing false
		*Bug 22539: alignment issue and tooltip is required for actions in algorithm and deleted algo tab
		*Bug 25724: toolkit-lite issue using docker- model is not getting deployed
		*Bug 12894: for clustering, save button is cutting due to cluster's card
		*Bug 12046: login page is not showing proper for screen resolution 1920 *1080
		*Bug 20443: If the project name is very long the action buttons alignment is not proper on project listing page
		*Bug 20451: drift overview - concept drift - add space between model performance and distribution plot
		*Bug 25724: toolkit-lite issue using docker- model is not getting deployed
## Predictsense 4.4.0 has been released with the following headline features 07/02/2022 to 08/03/2022:
   -**Added algorithms configuration in settings module**:admin user can enable and disable the algorithm features and plots like lime report, roc-auc, regression line plot, decision tree and other features as 							  		well using algorithm module. admin user can add the new algorithm and do the configuration for plot config. 
   -**Added snowflake and s3 connection in settings and data connection module**:User can setup the snowflake and s3 connection from settings module by filling all the required field like account name, username 											and password  and for s3 required aws region, keyid, secret key and user can create the data connection to pull the data from s3 											and snowflake from data connection module to use it for eda and model building.
   -**Clustering model page enhacement**: moved the decision tree and feature importance plot inside the analysis tab and added the scatter plot inside the feature distribution tab.
   -**Added change date format option in eda module**:The date format which will be used in parsing that date feature as sometimes the date feature might be parsed as mm-dd-YYYY but the user might want/have the 							      date feature as dd-mm-YYYY.If the user doesn't provide the format, then default parsing is done..
   -**Added plans in setting module for saas**:admin user can modifiy the existing basic and pro plans like changing the project limit, eda, training and also can add the new plans. 
   -**Bug fixes**:fixed the below listed issues or bugs.
		*Bug 13797: change header name and both tooltip for algorithm parameter under advanced option of train model.
		*Bug 13798: nlp setting is getting performed on all text features(nlp is applied for response_text2 and display same in pipline although setting is done only for response-text1).
		*Bug 13601: for timeseries in train model page showing the class name names it should not display for timeseries.
		*Bug 13611: in user profile need to correct the text User Name to Username.
		*Bug 13799: change var type integer to categorical and categorical to text then it is allowing to do nlp on train model page but text analysis operations are failing.
		*Bug 13800: in train model page, if we are selecting ordinal as strategy then that feature is not reflected into interactive pipeline.
		*Bug 14619: lime report are not disable in qp, for those algorithm which are having disable lime report on model page.
		*Bug 14682: eda is not haapend when user change outlier setting as custom and custom value
		*Bug 14716: if we change vartype in eda then in train model page while selecting the dataset from dropdown getting error in browser console.
		*Bug 14829: single input qp is failing for retrained model.
		*Bug 14884: hr, minute and second options need to disable as per the eda page calculation for datetime feature in train models page.
		*Bug 14953: train model page is not working for timeseries project.
		*Bug 15315: for orderdata set target is not populating in eda.
		*Bug 15506: for dbscan algorithm in clustering project algorithm parameter values are not resetting.
		*Bug 15828: feature distribution in cluster project is failing.
		*Bug 15873: cluster feature distribution does not retain selected value in graph.
		*Bug 15887: train model is failing for 29_Period_of_trials_by_courts dataset and giving error in node terminal like could not save the model info.
		*Bug 16031: in clustering project, for optimal cluster, validation message is missing for select algorithm field.
		*Bug 16041: in clustering project, for agglomerative algorithm affinity field is not resetting.
		*Bug 16061: for predictive modelling, models are not generating and giving typeerror: cannot read properties of undefined (reading 'rSquared').
		*Bug 16153: for free trail user application does not allow to open train model and model page and signout user with message as user is not authorized.
		*Bug 16172: eda is not working for all project type.
		*Bug 16210: qp is failing for text analysis and giving attributeerror: 'nonetype' object has no attribute 'pipe'.
		*Bug 16288: in eda date featured(date with timestamp) is consider data type as url and training is failing for expense dataset.
		*Bug 16335: training is failing and model page is blank for wa_fn-usec_-hr-employee-attrition dataset.
		*Bug 16383: qp is failing for dataset saved from notebook.
		*Bug 16425: toolkit and toolkit_lite is not running getting ModuleNotFoundError: No module named 'modules.clustering.clustering'.
		*Bug 16434: docker toolkit and toolkit_lite is not running.
		*Bug 16744: interceptor flow execution giving error in celery app while clicking on play button for different datasets. 
		*Bug 16946: in clustering models page for feature importance option button position is showing different if we switch between graph and table option.
		*Bug 16952: in clustering qp option is not showing in models page.
		*Bug 16962: for basic plan user not able to do upload file, eda and train model.
		*Bug 16971: in regular toolkit under in monitoring tab under models dropdown deployed models not showing.
		*Bug 17054: select strategy dropdown not visible on train model page for timeseries project.
		*Bug 17180: for clustering project if we click on qp button popup is showing and loader keeps loading and showing error in browser console.
		*Bug 17380: for free trial (pro plan) user not able to do upload file, eda or train model.
		*Bug 15888: custom feature not showing in feature decomposition for pca and factor analysis, checked for insurance dataset from sample dataset popup.
		*Bug 16785: in train model in advanced option after selecting pca in feature reduction it is automatically selecting standard scaler in transformation.
		*Bug 17088: sample template name to be updated as sample projects in settings.
		*Bug 13400: for timeseries, model are not generating for both algorithm.
		*Bug 16524: tree structure is not showing proper for sftp connection.
		*Bug 17381: pendo's are breaking for listed scenarios for eda, text analysis.
		*Bug 17721: remove the problem type card in train model page for timeseries.
		*Bug 13273: retraining is failing for text analysis file (expected do not show process file in retrain dropdown).
		*Bug 16963: suggestion on plans(setting page) add expand and collapse option.
		*Bug 16975: pipeline is failing for time series project.
		*Bug 17759: change password policy in invite user and user creation page( also mantain same whenever password setting reflect).
		*Bug 17761: password mismatched error in invite user(although added same password in both fileds).
		*Bug 16981: for timeseries, after changing date format eda is not working.
		*Bug 17039: timeseries model page is not loaded and display typeerror: cannot set properties of undefined (setting'status') in console.
		*Bug 17631: issues in plans page related to text label and also refer the docx.
		*Bug 15903: need to validate the algorithm name if someone add same name twice.
		*Bug 15904: edit algorithms issue for plot config options.
		*Bug 16062: for timeseries algorithm don't required to show the plot config options in ui.
		*Bug 16026: need to disable the algorithm from models and quick prediction for old projects.
		*Bug 13603: scatter plot title is wrong for agglomerative.
		*Bug 10188: required proper update in toolkit and toolkit lite( it's must be properly aligned with predictsense).
		*Bug 10189: in quick prediction should not work if file encoder is latin and user added as utf8(also same need to fix in both toolkit).
		*Bug 17879: retraining is failing with merge option.
		*Bug 18230: retraining fails if all features in the file are not selected for training.
## Predictsense 4.3.0 has been released with the following headline features 03/01/2022 to 01/02/2022 :
   -**Added the agglomerative algorithm for clustering project type**:agglomerative clustering is a type of hierarchical clustering algorithm. It is an unsupervised machine learning technique that divides      									the population into several clusters such that data points in the same cluster are more similar and data points in different clusters are dissimilar
   -**Added dendrogram plot in optimize cluster plot**:dendrograms are a diagrammatic representation of the hierarchical relationship between the data-points. It illustrates the arrangement of the clusters 							       produced by the corresponding analyses and is used to observe the output of hierarchical (agglomerative) clustering.
   -**Added the calinski-harabasz index metrics for evaluating the clustering model**:The calinski-harabasz index also known as the Variance Ratio Criterion, is the ratio of the sum of between-clusters 											     dispersion and of inter-cluster dispersion for all clusters, the higher the score , the better the performances.	
   -**UI/UX enhancement for login and signup page**:enhanced the login and registeration page ui, also added the password policy and invisible recaptcha for new user registration, reset password etc.
   -**Added heatmap for clustering in models page**:cluster heatmaps are commonly used in biology and related fields to reveal hierarchical clusters in data matrices. Heatmaps visualize a data matrix by drawing 							     a rectangular grid corresponding to rows and columns in the matrix, and coloring the cells by their values in the data matrix.
   -**Added split dataset date wise in eda advanced option under split data tab**:for predictive modeling, the data splitting is done randomly. The data which goes into train, test, dev is random.	
										  But if there's a date feature present in data and if the user wants to split the data based on this date feature, so that the 										  data gets splitted in order of date (older data into train, new data into test/dev, just like what we do for timeseries), we have 											  added an option to split dataset datewise.
   -**Bug fixes**:fixed the below listed issues or bugs.
		*Bug 11732: In create project template allowing to upload xlsx file where it should only accept zip file only
		*Bug 11762: In dataconnection, for new datasource not allowing to upload the supported file format(.xls).
		*Bug 11767: lime report is not working for xgboost regression algo while training model using feature scaling advanced option
		*Bug 11788: enterprise build- Ticket functionality is missing
		*Bug 11790: enterprise build allow to create new user with all role(Admin,developer and Report user)
		*Bug 11791: help document link/document is missing
		*Bug 11795: upload ta model upload btn not getting enabled once we upload the invalid model.
		*Bug 11836: eda is getting failed for all 3 types of project getting error in python terminal
		*Bug 12073: for timeseries, on train model page, resampling in advanced option is not reset for new file
		*Bug 12074: pagination issue on project management page
		*Bug 12076: qp is not working while training the file which is saved using notebook
		*Bug 12080: for clustering in file upload qp if we upload different datset it is not showing validation message and loader is continuously loading
		*Bug 12089: qp is failing and giving error as 'AttributeError: 'float' object has no attribute 'split''
		*Bug 12297: for clustering, heatmap is not displaying properly
		*Bug 12299: save button is not displayed on model page for DBSCAN
		*Bug 12300: In project management page after deleting project from next page, project list is not appearing
		*Bug 12308: sample project template if user search for research it display blank screen and does not refresh page.
		*Bug 12309: lime report is failing under quick prediction (single/file upload) for any project
		*Bug 12310: for k-means algorithm, heatmap is not visible
		*Bug 12320: user list display single user for saas and empty list for enterprise in add user module, forgot password is giving error user not found
		*Bug 12322: older project eda and training page display error and for some project it's display EDA tobe perform(although Training and EDA is done)
		*Bug 12368: for prject management page, not able to search old project
		*Bug 12422: feature impact is not working regression algorithms  
		*Bug 12423: for timeseries, fix layout of feature analysis graphs
		*Bug 12443: Single input qp is failing for decision tree regression 
		*Bug 12467: In data connection page, if we create folder we are not able to import sample dataset into that folder	
		*Bug 12470: qp is failing in toolkit_lite and toolkit 
		*Bug 12471: x and y axis is missing in timeseries prediction for both toolkit and toolkit_lite
		*Bug 12472: toolkit-lite prediction is giving error for DBSCAN -cluster project
		*Bug 12586: In toolkit validation message from back end is not correct for forecast plot for default dates
		*Bug 12587: error message from backend is not being shown in ui for forecasting in toolkit
		*Bug 12605: toolkit retraining is failing for valid/invalid file
		*Bug 12606: required predicted value at front column(as per PS) in both toolkit
		*Bug 12645: recaptcha is not properly visible on screen an blocking us to create a new user
		*Bug 12647: pr curve failing for all algos when class names are of int type
		*Bug 12670: for timeseries, in pipeline resampling preview is not according to independent features and number of rows are incorrect
		*Bug 12694: labels is not showing properly for feature importance, feature coefficient and decision tree plot
		*Bug 12700: required back button on profile page to navigate back on home page
		*Bug 12701: reset otp function is not properly working if we try to validate the valid otp then greentick is showing and 2nd time clear the valid otp and pass the wrong otp and reset the 			            password and try login using that user then it is showing invalid username.
		*Bug 12795: In timeseries, for feature analysis for catgorical and datetime feature not showing the actions bar for histogram, pieplot, scatter plot etc.
		*Bug 12821: pipeline issue- preview fails if data contains mostly missing or constant columns
		*Bug 12822: feature analysis - there is no error message from python side when we select categorical vs datetime
		*Bug 12654: resampling is not properly captured in pipeline for timeseries
		*Bug 12831: for Air passenger dataset plots not showing properly in models page
		*Bug 12834: getting error in browser console for categorical pipeline preview and also for auto feature generation not showing other selected option during the model training for air passenger 				    dataset
		*Bug 12837: for predictive modelling, feature coefficient graph is not visible for some algorithms
		*Bug 12838: issue in reset otp- valid and invalid otp
		*Bug 12841: for prophet algorithm, feature scaling in not visible in pipeline
		*Bug 12844: time report is not generating for Artificial Neural Network Regression
		*Bug 12845: In text analysis images is not displaying.
		*Bug 12846: toolkit lite does not display newly added metric
		*Bug 12848: reduce the empty space from right side for sample dataset popup
		*Bug 12896: In agglomerative cluster user added custervalue as 10 and plot dendrogram and train model,it's display default 2 cluster under analysis
		*Bug 12899: In report module if we pass the invalid user email then not showing the validation message
		*Bug 11789: enterprise build- feedback option is visible to report user but when user click on feedback -application sign out user
		*Bug 12321: heatmap is not properly display when cluster name is a number
		*Bug 12127: profile section display message -selected option is under premium subscription.(when user not clicked on free day trail)
		*Bug 12819: for predictive modelling, giving error message for displaying decision tree
		*Bug 12890: In qp it is taking the new features as well earlier if we generate any feature using notebook, text analysis and data flow then in prediction it was taking only original features
		*Bug 12046: login page is not showing proper for screen resolution 1920 *1080
		*Bug 12835: model training is failing and getting error in python terminal for air passeneger dataset while training using dimensionality reduction advanced options like pca and factor analysis.
		*Bug 12836: need to update the validation message for feature analysis if we select categorical , datatime feature
		*Bug 12895: for netflix title data set toolkit(and toolkit-lite) prediction gives error as attached
		*Bug 11785: training would fail if NLP config language chosen is portuguese
		*Bug 11429: trainig is not working for ann algorithm
		*Bug 11437: pr curve is overlapping text and graph line
		*Bug 11621: decision tree plot is not working for regression problems and when target is transformed
		*Bug 11672: scoring function is missing while training 2nd time using feature reduction advanced option
		*Bug 11436: decision tree font is looking to small
		*Bug 11667: ent badge appear on entire application and user not able to do any action on screen		
		*Bug 11620: ticket submit display continuous loader
		*Bug 11594: models page display blank when user change -select strategy as ordinal encoder and click on cancel (it's onehot encoder)
		*Bug 11766: fix data splitting in eda
		*Bug 10190: In QP if we upload diffrent dataset file still prediction is working- application should give validation message as column mismatched
		*Bug 13016: file prediction and pipeline preview for text feature is not working if we generate feature using text analysis
## Predictsense 4.2.0 has been released with the following headline features :
   - **Added sample dataset in settings and data connection module**:added the samples dataset in settings dropdown which is having some default sample dataset templates and also we can create sample dataset in 									     settings and all the sample datasets are visible inside the data connection module to use it by clicking on import button. 
   - **Added project count for free trail and saas version**:added the no of project count for s_admin and s_developer in project dashbaord page.
   - **Added database version for mssql, mysql, postgresql**:added the database version which is supported for mssql, mysql, postgresql. user can see the database version in data sources popup while creating the 								     data connection.
   - **Bug fixes**:fixed the below listed issues or bugs.
	        *Bug 10674: for pro plan while creating data connection by using mysql, mssql, postgresql validation message for rows and columns is absent
		*Bug 10675: application display continuous loader for invite user when 14 days free trail ends
		*Bug 10726: validation message for rows and columns is required for QP, upload score data and in toolkit as well.
		*Bug 10801: train model and EDA limit exceed message is missing on pro plan
		*Bug 10823: for pro plan in left side menu if we click on data drift it is not redirecting to 404 We couldn't find this page.
		*Bug 10867: search option is not working for data preview in dataset and eda module
		*Bug 10868: For bayesian optimization restriction badge is missing in free trail pro plan
		*Bug 10894: need to restrict download model option in models page for pro and basic plan
		*Bug 10921: model tuning is not working for bayesian optimization option for classification algo
		*Bug 10959: validation message is not showing for import project if we upload the unsupported file extension
		*Bug 10960: need to add the validation message for unsupported files in sample template in settings
		*Bug 10962: In sample dataset popup not showing any message if we don't create any dataset in settings it should display the message like you don't have any data set
		*Bug 10971: add validation message "File upload limit reached" for file upload using(mssql, mysql, postgresql) on data connection page
		*Bug 10976: file Upload QP is not working
		*Bug 10980: analysis report is not working for sarimax algorithm
		*Bug 10984: merge dataset is not showing validation message if we select wrong file
		*Bug 11002: after earning 2 project by submitting feedback whoever submit the feedback should not get message "congratulations you earn 2 project"
		*Bug 11050: while clicking on import button in sample dataset popup it is giving server error
		*Bug 11059: for sudo user, data connection is not working for all like pull from url, mssql, mysql, postgresql and sftp.
		*Bug 11088: create button is disable when we select folder name on data connection
		*Bug 11091: model tuning is not working for sarimax model in timeseries
		*Bug 11101: for free trail on train model page we are able to train model model more than 4 times
		*Bug 10667: In data connection name and ps password field it should not allow white spaces
		*Bug 11104: invalid file upload in data connection,scoring, quick predciton always shows validation message for data size restriction
		*Bug 11089: update the version in toolkit
		*Bug 10899: invite user fails and does not show any validation msg if we input sender's email
		*Bug 10866: for free trail while navigating to subscription module plans card is not showing
		*Bug 10831: for reset password operation for password fields password policy is missing
		*Bug 10808: need to add loader for feature analysis sometime if we try using text feature plot is taking time to load after clicking on submit button
		*Bug 10788: change email content for resend activation link(keep same as registration mail)
		*Bug 10770: after the trial period has expired, we are still able to access predictsense features
		*Bug 10769: add space after (name should not exceed 60 characters) in update project details on dashboard
		*Bug 10768: error for feature list in scatter plot for cluster project when only text or categorical feature is used for training
		*Bug 10718: add proper validation message for unsupported files format in quick prediction file upload and upload scoring (add same in toolkit)
		*Bug 10673: error for cluster training when training with only text features or categorical features with more than 10 categories
		*Bug 10671: project count is not increased by 2 when user add feedback.
		*Bug 10642: add proper validation with message for unsupported file upload
		*Bug 10556: while using scheduler if we are on dataset page or eda page it shows wrong socket message
		*Bug 10477: getting error for training if we change var type for age feature integer to categorical
		*Bug 10585: In data set page pagination issue it is not showing total count properly
		*Bug 10725: issue in analysis report when user select few feature are not select on training page(ValueError: Provided exogenous values are not of the appropriate shape)
		*Bug 10676: project count should adjust as per s-admin( invite user project count issue) pro/free trail 20 project per s-admin(not for s-developer)
		*Bug 10188: required proper update in toolkit and toolkit lite( it's must be properly aligned with predictsense)
		*Bug 10189: In quick prediction should not work if file encoder is latin and user added as utf8 (also same need to fix in both toolkit)
## Predictsense 4.1.0 has been released with the following headline features :
   - **Data connection module enhancement**:added the latin file support in file upload , upload scoring and during file upload quick prediction and also checking the structured and unstructured file formate.
   - **EDA module enhancement**:if dataset rows contains the dictionary and list value. it is considered as unstructured feature and discard that feature from target feature dropdown and independent feature in 					train model page, input quick prediction.
   - **Added cluster analysis in clustering model**:cluster analysis helps to better understand the clustered output dataset on how the samples are segmented and describes statistical interpretations of the 						     features for each cluster to then allow the user to give a defined label to each cluster.
   - **Cluster visualization enhancment**:added the decision tree and feature importance options
			 * Decision tree:decision tree graph is a binary tree to help visualize how the data is getting segmented to its respective cluster showing the top features on which it is getting 						clustered by training a decision tree model using the clustered output dataset.
			 * Feature importance:feature importance plot displays the score for each feature in relatively contributing for the prediction of the cluster ranging from 0-1 and all adding up to 1 						      which is generated from the trained decision tree model on the clustered output dataset.
   - **Added the sample template in settings module**: you can create the sample templates in settings by filling all the required deatils like project name, project domain, description and project zip etc.
   - **Project template enhancement**: added the card for each templates with following details project name, domain and you can import the project templates by one click and use it for model builing.
   - **Bug fixes**:fixed the below listed issues or bugs.
	 * Scheduler update is not working in data connection and direct data flow module if we set to none it is not reflecting.
	 * Login issue:if user logins (not sudo), the error pop up comes "User not authorized" and not able to login
	 * Model training is failing for clustering problem getting error at python end.
	 * Notebook Share feature code issue getting key error: root group id in notebook while executing the share feature code cell
	 * Progress bar issue: while generating the optimise no of cluster plot then progress bar is not showing.
	 * Tooltip is missing for elbow method in optimise cluster graph.
	 * Snackbar issue for file upload :snackbar needs to be closed if the file upload throws any error in data connection page.
	 * In output module search option showing twice for manage access table
	 * LightGBM regression model random search tuning is failing
	 * Calculate feature score is failing for RMSE and MAE getting error in python terminal
	 * Decision tree plot is not working for kmeans model getting IndexError: list index out of range
	 * Decision tree plot showing zoomed for lightGBM regression algorithm
	 * Home page tour guides missing and display as coming soon (it display when we navigate back to project and home screen again)
	 * Feature importance and feature coeficient option in model page for predictive modeling continuously loading and getting error in browser console
	 * Model tuning is failing for polynomial regression for bayesian optimization option
	 * Model tuning is failing for xgboost regression algorithm for parameter option 
	 * Model tuning is failing for random forest classification for parameter tuning and random serach option
	 * Bug 9104: Flow need to updated there if admin/developer no mails need to send(When super admin create user as admin then mail is not received at new user end(admin)
	 * For get forecast plot in models page getting server error when user does not change start and end date 
	 * Bug 9376: require some validation message when user imports the corrupted zip.
	 * Bug 9910: clustering qp with file shows encoded/transformed data in the prediction
	 * Bug 9914: tree output is failing to generate for clustering in the obfuscated build.
	 * Bug 10137: timeseries project- categorical encoding and feature scaling preview is display server error
	 * Bug 10089: activation is failed when user click on verification link in mentioned scenario
	 * Bug 10144: lime report is failing for multilabel problem for xgboost classification retrained model using merge option
## Predictsense 4.0.0 has been released with the following headline features :
   - **Added subscription plan for SAAS version**: now you can use the plan subscription page to subscribe the pro and basic plan for predictsense monthly and yearly basis.
   - **Added invite user feature in pro plan**:you can subscribed the pro plan yearly and monthly. In pro plan user have access to invite user by filling all the details and submit invitation email will send the 						       user along with username and password. 
   - **Added the plan info in subscription module**: you can see the activated plan details in subscription module under currect plan and upcomming plan card.
   - **Added the account verification for sigup**:now you will get the email for account verification for registered email.
   - **Added two new user role for SAAS verison**:now added the s_admin and s_developer user role for saas version. after signup it will create the s_admin user and s_admin user can create the s_developer user 							 only if the s_admin is under pro subscription. And s_admin can only see the s_developer user list in settings.
   - **Feature restriction plan wise for SAAS version**:added the feature restriction in terms of settings, data, eda, training, retraining, advanced algo etc, for saas version based on the plan 							 subscription.
   - **Train model enhancement**:if we change any categorical encoding strategy, need to perform sampling again in training advanced options.
   - **Models page enhancement**:now user can compute the different cv metric in models page. And disable compare models if there is only 1 model and improved the UI for class distribution in target info etc.
   - **Added target in models page**: now show the target for all problem types except clustering in models page.
   - **Text analysis enhancement**:improved the pipeline settings in text analysis now you can see the newly generated text feature in interactive pipeline preview in models page. And performance improvement for 					   T5 model in text summarization.
   - **Project management page enhancement for SAAS version**:added the invite user button in project page. 
   - **Bug fixes**:fixed the below listed issues or bugs.
	* Dataflow execution and save flow issue
	* Scheduler issue for none selection in dataflow and edit data connection.
	* Feature wise drift report and model name issue 
	* Chi2 calculate feature score showing server error if dataset is having negative values.
	* Bagging and Boosting issue need to disable for already performed models.
	* Feature analysis report issue 
	* Tooltip missing issue for EDA module for advanced options
	* Tooltip issue for training advanced options missing for transformation and auto correlation
	* Ticketing issue user not able to revert to the email which are send by the admin
	* Toolkit prediction and retraining issue for predictive and clustering models
	* Prediction history issue for fbprophet model in toolkit
	* Disabled the data dirft option for clustering and timeseries project
	* Allow user to enter host name while creating DB connection and only restrict localhost
	* Feature impact plot issue for classification and multilabel problem
	* Showing wrong validation message when we add any special char in registration form. It always shows cannot start with blank space
	* Outlier preview download issue showing server error
	* Send email only when we change the ticket status to closed
	* Lime report is not working while training the models using advanced options
	* Password validation rules must match on register, add new user and in profile change password pages
	* Need to highlight the description text in email content for submit ticket
	* In text analysis- Word embedding model does not retain selected method in save and apply screen
	* Validation issue for text summarization in text analysis module
	* Registration page- change validation message for username and last name
	* Application does not keep selected metrics under cross validation -validation strategy
	* Retraining is failing in ANN, MLP classification
	* Sarimax- forecast graph gives all features (but in upload model has only 3 features)
	* Avg_total issue for classification report in predictsense as well as in toolkit
	* Form in QP was being generated with the new features created in notebook
 	* Unable to raised ticket for free trail user
	* Validation message is required if user add blank csv or excel in data connection page
	* nlpConfigs param does not have default config for selected text indep features
	* Scalar value for log transformation is not being retained in predictive modelling and clustering model	
	* Import project does not display data flow functionality.
	* In feature analysis popup plot option is not showing for numeric, categorical feature
	* Run cv is taking time and page stuck and showing the straight line issue
	* Radio button selection not retained for feature analysis
	* Datetime feature is not showing in feature analysis dropdown after selection 
	* Run CV is not working for f1score, precision, recall for multiclass 
	* Filter and model sorting issue in models page 
	* Missing threshold columns are not getting filtered out from target list
	* When random search for sarimax is failed, sarimax model gets removed from the models page and in train model page sarimax algo gets deselected 
	* Training is failed for text analysis model- Undefined error
	* Showing empty column in analysis report
## Predictsense 3.9.0 has been released with the following headline features :
   - **Data connection module enhancement**:now you can see the parsed and non parsed flag in data connection module for structured and unstructured file upload.
   - **EDA module enhancement**:you can see the dataset info on card after dataset selection from dropdown list and shows the target graph on card after target feature selection , also retaining and showing    					target from previous EDA for the selected file.
   - **Train model page enhancement**:now you can see info related to target in train model page and added the custom fetaure selection for scaling and normalization method.
   - **Lime report enhancement**:Added the lime report for text classifier.
   - **Added glove method for word embedding in text analysis module**:It is based on matrix factorization techniques on the word-context matrix. A large matrix of co-occurrence information is constructed and 					you count each “word” (the rows), and how frequently we see this word in some “context” (the columns) in a large corpus. Usually, we scan our corpus in the following manner: for 					each term, we look for context terms within some area defined by a window-size before the term and a window-size after the term. Also, we give less weight for more distant words.
   - **Added abstractive model-T5 in text summarization**:Added the abstractive method for text summarization. we have used text-to-text transfer transformer (T5) model to generate abstractive text summary. T5 								  is a new transformer model that is trained in an end-to-end manner with text as input and modified text as output.
   - **Added SVM algorithm in predictive modeling**:Now you can use the svm algorithm to build the models for prediction to check the insights.
   - **Signup page enhancment**:now added the password policy to create the strong passowrd . it should contain upper case letter, lower case letter, special symbol and numbers.
   - **Reset password enhancment**:now added the opt verification in reset password module. you can reset the password by verifying the opt which is send to your official e-mail. 
   - **Bug fixes**:Fixed the below listed issues or bugs.
	* Feature analysis plot is not working for all vartype feature if we check before EDA operation showing TypeError: Cannot read property 'reduce' of undefined.
	* Feature analysis plot is not working proper for numeric features showing bar plot for both options like boxplot and histogram.
	* Random search tuning is failing for ann regression and classification algorithm.
	* In comment section chat showing sudo user only for share project if we are adding comment using another user login.
	* Categorical encoder issue in pipeline for hashing and leave one out encoder method.
	* Training is failing for timeseries model getting KeyError: 'logTransformationColumns'
	* View EDA report button is enabled without performing EDA operation ( it should enable only when EDA operation is done).
	* in Feature scalling pipeline preview for all transforamtion method it is showing the numerical transformation.
	* In Scoring result tab showing same report for all the indexs and empty title.
	* Lime report is not working for regression problem getting error in python teminal.
	* ANN classification and regression lime report is not working .
	* For ann classification and regression cv is not working.
	* Need to disable the tour guide tool for report user.
	* Classification report issue for multiclass and multilabel problem.
	* Validation message issue while retraining using invalid data.
	* ANN classification feature impact plot issue, disabled for ann classification.
	* Feature coeff for multiclass is not showing.
	* Tuned model, doesnt show form for the very first time.
	* Random search and bayes opt doesnt show best param for tuned model.
	* Comment issue chat is overlapping.
	* Projects template issue training is failing getting numerical transformation error.
	* scheduler issue in docker toolkit.
	* For clustering project for  feature scaling and normalization not showing data preview option in pipeline.
	* For clustering model training is failing while using the transformation advanced options. 
## Predictsense 3.8.0 has been released with the following headline features :
   - **Added signup functionality in login page**:you can use the signup feature to create new user and use it for build models.
   - **Added reset password functionality in login page**:you can use the reset password feature to set new password for login. 
   - **Added guided tour and analytics using pendo**:tour guide tool helps user to understand the flow of the functionality in each module like project creation, import project, eda process, training model, 							     quick predcition etc.
   - **Added ticket feature**:you can use the ticket feature to raise the bug, new enhancement and feedback for the predictsense. The raised bug, enhancement and feedback is automatically forwarded to 				      super admin user. 
   - **Signin page enhancement**:Added signup and reset password link in login module. 
   - **EDA module enhancement**:Enabled user to have more control over the data split mechanism. Added the target selection in EDA module and also you can see the target graph for selected target feature and    					also you can split the dataset for training, testing and holdout.
   - **Quick prediction enhancement**:Added refresh form button in single input prediction by clicking on this button you can perform prediction on different form values. 
   - **Models page enahancement**: Changed the ordering of models page like holdout, developement, CV, Scoring. also added the validation strategy in CV tab you can perform it using different matrics.
   - **Bug fixes**:Fixed the below listed issues or bugs.
	* Username and password validation is missing in login page.
	* String transformation issue in eda advanced option not reflecting the change in EDA report
	* Features analysis plot issue for categorical, numeric, numeric feature.
	* Text analysis clone experiment issue if we click on save button without executing the component loader is continously loading.
	* Models page plot issue for roc_auc, lift&gain, feature impact, feature distribution issue for UI end.
	* Datadrift issue for regression and classification getting edaSummary is undefined error in browser console.
	* Quick prediction issue clustering and predictive modeling problem.
	* Timeseries interactive pipeline issue for categorical encoding showing the features twice.
	* Model tuning issue for sarimax model.
	* Analysis report issue for classification, regression, multilabel, clustering and timeseries problem.
	* Forecast plot issue for sarimax model output is reflecting  in prophet window.
	* Evaluate forecast plot issue for sarimax output is not showing.
	* Nested folder deletion issue in data connection module
	* Dataflow issue not showing none option in scheduler dropdown.
	* Search issue in stationarity test advanced option in timeseries.
	* Auto correlation plot issue for timeseries model
	* Text analysis issue for rule based matching and missing the graph option
	* Download options is missing for pos, ner and rbm  component.
	* Toolkit prediction issue for timeseries model
	* Calculate feature score issue in advanced option for RFE.
	* Disabled the refresh button in lime report for file uplaod and input prediction.
	* Pipeline preview issue for categorcial encoding showing binary encoder in train page it is one hot encoder.
	* File upload issue if we have blank header in dataset file.
	* Disabled the latin_1 encoding for file upload
	* Tooltip is missing for eda advanced options.
	* Retraining issue with merge dataset option plots not working and model retraining is also not working.
	* Model upload issue in settings showing server error
	* Socket issue for dataconnection, database connection showing server error.
	* Regression line plot and analysis report issue.
	* Disabled the advanced algorithm for multilabel problem
	* Disabled the bayseian optimization tuning option for multilabel problem.
	* Disabled the text analysis for timeseries.
	* Tooltip issue for text analysis module.
	* Compare model issue in model page - shows deleted module in comaprision screen.
	* Decision tree preview and download issue.
	* Disabled time vs accurancy plot for predictive modeling 
	* Changed the ordering of advanced option like feature generation, transformation, feature reduction, sampling and hpt.
	* Toolkit_lite issue for prediction, validation message, rounding, dashbaord and manage page.
	* Downloaded graph issue for pos, ner and rule based matching.
	* Sampling advanced option validation issue.
	* Retraining issue for classification model
	* HPT issue for gussian nb classification model
	* Model sorting issue for f1score and mathews coeff. 
	* Advanced option retain issue for previous training.
	* Timeseries target list issue for categorcial feature.
	* Project template issue for train model page showing server error and independent feature is not showing.
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 3.7.0 has been released with the following headline features :
   - **Text analysis module enhancement**: Add downlaod option in pos, ner and rule based matching graph.
   - **Model page ehancement**:Improved the ui for model deployment now you can add multiple deployment server setting and use the different host from list during the model deployment. 
   - **Drift report enhancement**: Improved the the model infomation ui in drift report and also features wise drift report. 
   - **Bug fixes**:Fixed the below listed issues or bugs.
	*EDA issue for missing value calculation.
	*Decision tree plot issue in models page.
	*Project search issue in project management page.
	*Train models page not retaining values, and showing server error.
	*Feature coeff graph/table issue not rendering properly.
	*File upload issue in quick prediction.
	*Lime report is not showing issue.
	*Lift and Gain plot is not showing for logistic regression getting server error.
	*In feature distribution if does not select value and click on submit application keep on loading.
	*Analysis report issue showing distorted values.
	*In models page cpu load issue showing incorrect.
	*Removed file name extention .pkl from eda and other pages.
	*Duplicate features displaying in eda feature analysis dropdown.
	*Conditional filtering issue in eda advanced option.
	*Share project is not working getting server error .
	*Home page issue if we select any option getting TypeError: Cannot read property '_id' of undefined.
	*EDA report issue getting error in ui like could not generate the advanced eda report.
	*For featurewise drift report getting KeyError: 'baselineStats'.
	*For clustering model plot issue for scatter and pie pot.
	*Dataflow execution issue for both direct and indirect flow.
	*Auto feature generation values is not getting passed in training request.
	*Pipeline preview issue for imputation showing the values twice.
	*EDA stages issue showing the same text twice.
	*URL validation issue for data connection.
	*In output module report preview is not working.
	*In text analysis not showing the close button in pipeline settings popup
	*Popup window width issue in text analysis for pipeline settings popup and plots like ner, pos and rbm.
	*Copy output is not working for text summarization. 
	*Word embedding is not working in text analysis.
	*Invalid username password error not displayed in login page if we pass worng details.
	*In clustering model metric is overlapping issue.
	*Analysis report issue for clustering model getting 500 error.
	*In pipeline for feature decomposition table details is showing empty.
	*In timeserie pipeline for resampling and feature scaling table preview is showing blank.
	*For timeseries model for forecast start and end date is showing blank. 
	*Pipeline setting alginement issue for word embedding, sentiment analysis, ner and pos.
	*Edit details are not working database connection, SFTP connection, usecase.
	*In Create project under description box showing wrong text message.
	*User profile issue not showing the profile.
	*Refresh button issue in text analysis for input text field.
	*Tooltip issue for dataset, eda module.
	*Validation message issue for share project in project management page.
	*Tooltip is missing for all advanced options tabs in train model page.
	*Model tuning issue for timeseries project it is not working.
	*Loader issue in dataconnection, eda and models page.
	*calculated feature scores in the independent feature table sorting issue.
	*For bayesian and random search model tuning, the input boxes for parameters are not aligned properly.
	*Uploaded model is not showing under POS and NER dropdown.
	*Tooltip issue in dataflow module.
	*Popup window width issue for create notebook.
	*delete button is not working in feature repo module.
	*prophet algo is missing in train model page under the dropdown list.
	*Toolkit issue for preidction, dashbaord.
   - **UX Enhancement**: Imporved UI/UX
## Predictsense 3.6.0 has been released with the following headline features :
   - **Added Rule Based Matching component in text analysis**: Added Rule Based Matching option to create a component which will match the patterns for each document and return the matched texts.This allow user 								      to add multiple patterns for matching.We can save or save & apply the experiments and view mode is just to view 
   - **Added download option support for rule based matching**: Added download option for Rule based matching graph.
   - **Conditional filtering in EDA**: Allow user to add condition on dataset for categorical ,numerical,datetime,text features. As per condition added on  dataset eg. greater than, not equal, remove 				       class ,equal class etc. number of data rows are reduced and this conditional data used for EDA and module training.User can add multiple condition and preview data. 					       Validation message added at preview' Note : It is recommended to have more number of data points for model creation'.
   - **Add new data type in EDA**: Add new data type as URL in Text.
   - **RFE feature selection**: Added RFE feature in model training advanced option.
   - **Lime report enhancement**: Along with class name we are displaying global prediction as well.
   - **Usecase creation**: Updated usecase creation API and added ideal persona and description columns under usecase model.
   - **PredictSense Client application**: Created basic desktop app using electronjs which allow user to explore usecase and tryout model training on user dataset and pre-filled data set. After model training 						  ideal persona,factor analysis,scenario generator and model specification display on screen with detailed information. It's allow user to download Prediction report.
   - **Bug fixes**: Fixed the below listed issues or bugs .
      * lime report global population value is mismatched with QP value.
      * QP is not working for data set(zomato) after conditional filtering is applied.
      * Getting error as 'No component lemmatizer found in pipeline' when use NER model from upload model option.
      * Feature distribution graph is not working and display Key error 'bins' issue.
## Predictsense 3.5.0 has been released with the following headline features :
   - **Text Analysis enhancement**:Added status in the saved expeiments list. Also now showing the saved experiments for import project as well.
   - **Added clone experiment support in text analysis module**:Added a action option for clone the experiment in this mode you can save or save & apply the experiments and view mode is just to view there we 								don't have that floating button.
   - **Added download option support in text analysis module**:Added download option for pos tagging, ner for plots.
   - **Added similarity model support in text summarization**:Similarity is a machine learning method that uses a nearest neighbor approach to identify the similarity of two or more objects to each other based 								      on algorithmic distance functions.
   - **Cleaning and transformation method enhancement in text analysis**:now added the remove emoticon and emojis from text using this operation.
   - **Added word embedding support in text analysis**:Word embeddings are a type of word representation that allows words with similar meaning to have a similar representation. You can check the most similar 							       word, next output word, similarity score between words.
   - **Added usecase support in predictsesne**:Domain module is use to add the specific business domain and you can create the use case for domain by selecting domain and adding tag, title, objectives, 						       description, outcome and by selecting the project, training and model Id. You can see the configured usecase in pslite.
   - **Added upload model support in settings**:In upload model you can upload the custom models and also you can use the upload model in POS ans NER to perform the operations on text data.
   - **Noetbook UI enhancement**:Added loader to the create notebook.
   - **Lime report enhancement**:Added the refresh button in popup window. You can generate the lime report for different indexs by clicking on refresh button.
   - **Added feature impact support in models module**:Feature impact gives you a score for each feature of your data, the higher the score more important or relevant is the feature towards your output         							       variable.
   - **Added feature distribution support in models module**:feature distribution helps in understanding what kind of feature you are dealing with, and what values you can expect this feature to have. You’ll see 								     if the values are centered or scattered	
   - **Angular version upgrade**:Updated the angular version from 1.5.8 to 1.5.9 
   - **Added toolkit_lite support in predictsense**:In toolkit_lite you can perform the following operations like you can see the model related information in dashboard, in manage module shows the list of models 							    along with upload model functionality and prediction module.
   - **Added pslite support**:In pslite you can see the dashboard, manage and prediction. In manage module you can upload the models. This is a light version of predictsense you need to add domain and usecase in 				      predictsense then the created use case will display in pslite. In pslite you can check the predciton for input and file upload as well.
   - **Interactive pipeline enhancement**:Improved the pipeline for text analysis module operations.
   - **Bug fixes**:fixed the below listed issues or bugs .
      * Histogram plots is not visible properly due to scroll bar in output module and report module
      * Issue with text analysis generated features showing up in quick prediction.
      * Disabled text operation from indep variable table in training module.
      * Holdout tab issue: analysis report and lime report is not working for trained model for text analysis generated feature.
      * Scoring result is failing for trained model for text analysis generated feature.
      * In setting actions alignment is showing different for all.
      * For timeseries model validation message is not showing in toolkit_lite while selecting the past date.
      * Train model using pca with custom feature advanced option and change the dataset and do training for other dataset then advanced option is not getting rest showing error.
      * Browes file option is not showing in import project popup window.
      * For SFTP connection not showing proper validation message if there is no any new file updated.
      * For clustering model training is failing getting ValueError: too many values to unpack.
      * If the project name has a dot ("."), the model deployment will fail.
      * For nlp default option is not showing
      * Disabled the feature distribution plot for multilabel problem.
      * For nlp data not showing text features in feature score, feature importance and feature coefficient plot and table view.
      * Issue in ordinal encoder does not keep save setting when user visit pages again while train model page.
      * For exams dataset QP and scoring result is failing while selecting the st.dev in imputation strategy and delete data in outlier strategy in EDA.
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 3.4.0 has been released with the following headline features :
   - **Added log support in data flow execution**:Now flow execution failure messages are coming in popups and we can see the error in view log in dataflow module.
   - **Added text analysis module support**:Text analysis is the process of obtaining valuable insights from texts. Added the following text analysis operations like cleaning, POS (Part of speech), NER(name 						    entity recognization), sentiment analysis, text summarization, word frequency etc.
   - **Added cleaning/transformation support in text analysis module**:Text contains different symbols and words which doesn't convey meaning to the model while training. So we will remove them before feeding to 									       the model in an efficient way. This method is called text cleaning.
   - **Added POS tagging support in text analysis**:Part-of-Speech tagging is a well-known task in Natural Language Processing. It refers to the process of classifying words into their parts of speech (also 							    known as words classes or lexical categories).
   - **Added NER support in text analysis**:NER is an information extraction technique to identify and classify named entities in text. These entities can be pre-defined and generic like location names, 						    organizations, time etc.
   - **Added sentiment analysis support in text analysis**:Sentiment analysis is a machine learning tool that analyzes texts for polarity, from positive to negative. By training machine learning tools with 								   examples of emotions in text, machines automatically learn how to detect sentiment without human input.
   - **Added text summarization support in text analysis**:Text summarization is the technique of shortening long pieces of text. The intention is to create a coherent and fluent summary having only the 								   main points outlined in the document. Automatic text summarization is a common problem in machine learning and natural language processing (NLP).
   - **Added word frequency support in text analysis module**: It lets you know that how many times a particular word is used in an entire text. It counts every word of your text and displays the number of 								       repetition.
   - **Added multiselect delete feature for dataset and data connection module**:Now we can delete multiple files at once by selecting all the files in dataset and data connection module etc.
   - **Interactive pipeline enhancement**:Improved the pipeline for text analysis module operations.
   - **Added the ordinal encoder support for catgorical feature**:ordinal encoding, each unique category value is assigned an integer value. For example, “red” is 1, “green” is 2, and “blue” is 3.
   - **Bug fixes**:fixed the below listed issues or bugs .
      * lime report issue for cars dataset plot is showing empty.
      * data connection issue for Pull from url, table is not getting refreshed when pull data is unchecked.
      * pipeline preview issue : not showing training process.
      * project management pagination issue.
      * data connection is not getting deleted .
      * EDA is failing for zscore outlier detection strategy method.
      * ordinal encoder issue while passing the negative values.
      * retraining is failing in while using merge dataset option in PS as well as in toolkit.
      * Drift report issue in PS and toolkit.
      * hold out and scoring result is not working for glass_train dataset.
      * model training issue for multilabel problem for netflix_movies dataset.
      * Sampling validation issue: train model using any sampling option and again redirect to train model page and select other sampling options and click on training then validation message is 			       not showing.
      * model training issue: if we change the target and click on start training without selecting any algoritm it is showing wrong algorithm name.
      * clustering model optimize no of cluster graph and input preiction is not working. 
      * model not showing after training: showing error like could not load any models.
      * fixed the timeseries plot issue for sarimax and prophet it is not showing the plots for past datset.
      * toolkit input preidction issue: showing all the feature's those are generated from notebook and text analysis now only showing the original features
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 3.3.0 has been released with the following headline features :
   - **Data drift UI enhancement**:Imporved the data drift plots also other ui changes.
   - **Toolkit UI enhancement**:Improved toolkit UI added new functionalities like monitoring, manage, database configuration etc..
   - **Added model monitoring support in toolkit**:now you can montior the model for week, month, day as per the schedule selection. It will compute the drift report on one 							   month prediction output etc.
   - **Added multiple task execution support in toolkit**:now you can add multiple tasks in scheduler and it will execute the simultaneously the model monitoring and 								  retraining tasks also you will get the alert message based on the scheduler selection.
   - **Added model dashbaord support in toolkit**:Link drift report to the models, in model dashboard.
   - **Prediction chart enhancement in toolkit**:Improved the prediction chart in toolkit. 
   - **Scheduler enhancement in toolkit**: now you can see the task with following details model name, task id and task type etc.
   - **Added savedata and appenddata node support in dataflow**:now you can use the savedata and appenddata node to make changes in dataset.
   - **Added gmail and zapier alert message support in toolkit**:now you can create alert for gmail, office365 and zaiper and used it in retraining and model monitoring.
   - **Feature extraction enhancement**:now we have an option to define number of grams along with few other parameters.
   - **Timeseries plot enhancement**:improved the foreacast plot for sarimax and prophet etc.
   - **Toolkit enhancement**:Improved the toolkit ui as well as the functinlaity etc.
   - **Notebook enhancements**:Improved the notebook functionality.
   - **Bug fixes**:fixed the below listed issues or bugs .
                     * EDA operation issue for timeseries dataset.
                     * Lime report issue with custom pca.
		     * Notebook issue.
		     * Data connection issue for default folder selection.
		     * Pipeline preview issue for feature decomposition.
		     * Export project issue.
		     * Outlier preview download issue in EDA 
		     * Delete project issue.
		     * Scheduler issue in toolkit.
		     * Alert message issue in toolkit app.
		     * Pull data issue in data connection.
		     * Drift report issue in PS.
	             * Save and  edit flow issue .
		     * Data flow issue for import project.
		     * Drift summary issue in models dashboard page
		     * zaiper alert issue in toolkit.
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 3.2.0 has been released with the following headline features :
   - **Code documentation for psstudio & pscore**: Prepared code documentation for both psstudio and pscore.
   - **Code refactoring for psstudio & pscore**: Completed code refactoring for all psstudio & pscore modules.
   - **Data drift UI enhancement**:Imporved the data drift plots also other ui changes.
   - **Toolkit enhancement**:Imporoved the linux and docker toolkit functionality.
   - **Added string transformation support in eda advanced**:now you can transform the string in EDA. It will reflect in everywhere in ps.
   - **Enhanced the data connection module**:improved the data connection module ui change for all the sources.
   - **Added add folder option for file upload**:now we can place the uploaded file in folder during file upload.
   - **Update lib for pscore**:updated keras, XGBoost, LightGBM, Sklearn and pandas and other library too.
   - **Added support for feature score in train model page**:now feature score value is displayed on train model page along with independent feature list.
   - **Toolkit enhancement**:Improved the toolkit ui as well as the functinlaity etc.
   - **Notebook enhancements**:Improved the notebook functionality.
   - **Bug fixes**:fixed the below listed issues or bugs .
                     * ANN,MLP, Extra tree classification tuning issue.
      * Random search tuning issue
      * Notebook issue for Import project.
      * Data connection module issues.
      * Retraining issue for ANN model
      * Model tuning issue
      * Login issue
      * Regression line plot issue.
      * QP issue.
      * Holdout and scoring issue.
      * SFTP Connection issue.
      * Drift report issue in PS.
      * Distribution and performance graphs plotting issue in drift report.
      * Data flow issue.
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 3.1.0 has been released with the following headline features :
  - **Data dirft enhancement**:Now we can see the more dirft informations. Added both concept drift and Data drift informations in drift report also done drift UI changes.
  - **Data drift support in toolkit**:Now we can generate the drift report in toolkit as well like in PredictSense. Need to add the drift config to compute the drift for 					      regression and classification model
  - **Added scheduler support in toolkit**:Now we can create scheduler , remove , pause scheduler and also we can schedule retraining process(if data source is sql).
  - **Toolkit enhancement**:Imporoved the linux and docker toolkit functionality.
  - **Added alert support in toolkit app**:Now you can configure the alert in toolkit and use during the retraining as per the scheduler it will send the retraining       						   model alert in every minute, hr,week, days to the confiured email ID.
  - **Added connection module in toolkit**:Now you can create connection for MS-SQL, MySQL and PostgreSQL.
  - **Added pull data support in data connection module**:Now you can pull the data from existing connection without using the scheduler for Pull from URL, MSSQL, MySQL and 								  PostgreSQL and SFTP connection.
  - **Added upload model support in toolkit**:Now you can download the model zip file from PredictSense and Upload the zip file in toolkit and perform the prediction, 						      retraining etc.
  - **Lime report enhancement**:Now lime report plot is using the ploty library.
  - **Added log transformation support**:Now you can use the log transformation advanced option to transform the data during training.
  - **Added calculate sampling percentage support**:Now you can use the over and under sampling option to train the model.
  - **Toolkit UI enhancement**:Improved the dashboard, prediction etc.
  - **Notebook enhancements**:Improved the notebook functionality.
  - **Bug fixes**:fixed the below listed issues or bugs .
      * Model tuning fixes.
		* Data flow issue.
      * Import project fixes.
      * timeseries plot issues.
      * Feature analysis plot issues
      * Interative pipeline issue for categorical encoding.
      * Analysis report issue for time series and clustering model.
      * Forecast plot issue for Timeseries model for sarimax.
      * Data connection module issues.
      * Bagging and Boosting model issue.
      * Lime report issues.
      * Model deployment issue for Forecasting project.
      * Cluster visualization plot issue.
      * Train model page plot issue.
      * Calculate feature score issue with log transformation.
      * Import project issue for data connection.
      * PostgreSQL edit connection issue.
## Predictsense 3.0 has been released with the following headline features :
  - **Added data connetion module support**:Now we can create connection for Pull from URL, MSSQL, MySQL, PostgreSQL, SFTP and pull the structured and unstructured file and  						   process it to structured file.
  - **Added scheduler support**:Now we can schedule the Pull data soruces from URL, MSSQL, MySQL, SFTP.
  - **Feature analysis graph enhancement**:Added more graphs for categorical and numeric features.
  - **Added scheduler support in toolkit**:Now we can create scheduler , remove , pause scheduler and also we can schedule retraining process(if data source is sql).
  - **Toolkit enhancement**:Imporoved the linux and docker toolkit functionality.
  - **Added data flow module support**:Data flow is used to process the unstructured file into structured file.
  - **Added output module support**:We can generate and share the report(from notebook,eda report etc) with other user.
  - **Added download lime and decision tree report support**: Now we can download the decision tree and lime report plots.
  - **Scheduler settings enhancement**:Improved the scheduler settings user interface.
  - **Notebook enhancements**:Improved the notebook functionality.
  - **Bug fixes**:fixed the below listed issues or bugs .
      * Feature Analysis fixes.
      * Model tuning fixes.
      * Data flow mutiple time execution issue.
      * Import project fixes.
      * timeseries trainig issue for advanced options.
      * Interative Pipeline bug fixes.
      * Analysis report issue for prophet model.
      * Forecast plot issue for Timeseries model for sarimax.
      * Data connection module issues.
      * Data drift bug fixes.
      * Feature Score, Feature impportance, Feature Coefficent plot issue.
      * Scheduler issues.
      * Lime report and dicision tree plot issues.
      * Popup windows issues. 
      * Download button issue.
      * Model deployment settings validation message issues.
      * Feature analysis plot issues
## Predictsense 2.9.0 has been released with the following headline features :
  - **Added Parallel Computing Support**:Now we can train the model parallelly , it is taking very less time to train the model using small and large datasets.
  - **Added Delete Model support**:Now we can delete any single model using delete button in models dashboard page.
  - **Retraining enhancement**:Now we can retrain the models using mssql pulled dataset.
  - **Added support for Model deployent**:now we can deploy the models in one click for that we need to add the deployment setting.
  - **Toolkit enhancement**:Imporoved the linux and docker toolkit functionality.
  - **Lime Report support for Regression algorithms**:Added lime report for Regression algorithms.
  - **Drift Report enhancemnts**:
  - **Decision Tree enhancement**:Added decision tree support for LightGBM and XGBoost
  - **Notebook enhancements**:Improved the notebook functionality.
  - **Bug fixes**:fixed the below listed issues or bugs .
			* Feature Analysis plot issues.
			* Model tuning fixes.
			* Learning curve plot bug fixes for classification and regression problem.
			* Quick Prediction Fixes.
			* Calculate feature score issue for Classification Problem.
			* Interative Pipeline bug fixes.
			* Advanced algorithms bug fixes.
			* Forecast plot issue for Timeseries model.
			* Custom Imputation bug fixes.
			* Analysis report issue for forecasting model
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 2.8.0 has been released with the following headline features :
   - **Data drift Bug fixes and new enhancements**: .
			* Concept drift for regression and classification based predicted value wrt std.
			* Add validation for feature wise drift.
			* Now we can see the retraining dataset info in Drift report page
   - **Retraining in toolkit**:Now we can retrain the Predictive modeling model from toolkit.
			* Added model overritte option while retraining in toolkit
			* Now we can merge the existing trained model dataset with newly retrained model datatset. 
   - **EDA Report enhancements**:Now we can download the EDA report in html format.
   - **Lime report in QP and Models page enhancements**:now we can run the lime report in both Quick Prediction as well as in Models page and also we can generate the lime 								plot for specific row. 
   - **Decision tree in models page**: Decision trees are constructed via an algorithmic approach that identifies ways to split a data set based on different 							   conditions	
   - **Pipeline enhancements and bug fixes**:Pipeline enhancement for date column and categorical , also fixed data population issue in pipeline.
   - **Delete training in models page**: Now we can delete the selected training from Models page.
   - **Added support for Xgboost and LightGBM for Multilable**:Now we can train the model for Xgboost and LightGBM classification algorithm for Multilable Problem as well.
   - **Added Support for Parallel Computing**:By splitting a job in different tasks and executing them simultaneously in parallel, a significant boost in performance can be 						      achieved
   - **Notebook enhancements**:Improved the notebook functionality.
   - **Bug fixes**:fixed the below listed issues or bugs .
			* Lime Report issues for Multilable Problem as well as for retrained model.
			* Plot issues in models Page for Classification Problem.
			* Categorical encoders training issue for clustering and Timeseries problem.
			* Fixes for Confusion Matrix.
			* Calculate feature score issue for Classification Problem.
			* Optimise no of cluster plot issue.
			* Remove target column from feature wise report.
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 2.7.0 has been released with the following headline features :
   - **Toolkit enhancements**: Now we can run multiple model in single container.
	   * File upload for Predictive Modeling
		* Model Dashboard 
		* Toolkit Skeleton
		* Toolkit for Multi-model container
   - **Time series**: added the parameter and Random Search model tuning functionality.
   - **Retraining in toolkit**:Now we can retrain the model in toolkit. 
   - **Merge Dataset column wise**: Added merge dataset column wise using different types of Jions like inner, left, right and outer join.
   - **Data drift Feature**:Added Data Drift Feature to detect the drift or changes in new dataset and Drift contribution plot, Drift Summary etc.
   - **Notebook enhancements**:Improved the notebook functionality. 
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 2.6.0 has been released with the following headline features :
   - **Added support for retraining in toolkit**: Now we can retrain the model in toolkit itself, we can trigger the API for retraining.
   - **Added more GPU algorithms**: Added more GPU based algorithms.Forecasting - ARIMA, Clustering - KMeans, and Predictive Modelling - XGBoost
   - **Pipeline tasks in UI**: Displaying pipeline tasks in UI.
   - **Added toolkit for Timeseries, Clustering**: Added a UI(file upload, graph) for clustering, timeseries in toolkit.
   - **Auto feature generation enhancements**: Added options for power and split custom auto feature generation.
   - **Timeseries enhancements**: Added auto correlation graph, enabled multiple model training, analysis report etc.
   - **Training history**: Added training history for timeseries and clustering modules.
   - **Memory optimization for rapid**: Added memory optimization for rapid algorithms.
   - **API to check database connectivity**: Added an API to check the database connectivity.
   - **UX Enhancement**: Improved UI/UX.
## Predictsense 2.5.0 has been released with the following headline features :
   - **Added Clustering and Time series modules**: Added the modules for creating Clustering and Timeseries models.
   - **RAPID AI**: Integrated Rapid AI, now we have two algorithms which can be run on GPU under Predictive Modeling.
   - **Dockerized Toolkit**: We can run the toolkits using docker.
   - **Pipeline support for Timeseries and Clustering**: Introduced complete pipeline support for timeseries and clustering modules.
   - **Auto feature generation**: Added explicit pairwise combination.
   - **Function sharing**: We can share functions to other users on the same PredictSense instance.
   - **UX Enhancement**: Improved UI/UX.
   
## Predictsense 2.4.0 has been released with the following headline features :
   - **Better project management and collaboration**: Introduced new project management and collaboration features like comments on project, share project, import and export project.
   - **New workflow**: Easier, Flexible and New model generation workflow.
   - **Pipeline support for predictive modelling**: Introduced complete pipeline support for predictive modeling.
   - **Data versioning(Manual)**: Maintain multiple versions of the data on the same project.
   - **Project templates**: Ready to use projects on different verticals.
   - **Auto feature generation**: Added feature for automatic feature generation.
   - **Feature sharing(Using notebook)**: We can share features to other users on the same PredictSense instance using notebook.
   - **UX Enhancement**: Improved UI/UX.

## Predictsense 2.3.0 has been released with the following headline features :
   - **Feature sharing and repository**: Now we can create a new feature and save it in feature repository also can share it with other useres of predictsense.
   - **Feature selection method**: Given provision for selecting feature score calculating methods.
   - **Feature score on leader board page**: We are providing an option to view the selected feature(while training) score in models page.
   - **LSTM and DBScan parameter tuning**: Added parameter tuning option for LSTM and DBScan.
   - **Improved documentation**: Added help documents/tooltips in DATA,EDA & Training page.
   - **Decomposition custom options**: Added custom options for decomposition.
   - **Notebook optimization**: Automatically terminate inactive notebook kernals.
   - **Added factor analysis method**: Added factor analysis method in decomposition options.

## Predictsense 2.2.1 has been released with the following headline features :
   - **Added DBScan algorithm**: Implemented DBScan clustering algorithm.
   - **Jupyter notebook integration**: Integrated jupyter notebook into predictsense, will be available for admin user only.
   - **Added LSTM algorithm**: Implemented LSTM algorithm as a part of timeseries.
   - **Edit data type**: We can edit datatype in manual EDA.
   - **Bivariate/Multivariate plotly implementation**: Added plotly graphs for Bivariate/Multivariate.
   - **Decomposition support**: Added decomposition support for predictive modeling.
   - **NLP enhancements**
   - **Memory optimization**: Memory optimization for EDA.
   - **Added sorting options to leader board**: Added alphabetical sorting options to model leader board.
   - **Tooltip info**: Added tooltip for all the components in models page.
   
## Predictsense 2.2.0 has been released with the following headline features :
   - **Clustering support**: Implemented KMeans clustering algorithm with quick prediction and toolkit support.
   - **Bayesian Optimization**: Implemented  Bayesian Optimization for all algorithms
   - **PCA**: Implemented PCA as a part of clustering
   - **Lift&Gain charts**: Implemented lift&gain charts for binary classification models, which will help us to understand the model performance.
   - **Downsampling for imbalanced dataset**
   - **Cahnged graph library as plotly**: Plotly will give better user interactivity and visualization effects.

## Predictsense 2.1.0 has been released with the following headline features :
   - **Timeseries forecasting graph improvements**: Improved forecasting graphs interactivity.
   - **Feature Normalization**: Added option to do feature normalisation.
   - **Fill missing values**: Fill missing values based on its other categorical and boolean column.
   - **Change strategy in manual eda based on datatypes**: Now we can change strategy in manual eda based on datatypes.
## Predictsense 2.0.1 has been released with the following headline features :
   - **Multivariate Analysis Enhancement**: Moved Multivariate Analysis to EDA page, now user can view the graphs for raw data and imputed data after EDA.
   - **Convertion of svg graph to html**: Converted all image graph to html like 3 numerical graph plot in multivariate, regression line, ROC-AUC.
   - **Show numerical columns for outlier in manual EDA**: Display only numerical columns for outlier correction strategies in manual EDA.
   - **Download EDA Report**: User can download the EDA report in html format.
   - **Enhanced logic for nlp**: Perform training for nlp dataset with correcting some features in the dataset.
   - **Toolkit support for exogenous variable**: Toolkit support for multi variable for sarimax multivariate model.
   - **Validation of custom input**: Restrict user to put string or special character for numerical column in custom input while doing manual EDA.


## Predictsense 2.0 has been released with the following headline features :
   - **TimeSeries Model Enhancement**: Support multivariate traaining for sarimax algorithm.
   - **Leaderboard Enhancement**: Summary table and forecast enhancement.
   - **Outlier Handling**: Outlier detection and correction in EDA. Implemented 3 strategies are:
          1.Factor Method
          2.Z-Score
          3.Inter-Quartile Range
   - **Prophet Algorithm**: Support for timeseries datasets.
   - **Parameter Tuning For Sarimax**: User can select the parameters according to his dataset demands.
   - **Toolkit support for Timeseries**: Enabled toolkit support for time series algorithms Sarimax and prophet.
   - **Reduce dataframe memory**: Reduce dataframe memory size to decrease the computation cost.
   - **Merge API Enhancement**: Merge api logic enhancement if we have raw data to merge using api.
   - **User input for Timeseries graph analysis**: User can input number of months to forcast for prophet model.
   - **Pull Data**: User can provide public url to pull data to predictsense.
     
  
## Predictsense 1.9.0 has been released with the following headline features :
   - **Regression Line Performance metrics**:Regression line performs relationship between two variables by fitting a linear equation for observed data.
   - **Dynamic percentege of test size**: Use dynamic percentege of test size in advance options according to the size of the dataset.
   - **XGBoost and Lightgbm HPT**: Added Hyper Parameter tuning for XGBoost and LightGBM regressor and classifier
   - **ANN RandomSearch implementation**: At leaderBoard page of ANN implemented gridsearch for finding the best parameters, train on it and create new model.
   - **Default value RandomSearch**: Display some default parameters for the algorithms under randomsearch.
   - **Random Search best Parameters**: Once training gets completed under random search show the best parameter suits for the model among the passed parameters.
    - **UI/UX Enhancement**: Simple transition effect added.
    - **Analysis Report**: Analysis Report for devlopment, holdout and scoring.
    - **TimeSeries implementation**: For timeseries data will undergo the below processes
        1. Preprocessing
        2. Graph analysis
        3. Training

   
## Predictsense 1.8.0 has been released with the following headline features:
   - **Hyper parameters of ANN**: Added hyperparameters for ANN.
   - **Memory usage graph**: Show memory usage graph on UI.
   - **Date Column segregation**: Date Column segregation on EDA page.
   - **RandomSearch CV Implementation**: At leaderBoard page implement gridsearch for finding the best parameters, train on it and create new model.
   - **LightGBM algo Implementation**: Added a new algorithm for both classification and regression.
   - **XGBoost Algorithm Implementation**: Add XGBoost Classifier and Regressor.
   - **Scoring Data**: User's test dataset to measure performance of model.
   - **Enhanced Analytics**: 1. Univariate and bivariate more plots
                             2. Target plot Enhancement
                             3. Animations 
                                      
    - **Toolkit changes related to new algos**: Toolkit added for ANN, XGBoost and Lightgbm.
    - **Hold Out sets**: Scoring the performance metrics on an unseen data i.e the Test Data.
    - **Bagging Boosting code change**: Advanced algorithms changes for Validation.    


## Predictsense 1.7.0 has been released with the following headline features:
- **Code Optimization**: Remove the redundant code for Preprocess, Multivariate, Hypothesis.
- **Preprocessing EDA**: Create each functions in preprocessing module for date handling, calculate datatypes, calculate missing values, calculate statistics, imputation, eda summary.
- **EDA Datatype Calculation**: Boolean:1. Number - contains unique value should be 2
                                        2. Text - contains True and False

                                Numeric:1. Number - contains category (int)
                                        2. Number - contains continuous value - int or float

                                Categorical:Text - Contains category except True and False

                                Date:1. Date - Contains only date
                                     2. Timestamp

                                Text - Contains text (unique values)
- **Python code optimization**: Python code optimization related changes for Preprocess, Multivariate, Hypothesis.
- **UI Changes**: Removal of histogram, Rename advance EDA to EDA report, Removal of P value score to progress bar in correlation, Scatter plot removal, Removal of activity bar and Provide a loader in Quick prediction while changing algorithms.
- **Add logger info**: Added logger info for all modules.
- **EDA- Unique values computation** : Calculate and show unique value for each column after EDA along with column name.
- **Treat balnk in EDA**: Treat blank space, n/a and NAN (any case) to null values.
- **Remove special charcter in table headers**: Convert any special chars to _ if present in column name/taable headers.
- **Tensorflow - ANN**: Added a new tensorflow algorithm for both regression and classification data.
- **Re-Engineering Kfold + Cross Validation**: Added validation strategy for calculating CV score under advance options. The new added strategies are stratified k fold, stratified shuffle split and timeseries split.


## Predictsense 1.6.0 has been released with the following headline features:
 - **Toolkit licensing**: Toolkit will be  expired based on the expiry date mentioned and number of predictions which ever condition meet first, it will get expired.
 - **Merge Api**: Add new data to existing data, it can be a single data or a complete dataset file.
 - **Python modules obfuscation**: Enhance obfuscation logic for python modules based on the new file structure.
 - **Ps_Core architechture**: Maintain proper flask file structure.
 - **Licensing**: User will require a license file to run predictsense. License is done base on number of projects, number of user, number of trainings per project and expiry date. Whichever condition meets first, predictsense app will get expired. 
 - **Lime**: LIME modifies a single data sample by improving the feature values and observes the resulting impact on the output. 
 - **Celery integration for Training and Hypothesis**: Give the training and hypothesis testing task to celery.




## Predictsense 1.2.0 has been released with the following headline features:
  -  **Multivariate analysis**: Analyse patterns and relationships between several variables simultaneously.
  -  **Custom EDA**: Added custom EDA functionality in manual EDA for user define imputation of missing values.
  -  **Quick Prediction**: Support for single value inputs and show prediction probabilities of classification datasets.
  -  **Celery**: Give large tasks to other process and continue with the usual routine.
  -  **Smote**: Handle imbalanced dataset if assigned as a target feature.
  -  **Feature Scaling**: To overcome the noise for dataset containing features highly varying in terms of magnitudes, units and range.
  -  **Advance algorithm parameter**: User can design his choices to build the model architecture for bagging, boosting and Gridsearch CV.
  -  **Node-Red**: Extended node red functionalities to support mongodb and sql even perform dataset operations.
  -  **User Management(admin)**: Admin will get the option to reset user password
Options.
  -  **Help Sections**: Added user manual and demo videos under this section.
  -  **Performance metrics filter**: Added filter option in the model to customize the user needs.
  -  **Analysis Report**: Change the logic from Numpy arrays to DataFrames to maintain the records in the Analysis Report.




## Predictsense 1.1.0 has been released with the following headline features:
  - **Node-Red**: Designed Node-Red basic flow, for data upload.
  - **Nginx-Server**: Integrated Nginx server for balancing load to avoid performance issues.
  - **Toolkit**: Fixed some minor bug fixes and introduced toolkit UI for passing single data output.
  - **Learning Curve**: To show the comparision graph of training score and cross validation score.
  - **Target Feature Enhancement**: Added hypothesis testing feature between dependent and independent features. which will compute the p value (helps to find the feature significance).
  - **Advance algorithms**: Added bagging,boosting and gridsearch cv for every algorithms as advance option.
  - **ANN algorithm**: Added ANN algorithm for classification belonging to deep learning category.
  - **Api improvements**:  /api/eda/pandasProfile
                           /api/eda/graph
                           /api/data/read
                           /api/train/scatter
                           /api/models/analysisReport/graph
                           /api/models/analysisReport/report
                           /api/classification/roc_auc
                           /api/model/classificationReport
                           /api/model/learningCurve
                           Given error messages incase any of the following operations gets failed.
      



## Predictsense 1.0 has been released with the following headline features:
  - **Hyperparameter Tuning**: User can design his choices to build the model architecture. He can select the parameters according to his dataset demands.
 - **NLP Support**: Support for NLP dataset with suitable algorithms. Now predictsense can build model for text data and wordcloud for the nlp data visualisation.
 - **Histogram Binning**: Makes easier for the viewer to interpret the data. 
 - **Winjit Blue Theme**: Added blue theme for better design.
 - **Toolkit**: Basic utilisation is done, user can download .sav model.
 - **Regularization algo**: Avoid predictsense models from overfitting we added some algorithms like logistic, ridge, lasso.
  - **Trees Algorithm**: Whenever an element is to be searched, start searching from the root node. It can handle both numerical and categorical data. Can also handle multi-output problems. Decision Tree algorithm is added in predictsense to support both type of data's.
  - **Download EDA summary**: User can download the computed EDA summary.
  - **Show complete training history**: Save the last 5 trained set of models for every individual projects.
  - **Class weight classification algorithms**: For X-train, X-test split, split_weights must have an equal probability.
  
