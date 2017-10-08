from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase
import sys
import json

dataset_name = ""
if len(sys.argv) == 2:
    args = json.loads(sys.argv[1])
    dataset_name = args['dataset']
else:
    print('Invalid number of arguments.')
    exit()

db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

ds_query = 'MATCH (d:DataSet { Data_Set_Name: \'' + dataset_name + '\'})RETURN d'
ds_query_results = db.query(ds_query, returns=client.Node)

print(len(ds_query_results))
if len(ds_query_results) > 0:
    del_rel = 'MATCH (p:User)-[u:Uses]->(d:DataSet { Data_Set_Name: \'' + dataset_name + '\'}) DELETE u'
    db.query(del_rel)
    del_node = 'MATCH (d:DataSet { Data_Set_Name: \'' + dataset_name + '\'}) DELETE d'
    db.query(del_node, )
    return_string = "{\"result\": \"success\"}"
else:
    return_string = "{\"isLinked\": \"failure\"}"

print(return_string)