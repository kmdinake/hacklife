from raw_data_processor import *
import sys
import json

"""
    Parameters to be passed to this script:
    
    - A json string with the following keys
        - user_id
        - access_modifier
        - data_path
        - schema_path
        
    eg: {\"user_id\":\"luciansargeant@gmail.com\",\"access_modifier\":\"private\",\"data_path\":\"test.csv\",
    \"schema_path\":\"test.json\"}
    
"""

if len(sys.argv) == 2:
    args = json.loads(sys.argv[1])
    user_id = args['user_id']
    access_modifier = args['access_modifier']
    data_path = args['data_path']
    schema_path = args['schema_path']
    rdp = RawDataProcessor(user_id, data_path, schema_path=schema_path, access_modifier=access_modifier)
else:
    print('Invalid number of arguments.')
    exit()

rdp.engage()
