"""
 @ Todo: Return all the datasets that a user has uploaded or generated trends on
 @ Param: The user's email
 @ Return: Json string of the following schema:
    {
        "my_data" : [
            {
                datasetID: -1,
                datasetName: "",
                attributes: [],
                recordCount: -1,
                uploadDate: "", dd/mm/yyyy,
                access_mod: "",
                download_path: "",
                trendProfileHistory: [] -> { trendProfileID: -1, nr_clusters: -1, algorithmName: "", dateGenerated: "" }
            }
        ]
    }
"""

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

# Input is a users email address
return_string = "{ \"my_data\": ["
db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
# Get all of a users datasets
db_list = list()
db_nodes = list()
db_query = 'MATCH (u:User { Email: \'' + email + '\'})-[z:Uses]->(d:DataSet) RETURN d'
db_results = db.query(db_query, returns=client.Node)

for z in db_results:
    db_list.append([z[0]["Data_Set_ID"], z[0]["Data_Set_Name"]])
    db_nodes.append(z[0])

count = 0
while count < len(db_list):
    return_string += "{\"datasetID\":" + "\"" + db_list[count][0] + "\"," + "\"datasetName\":" + "\"" + db_list[count][1] + "\","

    # Find all the attributes in a data set
    attr_query = 'MATCH (d:DataSet { Data_Set_ID: \'' + db_list[count][0] + '\'})-[h:Has]->(a:Attribute) RETURN a'
    attr_query_result = db.query(attr_query, returns=client.Node)

    return_string += "\"attributes\": ["
    for a in attr_query_result:
        return_string += "\"" + a[0]["Attribute_Name"]
        if a != attr_query_result[len(attr_query_result) -1]:
            return_string += "\","
        else:
            return_string += "\"],"

    return_string += "\"recordCount\": \"" + str(db_nodes[count]["Record_Count"]) + "\","
    return_string += "\"uploadDate\": \"" + db_nodes[count]["Upload_Date"] + "\","
    return_string += "\"access_mod\":\"" + db_nodes[count]["Access_Modifier"] + "\","
    return_string += "\"download_path\":\"" + db_nodes[count]["Download_Path"] + "\","
    query = 'MATCH (u:User { Email: \'' + email + '\'})-[z:Has]->(p:Trend_Profile)-[y:Has]->(d:DataSet ' \
            '{ Data_Set_ID: \'' + db_list[count][0] + '\'}) RETURN p'
    results = db.query(query, returns=client.Node)
    trend_p_array = list()

    return_string += "\"trendProfileHistory\": ["
    for x in results:
        trend_p_array.append(x)
        return_string += "{ \"trendProfileID\": " + "\"" + str(x[0]["Trend_Profile_ID"]) + "\"," + "\"dateGenerated\": " + "\"" + x[0]["Date_Generated"] + "\","

        trend_p_id = x[0]["Trend_Profile_ID"]
        # For each trend profile get all the trends
        trend_query = 'MATCH (u:User { Email: \'' + email + '\'})-[z:Has]->(p:Trend_Profile { Trend_Profile_ID:' \
                        ' ' + str(trend_p_id) + '})-[h:Has]->(t:Trend) RETURN t'
        trend_results = db.query(trend_query, returns=(client.Node))

        return_string += " \"nr_clusters\": " + "\"" + str(len(trend_results)) + "\","

        algo_query = 'MATCH (u:User { Email: \'' + email + '\'})-[z:Has]->(p:Trend_Profile { Trend_Profile_ID: ' + str(x[0]["Trend_Profile_ID"]) + '})-[g:Generated_By]->(a:Algorithm) RETURN a'
        algo_query_results = db.query(algo_query, returns=client.Node)

        a = algo_query_results[0]
        return_string += "\"algorithmName\":" + "\"" + a[0]["Algorithm_ID"] + "\""

        if x != results[len(results)-1]:
            return_string += "},"
        else:
            return_string += "}"

    return_string += "]}"

    if count != len(db_list)-1:
        return_string += ","

    count = count + 1

return_string += "]}"

print(return_string)
