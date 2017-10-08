import sys
import json
import pymongo as pm

data_set_id = json.loads(sys.argv[1])['dataSetID']

database_name = 'Data'
collection_name = data_set_id

# Exclude the mongo _id
attrib_projection = {'_id': False, 'missing_values': False, 'outliers': False}

# Create a MongoDB client
client = pm.MongoClient()

# Retrieve the database
db = client[database_name]

# Retrieve the collection
collection = db[collection_name]

data = json.dumps(list(collection.find(projection=attrib_projection)))
print(data)