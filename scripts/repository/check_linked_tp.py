from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase
import sys
import json


def handleRequest(dataset_id):
    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

    tp_query = 'MATCH (p:Trend_Profile)-[h:Has]->(d:DataSet { Data_Set_ID: \'' + dataset_id + '\'})RETURN p'
    tp_query_results = db.query(tp_query, returns=client.Node)
    return_string = ""

    size = len(tp_query_results)

    if size > 0:
        return_string = "{\"isLinked\": \"true\"}"
    else:
        return_string = "{\"isLinked\": \"false\"}"

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
