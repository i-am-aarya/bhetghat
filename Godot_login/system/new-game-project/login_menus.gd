extends Control

var username = ""
var hashed_password = ""
var created = false

func _on_login_button_down() -> void:
	var entered_username = $Username.text.strip_edges()  # Trim spaces
	var entered_password = $Password.text.strip_edges()

	if !created:
		if validate_inputs(entered_username, entered_password):
			username = entered_username
			hashed_password = hash_password(entered_password)
			created = true
			$Login.text = "Login"
			$Username.text = ""
			$Password.text = ""
			print("Account created successfully.")
		else:
			print("Invalid inputs. Username and password must be at least 6 characters.")
	else:
		if entered_username == username and hash_password(entered_password) == hashed_password:
			print("Login successful!")
		else:
			print("Login failed. Incorrect username or password.")
		clear_inputs()

func hash_password(password: String) -> String:
	# Use SHA256 for demonstration; replace with a more secure method like bcrypt in real applications
	var hasher = HashingContext.new()
	hasher.start(HashingContext.HASH_SHA256)
	hasher.update(password.to_utf8_buffer())
	return hasher.finish().hex_encode()

func validate_inputs(user: String, pwd: String) -> bool:
	return user.length() >= 6 and pwd.length() >= 6

func clear_inputs() -> void:
	$Username.text = ""
	$Password.text = ""
