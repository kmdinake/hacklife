from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase
import sys
import json

email = ""
if len(sys.argv) == 2:
    args = json.loads(sys.argv[1])
    email = args['email']
else:
    print('Invalid number of arguments.')
    exit()

db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

user_query = 'MATCH (u:User { Email: \'' + email + '\'})RETURN u'
user_query_results = db.query(user_query, returns=client.Node)
return_string = ""

for n in user_query_results:
    return_string += "{\"fullname\": " + "\"" + n[0]["First_Name"] + " " +  n[0]["Last_Name"] + "\""

return_string += "}"

print(return_string)
