function uploadImage() {

	let iInputImage = document.getElementById("iInputImage");

	let formData = new FormData();

	// TODO: Check if file actually exists.

	formData.append("inputImage", iInputImage.files[0]);
	
	// console.log(formData.getAll("inputImage"));

	xhr = new XMLHttpRequest();
	xhr.open("POST", "/upload_image", true);

	xhr.onload = function(response) {
		console.log(response);
	}

	xhr.send(formData);

}