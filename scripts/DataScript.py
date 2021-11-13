import xlrd
import pymysql
import random

# --- Open workbook and sheet
book = xlrd.open_workbook("letter_E.xls")
sheet = book.sheet_by_name("Letter E")
# --- MySQL connection
database = pymysql.connect(host="localhost",user="root",password="mysql657813",database="dictionary_db" )
# --- Initialize cursor
cursor = database.cursor()


# -- Create the INSERT queries
queryWord = """INSERT INTO allwords (word, definition, letter) VALUES (%s, %s ,%s)"""

words = []
for i in range(1,sheet.nrows):
		word	= sheet.cell(i,0).value
		definition	= sheet.cell(i,1).value
		letter = word[0]
		values = (word, definition, letter)
		cursor.execute(queryWord, values)

# --- Close the cursor
cursor.close()
# --- Commit the transaction
database.commit()
# --- Close the database connection
database.close()


# # --- Open workbook and sheet
# book = xlrd.open_workbook("lexique_trilingue-points_du_d_juridique-pour_resume_lougatou_-_Copy_2.xls")
# sheet = book.sheet_by_name("Sheet1")
# # --- MySQL connection
# database = pymysql.connect(host="localhost",user="root",password="mysql657813",database="dictionary_db" )
# # --- Initialize cursor
# cursor = database.cursor()


# # -- Create the INSERT queries
# queryWord = """INSERT INTO allwords (word, definition, letter) VALUES (%s, %s ,%s)"""

# words = []
# for i in range(0,sheet.nrows):
# 		word	= sheet.cell(i,8).value
# 		definition	= sheet.cell(i,2).value
# 		letter = word[0]
# 		values = (word, definition, letter)
# 		cursor.execute(queryWord, values)

# # --- Close the cursor
# cursor.close()
# # --- Commit the transaction
# database.commit()
# # --- Close the database connection
# database.close()
