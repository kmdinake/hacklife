import sys
import os
import json
import pandas as pd
import pymongo as pm


def handleRequest(dataset_id, user_folder):
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
        print('{ \"result\": \"' + user_dir + '\" }')
    except EnvironmentError:
        print('{ \"result\": \"failed\" }')
    except BaseException:
        print('{ \"result\": \"failed\" }')


def main():
    if len(sys.argv) == 2:
        json_obj = json.loads(sys.argv[1])
        handleRequest(json_obj['dataset_id'], json_obj['hasedUserEmail'])
    else:
        print('{ \"result\": \"failed\" }')


if __name__ == '__main__':
    main()
