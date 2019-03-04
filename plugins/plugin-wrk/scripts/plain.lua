-- local inspect = require('inspect')

wrk.method = "POST"
wrk.body   = '{ "name": "nick" }'
wrk.headers["Content-Type"] = "application/json"
wrk.headers["Authorization"] = "Basic MjNiYzQ2YjEtNzFmNi00ZWQ1LThjNTQtODE2YWE0ZjhjNTAyOjEyM3pPM3haQ0xyTU42djJCS0sxZFhZRnBYbFBrY2NPRnFtMTJDZEFzTWdSVTRWck5aOWx5R1ZDR3VNREdJd1A="
