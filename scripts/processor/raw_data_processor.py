import os

from load import *
from processor import *
from store import *


class RawDataProcessor:
    """Root class holding references to the loading, cleaning and storing strategies"""

    def __init__(self, user_id, data_path, schema_path=None, access_modifier='private'):

        self.__user_id = user_id
        self.__data_path = data_path
        self.__schema_path = schema_path
        self.__access_modifier = access_modifier
        self.__loading_strategy = None
        self.__processor = None
        self.__storing_strategy = None
        self.__data_set = None
        self.__schema = None
        self.__file_name = None
        self.__data_set_stats = None
        self.__record_count = None
        self.__unique_data_set_identifier = None

    def engage(self):
        self.load()
        self.process()
        self.store()
        to_return = '{ \"result\": { \"dataset_name\": \"' + self.__file_name + '\", \"dataset_id\": \"' + self.__unique_data_set_identifier + '\"}}'
        print(to_return)

    def load(self):
        # Extract the file extension from the path and instantiate the appropriate loading strategy.
        try:
            file_name_with_ext = os.path.split(self.__data_path)[-1]
            self.__file_name, file_extension = os.path.splitext(file_name_with_ext)
        except RuntimeError:
            print('Error. Unable to split directory path.')


        if file_extension == '.csv':
            self.__loading_strategy = ConcreteLoadCSV()
        elif file_extension == '.json':
            self.__loading_strategy = ConcreteLoadJSON()
        elif file_extension == '.xml':
            self.__loading_strategy = ConcreteLoadXML()
        elif file_extension == '.xls' or file_extension == '.xlsx':
            self.__loading_strategy = ConcreteLoadXLS()
        else:
            print('Error. Unsupported format.')
            return 'Error'

        # Load the data.
        self.__data_set = self.__loading_strategy.load_data(self.__data_path, schema_path=self.__schema_path)
        self.__record_count = self.__data_set.shape[0]
        return 'Success'

    def process(self):
        # Instantiate the processor.
        self.__processor = Processor()

        # Remove leading and trailing spaces from column headings
        self.__processor.format_column_headings(self.__data_set)

        # Strip leading and trailing spaces
        self.__processor.strip_data_points(self.__data_set)

        # Determine missing indicators
        self.__data_set, missing_values_column = self.__processor.determine_missing_indicators(self.__data_set)

        # Fill missing values
        self.__processor.fill_missing_values(self.__data_set)

        # Create the schema
        self.__schema = self.__processor.create_schema(self.__data_set)

        # Add the missing values column
        self.__data_set["missing_values"] = missing_values_column

        # Calculate stats on the data.
        self.__processor.calculate_stats(self.__data_set)

        # Detect and mark outliers
        self.__processor.detect_and_mark_outliers(self.__data_set)

        # Convert categorical data.
        self.__processor.convert_categorical_data(self.__data_set)

        # Format numbers
        self.__data_set_stats = self.__processor.format_numbers()

    def store(self):
        # Instantiate the storing strategy.
        self.__storing_strategy = ConcreteStoreMongo()

        # Store the data.
        # ---------------
        # Once the meta level is implemented there will be a mechanism to determine which database we're working with

        # Check that the current user doesn't already have a data set with the same name
        self.__storing_strategy.check_for_same_named_data_set(self.__file_name, self.__user_id)

        self.__unique_data_set_identifier = self.__storing_strategy.add_data_set_to_graph(self.__file_name, 'Me', 'Mongo',
                                                                                   self.__access_modifier,
                                                                                   self.__schema, self.__user_id,
                                                                                   self.__record_count)
        self.__storing_strategy.store_data(self.__data_set, self.__data_set_stats, 'Data', self.__unique_data_set_identifier)

    def store_to_db(self):
        # For testing purposes
        self.__storing_strategy.store_data(self.data_set, 'Data', self.file_name)

    def print_data(self):
        print(self.__schema)
        print('\n')
        print(self.__data_set)
        print('\n')
        print(self.__data_set_stats)
