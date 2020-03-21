from PIL import Image
from core import file_handler


def get_channel(image_name, channel):
	im = Image.open(file_handler.get_path(image_name))
	return im.getchannel(channel)