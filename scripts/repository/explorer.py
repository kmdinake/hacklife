import sys
import json
from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase


def handleRequest(user_email):
    cq_1 = 'MATCH (p:User { Email: \'' + user_email + '\'})-[u:Uses]->(d:DataSet { Access_Modifier: \'public\' }) RETURN d;'
    cq_2 = 'MATCH (p:User)-[u:Uses]->(d:DataSet { Access_Modifier: \'public\' }) where p.Email <> \'' + user_email + '\' RETURN p, d;'
    db = GraphDatabase(url='http://localhost:7474', username='neo4j', password='12345678')
    user_datasets = db.query(cq_1, returns=client.Node)  # the current user's public datasets
    other_datasets = db.query(cq_2, returns=client.Node)  # other user's public datasets
    if len(user_datasets) <= 0 or len(other_datasets) <= 0:
        print('{\"result\": \"failed\"}')
        return
    else:
        user_count = 0
        other_count = 0
        temp_u_names = []
        temp_o_names = []
        for user_count in range(len(user_datasets)):
            temp_u_names.append(user_datasets[user_count]["Data_Set_ID"]

        for other_count in range(len(other_datasets)):
            temp_o_names.append(other_datasets[other_count]["Data_Set_ID"])

def main():
    if len(sys.argv) == 2:
        args = json.loads(sys.argv[1])
        handleRequest(user_email=args['user_email'])
    else:
        print('{\"result\": \"Invalid number of arguments\"}')


if __name__ == '__main__':
    main()
