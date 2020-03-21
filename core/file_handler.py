import config
import os
from werkzeug.utils import secure_filename


def get_format(filename):
	return os.path.splitext(filename)[1][1:]


def is_valid_file(filename):
	return get_format(filename) in config.ALLOWED_EXTENSIONS


def savefile(file):
	if not file: raise Exception("File not defined.")
	if not is_valid_file(file.filename): raise Exception("Invaid file name.")
	
	filename = secure_filename(file.filename)
	file.save(os.path.join(config.UPLOAD_DIRECTORY, filename))


def get_available_images():
	return os.listdir(config.UPLOAD_DIRECTORY)


def check_existance(filename):
	return filename in get_available_images()


def get_path(filename):
	return os.path.join(config.UPLOAD_DIRECTORY, filename)