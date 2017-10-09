import unittest
import inspect

from raw_data_processor import *


def log_point(context):
    'utility function used for module functions and class methods'
    calling_function = inspect.stack()[1][3]
    print('in %s - %s()' % (context, calling_function))


class LoadingTestCases(unittest.TestCase):

    def setUp(self):
        log_point(self)

    def tearDown(self):
        log_point(self)

    def test_is_loaded_with_schema(self):
        self.rdp = RawDataProcessor(None, 'Data/wine.csv', 'Data/wine_schema.json')
        self.rdp.load()
        self.assertFalse(self.rdp.is_data_set_empty())

    def test_is_loaded_without_schema(self):
        self.rdp = RawDataProcessor(None, 'Data/stocks.json')
        self.rdp.load()
        self.assertFalse(self.rdp.is_data_set_empty())

    def test_incorrect_format(self):
        self.rdp = RawDataProcessor(None, 'values.docx')
        self.assertEqual(self.rdp.load(), 'Error')


class ProcessingTestCases(unittest.TestCase):

    def setUp(self):
        log_point(self)

    def tearDown(self):
        log_point(self)

    def test_replacement_of_missing_values(self):
        self.rdp = RawDataProcessor(None, 'Data/test.csv', 'Data/test.json')
        self.rdp.load()
        self.rdp.test_clean()
        self.assertFalse(self.rdp.does_data_set_contain_nan())
        log_point(self)

    def test_calculation_of_stats(self):
        self.rdp = RawDataProcessor(None, 'Data/test.csv', 'Data/test.json')
        self.rdp.load()
        self.rdp.test_clean()
        self.rdp.test_calculate_stats()
        self.assertFalse(self.rdp.is_data_set_stats_empty())

    def test_categorical_conversion(self):
        self.rdp = RawDataProcessor(None, 'Data/test.csv', 'Data/test.json')
        self.rdp.load()
        self.rdp.test_clean()
        self.assertFalse(self.rdp.test_categorical_conversion())


class StoringTestCases(unittest.TestCase):
    def setUp(self):
        log_point(self)

    def tearDown(self):
        log_point(self)

    def test_is_stored_in_mongo(self):
        self.rdp = RawDataProcessor(None, 'Data/test.csv', 'Data/test.json')
        self.rdp.load()
        self.rdp.test_clean()
        self.rdp.test_calculate_stats()
        self.rdp.test_store_to_db_mongo()
        client = pm.MongoClient()
        db = client['testDB']
        collection = db['test']
        self.assertEqual(collection.count(), 8)

    def test_is_stored_in_neo(self):
        self.rdp = RawDataProcessor(None, 'Data/test.csv', 'Data/test.json')
        self.rdp.load()
        self.rdp.test_clean()
        self.rdp.test_calculate_stats()
        self.rdp.test_add_data_set_to_graph()

        db = GraphDatabase(url='http://localhost:7474', username='neo4j', password='12345678')
        q = 'MATCH (d:DataSet{ Data_Set_Name: \'test\'}) RETURN d'
        results = db.query(q, returns=client.Node)
        for g in results:
            if g[0]['Data_Set_Name'] == 'test':
                found = True
            else:
                found = False

        self.assertTrue(found)

if __name__ == "__main__":
    unittest.main()  # Run all tests