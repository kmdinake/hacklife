# ToDo List for Ritesh
Open this file in Firefox

## UserService
### getUserFullname > POST Request
```javascript
    /*
        @ToDo: Get a user's fullname
        @Param: The user's email accessible through req.body.userEmail
        @Return: JSON result containing the user's fullname i.e { fullname: resultFromNeo4jQuery }
    */
```

## DataService
### changeDatasetAccessMod > POST Request
```javascript
    /*
        @ToDo: Get a user's fullname
        @Param: The dataset's name accessible through req.body.datasetName and the variable indicating whether the dataset is sharable or not through req.body.truth_val
        @Return: JSON result containing the success of the operation i.e { result: "success" | "failure" }
    */
```

### removeDataset > POST Request
```javascript
    /*
        @ToDo: Remove a dataset from Neo4j and Mongo
        @Param: The dataset's name accessible through req.body.datasetName
        @Return: JSON result containing the success of the operation i.e { result: "success" | "failure" }
    */
```

### retrieveDataSamples > POST Request
```javascript
    /*
        @ToDo: Get the data of a specific dataset
        @Param: The dataset's name accessible through req.body.datasetName
        @Return: JSON result containing the data of a dataset i.e { dataSamples: resultFromNeo4jQuery }
    */
```

### hasLinkedTrendProfiles > POST Request
```javascript
    /*
        @ToDo: Check if a dataset has Trend Profiles it is linked to
        @Param: The dataset's name accessible through req.body.datasetName
        @Return: JSON result containing a true or false value indicating whether there are any trend Profiles connected to the dataset i.e { isLinked : true | false }
    */
```

# Final Comments
So these are the service contracts for the request routes that are specified in the angular services. So Ritz, I need you to write Node endpoints for those routes, i.e.
```javascript
    // Post request
    app.post('/route', function(req, res){
        // implement
    });
    // Get Request
    app.get('/route', function(req, res){
        // implement
    });
```
Also, If you have time, please write the Neo4j queries for each of those request, or just write them down for me then I'll write the python files for it.

### Thanks alot Ritz 
