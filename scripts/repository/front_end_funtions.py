from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase


def user_auth(email, password):
    returnbool = False
    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

    # Find user node
    q = 'MATCH (u:User { Email: \'' + email + '\'}) RETURN u'
    results = db.query(q, returns=client.Node)
    for r in results:
        # print("%s" % (r[0]["First_Name"]))
        # print("%s" % (r[0]["Password"]))
        if r[0]["Email"] == email and r[0]["Password"] == password:
            returnbool = True
            break

    return returnbool


def user_reg(fname, lname, email, password):

    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")

    lbl_user = db.labels.create("User")
    user = db.nodes.create(User_ID="1", First_Name=fname, Last_Name=lname, Email=email, Password=password)
    lbl_user.add(user)

    return True

def get_user_datasets(user_email):

    return_string = ""
    return_array = list()

    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
    q = 'MATCH (u:User { Email: \'' + user_email + '\'})-[r:Uses]->(d:DataSet) RETURN d'
    results = db.query(q, returns=client.Node)
    for r in results:
        return_array.append(r[0]["Data_Set_Name"])

    num_arrays = len(return_array)

    count = 0
    if num_arrays == 1:
        return "{" "\"" + str(return_array.pop(count)) + "\"" + "}"

    return_string = return_string + "{"
    while count < num_arrays:

        return_string = return_string + "" "\"" + str(return_array.pop(0)) + "\"" + ""

        if count != num_arrays - 1:
            return_string = return_string + ","

        count = count+1

    return_string = return_string + "}"

    return return_string


def dataset_attributes(user_email):
    return_string = ""
    return_array = list()
    dataset_nodes = list()

    db = GraphDatabase("http://localhost:7474", username="neo4j", password="12345678")
    q = 'MATCH (u:User { Email: \'' + user_email + '\'})-[r:Uses]->(d:DataSet) RETURN d'
    results = db.query(q, returns=client.Node)
    for r in results:
        return_array.append(r[0]["Data_Set_Name"])
        dataset_nodes.append(r[0])
    num_arrays = len(return_array)

    # If theres only one dataset connected to the users node
    count = 0
    if num_arrays == 1:
        tempval = str(return_array.pop(0))
        return_string = return_string + "[{" "\"" + tempval + "\"" + ""
        q = 'MATCH (u:User { Email: \'' + user_email + '\'})-[r:Uses]->(d:DataSet { Data_Set_Name: \'' \
            '' + tempval + '\'})-[s:Has]->(a:Attribute) RETURN a'
        results = db.query(q, returns=client.Node)
        return_string = return_string + ", \"Attributes\": "
        att_count = 0
        for v in results:
            if 0 == att_count:
                return_string = return_string + "["

            if len(results[0]) == att_count - 2:
                return_string = return_string + "\"" + v[0]["Attribute_Name"] + "\""
            else:
                return_string = return_string + "\"" + v[0]["Attribute_Name"] + "\"" + ","

            att_count = att_count + 1

        """if count != num_arrays - 1:
            return_string = return_string + ","""""
        if count == num_arrays - 1:
            return_string = return_string + "]"

        count = count + 1
        return_string = return_string + "}"
        return_string = return_string + "]"

        return return_string

    return_string = return_string + "["
    # return_string = return_string + "{"
    while count < num_arrays:
        name = str(return_array.pop(0))

        return_string = return_string + "{" "\"" + name + "\"" + ""
        attribute_string = ""
        q = 'MATCH (u:User { Email: \'' + user_email + '\'})-[r:Uses]->(d:DataSet { Data_Set_Name: \'' \
            '' + name + '\'})-[s:Has]->(a:Attribute) RETURN a'
        results = db.query(q, returns=client.Node)
        return_string = return_string + ": \"Attributes\":"
        att_count = 0
        for v in results:
            if 0 == att_count:
                return_string = return_string + "["

            if len(results[0]) == att_count-2:
                return_string = return_string + "\"" + v[0]["Attribute_Name"] + "\""
            else:
                return_string = return_string + "\"" + v[0]["Attribute_Name"] + "\"" + ","

            att_count = att_count + 1

        """if count != num_arrays - 1:
            return_string = return_string + ","""""
        if count == num_arrays - 1:
            return_string = return_string + "]"

        count = count + 1
        return_string = return_string + "}"
    return_string = return_string + "]"

    return return_string

