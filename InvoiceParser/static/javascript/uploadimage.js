var images = [];

var form=document.getElementById('form')
   	  function image_select() {
   	  	  var image = document.getElementById('image').files;

			for (i = 0; i < image.length; i++) {
   	  	  	  if (check_duplicate(image[i].name)) {
                images.push({
   	  	  	  	    "name" : image[i].name,
   	  	  	  	    "url" : URL.createObjectURL(image[i]),
   	  	  	  	    "file" : image[i],
   	  	  	    })
   	  	  	  } else 
   	  	  	  {
   	  	  	  	 alert(image[i].name + " is already added to the list");
   	  	  	  }
   	  	  }
   	  	  
		 document.getElementById('form').reset();
   	  	  document.getElementById('container').innerHTML = image_show();
   	  }

   	  function image_show() {
   	  	  var image = "";
   	  	  images.forEach((i) => {
   	  	  	 image += `<div class="image_container d-flex justify-content-center position-relative">
   	  	  	  	  <img src="`+ i.url +`" alt="Image">
   	  	  	  	  <span class="position-absolute" onclick="delete_image(`+ images.indexOf(i) +`)">&times;</span>
   	  	  	  </div>`;
   	  	  })
   	  	  return image;
   	  }
   	  function delete_image(e) {
   	  	  images.splice(e, 1);
   	  	  document.getElementById('container').innerHTML = image_show();
   	  }

   	  function check_duplicate(name) {
   	  	var image = true;
   	  	if (images.length > 0) {
   	  		for (e = 0; e < images.length; e++) {
   	  			if (images[e].name == name) {
   	  				image = false;
   	  				break;
   	  			}
   	  		}
   	  	}
   	  	return image;
   	  }


function getCookie(name) {
let cookieValue = null;
if (document.cookie && document.cookie !== '') {
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		// Does this cookie string begin with the name we want?
		if (cookie.substring(0, name.length + 1) === (name + '=')) {
			cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
			break;
		}
	}
}
return cookieValue;
}
		


$('#form').on('submit',function(e){

	e.preventDefault();
	const csrftoken = getCookie('csrftoken');
	var formData=new FormData();

	for(var i=0;i<images.length;i++)
	{
		// invoice_list.push();
		formData.append('invoice '+(i+1),images[i].file)
	}
	//formData.append('image',invoice_list);

	$.ajax({
			url: window.location.pathname,
            type: 'POST',
            data: formData,
			headers: { "X-CSRFToken":csrftoken },
            success: function (response) {
                console.log(response)
            },
			error:function(response)
			{
				console.log(response)
			},
            cache: false,
            contentType: false,
            processData: false
	});
	
});
