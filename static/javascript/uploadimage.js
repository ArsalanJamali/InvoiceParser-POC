var images = [];
var invoice_id=0;
var data;

var form=document.getElementById('form')
   	  function image_select() {
   	  	  var image = document.getElementById('image').files;

			for (i = 0; i < image.length; i++) {
   	  	  	  if (check_duplicate(image[i].name)) {
                images.push({
					"id":invoice_id,
   	  	  	  	    "name" : image[i].name,
   	  	  	  	    "url" : URL.createObjectURL(image[i]),
   	  	  	  	    "file" : image[i],
   	  	  	    })
					invoice_id+=1;
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

	if(images.length==0)
	{
		alert('Upload First');
		e.preventDefault();
		return;
	}

	e.preventDefault();
	const csrftoken = getCookie('csrftoken');
	var formData=new FormData();

	for(var i=0;i<images.length;i++)
	{
		formData.append('images_'+images[i].id,images[i].file)
		formData.append(images[i].id,images[i].url)
	}
	//formData.append('image',invoice_list);

	$('#proceed_btn_div').html(' <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">\
	<span class="sr-only">Loading...</span>\
  </div>')

	$.ajax({
			url: window.location.pathname,
            type: 'POST',
            data: formData,
			headers: { "X-CSRFToken":csrftoken },
            success: function (response) {
                $('#main_container').html(response)
            },
			error:function(response)
			{
				alert('Some error was detected please Try Again');
			},
            cache: false,
            contentType: false,
            processData: false
	});

});

