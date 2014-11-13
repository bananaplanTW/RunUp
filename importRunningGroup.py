import MySQLdb
import sys
import urllib

db = MySQLdb.connect(host='localhost', user='running_area', passwd='Sunflower123', db='running_area')
cursor = db.cursor()
f = open(sys.argv[1], 'r')

lines = f.read().split('\r')
basic_SQL = "insert INTO running_group (group_id, group_name, contact, address, email, website) VALUE "
i = 0
for line in lines:
	if (i == 0):
	   i = i + 1
	   continue
	club_data = line.split('\t')
	name = urllib.quote(club_data[1].strip("\""))
	group_id = name.lower().replace(" ", "_")
	address = club_data[3].strip("\"")
	contact = club_data[4].strip("\"")
	email = club_data[5].strip("\"")
	webite = club_data[6].strip("\"")
	SQL = basic_SQL + "(\"" + group_id + "\",\"" + name + "\",\"" + contact + "\",\"" + address + "\",\"" + email + "\",\"" + webite + "\")"
	print SQL
	try:
		cursor.execute(SQL)
		db.commit()
	except:
		db.rollback()
	result = cursor.fetchall()
	print result
db.close()
