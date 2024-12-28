class_name Player
extends CharacterBody2D

@export var move_speed :	float = 100
@export var starting_direction :	 Vector2 = Vector2(0,1)

@onready var player_name_label :Label= $PlayerNameLabel
@onready var sprite2D: Sprite2D = $Sprite2D
@onready var animation_tree: AnimationTree = $AnimationTree
@onready var animation_player :AnimationPlayer = $AnimationPlayer
@onready var state_machine = animation_tree.get("parameters/playback")

var player_name: String
var input_direction := Vector2.ZERO
var is_user: bool

func _ready():
	print("PLAYER ", player_name, " READY!")
	player_name_label.set_text(player_name)
	add_child(player_name_label)

func _physics_process(delta):
	if is_user:
		var input_direction = Vector2(
			Input.get_action_strength('right') - Input.get_action_strength('left'),
			Input.get_action_strength('down') - Input.get_action_strength('up')
		).normalized()
		velocity = input_direction * move_speed
	move_and_slide()
	update_animation_parameters(velocity)
	pick_new_state()


func update_animation_parameters(move_input : Vector2):
	if (move_input != Vector2.ZERO):
		animation_tree.set('parameters/Walk/blend_position', move_input)
	else:
		animation_tree.set('parameters/Idle/blend_position',move_input)
	
func pick_new_state():
	if(velocity != Vector2.ZERO):
		state_machine.travel("Walk")
	else:
		state_machine.travel("Idle")
