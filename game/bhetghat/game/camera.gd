extends TextureRect

func _ready() -> void:
	print("Cameras")
	for f in CameraServer.feeds():
		print(f)
