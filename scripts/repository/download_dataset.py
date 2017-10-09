import sys
import os
import json
import pandas as pd
import pymongo as pm
from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase


def handleNeoRequest(download_path, dataset_id):
    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
    cq = 'MATCH (d: DataSet { Data_Set_ID: \'' + dataset_id + '\'}) SET d.Download_Path = \'' + download_path + '\''
    db.query(cq, returns=client.Node)
    cq = 'MATCH (d: DataSet { Data_Set_ID: \'' + dataset_id + '\', Download_Path: \'' + download_path + '\'}) RETURN d'
    res = db.query(cq, returns=client.Node)
    if len(res) > 0:
        print('{ \"result\": \"success\" }')
    else:
        print('{ \"result\": \"failed\" }')


def handleMongoRequest(dataset_id, user_folder):
    client = pm.MongoClient()
    db_name = "Data"
    coll_name = dataset_id
    mongo_db = client[db_name]
    mongo_coll = mongo_db[coll_name]
    attrib_projection = {'_id': False, 'missing_values': False, 'outliers': False}
    data_samples = list(mongo_coll.find(projection=attrib_projection))
    if len(data_samples) == 0:
        print('{ \"result\": \"failed\" }')
        return
    df = pd.DataFrame(data_samples)
    user_dir = "downloads/datasets/" + user_folder
    if not os.path.exists(user_dir):
        try:
            os.makedirs(user_dir)
        except EnvironmentError:
            print('{ \"result\": \"failed\" }')
            return
    user_dir = user_dir + "/" + dataset_id + ".csv"
    try:
        df.to_csv(user_dir)
        # print('{ \"result\": \"' + user_dir + '\" }')
        handleNeoRequest(user_dir, dataset_id)
    except EnvironmentError:
        print('{ \"result\": \"failed\" }')
    except BaseException:
        print('{ \"result\": \"failed\" }')


def main():
    if len(sys.argv) == 2:
        json_obj = json.loads(sys.argv[1])
        handleMongoRequest(json_obj['dataset_id'], json_obj['hasedUserEmail'])
    else:
        print('{ \"result\": \"failed\" }')


if __name__ == '__main__':
    main()
