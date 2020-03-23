from PIL import Image
from core import file_handler
import config


def get_channel(image_name, channel):
	im = Image.open(file_handler.get_path(image_name))
	width_r = (config.WIDTH / float(im.size[0]))
	height = int((float(im.size[1])*float(width_r)))
	im = im.resize((config.WIDTH,height), Image.ANTIALIAS)
	return im.getchannel(channel)