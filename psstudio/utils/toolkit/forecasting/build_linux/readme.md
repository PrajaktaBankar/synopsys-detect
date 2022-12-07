#PredictSense toolkit

######Steps to setup and run the toolkit

1) Install python >=3
2) Extract and navigate to the build folder
3) Run toolkit-start.sh script using below command:

        sh toolkit-start.sh
 
How to use:
    
- You can send prediction data to api in one of the following format

        API Endpoint: /api/prediction?result=json/graph

            JSON Format
        
            {
                "startDate":"mm/dd/yyyy",
                "endDate": "mm/dd/yyyy"
            }


Note:
* You can always replace the default server with unicorn,nginx etc.
* Please add security for api
