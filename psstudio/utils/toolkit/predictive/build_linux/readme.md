#PredictSense toolkit

######Steps to setup and run the toolkit

1) Install python >=3
2) Extract and navigate to the build folder
3) Run toolkit-start.sh script using below command:

        sh toolkit-start.sh
 
How to use:
    
- You can send prediction data to api in one of the following format

        API Endpoint: /api/prediction

        1) JSON Format 1
            ---------------------
            [
                {
                    colName:colValue,
                    colName:colValue
                },
                {
                    colName:colValue,
                    colName:colValue
                }
            ]
    
        2) JSON Format 2
            ---------------------
            {
                "filepath":"Absolute filepath",
                "fileEncoding":"Appropriate encoding of the file ex:utf-8"
            }

- You can send retraining data to api in below format and retrain the 
existing model which will be overwritten and utilize it for predictions

  
        API Endpoint: /api/retraining
  
  	        JSON Format
      		
            {
              "filepath":"Absolute filepath",
              "fileEncoding":"Appropriate encoding of the file ex:utf-8"
            }


Note:
* You can always replace the default server with unicorn,nginx etc.
* Please add security for api