extends Node2D




func _on_msg_button_down() -> void:
	get_tree().change_scene_to_file("res://Nodes_2D.tscn")
