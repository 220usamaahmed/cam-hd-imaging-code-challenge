class ChannelsDisplay {

	static async initialize(imgViewer, imageName, imageProcessor) {
		this.imgViewer = imgViewer;
		this.imageName = imageName;
		this.channels = { 'R': true, 'G': true, 'B': true };
		return await this.loadChannelPixels();
	}

	/**
	 * Download image and resolve initialization promise.
	 */
	static async loadChannelPixels() {
		
		this.channelPixels = {};
		let tempCanvas = document.createElement("canvas");
		let tempCanvasCtx = tempCanvas.getContext("2d");
		
		let channelsDoneLoading = 0;

		return new Promise(resolve => {
			for (let channel in this.channels) {
				let img = new Image();
				img.src = this.imageName + "/channels/" + channel;
			
				let that = this;

				img.onload = function() {
					if (img.width != 0 && img.height != 0) {

						tempCanvas.width = img.width;
						tempCanvas.height = img.height;
						tempCanvasCtx.drawImage(img, 0, 0);
						that.channelPixels[channel] = tempCanvasCtx.getImageData(0, 0, img.width, img.height).data;
						
						channelsDoneLoading++;
						if (channelsDoneLoading == Object.keys(that.channels).length) {
							that.width = img.width;
							that.height = img.height;
							that.display();
							resolve(that);
						}

					} else {
						showErrorMsg("Couldn't load your image.");
					}
				}
			}
		});
	}

	static display() {
		// TODO: Check if image is ready
		this.processImage().then(url => {
			this.imgViewer.src = url;
		});
	}

	static async processImage() {

		return new Promise(resolve => {
			let tempCanvas = document.createElement("canvas");
			let tempCanvasCtx = tempCanvas.getContext("2d");
			tempCanvas.width = this.width;
			tempCanvas.height = this.height;

			let imageData = tempCanvasCtx.getImageData(0, 0, this.width, this.height);
			let data = imageData.data;

			for (let i = 0; i < data.length; i += 4) {
				data[i]     = this.channels['R'] ? this.channelPixels['R'][i] : 0;
				data[i + 1] = this.channels['G'] ? this.channelPixels['G'][i] : 0;
				data[i + 2] = this.channels['B'] ? this.channelPixels['B'][i] : 0;
				data[i + 3] = 255
			}
			tempCanvasCtx.putImageData(imageData, 0, 0);
			resolve(tempCanvas.toDataURL("image/png"));
		});

	}

	static toggleChannel(channel) {
		this.channels[channel] = !this.channels[channel];
		this.display();
	}

}















