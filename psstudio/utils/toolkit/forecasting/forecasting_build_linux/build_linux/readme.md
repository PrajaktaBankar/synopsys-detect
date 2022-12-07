#PredictSense toolkit

Steps to setup and run the toolkit
1) Install python >=3
2) Extract and navigate to the toolkit folder
3) Do "pip install requirements.txt"
install ."
5) Once the installation is completed, do "cd app" then run "python
 toolkit_app.py",this will
 start a local server on port 5005

How to use:
1)Start the server by typing "python toolkit_app.py", if it is already running leave as it is.
2)You can send prediction data to api in one of the following format

    API Endpoint: /api/prediction?result=json/graph

	1) JSON Format
		---------------------
		{
            "startDate":"mm/dd/yyyy",
            "endDate": "mm/dd/yyyy"
        }


Note:
* You can always replace the default server with unicorn,nginx etc.
* Please add security for api