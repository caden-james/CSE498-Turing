# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from pprint import pprint
import json
import random
import functools
from . import socketio
db = database()




# @socketio.on('openBoard', namespace='/openboard')
# def connect():
# 	print("the session:",session['board_id'])
# 	join_room(f"session: {session['board_id']}")



# @socketio.on('newcard', namespace='/openboard')
# def newCard(message):

# 	panel_id = message['data']['panel_id']
# 	card_name = message['data']['card_name']
# 	card_id = db.getCardID(panel_id, card_name)[0]['card_id']
# 	# emit('card_created')
# 	# print("card_id", {'panel_id': panel_id, 'card_name': card_name, 'card_id': card_id})
# 	emit('card_created', {'panel_id': panel_id, 'card_name': card_name, 'card_id': card_id}, room = f"session: {session['board_id']}")
	

# @socketio.on('deletecard', namespace='/openboard')
# def deleteCard(message):
# 	card_id = message['data']['card_id']

# 	emit('card_deleted', {'card_id': card_id}, room = f"session: {session['board_id']}")
	

# @socketio.on('disconnect', namespace='/openboard')
# def handle_disconnect():
#     # Remove all locks by this user
#     for card_id, locker in list(locked_cards.items()):
#         if locker == user_id:
#             del locked_cards[card_id]
#             emit('lock_status', {'card_id': card_id, 'status': 'unlocked'}, broadcast=True, namespace='/openboard')


# Dictionary to track locked cards
# locked_cards = {}

# @socketio.on('lock_card', namespace='/openboard')
# def lock_card(data):
#     card_id = data['card_id']
#     user_id = data['user_id']

#     # Check if the card is already locked
#     if card_id in locked_cards:
#         emit('lock_status', {'card_id': card_id, 'status': 'locked', 'by': locked_cards[card_id]}, room=request.sid)
#     else:
#         # Lock the card and notify other users
#         locked_cards[card_id] = user_id
#         emit('lock_status', {'card_id': card_id, 'status': 'locked', 'by': user_id}, broadcast=True, namespace='/openboard')

# @socketio.on('unlock_card', namespace='/openboard')
# def unlock_card(data):
#     card_id = data['card_id']
#     user_id = data['user_id']

#     # Check if the user unlocking is the one who locked
#     if locked_cards.get(card_id) == user_id:
#         del locked_cards[card_id]
#         emit('lock_status', {'card_id': card_id, 'status': 'unlocked'}, broadcast=True, namespace='/openboard')
#     else:
#         emit('error', {'msg': 'You do not have permission to unlock this card.'}, room=request.sid)

	

#######################################################################################
# OTHER
#######################################################################################
@app.route('/')
def root():
	return redirect('/main')

# @app.route('/home')
# def home():
# 	boards = db.getUsersBoards(user = getUser())
# 	return render_template('home.html',username = getUserName(), user=getUser(), user_boards = boards['boards'], otherUsers = db.getAllUsers(user = getUser()))

# @app.route('/openboard')
# def openboard():
# 	board_info = db.getBoardInfo(board_id=session['board_id'])
# 	return render_template('temp.html')
	# return render_template('board.html', board_info = {{}})



@app.route('/main')
def main():
	# board_info = db.getBoardInfo(board_id=session['board_id'])
	return render_template('temp.html')
		   

# @app.route("/static/<path:path>")
# def static_dir(path):
#     return send_from_directory("static", path)

# @app.after_request
# def add_header(r):
#     r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
#     r.headers["Pragma"] = "no-cache"
#     r.headers["Expires"] = "0"
#     return r


# @app.route('/selectexistingboard', methods=['GET'])
# def selectexistingboard():
# 	print("gothere", request.args.get('board_id'))
# 	session['board_id'] = request.args.get('board_id')
# 	return {'success': 1, 'board_id': request.args.get('board_id')}




# @app.route('/createboard', methods = ["POST"])
# def createboard():
# 	board_name = request.form['project_name']
# 	members = request.form.getlist('members')
	
# 	createBoard = db.createBoard(board_name, user)
# 	print(createBoard)

# 	if createBoard:
# 		session['board_id'] = str(createBoard['board_id'])

# 		print("board is:",session['board_id']  )
		
		
# 		members.append(user)
# 		print("members",members)


# 		for member in members:
# 			memberId = db.getUserId(member)['user_id'][0]['user_id']
# 			db.addUserToBoard(createBoard['board_id'], memberId)


# 		return {'success': 1}
# 	else:
# 		return {'success': 0}










# @app.route('/createcard', methods = ["POST"])
# def createcard():
# 	card_name = request.form['card_name']
# 	card_description = 	request.form['card_description'] if request.form['card_description']  else ""
# 	panel_id = request.form['panel_id']
# 	db.addCard(panel_id, card_name, card_description)
# 	return {'success': 1}

# @app.route('/deletecard', methods = ["POST"])
# def deletecard():
# 	card_id = request.form['card_id']
	
# 	db.removeCard(card_id)
# 	return {'success': 1}

# @app.route('/updatecard', methods = ["POST"])
# def updatecard():
# 	card_id = request.form['card_id']
# 	card_name = request.form['card_name']

# 	db.updateCard(card_id, card_name)
# 	return {'success': 1}

# @app.route('/movecard', methods = ["POST"])
# def movecard():
# 	card_id = request.form['card_id']
# 	panel_id = request.form['panel_id']

# 	db.moveCard(card_id, panel_id)
# 	return {'success': 1}











