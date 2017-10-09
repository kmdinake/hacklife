from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np
import re


class Processor:
    """Root cleaner class holding missing and erroneous value handlers."""

    def __init__(self):
        self.schema = None
        self.data_set_stats = None

    def format_column_headings(self, data_set):
        """Removes leading and trailing spaces"""

        # Extract the attribute names from the DataFrame.
        columns = data_set.columns.values.tolist()
        for i in range(0, len(columns)):
            columns[i] = columns[i].strip()

        data_set.columns = columns

        #return data_set

    def fill_missing_values(self, data_set):
        """Replaces NaN values with modelled values."""

        for column in data_set.columns.values:
            # Replace missing values with the median or mode of the column depending on the data type.
            if str(column) != "missing_values":
                try:
                    data_set[column] = pd.to_numeric(data_set[column])
                    data_set[column].fillna(data_set[column].median(), inplace=True)
                except ValueError:
                    most_frequent = data_set[column].mode()
                    # If the mode can't be computed that means that there are no repeating values in the column
                    if (len(most_frequent) > 0) and (len(most_frequent) < 2):
                        data_set[column].fillna(data_set[column].mode()[0], inplace=True)
                    else:
                        # What to do with the non repeating columns?
                        # For now just take the first item in the mode list
                        data_set[column].fillna(data_set[column].mode()[0], inplace=True)

    def determine_missing_indicators(self, data_set):
        """Replaces missing value indicators with NaN then creates an extra column indicating missing value positions"""

        # Replace all possible missing value indicators with NaN
        missing_value_indicators_regex = '\?|none|null|nan|unknown| '
        regex = re.compile(missing_value_indicators_regex, flags=re.IGNORECASE)
        data_set = data_set.replace(to_replace=regex, value=np.NaN, regex=True)

        missing_df = data_set.isnull()

        missing_values_column = []
        for i in range(0, missing_df.shape[0]):
            current_row = []
            for column in missing_df.columns:
                if missing_df[column].iloc[i]:
                    current_row.append(column)

            missing_values_column.append(list(current_row))

        return data_set, missing_values_column

    def create_schema(self, data_set):
        """The schema contains column name, column type pairs"""

        # Extract the attribute names from the DataFrame.
        columns = data_set.columns.values.tolist()

        # Extract the column data types.
        column_data_types = data_set.dtypes.tolist()

        # Convert to Numerical and Categorical keywords
        for i in range(0, len(column_data_types)):
            if np.issubdtype(column_data_types[i], np.number):
                column_data_types[i] = "Numerical"
            else:
                column_data_types[i] = "Categorical"

        # Create the schema.
        schema = list(zip(columns, column_data_types))

        return schema

    def handle_duplicate_rows_and_columns(self):
        # Detect then prompt user for action
        pass

    def detect_and_mark_outliers(self, data_set):
        """Mark each data point that has a value that is more than 3 standard deviations from the mean"""

        outliers_column = []
        for i in range(0, data_set.shape[0]):
            current_row = []
            for column in data_set.columns:
                if np.issubdtype(data_set[column].dtype, np.number):
                    # Find the standard deviation for the current column
                    for j in range(0, self.data_set_stats.shape[0]):
                        if self.data_set_stats["column_name"].iloc[j] == column:
                            break

                    curr_col_std_dev = self.data_set_stats["std_dev"].iloc[j]
                    curr_col_mean = self.data_set_stats["mean"].iloc[j]
                    range_lower = curr_col_mean - (3*curr_col_std_dev)
                    range_upper = curr_col_mean + (3*curr_col_std_dev)
                    curr_value = data_set[column].iloc[i]

                    if curr_value < range_lower or curr_value > range_upper:
                        # Then it is an outlier
                        current_row.append(column)

            outliers_column.append(list(current_row))

        data_set["outliers"] = outliers_column

    def calculate_stats(self, data_set):
        """Calculate common statistics for each numerical column in the data set"""

        stats_list = []

        for column in data_set.columns.values:
            if str(column) != "missing_values":
                if np.issubdtype(data_set[column].dtype, np.number):
                    # If the column is numerical
                    keys = ['column_name', 'mean', 'median', 'std_dev', 'min', 'max']
                    values = [column, data_set[column].mean(), data_set[column].median(),
                              data_set[column].std(), data_set[column].min(), data_set[column].max()]
                    stats = dict(zip(keys, values))
                    stats_list.append(stats)

        self.data_set_stats = pd.DataFrame(stats_list)
        return self.data_set_stats

    def convert_categorical_data(self, data_set):
        """Convert categorical data to it's numerical equivalent"""

        for column in data_set.columns.values:
            if str(column) != "missing_values" and str(column) != "outliers":
                if str(data_set[column].values.dtype) == 'object':
                    new_column_title = column + '_converted'
                    data_set[new_column_title] = data_set[column]
                    column_encoder = LabelEncoder().fit(data_set[new_column_title].values)
                    data_set[new_column_title] = column_encoder.transform(data_set[new_column_title].values)

        #return data_set

    def format_numbers(self):
        """Rounds all floating point values in the data set stats to 3 decimal places"""

        self.data_set_stats = self.data_set_stats.round(3)
        return self.data_set_stats

    def strip_data_points(self, data_set):
        for column in data_set.columns.values:
            if str(data_set[column].dtype) == 'object':
                data_set[column] = data_set[column].str.strip()
