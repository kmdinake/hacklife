import sys
import json
from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase

def main():
	if len(sys.argv) == 2:
		user_email = json.loads(sys.argv[1])['userEmail']
	else:
	    print('Invalid number of arguments.')
	    exit()

	db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

	db_query = 'MATCH (u:User { Email: \'' + user_email + '\'}) RETURN u'
	db_results = db.query(db_query, returns=client.Node)

	if len(db_results) > 0:
		print('{\"result\":\"true\"}')
	else:
		print('{\"result\":\"false\"}')

if __name__ == '__main__':
	main()