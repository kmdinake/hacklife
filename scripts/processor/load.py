import abc
import pandas as pd
import xml.etree.ElementTree as ElementTree
import sys


class AbstractLoad(metaclass=abc.ABCMeta):
    """Abstract interface for data loader."""

    @abc.abstractmethod
    def load_data(self, path, schema_path):
        pass


class ConcreteLoadCSV(AbstractLoad):
    """Concrete class implementing AbstractLoad."""

    def load_data(self, data_path, schema_path):
        if schema_path is None:
            # If no schema has been provided assume that the csv file has a header containing the attribute names.

            # Load the data set.
            try:
                data_set = pd.read_csv(data_path, header=0)
            except:
                print('Error. Unable to load csv data file.')
                exit()

        else:
            # The schema has been provided.

            # Load the attributes into a list.
            try:
                columns = list(pd.read_csv(schema_path).columns)
            except:
                print('Error. Unable to load csv schema file.' + sys.exc_info()[0])
                exit()

            # Load the data.
            try:
                data_set = pd.read_csv(data_path, names=columns)
            except:
                print('Error. Unable to load csv data file.')
                exit()

        return data_set


class ConcreteLoadJSON(AbstractLoad):
    """Concrete class implementing AbstractLoad."""

    def load_data(self, data_path, schema_path):
        # Load the data.
        try:
            data_set = pd.read_json(data_path)
        except:
            print('Error. Unable to load json data file.')
            exit()

        return data_set


class ConcreteLoadXLS(AbstractLoad):
    """Concrete class implementing AbstractLoad."""

    def load_data(self, data_path, schema_path):
        if schema_path is None:
            # If no schema has been provided assume that the csv file has a header containing the attribute names.

            # Load the data set.
            try:
                data_set = pd.read_excel(data_path, header=0)
            except:
                print('Error. Unable to load excel data file.')
                exit()

        else:
            # The schema has been provided.

            # Load the attributes into a list.
            try:
                columns = pd.read_csv(schema_path).iloc[0].tolist()
            except:
                print('Error. Unable to load csv schema file.')
                exit()

            # Load the data.
            try:
                data_set = pd.read_csv(data_path, names=columns)
            except:
                print('Error. Unable to load csv data file.')
                exit()

        return data_set


class ConcreteLoadXML(AbstractLoad):
    """Concrete class implementing AbstractLoad."""

    def load_data(self, data_path, schema_path):
        try:
            xml_data = open(data_path).read()
            root = ElementTree.XML(xml_data)
        except IOError:
            print('Error. Unable to load xml data file.')
            exit()
        except:
            print('Error. Unexpected issue when converting text to XML object.')
            exit()

        all_records = []
        for i, child in enumerate(root):
            record = {}
            for sub_child in child:
                record[sub_child.tag] = sub_child.text
                all_records.append(record)
                data_set = pd.DataFrame(all_records)

        return data_set

