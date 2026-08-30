import io
from PIL import Image, ImageDraw
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from checkins.models import CheckIn
from accounts.models import Profile

def generate_sample_place_image(title, bg_color):
    img = Image.new('RGB', (800, 600), color=bg_color)
    # Simple colored sample image
    draw = ImageDraw.Draw(img)
    draw.rectangle([(20, 20), (780, 580)], outline="white", width=4)
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=85)
    output.seek(0)
    return SimpleUploadedFile(f"{title}.jpg", output.read(), content_type='image/jpeg')

class Command(BaseCommand):
    help = 'Populates the database with sample users and geotagged check-ins'

    def handle(self, *args, **options):
        self.stdout.write("Seeding sample users...")

        users_data = [
            {'username': 'somchai', 'name': 'สมชาย สายชิล', 'bio': 'ชอบเดินทางท่องเที่ยวและถ่ายรูปคาเฟ่ทั่วไทย'},
            {'username': 'manee', 'name': 'มานี มีนา', 'bio': 'สายธรรมชาติ ภูเขา น้ำตก ทะเล'},
            {'username': 'chujai', 'name': 'ชูใจ ใจดี', 'bio': 'นักชิมของอร่อย คาเฟ่ฮอปเปอร์'},
        ]

        created_users = []
        for u in users_data:
            user, created = User.objects.get_or_create(
                username=u['username'],
                defaults={
                    'first_name': u['name'].split()[0],
                    'last_name': u['name'].split()[1] if len(u['name'].split()) > 1 else '',
                    'email': f"{u['username']}@example.com"
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                user.profile.bio = u['bio']
                user.profile.save()
                self.stdout.write(f"  Created user: {user.username} (password: password123)")
            else:
                self.stdout.write(f"  User {user.username} already exists")
            created_users.append(user)

        sample_checkins = [
            {
                'user': created_users[0],
                'place_name': 'วัดพระศรีรัตนศาสดาราม (วัดพระแก้ว)',
                'caption': 'สถาปัตยกรรมงดงาม อากาศแจ่มใส คนเยอะแต่ประทับใจมากครับ',
                'lat': 13.7516,
                'lng': 100.4927,
                'color': (41, 128, 185)
            },
            {
                'user': created_users[1],
                'place_name': 'ยอดดอยอินทนนท์ เชียงใหม่',
                'caption': 'อากาศหนาว 8 องศา สัมผัสหมอกยามเช้าและวิวธรรมชาติอันบริสุทธิ์ 🏔️',
                'lat': 18.5894,
                'lng': 98.4867,
                'color': (39, 174, 96)
            },
            {
                'user': created_users[2],
                'place_name': 'หาดไร่เลย์ จ.กระบี่',
                'caption': 'น้ำทะเลใสมาก วิวหน้าผาหินปูนอลังการ เหมาะกับการพายเรือคายัคสุดๆ 🌊',
                'lat': 8.0125,
                'lng': 98.8375,
                'color': (22, 160, 133)
            },
            {
                'user': created_users[0],
                'place_name': 'ตลาดน้ำอัมพวา จ.สมุทรสงคราม',
                'caption': 'บรรยากาศยามเย็นริมคลอง อาหารซีฟู้ดสดๆ และนั่งเรือชมหิ่งห้อย 🏮',
                'lat': 13.4258,
                'lng': 99.9547,
                'color': (211, 84, 0)
            },
            {
                'user': created_users[1],
                'place_name': 'ถนนคนเดินท่าแพ เชียงใหม่',
                'caption': 'ช้อปปิ้งของฝาก งานคราฟต์ และสตรีทฟู้ดพื้นเมืองยามค่ำคืน',
                'lat': 18.7883,
                'lng': 98.9934,
                'color': (142, 68, 173)
            }
        ]

        self.stdout.write("Seeding sample check-ins...")
        for item in sample_checkins:
            if not CheckIn.objects.filter(place_name=item['place_name']).exists():
                photo = generate_sample_place_image(item['place_name'], item['color'])
                CheckIn.objects.create(
                    user=item['user'],
                    place_name=item['place_name'],
                    caption=item['caption'],
                    latitude=item['lat'],
                    longitude=item['lng'],
                    photo=photo
                )
                self.stdout.write(f"  Created check-in: {item['place_name']}")

        self.stdout.write(self.style.SUCCESS("Database seeded successfully! Default password for users is 'password123'."))
