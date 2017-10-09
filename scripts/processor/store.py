import abc
import pymongo as pm
from neo4jrestclient.client import GraphDatabase
from neo4jrestclient import client
import datetime


class AbstractStore(metaclass=abc.ABCMeta):
    """Abstract interface for data storer."""

    @abc.abstractmethod
    def store_data(self, data_set, db_name, data_set_name):
        pass

    @staticmethod
    def add_data_set_to_graph(data_set_name, owner, database, access_modifier, schema, user_id, record_count,
                              url='http://localhost:7474',
                              username='neo4j', password='12345678'):
        now = datetime.datetime.now()
        date_uploaded = now.strftime('%d/%m/%y')
        db = GraphDatabase(url, username=username, password=password)
        data_sets_label = db.labels.create("DataSet")
        attributes_label = db.labels.create("Attribute")
        new_data_set = db.nodes.create(Data_Set_Name=data_set_name, Owner=owner, Access_Modifier=access_modifier,
                                       Database=database, Upload_Date=date_uploaded, Record_Count=record_count)
        new_data_set.set('Data_Set_ID', data_set_name + '_' + str(new_data_set.id))
        data_sets_label.add(new_data_set)

        attributes = []
        for pair in schema:
            attribute_name = pair[0]
            attribute_type = pair[1]
            new_attribute = db.nodes.create(Attribute_Name=attribute_name, Attribute_Data_Type=attribute_type)
            attributes_label.add(new_attribute)
            attributes.append(new_attribute)

        for attribute in attributes:
            new_data_set.relationships.create('Has', attribute)

        # Retrieve the user node from the graph
        q = 'MATCH (u:User{ Email: \'' + user_id + '\'}) RETURN u'
        results = db.query(q, returns=client.Node)
        for u in results:
            u[0].relationships.create('Uses', new_data_set)

        # Create the unique data set identifier
        return data_set_name + '_' + str(new_data_set.id)

    @staticmethod
    def check_for_same_named_data_set(data_set_name, user_id, url='http://localhost:7474', username='neo4j',
                                      password='12345678'):
        db = GraphDatabase(url, username=username, password=password)
        q = 'MATCH (u:User{ Email: \'' + user_id + '\'})-[h:Uses]->(d:DataSet{Data_Set_Name: \'' + data_set_name +\
            '\'}) RETURN d'
        results = db.query(q, returns=client.Node)
        for g in results:
            if g[0]['Data_Set_Name'] == data_set_name:
                print('Sorry you already have a dataset with that name. Please choose another name.')
                exit()


class ConcreteStoreMongo(AbstractStore):
    """Concrete class implementing AbstractStore."""

    def store_data(self, data_set, data_set_stats, db_name, data_set_name):
        # Create a MongoDB client.
        client = pm.MongoClient()

        # Select the database
        db = client[db_name]

        # Retrieve the collection if it exists else create it
        collection = db[data_set_name]

        # Check if it exists
        if collection.count() != 0:
            collection.drop()

        # Convert the cleaned DataFrame to a list of dictionaries and insert it into a mongo db.
        documents = data_set.to_dict('records')
        collection.insert_many(documents)

        # Add the data set stats to  mongo
        stats_collection_name = data_set_name + '_stats'
        collection = db[stats_collection_name]
        documents = data_set_stats.to_dict('records')
        collection.insert_many(documents)


class ConcreteStoreMySQL(AbstractStore):
    """Concrete class implementing AbstractStore."""

    def store_data(self, data_set, db_name, data_set_name):
        pass
