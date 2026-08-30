# ที่นี้ที่ไหนหรือ (Thi Ni Thi Nai Rue) 📍📸
### Location Check-In Social Web Application (Django & Bootstrap 5)

**"ที่นี้ที่ไหนหรือ" (Thi Ni Thi Nai Rue)** เป็นเว็บแอปพลิเคชัน Social Check-in แบบ Mobile-First พัฒนาด้วย **Django** และ **Bootstrap 5** ช่วยให้ผู้ใช้สามารถบันทึกและแบ่งปันจุดเช็คอินสถานที่ต่างๆ พร้อมรูปถ่าย คำบรรยาย และพิกัดตำแหน่งทางภูมิศาสตร์ (GPS Geolocation) ผ่าน HTML5 Geolocation API โดยมีหน้าฟีดรวมสาธารณะสำหรับให้ผู้ใช้ที่ล็อกอินสามารถเข้ามาดู กดถูกใจ และดูพิกัดบนแผนที่แบบ Interactive Map ได้

---

## 🌟 ฟีเจอร์หลัก (Core Features)

### 1. ระบบยืนยันตัวตน (Authentication & Profile)
- สมัครสมาชิก (Sign Up), เข้าสู่ระบบ (Log In), ออกจากระบบ (Log Out) ด้วยระบบความปลอดภัยมาตรฐานของ `django.contrib.auth`
- หน้าโปรไฟล์ส่วนตัว (User Profile) แสดงรูป Avatar, Bio, สถิติจำนวนครั้งที่เช็คอิน และประวัติการเช็คอินทั้งหมดของผู้ใช้นั้นๆ
- ฟอร์มแก้ไขข้อมูลส่วนตัวและอัปโหลดรูปภาพ Avatar

### 2. การจัดการจุดเช็คอิน (Check-In CRUD)
- **สร้างจุดเช็คอิน (Create)**:
  - ระบุชื่อสถานที่ (Place name)
  - ดึงพิกัดอัตโนมัติผ่านเบราว์เซอร์ด้วย Geolocation API (`navigator.geolocation`) ลงใน Hidden Input (หากผู้ใช้ไม่อนุญาต/ไม่เปิด GPS ก็ยังสามารถกรอกชื่อสถานที่เพื่อโพสต์ได้)
  - ข้อความบรรยายสถานที่ (Caption) สูงสุด 500 ตัวอักษร
  - อัปโหลดรูปภาพสถานที่ (พร้อมระบบพรีวิวรูปทันทีก่อนส่ง) มีระบบตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB) และชนิดไฟล์ (JPG, PNG, WEBP)
- **แสดงรายละเอียด (Read/Detail)**: แสดงรูปภาพขนาดใหญ่, พิกัด GPS, ลิงก์เปิด Google Maps, รายละเอียดผู้โพสต์ และเวลาโพสต์แบบ Relative Time (`timesince`)
- **แก้ไขจุดเช็คอิน (Update)**: สงวนสิทธิ์เฉพาะ **เจ้าของโพสต์เท่านั้น** (Owner-only check ป้องกันทั้งในระดับ View และ Form)
- **ลบจุดเช็คอิน (Delete)**: มีหน้าต่างยืนยันการลบ (Confirm Delete) และป้องกันการลบผ่าน GET request

### 3. หน้าฟีดรวมและแผนที่ (Public Feed & Map)
- หน้าฟีดเรียงลำดับจากล่าสุดไปเก่าสุด พร้อมระบบแบ่งหน้า (Pagination: 10 รายการต่อหน้า)
- ระบบกดถูกใจ (Like Toggle) แบบ AJAX โต้ตอบได้ทันทีโดยไม่ต้องรีโหลดหน้า
- **Interactive Map View**: แสดงหมุดแผนที่จุดเช็คอินทั้งหมดที่มีพิกัด GPS ด้วย **Leaflet.js** (OpenStreetMap) พร้อมป็อปอัปแสดงภาพและลิงก์รายละเอียด

