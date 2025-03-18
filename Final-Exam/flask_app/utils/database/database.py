import mysql.connector
import glob
import json
import csv
from io import StringIO
import itertools
import hashlib
import os
import cryptography
from cryptography.fernet import Fernet
from math import pow

class database:

    def __init__(self, purge = False):

        # Grab information from the configuration file
        self.database       = 'db'
        self.host           = '127.0.0.1'
        self.user           = 'master'
        self.port           = 3306
        self.password       = 'master'
        self.tables         = ['users','boards','users_to_boards','panels','cards']
        
        # NEW IN HW 3-----------------------------------------------------------------
        self.encryption     =  {   'oneway': {'salt' : b'averysaltysailortookalongwalkoffashortbridge',
                                                 'n' : int(pow(2,5)),
                                                 'r' : 9,
                                                 'p' : 1
                                             },
                                'reversible': { 'key' : '7pK_fnSKIjZKuv_Gwc--sZEMKn2zc8VvD6zS96XcNHE='}
                                }
        #-----------------------------------------------------------------------------

    def query(self, query = "SELECT * FROM users", parameters = None):

        cnx = mysql.connector.connect(host     = self.host,
                                      user     = self.user,
                                      password = self.password,
                                      port     = self.port,
                                      database = self.database,
                                      charset  = 'latin1'
                                     )


        if parameters is not None:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query, parameters)
        else:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query)

        # Fetch one result
        row = cur.fetchall()
        cnx.commit()

        if "INSERT" in query:
            cur.execute("SELECT LAST_INSERT_ID()")
            row = cur.fetchall()
            cnx.commit()
        cur.close()
        cnx.close()
        return row

    def createTables(self, purge=False, data_path = 'flask_app/database/'):
        ''' FILL ME IN WITH CODE THAT CREATES YOUR DATABASE TABLES.'''

        #should be in order or creation - this matters if you are using forign keys.
         
        # if purge:
        #     for table in self.tables[::-1]:
        #         self.query(f"""DROP TABLE IF EXISTS {table}""")
            
        # Execute all SQL queries in the /database/create_tables directory.
        for table in self.tables:
            
            #Create each table using the .sql file in /database/create_tables directory.
            with open(data_path + f"create_tables/{table}.sql") as read_file:
                create_statement = read_file.read()
            self.query(create_statement)

            # Import the initial data
            try:
                params = []
                with open(data_path + f"initial_data/{table}.csv") as read_file:
                    scsv = read_file.read()            
                for row in csv.reader(StringIO(scsv), delimiter=','):
                    params.append(row)
            
                # Insert the data
                cols = params[0]; params = params[1:] 
                print(table,cols,params)
                self.insertRows(table = table,  columns = cols, parameters = params)
            except:
                print('no initial data')

    def insertRows(self, table='table', columns=['x','y'], parameters=[['v11','v12'],['v21','v22']]):
        
        # Check if there are multiple rows present in the parameters
        has_multiple_rows = any(isinstance(el, list) for el in parameters)
        keys, values      = ','.join(columns), ','.join(['%s' for x in columns])
        
        # Construct the query we will execute to insert the row(s)
        query = f"""INSERT IGNORE INTO {table} ({keys}) VALUES """
        if has_multiple_rows:
            for p in parameters:
                query += f"""({values}),"""
            query     = query[:-1] 
            parameters = list(itertools.chain(*parameters))
        else:
            query += f"""({values}) """                      
        
        insert_id = self.query(query,parameters)[0]['LAST_INSERT_ID()']  
        return insert_id
    
    # def getResumeData(self):
    #     resumeData = dict() # dict for all resume data (essentially the institution dict)

    #     institution_query = self.query("SELECT * FROM institutions") # Get institution data
        
    #     # Get institution id for each institution and query for applicable positions at institution
    #     for inst in institution_query:
    #         inst_id = inst['inst_id']
            
    #         positions = dict()
    #         position_query = self.query(f'SELECT * FROM positions WHERE inst_id = {inst_id}') # Get position data
    #         sorted_positions = sorted(position_query, key=lambda x: (x['end_date'] is None, x['start_date']),reverse=True)
            
    #         for pos in sorted_positions:
    #             pos_id = pos['position_id']
    #             positions[pos_id] = pos

    #             if pos['end_date'] is not None:
    #                 pos['end_date'] = pos['end_date'].strftime("%b %Y")
    #             if pos['start_date'] is not None:
    #                 pos['start_date'] = pos['start_date'].strftime("%b %Y")

    #             experiences = dict()
    #             experiences_query = self.query(f'SELECT * FROM experiences WHERE position_id = {pos_id}') # Get experience data
    #             sorted_experiences = sorted(experiences_query, key=lambda x: (x['end_date'] is not None, x['start_date']))
    #             for exp in sorted_experiences:
    #                 exp_id = exp['experience_id']
    #                 experiences[exp_id] = exp
                    
    #                 if exp['end_date'] is not None:
    #                     exp['end_date'] = exp['end_date'].strftime("%b %Y")
    #                 if exp['start_date'] is not None:
    #                     exp['start_date'] = exp['start_date'].strftime("%b %Y")

    #                 skills = dict()
    #                 skills_query = self.query(f'SELECT * FROM skills WHERE experience_id = {exp_id}')
                    
    #                 for skill in skills_query:
    #                     skill_id = skill['skill_id']
    #                     skills[skill_id] = skill

    #                 exp['skills'] = skills
    #             pos['experiences'] = experiences
                
    #         inst['positions'] = positions
    #         resumeData[inst_id] = inst

    #     return resumeData

