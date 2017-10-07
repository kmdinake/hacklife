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
                uploadDate: "", dd/mm/yyyy
                trendProfileHistory: [] -> { trendProfileID: -1, nr_clusters: -1, algorithmName: "", dateGenerated: "" }
            }
        ]
    }
"""
