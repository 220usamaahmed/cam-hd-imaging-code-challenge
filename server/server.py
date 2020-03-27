import os
from flask import Flask, render_template, request, jsonify, make_response
from PIL import Image
from io import BytesIO
from werkzeug.utils import secure_filename


app = Flask(__name__)


# Directory to store image files uploaded
UPLOAD_DIRECTORY = os.path.join(os.getcwd(), "image_uploads")

# Allowed file formats
ALLOWED_EXTENSIONS = ('png', 'jpg', 'jpeg')

# Image channels
CHANNELS = ('R', 'G', 'B')

# Resizing
MAX_WIDTH = 800
MAX_HEIGHT = 800


def get_format(filename):
	return os.path.splitext(filename)[1][1:]


def is_valid_file(filename):
	return get_format(filename) in ALLOWED_EXTENSIONS


def savefile(file):
	if not file: raise Exception("File not defined.")
	if not is_valid_file(file.filename): raise Exception("Invaid file.")
	
	im = Image.open(file.stream)
	
	# Resizing Image
	if im.size[0] > im.size[1] and im.size[0] > MAX_WIDTH: # W > H, Constrain W
		width_r = MAX_WIDTH / float(im.size[0])
		height = int(float(im.size[1]) * float(width_r))
		im = im.resize((MAX_WIDTH, height), Image.ANTIALIAS)
	elif im.size[1] > im.size[0] and im.size[1] > MAX_HEIGHT: # H > W, Constain H
		height_r = MAX_HEIGHT / float(im.size[1])
		width = int(float(im.size[0])  * float(height_r))
		im = im.resize((width, MAX_HEIGHT), Image.ANTIALIAS)

	filename = secure_filename(file.filename)
	im.save(os.path.join(UPLOAD_DIRECTORY, filename))


def get_files_list():
	return list(reversed(os.listdir(UPLOAD_DIRECTORY)))


def check_existance(filename):
	return secure_filename(filename) in get_files_list()


def get_path(filename):
	return os.path.join(UPLOAD_DIRECTORY, secure_filename(filename))


def get_channels_stack(image_name):
	im = Image.open(get_path(image_name))

	# Stacking images vertically
	width = im.size[0]
	height = im.size[1]

	channel_stack = Image.new('L', (width, height * len(CHANNELS)))

	for i, channel in enumerate(CHANNELS):
		channel_stack.paste(im.getchannel(channel), (0, i * height))
	
	return channel_stack


# Helper function to send json responses
def json_response(status_code, message=None, data={}):
	response = jsonify({
		"message": message,
		"data": data
	})
	response.status_code = status_code
	return response


@app.route("/")
def index():
	return render_template("index.html")


@app.route("/upload_image", methods=['POST'])
def upload_image():
	if "inputImage" not in request.files:
		return json_response(400, "ERROR: No file uploaded.")

	file = request.files.getlist("inputImage")[0]

	try:
		savefile(file)
	except Exception as e:
		return json_response(400, f"ERROR: {e}")
	else:
		return json_response(200, "File uploaded successfully.")


@app.route("/get_available_images", methods=['GET'])
def get_available_images():
	return json_response(200, data={
			"image_files": get_files_list()
		})


# To reduce the number of HTTP requests made and the.
# number of times the file is opened. Return R, G, B 
# layers stacked vertically.
@app.route("/<image_name>/channels_stack")
def channels_stack(image_name):
	if check_existance(image_name):
		im = get_channels_stack(image_name)
		im_io = BytesIO()
		im.save(im_io, "png")
		response = make_response(im_io.getvalue())
		response.mimetype = "image/png"
		return response
	else:
		return json_response(404, "ERROR: File not found")
