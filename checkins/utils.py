from PIL import Image, ImageOps
import io
import sys
from django.core.files.uploadedfile import InMemoryUploadedFile

def optimize_checkin_image(image_file, max_dimension=1600, quality=85):
    """
    Resizes and optimizes an uploaded check-in image to reduce cloud storage
    and bandwidth usage. Corrects EXIF orientation and saves as JPEG.
    """
    if not image_file:
        return image_file

    try:
        if hasattr(image_file, 'seek'):
            image_file.seek(0)
        img = Image.open(image_file)

        img = ImageOps.exif_transpose(img)

        # Convert RGBA / P mode images to RGB for JPEG encoding
        if img.mode in ('RGBA', 'P', 'LA'):
            img = img.convert('RGB')
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Resize if either dimension exceeds max_dimension
        if img.width > max_dimension or img.height > max_dimension:
            img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)

        original_name = getattr(image_file, 'name', 'checkin.jpg')
        base_name = original_name.rsplit('.', 1)[0]
        new_filename = f"{base_name}.jpg"

        return InMemoryUploadedFile(
            file=output,
            field_name='ImageField',
            name=new_filename,
            content_type='image/jpeg',
            size=sys.getsizeof(output),
            charset=None
        )
    except Exception as e:
        # If optimization fails (e.g. invalid image data), fallback to original file
        return image_file
