extends Node2D

@export var WebSocketURL = "ws://localhost:8000/ws"
@onready var wsclient:WebSocketClient = $WebSocketClient
#var wsclient: WebSocketClient = WebSocketClient.new()
@onready var camera2d :Camera2D = Camera2D.new()

var p := Packet.new()

const MyPlayer := preload("res://characters/player_male.tscn")

var player1 := MyPlayer.instantiate()

var other_players : Dictionary = {
	player1.name: player1
}
func _ready() -> void:
	player1.player_name = str(randi_range(10, 100))
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
	p.name = player1.player_name
	p.position = player1.position
	wsclient.send(p)
	print("CONNECTED")

func _on_web_socket_client_message_received(message: Variant) -> void:
	var packet := Packet.string_to_packet(message)
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
			if (packet.position - other_players[packet.name].position) != Vector2(0, 0):
				var dir: Vector2 = (packet.position - other_players[packet.name].position).normalized()
				other_players[packet.name].velocity = dir*100

func _physics_process(delta: float) -> void:
	p.name = player1.player_name
	p.position = player1.position
	wsclient.send(p)

func _on_web_socket_client_connection_closed() -> void:
	print("CONNECTION CLOSED for: ", wsclient.get_socket().get_close_reason(), " code: ", wsclient.get_socket().get_close_code())

func _exit_tree() -> void:
	wsclient.close()
