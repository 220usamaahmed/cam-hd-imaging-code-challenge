from flask import Flask, render_template, request, jsonify, make_response
from core import file_handler, image_processing
from io import BytesIO


app = Flask(__name__)


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
		file_handler.savefile(file)
		return json_response(200, "File uploaded successfully.")
	except Exception as e:
		return json_response(400, f"ERROR: {e}")


@app.route("/get_available_images", methods=['GET'])
def get_available_images():
	return json_response(200, data={
			"image_files": file_handler.get_available_images()
		})


@app.route("/<image_name>/channels/<channel>")
def get_channel(image_name, channel):

	if file_handler.check_existance(image_name):
		im = image_processing.get_channel(image_name, channel)
		im_io = BytesIO()
		im.save(im_io, file_handler.get_format(image_name))
		response = make_response(im_io.getvalue())
		response.mimetype = f"image/{file_handler.get_format(image_name)}"
		return response
	else:
		return json_response(404, "ERROR: File not found")