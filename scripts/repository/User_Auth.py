import sys
import json
from front_end_funtions import user_auth

inputs = json.loads(sys.argv[1])

# {\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}
user_email = inputs['email']
password = inputs['password']

return_val = user_auth(user_email, password)
print(return_val)




