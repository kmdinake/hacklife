import sys
import json
from front_end_funtions import user_reg

inputs = json.loads(sys.argv[1])

# {\"firstName\":\"jason\",\"lastName\":\"Smith\",\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}
first_name = inputs['firstName']
last_name = inputs['lastName']
user_email = inputs['email']
password = inputs['password']

return_val = user_reg(first_name, last_name, user_email, password)
print(return_val)