#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
    def createUser(self, email='me@email.com', password='password', role='user'):
        # return {'success' : 1} if 1!=2 else {'success' : 0}
        auth = self.authenticate(email, password)
        if auth['success'] != 1:
            self.insertRows(table = "users",  columns = ["role", "email", "password"], parameters = [role,email,self.onewayEncrypt(password)])
            return {'success' : 1}
        else:
            return {'success' : 0}
        

    def authenticate(self, email='me@email.com', password='password'):
        # Query for all registered user emails & passwords
        query = self.query("SELECT * FROM users WHERE email = %s AND password = %s", [email, self.onewayEncrypt(password)])

        # Check if email or password already registered
        # return {'success' : 1} if query != [] else {'failure' : 0}
        return {'success' : 1} if query != [] else {'success' : 0}

    def onewayEncrypt(self, string):
        encrypted_string = hashlib.scrypt(string.encode('utf-8'),
                                          salt = self.encryption['oneway']['salt'],
                                          n    = self.encryption['oneway']['n'],
                                          r    = self.encryption['oneway']['r'],
                                          p    = self.encryption['oneway']['p']
                                          ).hex()
        return encrypted_string


    def reversibleEncrypt(self, type, message):
        fernet = Fernet(self.encryption['reversible']['key'])
        
        if type == 'encrypt':
            message = fernet.encrypt(message.encode())
        elif type == 'decrypt':
            message = fernet.decrypt(message).decode()

        return message


