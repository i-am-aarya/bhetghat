extends Control

# login
@onready var login_email = $NinePatchRect/TabContainer/Login/login_container/email
@onready var login_password = $NinePatchRect/TabContainer/Login/login_container/password
@onready var login_btn = $NinePatchRect/TabContainer/Login/login_container/login_btn
@onready var login_req = $NinePatchRect/TabContainer/Login/login_container/login_req
@onready var login_status_msg = $NinePatchRect/TabContainer/Login/login_container/login_status_msg

# register
@onready var register_firstname = $NinePatchRect/TabContainer/SignUp/VBoxContainer/firstname_input
@onready var register_lastname = $NinePatchRect/TabContainer/SignUp/VBoxContainer/lastname_input
@onready var register_email = $NinePatchRect/TabContainer/SignUp/VBoxContainer/email_input
@onready var register_username = $NinePatchRect/TabContainer/SignUp/VBoxContainer/username_input
@onready var register_password = $NinePatchRect/TabContainer/SignUp/VBoxContainer/password_input
@onready var register_confirm_password = $NinePatchRect/TabContainer/SignUp/VBoxContainer/confirm_password_input
@onready var register_btn = $NinePatchRect/TabContainer/SignUp/VBoxContainer/register_btn
@onready var register_req = $NinePatchRect/TabContainer/SignUp/VBoxContainer/register_req
@onready var register_status_msg = $NinePatchRect/TabContainer/SignUp/VBoxContainer/register_status_msg
var passwords_match: bool = false

# navigation
@onready var signup_btn = $NinePatchRect/TabContainer/Login/login_container/signup_btn
@onready var exit_btn = $NinePatchRect/TabContainer/Login/login_container/exit_btn
@onready var tab_container = $NinePatchRect/TabContainer

@onready var game_scene = preload("res://game/game.tscn")


#@onready var email_input = $NinePatchRect/login_container/email
#@onready var password_input = $NinePatchRect/login_container/password
#@onready var login_btn = $NinePatchRect/login_container/login_btn
#@onready var signup_btn = $NinePatchRect/login_container/signup_btn
#@onready var request = $NinePatchRect/login_container/HTTPRequest
#@onready var status_msg = $NinePatchRect/login_container/status_msg
#@onready var tab_container = $NinePatchRect/TabContainer
#@onready var game_scene = preload("res://game/game.tscn")
##@onready var register_scene = preload("res://game/game.tscn")
#
#func _on_login_btn_pressed() -> void:
	#login_btn.disabled = true
	#signup_btn.disabled = true
	##var request = HTTPRequest.new()
	#add_child(request)
	#request.request_completed.connect(_on_login_request_completed)
	#var headers = ["Content-Type: application/json"]
	#var req_body = JSON.stringify({"email": email_input.text, "password": password_input.text})
	#request.request("http://localhost:8000/auth/v1/login", headers, HTTPClient.METHOD_POST, req_body)
#
#func _on_register_btn_pressed() -> void:
	## change scene
	#pass
#
	##register_btn.disabled = true
	#login_btn.disabled = true
	###var request = HTTPRequest.new()
	#add_child(request)
	#var headers = ["Content-Type: application/json"]
	#var req_body = JSON.stringify("username: ")
	#request.request("http://localhost:8000/auth/v1/register", headers, HTTPClient.METHOD_POST, req_body)
	#request.request_completed.connect(_on_register_request_completed)
	#
#func _on_register_request_completed(result, response_code, headers, body):
	#pass
	## change scene
	## do stuff here
	##print("called on register_request_completed")
	##print("RESULT:", result)
	##var response_json = JSON.parse_string(body.get_string_from_utf8())
	##print(response_json)
	##register_btn.disabled = false
	##login_btn.disabled = false
#
#func _on_login_request_completed(result, response_code, headers, body):
	##print("called on login_request_completed")
	#var response_json: Dictionary = JSON.parse_string(body.get_string_from_utf8())
	#var token: String = ""
	#var username: String = ""
	#if response_json.has("authToken"):
		#token = response_json["authToken"]
		#username = response_json["user"]["username"]
	#else:
		#token = ""
		#username = ""
	#if len(token)>0:
		#print("login success")
		#print("username: ", username)
		#
		#get_tree().change_scene_to_packed(game_scene)
		#
		#status_msg.text = "Welcome, " + username
	#else:
		#status_msg.text = "Login Failed"
	#login_btn.disabled = false
	#signup_btn.disabled = false

