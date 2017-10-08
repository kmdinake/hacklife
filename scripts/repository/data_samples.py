import sys
import json
import pymongo as pm
from neo4jrestclient import client as neo_client
from neo4jrestclient.client import GraphDatabase


def handleRequest(arr):
    dataset_id = arr["dataSetID"]
    neo_db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
    ds_query = 'MATCH (d:DataSet { Data_Set_ID: \'' + dataset_id + '\'}) RETURN d'
    ds_query_res = neo_db.query(ds_query, returns=neo_client.Node)
    if len(ds_query_res) > 0:
        mongo_db_name = "Data"
        mongo_coll_name = dataset_id
        mongo_client = pm.MongoClient()
        mongo_db = mongo_client[mongo_db_name]
        mongo_coll = mongo_db[mongo_coll_name]
        attrib_projection = {'_id': False, 'missing_values': False, 'outliers': False}
        data_samples = json.loads('{\"result\": '+json.dumps(list(mongo_coll.find(projection=attrib_projection)))+'}')
        print(json.dumps(data_samples))
    else:
        print('{ \"result\": \"failed\" }')


def main():
    if len(sys.argv) == 2:
        handleRequest(json.loads(sys.argv[1]))
    else:
        print("Invalid number of arguments")
        exit()


if __name__ == '__main__':
    main()