#######################################################################################
# TRELLO RELATED
#######################################################################################
    def createBoard(self, board_name, creator):            
            sql = """
                SELECT board_id FROM boards WHERE name = %s
                """
            
            if len(self.query(sql, [board_name])) > 0:
                return {'failure': 0, 'error': 'Project name already exists'}
        
            sql = """
                SELECT user_id FROM users WHERE email = %s
                """
            user_id = self.query(sql, [creator])
            creatorId = user_id[0]['user_id']

            sql = """
                INSERT INTO boards (name, created_id) VALUES (%s, %s)
                """
            
            self.query(sql, [board_name, creatorId])
            


            boardIdResult = self.query("""
                        SELECT board_id FROM boards WHERE name = %s;
                        """, [board_name])
            
            # print("id",boardIdResult)

            if boardIdResult:
                boardId = boardIdResult[0]['board_id']
                # self.addUserToBoard(boardId, creatorId)

                # Initialize the default list upon creation of the board
                defaultLists = ["To Do", "Doing", "Completed"]
                for panelName in defaultLists:
                    sql = """INSERT INTO panels (board_id, panel_name) VALUES (%s, %s)"""
                    self.query(sql, [boardId, panelName])
                    print("here sql",sql,boardId, panelName)
        
                return {'success': 1, 'board_id': boardId}
            
            return {'failure': 0, 'error': 'Failed to create board'}
    
            

    def getAllUsers(self, user):
            sql = """
                SELECT email FROM users WHERE email != %s
                """
            users = []
            for item in  self.query(sql,[user]):
                users.append(item['email'])
            return users

    def getUsersBoards(self, user):
            print("here",self.query("SELECT * FROM boards"))
            
            print("user", user)
            user_id = self.getUserId(user)['user_id'][0]['user_id']
            
            
            sql = """
                SELECT b.board_id, b.name, b.created_id
                FROM boards b
                JOIN users_to_boards utb ON b.board_id = utb.board_id
                WHERE utb.user_id = %s    
                """
            
            boards = self.query(sql, [user_id])
            ret_dict = {}
            for item in boards:
                id = item['board_id']
                ret_dict[id] = item

            if boards:
                return {'success': 1, 'boards': ret_dict}
            return {'success': 0, 'boards': {}}

    def getUserId(self, username): 
            sql = """
                SELECT user_id FROM users Where email = %s
                """
            user_id = self.query(sql, [username])

            if not user_id:
                return {'success': 0, 'error': 'User not found in database'}
            
            return {'success': 1, 'user_id': user_id}


    def getBoardInfo(self, board_id):
            boardData = {}
            sql = """
                SELECT * FROM boards WHERE board_id = %s
                """
            boardData['board_name'] =  self.query(sql, [board_id])[0]['name']
            sql = """
                SELECT * FROM panels WHERE board_id = %s
                """
            # sql = """
            #     SELECT * FROM panels
            #     """
            panels = self.query(sql, [board_id])
            # panels = self.query(sql)
            

            for panel in panels:
                sql = """
                    SELECT * FROM cards WHERE panel_id = %s
                    """
                cards = {} 
                cards_query = self.query(sql, [panel['panel_id']])
                for card in cards_query:
                    cards[card['card_id']] = card
                    print("cardfffff",card)
                    # print("cardts",cards[0])
                panel['cards'] = cards

            boardData['panels'] = panels

            ret_panels = {}
            for panel_entry in panels:
 
                ret_panels[panel_entry['panel_id']] = panel_entry
      
            boardData['panels'] = ret_panels

            if boardData:
                return {'success': 1, 'board': boardData}
            return {'success': 0, 'board': {}}
    
    def addUserToBoard(self, board_id, user_id):
        sql = """
            INSERT INTO users_to_boards (board_id, user_id) VALUES (%s, %s)
            """
        self.query(sql, [board_id, user_id])
        return {'success': 1}
    
    def getAuthorizedUsers(self, board_id):
        sql = """
            SELECT email FROM users u
            JOIN users_to_boards utb ON u.user_id = utb.user_id
            WHERE utb.board_id = %s
            """
        users = []
        for item in  self.query(sql,[board_id]):
            print("item",item, item['email'])
            users.append(item['email'])
        print("users",users)
        return users
    

    def addCard(self, panel_id, card_name, card_description):
        sql = """
            INSERT INTO cards (panel_id, card_title, card_desc) VALUES (%s, %s, %s)
            """
        self.query(sql, [panel_id, card_name, card_description])
        return {'success': 1}
    
    def removeCard(self, card_id):
        sql = """
            DELETE FROM cards WHERE card_id = %s
            """
        self.query(sql, [card_id])
        return {'success': 1}
    
    def updateCard(self, card_id, card_name):

        sql = """UPDATE cards SET card_title = %s WHERE card_id = %s"""
        self.query(sql, [card_name, card_id])
    
        return {'success': 1}
    
    def moveCard(self, card_id, new_panel_id):

        sql = """UPDATE cards SET panel_id = %s WHERE card_id = %s"""
        self.query(sql, [new_panel_id, card_id])
    
        return {'success': 1}
    
    def getCardID(self, panel_id, card_name):
        sql = """
            SELECT card_id FROM cards WHERE card_title = %s AND panel_id = %s
            """
        card_id = self.query(sql, [card_name, panel_id])
        return card_id