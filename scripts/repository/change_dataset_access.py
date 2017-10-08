from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase
import sys
import json

dataset_name = ""
if len(sys.argv) == 2:
    args = json.loads(sys.argv[1])
    dataset_name = args['dataset']
    access = args['access']
else:
    print('Invalid number of arguments.')
    exit()

db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

user_query = 'MATCH (d:DataSet { Data_Set_Name: \'' + dataset_name + '\'})RETURN d'
user_query_results = db.query(user_query, returns=client.Node)
return_string = ""

d = user_query_results[0]
dataset_access = d[0]["Access_Modifier"]

if len(user_query_results) > 0:
    q = 'MATCH (d:DataSet { Data_Set_Name: \'' + dataset_name + '\'}) SET d.Access_Modifier = \'' + access + '\''
    db.query(q, )
    return_string = "{\"result\": \"success\"}"
else:
    return_string = "{\"isLinked\": \"public\"}"

print(return_string)