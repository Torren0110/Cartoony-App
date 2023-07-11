from django.shortcuts import render, HttpResponse
from django.http import FileResponse, JsonResponse
from os import path, getcwd
from django.views.decorators.csrf import csrf_exempt
from .utils import is_image, cartoonify
from django.core.files.storage import FileSystemStorage
import base64

# Create your views here.

def home(request):
    return render(request, path.join('home', 'base.html'))

@csrf_exempt
def getImage(request):
    if(request.method == 'POST'):
        input_img = request.FILES.get('image')

        if input_img and is_image(input_img):
            fs = FileSystemStorage()
            img_name = input_img.name
            img_path = 'home/imgs/' + img_name

            fs.save(img_path, input_img)

            output_img = cartoonify(img_path)

            image_data = output_img.read()
            encoded_image = base64.b64encode(image_data).decode('utf-8')

            return JsonResponse({'image' : encoded_image})

            # response = FileResponse(output_img, as_attachment=True, content_type='image/jpeg')
            # response['Content-Disposition'] = 'attachment; filename="myimage.jpg"'

            # return response

        return HttpResponse(None)
    else:
        return HttpResponse(None)