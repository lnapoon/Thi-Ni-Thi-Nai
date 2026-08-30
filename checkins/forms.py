from django import forms
from .models import CheckIn
from PIL import Image

class CheckInForm(forms.ModelForm):
    class Meta:
        model = CheckIn
        fields = ['place_name', 'caption', 'photo', 'latitude', 'longitude']
        widgets = {
            'place_name': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'เช่น ร้านกาแฟหน้ามอ, ตลาดนัดริมคลอง',
                'required': True,
                'autocomplete': 'off',
            }),
            'caption': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'maxlength': 500,
                'placeholder': 'เขียนบรรยากาศ ความรู้สึก หรือสิ่งที่น่าสนใจที่นี่...',
                'required': True,
            }),
            'photo': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/jpeg,image/png,image/webp,image/gif,image/heic',
                'id': 'id_photo',
            }),
            'latitude': forms.HiddenInput(attrs={'id': 'id_latitude'}),
            'longitude': forms.HiddenInput(attrs={'id': 'id_longitude'}),
        }
        labels = {
            'place_name': 'ชื่อสถานที่ / จุดเช็คอิน *',
            'caption': 'ข้อความบรรยาย * (สูงสุด 500 ตัวอักษร)',
            'photo': 'รูปภาพสถานที่ *',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # When editing an existing checkin, photo is optional (keeps existing photo if blank)
        if self.instance and self.instance.pk:
            self.fields['photo'].required = False
            self.fields['photo'].label = 'เปลี่ยนรูปภาพสถานที่ (เว้นว่างไว้หากใช้รูปเดิม)'
        else:
            self.fields['photo'].required = True

    def clean_photo(self):
        photo = self.cleaned_data.get('photo')
        if photo and hasattr(photo, 'size'):
            # Validate max size: 5 MB
            max_size_mb = 5
            if photo.size > max_size_mb * 1024 * 1024:
                raise forms.ValidationError(f'ขนาดไฟล์รูปภาพต้องไม่เกิน {max_size_mb} MB (ไฟล์ปัจจุบัน {photo.size / (1024*1024):.2f} MB)')

            # Validate that it is a genuine image
            try:
                if hasattr(photo, 'seek'):
                    photo.seek(0)
                img = Image.open(photo)
                valid_formats = ['JPEG', 'PNG', 'WEBP', 'GIF', 'MPO', 'HEIF']
                if img.format not in valid_formats:
                    raise forms.ValidationError('รูปแบบไฟล์รูปภาพไม่ถูกต้อง รองรับเฉพาะ JPG, PNG, WEBP, GIF เท่านั้น')
                if hasattr(photo, 'seek'):
                    photo.seek(0)
            except forms.ValidationError:
                raise
            except Exception:
                if hasattr(photo, 'seek'):
                    photo.seek(0)
                raise forms.ValidationError('ไฟล์ที่อัปโหลดไม่ใช่ไฟล์รูปภาพที่ถูกต้อง')

        return photo


    def clean_caption(self):
        caption = self.cleaned_data.get('caption', '').strip()
        if not caption:
            raise forms.ValidationError('กรุณาระบุข้อความบรรยาย')
        if len(caption) > 500:
            raise forms.ValidationError('ข้อความบรรยายต้องไม่เกิน 500 ตัวอักษร')
        return caption
