extends Node2D

class_name WebSocketManager
var websocket_peer : WebSocketMultiplayerPeer

signal server_started
signal client_connected
signal connection_failed

func start_server(port: int) -> void:
	websocket_peer = WebSocketMultiplayerPeer.new()
	var result = websocket_peer.create_server(port)
	if result == OK:
		multiplayer.multiplayer_peer = websocket_peer
		emit_signal("server_started")
		print("WebSocket Server started on port", port)
	else:
		print("Failed to start WebSocket server")

func join_server(host: String, port: int) -> void:
	websocket_peer = WebSocketMultiplayerPeer.new()
	var result = websocket_peer.create_client("ws://%s:%d" % [host, port])
	if result == OK:
		multiplayer.multiplayer_peer = websocket_peer
		emit_signal("client_connected")
		print("Connected to WebSocket Server at", host, ":", port)
	else:
		emit_signal("connection_failed")
		print("Failed to connect to WebSocket server")
