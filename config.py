import os


# Directory to store image files uploaded
UPLOAD_DIRECTORY = os.path.join(os.getcwd(), "image_uploads")


# Allowed file formats
ALLOWED_EXTENSIONS = ('png', 'jpg', 'jpeg')


# Resizing
WIDTH = 800;
