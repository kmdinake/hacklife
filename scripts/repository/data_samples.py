import sys
import json
import pymongo as pm
from neo4jrestclient import client as neo_client
from neo4jrestclient.client import GraphDatabase


def handleRequest(arr):
    dataset_name = arr["dataset"]
    neo_db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
    ds_query = 'MATCH (d:DataSet { Data_Set_Name: \'' + dataset_name + '\'}) RETURN d'
    ds_query_res = neo_db.query(ds_query, returns=neo_client.Node)
    if len(ds_query_res) > 0:
        mongo_db_name = "Data"
        mongo_coll_name = dataset_name
        mongo_client = pm.MongoClient()
        mongo_db = mongo_client[mongo_db_name]
        mongo_coll = mongo_db[mongo_coll_name]
        data_samples = json.dumps('{ \"result\": ' + list(mongo_coll.find()) + '}')
        print(data_samples)
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
