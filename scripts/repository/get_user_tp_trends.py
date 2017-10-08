"""
 @ Todo: Return all the trends that a trend profile consists of
 @ Param: The user's email, users trend profile ID
 @ Return: Json string of the following schema:
    {
        "trends" : [
            {
                trend_id: "",
                rules: "",
                count: "",
            }
        ]
    }
"""

from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase
import sys
import json

email = ""
tp_id = ""
if len(sys.argv) == 2:
    args = json.loads(sys.argv[1])
    email = args['email']
    tp_id = args['tp_id']
else:
    print('Invalid number of arguments.')
    exit()

return_string = "{ \"trends\": "
db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

trend_query = 'MATCH (u:User { Email: \'' + email + '\'})-[h:Has]->(p:Trend_Profile { Trend_Profile_ID: ' + str(tp_id) + '})-[j:Has]->(t:Trend) RETURN t'
trend_query_results = db.query(trend_query, returns=client.Node)

print(len(trend_query_results))
for t in trend_query_results:
    return_string += "{\"trend_id\": " + "\"" + str(t[0]["Trend_ID"]) + "\"" + ", \"rules\": " + t[0]["DecisionTreeRules"] + "," + "\"count\": " + "\"" + str(t[0]["Sample_Count"]) + "\"}"

    if t != trend_query_results[len(trend_query_results)-1]:
        return_string += ", "

return_string += "}"
print(return_string)
