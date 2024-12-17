extends Node2D

@onready var host = $Host
@onready var join = $Join
@onready var username = $Username
@onready var send = $Send
@onready var message = $Message
@onready var messages = $Messages
@onready var goto_message = $GotoMessage  # Reference to the new button

var websocket_manager : WebSocketManager
var usrnm : String  # Global username variable

func _ready():
	websocket_manager = WebSocketManager.new()
	add_child(websocket_manager)

	# Connect signals from WebSocketManager
	websocket_manager.server_started.connect(joined)
	websocket_manager.client_connected.connect(joined)
	websocket_manager.connection_failed.connect(_on_connection_failed)

func _on_host_pressed() -> void:
	websocket_manager.start_server(1027)

func _on_join_pressed() -> void:
	websocket_manager.join_server("127.0.0.1", 1027)

func _on_send_pressed() -> void:
	if message.text.strip_edges() != "":
		rpc("msg_rpc", usrnm, message.text)
		message.text = ""  # Clear the input field

@rpc("any_peer", "call_local")
func msg_rpc(usrnm, data):
	messages.text += str(usrnm, ":", data, "\n")
	messages.scroll_vertical = INF  # Auto-scroll to the bottom

func joined():
	host.hide()
	join.hide()
	username.hide()
	usrnm = username.text
	message.grab_focus()

func _on_connection_failed():
	print("Connection to server failed!")
	
	
	
	#with out socket connection 
	#CODE BELOOW
		
	#extends Node2D
#
#@onready var host = $Host
#@onready var join = $Join
#@onready var username = $Username
#@onready var send = $Send
#@onready var message = $Message
#@onready var messages = $Messages
#@onready var goto_message = $GotoMessage  # Reference to the new button
#
#var usrnm : String  # Global username variable
#var msg : String
#
#func _on_host_pressed() -> void:
	#var peer = ENetMultiplayerPeer.new()
	#peer.create_server(1027)
	#get_tree().set_multiplayer(SceneMultiplayer.new(),self.get_path())
	#multiplayer.multiplayer_peer = peer
	#joined()
#
#func _on_join_pressed() -> void:
	#var peer = ENetMultiplayerPeer.new()
	#peer.create_client("127.0.0.1", 1027)
	#get_tree().set_multiplayer(SceneMultiplayer.new(), self.get_path())
	#multiplayer.multiplayer_peer = peer
	#joined()
#
#func _on_send_pressed() -> void:
	#rpc("msg_rpc", usrnm, message.text)
	#message.text =""
#
#@rpc("any_peer", "call_local")
#func msg_rpc(usrnm, data):
	#messages.text += str(usrnm, ":", data, "\n")
	#messages.scroll_vertical = INF
#
#func joined():
	#host.hide()
	#join.hide()
	#username.hide()
	#usrnm = username.text
	#message.grab_focus()  # Automatically focus on the LineEdit input
#
#Write the websockets for this script
