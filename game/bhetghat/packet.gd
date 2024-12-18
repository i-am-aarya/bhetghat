class_name Packet
extends Object

var name: String
var position: Vector2

static func string_to_packet(string: String) -> Packet:
	var parsed = JSON.parse_string(string)
	var pp := Packet.new()
	pp.name = parsed["n"]
	pp.position = Vector2(parsed["p"]["x"], parsed["p"]["y"])
	return pp

func _to_string() -> String:
	var dict : Dictionary = {
		"n": name,
		"p": {
			"x": position.x,
			"y": position.y
		}
	}
	return JSON.stringify(dict)