### 4. Mobile-First UI & PWA Ready
- ดีไซน์ Responsive รองรับหน้าจอสมาร์ตโฟน (375px - 414px) และแท็บเล็ต/เดสก์ท็อป
- แถบเมนูด้านล่าง (Bottom Navigation Bar) สำหรับอุปกรณ์มือถือ สะดวกต่อการใช้งานด้วยมือเดียว
- รองรับ Web App Manifest (`manifest.json`) และแท็ก `theme-color` สำหรับการกด "Add to Home Screen"

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Backend**: Python 3.11+ / Django 5.x
- **Frontend**: Django Template Language (DTL), Bootstrap 5.3, Bootstrap Icons, Leaflet.js
- **Image Processing**: Pillow (ปรับขนาดอัตโนมัติไม่เกิน 1600px, แก้ไข EXIF Orientation, แปลงเป็น JPEG คุณภาพสูงเพื่อประหยัดพื้นที่)
- **Configuration & Secrets**: `python-decouple` (โหลดค่าผ่าน `.env`)
- **Database**: SQLite (Local Dev) / รองรับ PostgreSQL สำหรับ Production ผ่าน `dj-database-url`
- **File Storage**: `django-storages` + `django-cloudinary-storage` (Pluggable Architecture)

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Local Setup)

### 1. Clone หรือเปิดโฟลเดอร์โปรเจกต์
```bash
cd content2
```

### 2. สร้างและเปิดใช้งาน Virtual Environment
```bash
# บน macOS / Linux:
python3 -m venv venv
source venv/bin/activate

# บน Windows:
# python -m venv venv
# venv\Scripts\activate
```

### 3. ติดตั้ง Dependencies
```bash
pip install -r requirements.txt
```

### 4. สร้างไฟล์ `.env` สำหรับตั้งค่าตัวแปรสภาพแวดล้อม
คัดลอกไฟล์ `.env.example` เป็น `.env`:
```bash
cp .env.example .env
```

### 5. รัน Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. สร้างบัญชีผู้ดูแลระบบ (Superuser - ทางเลือก)
```bash
python manage.py createsuperuser
```

