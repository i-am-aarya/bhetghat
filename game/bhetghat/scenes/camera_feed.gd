extends Sprite2D

var camera_feed: CameraFeed

func _ready():
	# Check if any camera feeds are available
	if CameraServer.get_feed_count() > 0:
		# Access the first available camera feed
		camera_feed = CameraServer.get_feed(0)
		if camera_feed:
			# Activate the camera feed
			camera_feed.active = true
			# Assign the camera feed texture to the sprite
			texture = camera_feed.get_texture()
		else:
			print("Failed to access the camera feed.")
	else:
		print("No camera feeds available.")
