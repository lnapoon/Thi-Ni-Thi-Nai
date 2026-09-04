from django import forms
from .models import CheckIn
from .constants import REGION_CHOICES, PROVINCE_CHOICES, PROVINCE_TO_REGION
from PIL import Image

class CheckInForm(forms.ModelForm):
    region = forms.ChoiceField(
        choices=REGION_CHOICES,
        required=False,
        label='ภูมิภาค',
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'id_region',
        })
    )
    province = forms.ChoiceField(
        choices=PROVINCE_CHOICES,
        required=False,
        label='จังหวัด',
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'id_province',
        })
    )

    class Meta:
        model = CheckIn
        fields = ['place_name', 'region', 'province', 'caption', 'photo', 'aspect_ratio', 'latitude', 'longitude']
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
            'aspect_ratio': forms.HiddenInput(attrs={'id': 'id_aspect_ratio'}),
            'latitude': forms.HiddenInput(attrs={'id': 'id_latitude'}),
            'longitude': forms.HiddenInput(attrs={'id': 'id_longitude'}),
        }
        labels = {
            'place_name': 'ชื่อสถานที่ / จุดเช็คอิน *',
            'region': 'ภูมิภาค',
            'province': 'จังหวัด',
            'caption': 'ข้อความบรรยาย * (สูงสุด 500 ตัวอักษร)',
            'photo': 'รูปภาพสถานที่ *',
            'aspect_ratio': 'สัดส่วนภาพ',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['photo'].required = False
        if self.instance and self.instance.pk:
            self.fields['photo'].label = 'เปลี่ยนรูปภาพสถานที่ (เว้นว่างไว้หากใช้รูปเดิม)'

    def clean(self):
        cleaned_data = super().clean()
        photo = cleaned_data.get('photo')
        if not self.instance.pk and not photo and not self.files.getlist('photos') and not self.files.getlist('photo'):
            self.add_error('photo', 'กรุณาเลือกรูปภาพสถานที่อย่างน้อย 1 รูป')
        return cleaned_data

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
