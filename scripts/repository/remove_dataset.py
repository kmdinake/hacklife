import sys
import json
import pymongo as pm
from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase


def removeFromNeo4j(dataset_id):
    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
    ds_query = 'MATCH (d:DataSet { Data_Set_ID: \'' + dataset_id + '\'})RETURN d'
    ds_query_results = db.query(ds_query, returns=client.Node)
    if len(ds_query_results) > 0:
        del_rel = 'MATCH (p:User)-[u:Uses]->(d:DataSet { Data_Set_ID: \'' + dataset_id + '\'}) DELETE u'
        db.query(del_rel)
        del_attr_and_rel = 'MATCH (d:DataSet { Data_Set_ID: \'' + dataset_id + '\'})-[h:Has]->(a:Attribute) DELETE h, a'
        db.query(del_attr_and_rel)
        del_node = 'MATCH (d:DataSet { Data_Set_ID: \'' + dataset_id + '\'}) DELETE d'
        db.query(del_node)
        return True
    else:
        return False


def removeFromMongo(dataset_id):
    mongo_db_name = "Data"
    mongo_coll_name = dataset_id
    mongo_client = pm.MongoClient()
    mongo_db = mongo_client[mongo_db_name]
    mongo_coll = mongo_db[mongo_coll_name]
    is_removed = str(mongo_coll.drop())
    mongo_coll_name = dataset_id + "_stats"
    mongo_coll = mongo_db[mongo_coll_name]
    is_removed_2 = str(mongo_coll.drop())
    if is_removed == "true" and is_removed_2 == "true":
        return True
    else:
        return False


def handleRequest(dataset_id):
    res_neo = removeFromNeo4j(dataset_id=dataset_id)
    if res_neo is True:
        res_mongo = removeFromMongo(dataset_id=dataset_id)
        if res_mongo is True:
            return_string = "{\"result\": \"success\"}"
        else:
            return_string = "{\"result\": \"failure\"}"
    else:
        return_string = "{\"result\": \"failure\"}"
    print(return_string)


def main():
    dataset_id = ""
    if len(sys.argv) == 2:
        args = json.loads(sys.argv[1])
        dataset_id = args['dataset_id']
        handleRequest(dataset_id=dataset_id)
    else:
        print('Invalid number of arguments.')
        exit()


if __name__ == '__main__':
    main()
