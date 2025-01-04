extends Control

@onready var msg_input := $VBoxContainer/HBoxContainer/message_input
@onready var send_btn := $VBoxContainer/HBoxContainer/send_btn
@onready var chat_history := $VBoxContainer/chat_history_container/chat_history
var input_count = 0

var input_focused: bool = false
var message:String = ""

signal send_msg_signal(msg: String)

func send_message():
	message = msg_input.text
	if (message.length()>0):
		msg_input.clear()
		send_msg_signal.emit(message)

func _input(event: InputEvent) -> void:
	input_count+=1
	if event.is_action_pressed("chat"):
		if !msg_input.has_focus():
			msg_input.grab_focus()
			get_viewport().set_input_as_handled()

func _on_send_btn_pressed() -> void:
	send_message()

func _on_message_input_text_submitted(new_text: String) -> void:
	send_message()

func _on_message_input_focus_entered() -> void:
	print("MSG INPUT GRABBED FOCUS")


func _on_game_message_received(sender: String, message: String) -> void:
	chat_history.append_text("\n"+ sender + " : " + message)
