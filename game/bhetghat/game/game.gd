extends Node2D

#@export var WebSocketURL = "ws://localhost:8000/ws"
var GAME_SERVER_WS_ENDPOINT = JSON.parse_string(JavaScriptBridge.eval("JSON.stringify(CONFIG)"))["GAME_SERVER_WS"]
var WebSocketURL = GAME_SERVER_WS_ENDPOINT
@onready var wsclient:WebSocketClient = $WebSocketClient
@onready var camera2d :Camera2D = Camera2D.new()
#@onready var chat_history = $CanvasLayer/chat/VBoxContainer/chat_history_container/chat_history

var pkt := Packet.new()

const MyPlayer := preload("res://characters/player_male.tscn")

var player1 := MyPlayer.instantiate()

var other_players : Dictionary = {
	#player1.name: player1
}

signal message_received(sender: String, message: String)

func _ready() -> void:
	print("WEBSOCKET URL IS: "+ WebSocketURL)
	#player1.player_name = str(randi_range(10, 100))
	player1.player_name = Globals.player_name
	var err := wsclient.connect_to_url(WebSocketURL)
	if err!=OK:
		print("ERROR CONNECTING")
		return
	print("CONNECTING...")
	player1.is_user = true
	camera2d.set_enabled(true)
	camera2d.make_current()
	player1.add_child(camera2d)
	add_child(player1)

func _on_web_socket_client_connected_to_server() -> void:
	pkt.name = player1.player_name
	pkt.position = player1.position
	wsclient.send(pkt)
	print("CONNECTED")

func _on_web_socket_client_message_received(message: Variant) -> void:
	var packet := Packet.string_to_packet(message)
	if packet.type == "pup":
		if packet.name == player1.player_name:
			pass
		else:
			if !other_players.has(packet.name):
				
				var new_player := MyPlayer.instantiate()
				new_player.is_user = false
				new_player.position = packet.position
				new_player.player_name = packet.name
				print("added new player: ", new_player.player_name)
				other_players[new_player.player_name] = new_player
				add_child(new_player)
			else:
				other_players[packet.name].pos_in_server = packet.position
	elif packet.type == "chat":
		message_received.emit(packet.name, packet.message)
	elif packet.type == "leave":
		other_players.erase(packet.name)
	else:
		pass

func _physics_process(_delta: float) -> void:
	pkt.name = player1.player_name
	pkt.type = "pup"
	pkt.position = player1.position
	wsclient.send(pkt)

func _on_web_socket_client_connection_closed() -> void:
	print("CONNECTION CLOSED for: ", wsclient.get_socket().get_close_reason(), " code: ", wsclient.get_socket().get_close_code())

func _exit_tree() -> void:
	wsclient.close()


func _on_chat_send_msg_signal(msg: String) -> void:
	pkt.type = "chat"
	pkt.name = player1.player_name
	pkt.message = msg
	wsclient.send(pkt)
