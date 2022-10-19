-- ONLY FOR NOTES - these are not being read from. add any functioning queries to server/query.js in the relevant spot

-- COPY TABLE QUERIES (load from files - pathname must be specified)

COPY "User" (name, username, password_hash, type)
FROM 'pathname\user.csv'
DELIMITER ','
CSV HEADER;