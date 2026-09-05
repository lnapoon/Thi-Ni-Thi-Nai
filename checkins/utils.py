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


def delete_cloudinary_image(photo_field_or_public_id):
    """
    Deletes an image asset from Cloudinary by its public_id, CloudinaryResource,
    or CloudinaryField. Invalidates CDN cache.
    Safely ignores non-existent or null values, and catches any network exceptions.
    """
    if not photo_field_or_public_id:
        return None

    public_id = getattr(photo_field_or_public_id, 'public_id', None)
    if not public_id:
        val = str(photo_field_or_public_id).strip()
        if not val:
            return None
        # If full URL like .../upload/v1234/checkins/xxx.jpg
        if val.startswith('http'):
            try:
                parts = val.split('/upload/')
                if len(parts) > 1:
                    # Remove potential transformation segments and version prefix
                    path = parts[1].split('/', 1)[-1]
                    public_id = path.rsplit('.', 1)[0]
            except Exception:
                public_id = None
        else:
            public_id = val

    if public_id:
        try:
            import cloudinary.uploader
            res = cloudinary.uploader.destroy(public_id, invalidate=True)
            return res
        except Exception as e:
            # Silently catch network errors or missing keys to avoid blocking DB operations
            import logging
            logging.getLogger(__name__).warning("Failed to delete Cloudinary asset %s: %s", public_id, e)
            return None

    return None