### 7. เริ่มต้นเครื่องเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)
```bash
python manage.py runserver 8000
```
เปิดเบราว์เซอร์ไปที่: [http://localhost:8000](http://localhost:8000)

---

## ☁️ กลยุทธ์การจัดเก็บรูปภาพบนคลาวด์ (Cloud Storage Strategy)

โปรเจกต์นี้ใช้โครงสร้าง **Pluggable Storage** ผ่าน `django-storages` และการตั้งค่า `STORAGES` ของ Django ทำให้สามารถสลับผู้ให้บริการจัดเก็บไฟล์ (Cloud Storage Providers) ได้อย่างง่ายดายผ่านไฟล์ `.env` **โดยไม่ต้องแก้ไขโค้ดของแอปพลิเคชันแม้แต่บรรทัดเดียว**:

### 1. Local Storage (ค่าเริ่มต้นสำหรับการพัฒนา)
```env
STORAGE_BACKEND=local
```
ไฟล์รูปภาพจะถูกบันทึกลงในโฟลเดอร์ `media/` ภายในเครื่อง

---

### 2. Cloudinary Storage (Primary Cloud Backend)
สมัครบัญชีฟรีที่ [Cloudinary](https://cloudinary.com/) แล้วนำค่า API Credentials มาใส่ใน `.env`:
```env
STORAGE_BACKEND=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 3. สลับไปยัง S3-Compatible Storage (Cloudflare R2 / Backblaze B2 / AWS S3)
หากต้องการเปลี่ยนไปใช้ผู้ให้บริการที่มี Free Tier กว้างขวางและไม่มีค่า Egress เช่น **Cloudflare R2** หรือ **Backblaze B2**:

เพียงเปลี่ยนค่าใน `.env` ดังนี้:
```env
STORAGE_BACKEND=s3
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_STORAGE_BUCKET_NAME=your_bucket_name
AWS_S3_REGION_NAME=auto
# ตัวอย่าง Endpoint สำหรับ Cloudflare R2:
AWS_S3_ENDPOINT_URL=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
# หรือโดเมนสาธารณะ (Custom Domain) ของ Bucket:
AWS_S3_CUSTOM_DOMAIN=media.yourdomain.com
```

---

### 🖼️ การประมวลผลรูปภาพฝั่งเซิร์ฟเวอร์ด้วย Pillow
เพื่อป้องกันปัญหาการใช้พื้นที่และ Bandwidth เกินโควตา:
1. ก่อนบันทึกรูปลง Storage ระบบจะตรวจสอบทิศทางภาพจาก EXIF Metadata (`ImageOps.exif_transpose`)
2. ปรับลดขนาดภาพอัตโนมัติหากด้านใดด้านหนึ่งเกิน `1600px` (ด้วยอัลกอริทึม LANCZOS)
3. เข้ารหัสเป็น JPEG คุณภาพ 85% พร้อมเปิด `optimize=True` ทำให้ได้ไฟล์ขนาดกะทัดรัด (ลดขนาดจาก 5-10MB เหลือ ~200-400KB) โดยยังคงความคมชัดสูง

---

## 🧪 การทดสอบระบบ (Automated Unit Tests)

รันชุดแบบทดสอบอัตโนมัติเพื่อตรวจสอบความถูกต้องของระบบทั้งหมด:
```bash
python manage.py test
```

ครอบคลุมการทดสอบ:
- การสมัครสมาชิก, ล็อกอิน, ล็อกเอาต์ และการสร้าง Profile อัตโนมัติด้วย Signals
- การสร้าง Check-in พร้อมพิกัด GPS และรูปภาพ
- การตรวจสอบขนาดไฟล์รูปภาพไม่ให้เกิน 5MB
- การป้องกันสิทธิ์การเข้าถึง (Login Required & Object-level Ownership Checks สำหรับ Edit/Delete โดยคืนค่า 403 สำหรับผู้ใช้ที่ไม่ใช่เจ้าของ)
- การทำงานของระบบ Pagination บนหน้าฟีด
- การกด Like และ Unlike

---

## 📁 โครงสร้างโปรเจกต์ (Project Directory Structure)

```
content2/
├── accounts/               # แอปพลิเคชันจัดการผู้ใช้และโปรไฟล์
│   ├── models.py           # Model: Profile
│   ├── views.py            # Views: SignUp, Login, Logout, Profile, ProfileEdit
│   ├── forms.py            # Form: SignUpForm, ProfileEditForm, UserUpdateForm
│   ├── signals.py          # Auto create profile on User post_save
│   └── tests.py            # Unit tests สำหรับ accounts
├── checkins/               # แอปพลิเคชันหลัก Check-in
│   ├── models.py           # Model: CheckIn, Like
│   ├── views.py            # Views: Feed, Detail, Create, Update, Delete, Map, Like
│   ├── forms.py            # Form: CheckInForm (พร้อม Geolocation & Validators)
│   ├── utils.py            # Pillow Image resizing & optimization
│   └── tests.py            # Unit tests สำหรับ checkins
├── config/                 # การตั้งค่าหลักของโปรเจกต์
│   ├── settings.py         # Settings พร้อม decouple & pluggable storage
│   ├── urls.py             # Root URL routing
│   ├── wsgi.py
│   └── asgi.py
├── static/                 # Static Assets
│   ├── css/style.css       # Mobile-first CSS & theme styling
│   ├── js/geolocation.js   # Geolocation capture & preview script
│   └── manifest.json       # PWA Web App Manifest
├── templates/              # Django HTML Templates
│   ├── base.html           # Base template พร้อม Bootstrap 5 & Bottom Nav
│   ├── accounts/           # Templates หน้าสมัครสมาชิก เข้าสู่ระบบ และโปรไฟล์
│   ├── checkins/           # Templates หน้า Feed, Detail, Form, Map, Delete
│   ├── 403.html            # Forbidden error template
│   ├── 404.html            # Not Found error template
│   └── 500.html            # Server Error template
├── manage.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```
# content
