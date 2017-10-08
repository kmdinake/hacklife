import sys
import json
import pymongo as pm
from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase


def removeFromNeo4j(dataset_name):
    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
    ds_query = 'MATCH (d:DataSet { Data_Set_Name: \'' + dataset_name + '\'})RETURN d'
    ds_query_results = db.query(ds_query, returns=client.Node)
    if len(ds_query_results) > 0:
        del_rel = 'MATCH (p:User)-[u:Uses]->(d:DataSet { Data_Set_Name: \'' + dataset_name + '\'}) DELETE u'
        db.query(del_rel)
        del_node = 'MATCH (d:DataSet { Data_Set_Name: \'' + dataset_name + '\'}) DELETE d'
        db.query(del_node)
        return True
    else:
        return False


def removeFromMongo(dataset_name):
    mongo_db_name = "Data"
    mongo_coll_name = dataset_name
    mongo_client = pm.MongoClient()
    mongo_db = mongo_client[mongo_db_name]
    mongo_coll = mongo_db[mongo_coll_name]
    is_removed = str(mongo_coll.drop())
    if is_removed == "true":
        return True
    else:
        return False


def handleRequest(dataset_name):
    res_neo = removeFromNeo4j(dataset_name=dataset_name)
    if res_neo is True:
        res_mongo = removeFromMongo(dataset_name=dataset_name)
        if res_mongo is True:
            return_string = "{\"result\": \"success\"}"
        else:
            return_string = "{\"result\": \"failure\"}"
    else:
        return_string = "{\"result\": \"failure\"}"
    print(return_string)


def main():
    dataset_name = ""
    if len(sys.argv) == 2:
        args = json.loads(sys.argv[1])
        dataset_name = args['dataset']
        handleRequest(dataset_name)
    else:
        print('Invalid number of arguments.')
        exit()


if __name__ == '__main__':
    main()