func _input(event: InputEvent) -> void:
	#if event is not InputEventMouseMotion:
		#login_status_msg.set_text("")
		#register_status_msg.set_text("")
	if len(login_email.text)>0 and len(login_password.text)>0:
		login_btn.set_disabled(false)
	else:
		login_btn.set_disabled(true)

	if register_password.get_text() == register_confirm_password.get_text():
		passwords_match = true
	else:
		passwords_match = false

	if len(register_email.get_text())>0 and len(register_username.get_text())>0 and len(register_password.get_text())>0 and len(register_confirm_password.get_text())>0 and passwords_match:
		register_btn.set_disabled(false)
	else:
		register_btn.set_disabled(true)

#func _process(_delta: float) -> void:
	#if register_password.get_text() == register_confirm_password.get_text():
		#passwords_match = true
	#else:
		#passwords_match = false


func _on_exit_btn_pressed() -> void:
	get_tree().quit()

func _on_login_btn_pressed() -> void:
	login_btn.set_disabled(true)
	var headers = ["Content-Type: application/json"]
	var req_body = JSON.stringify({
		"email": login_email.get_text(),
		"password": login_password.get_text()
	})
	login_req.request_completed.connect(_on_login_request_completed)
	login_req.request("http://localhost:8000/auth/v1/login", headers, HTTPClient.METHOD_POST, req_body)

func _on_login_request_completed(result, response_code, headers, body):
	var response_json: Dictionary = JSON.parse_string(body.get_string_from_utf8())
	var token: String = ""
	var username: String = ""
	if response_json.has("authToken"):
		token = response_json["authToken"]
		username = response_json["user"]["username"]
	else:
		token = ""
		username = ""
	if len(token)>0:
		login_status_msg.set_text("Welcome, " + username)
		Globals.player_name = username
		get_tree().change_scene_to_packed(game_scene)
	else:
		login_status_msg.append_text("[color=red]Login Failed[/color]")
		#login_status_msg.
	login_btn.set_disabled(true)


func _on_signup_btn_pressed() -> void:
	tab_container.set_current_tab(1)

func _on_back_btn_pressed() -> void:
	tab_container.current_tab = 0

# check for input lengths
func check_register_params() -> bool:
	if len(register_username.get_text())<4:
		register_status_msg.set_text("username too short")
		return false
	if len(register_password.get_text())<8:
		register_status_msg.set_text("password too short")
		return false
	return true

func _on_register_btn_pressed() -> void:
	if !check_register_params():
		return
	print("
	REQUEST SENT:
	{
		firstName: "+register_firstname.get_text()+",
		lastName: "+register_lastname.get_text()+",
		email: "+register_email.get_text()+",
		username: "+register_username.get_text()+",
		password: "+register_password.get_text()+",
		confirmPassword: "+register_confirm_password.get_text()+",
	}")
	register_btn.set_disabled(true)
	register_req.request_completed.connect(_on_register_request_completed)
	
	var headers = ["Content-Type: application/json"]
	var req_body = JSON.stringify({
		"firstName": register_firstname.get_text(),
		"lastName": register_lastname.get_text(),
		"email": register_email.get_text(),
		"username": register_username.get_text(),
		"password": register_password.get_text(),
		"confirmPassword": register_confirm_password.get_text()
	})
	register_req.request("http://localhost:8000/auth/v1/register", headers, HTTPClient.METHOD_POST, req_body)

func _on_register_request_completed(result, response_code, headers, body):
	var response_json: Dictionary = JSON.parse_string(body.get_string_from_utf8())
	print("RESPONSE RECEIVED:\n", response_json)
	if response_json.has("error"):
		register_status_msg.set_text(response_json["error"])
		return
	
	register_status_msg.set_text("Registration Successful! Login To Start!")
	register_btn.set_disabled(false)
