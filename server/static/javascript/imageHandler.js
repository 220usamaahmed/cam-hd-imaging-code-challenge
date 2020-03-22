class ChannelsDisplay {

	static async initialize(ctx, imageName) {
		this.ctx = ctx;
		this.imageName = imageName;
		this.channels = { 'R': true, 'G': true, 'B': true };
		return await this.loadChannelPixels();
	}

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
				}
			}
		});
	}

	static display() {

		// Check if image is ready

		let img = new Image();
		img.width = this.width;
		img.height = this.height;

		let tempCanvas = document.createElement("canvas");
		let tempCanvasCtx = tempCanvas.getContext("2d");
		tempCanvasCtx.drawImage(img, 0, 0);

		var imageData = tempCanvasCtx.getImageData(0, 0, this.width, this.height);
		var data = imageData.data;

		for (var i = 0; i < data.length; i += 4) {
			data[i]     = this.channels['R'] ? this.channelPixels['R'][i] : 0;
			data[i + 1] = this.channels['G'] ? this.channelPixels['G'][i] : 0;
			data[i + 2] = this.channels['B'] ? this.channelPixels['B'][i] : 0;
			data[i + 3] = 255
		}
		this.ctx.putImageData(imageData, 0, 0);

	}

	static toggleChannel(channel) {
		this.channels[channel] = !this.channels[channel];
		this.display();
	}

}