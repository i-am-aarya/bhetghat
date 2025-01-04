class_name Packet
extends Object

enum PacketType {
	POSITION_UPDATE,
	CHAT
}

var type: String
var payload: Dictionary

var name: String
var position: Vector2
var message: String

static func string_to_packet(string: String) -> Packet:
	var parsed = JSON.parse_string(string)
	var pp := Packet.new()
	pp.type = parsed["t"]
	#pp.name = parsed["pl"]["n"]
	#pp.position = Vector2(parsed["pl"]["p"]["x"], parsed["pl"]["p"]["y"])
	match pp.type:
		"pup":
			pp.name = parsed["pl"]["n"]
			pp.position = Vector2(parsed["pl"]["p"]["x"], parsed["pl"]["p"]["y"])
		"chat":
			pp.name = parsed["pl"]["n"]
			pp.message = parsed["pl"]["m"]
	return pp

func _to_string() -> String:
	var dict : Dictionary = {}
	match type:
		"pup":	
			dict = {
				"t": type,
				# pl -> payload
				"pl": {
					"n": name,
					"p": {
						"x": position.x,
						"y": position.y
					}
				}
			}
		"chat":
			dict = {
				"t": type,
				"pl": {
					"n": name,
					"m": message
				}
			}
	return JSON.stringify(dict)
