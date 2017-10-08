import sys
import json
import pymongo as pm

input = json.loads(sys.argv[1])
data_set_id = input['dataSetID']

database_name = 'Data'
collection_name = data_set_id + '_stats'
#print(collection_name)
attrib_projection = {'_id': False}

# Create a MongoDB client
client = pm.MongoClient()

# Retrieve the database
db = client[database_name]

# Retrieve the collection
collection = db[collection_name]

stats = json.dumps(list(collection.find(projection=attrib_projection)))
#stats = stats.replace('\"','')
print(stats)
