import os
import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User  # type: ignore
# pyrefly: ignore [missing-import]
from accounts.models import Profile  # type: ignore
# pyrefly: ignore [missing-import]
from checkins.models import CheckIn  # type: ignore
# pyrefly: ignore [missing-import]
import cloudinary.uploader  # type: ignore

BRAIN_DIR = Path("/Users/monphrakan/.gemini/antigravity-ide/brain/8a27a3ef-061e-45e4-94fe-960adc1c94f8")

BOTS_DATA = [
    {
        "username": "somchai_traveler",
        "first_name": "สมชาย",
        "last_name": "ใจดี",
        "email": "somchai.jaidee.travel@gmail.com",
        "display_name": "สมชาย ใจดี",
        "category": "นักเดินทาง / ช่างภาพธรรมชาติ",
        "bio": "ชอบเที่ยวธรรมชาติ ถ่ายภาพวิถีชีวิตอีสานใต้ 📸🌾",
        "avatar_img": BRAIN_DIR / "somchai_avatar_1788604858987.jpg",
        "post": {
            "place_name": "ผามออีแดง อุทยานแห่งชาติเขาพระวิหาร",
            "province": "ศรีสะเกษ",
            "region": "ตะวันออกเฉียงเหนือ",
            "latitude": 14.3752,
            "longitude": 104.7083,
            "caption": "บรรยากาศยามเช้าที่ผามออีแดง ลมหนาวพัดเย็นสบาย หมอกลอยเหนือแนวป่าชายแดนไทย-กัมพูชา สวยงามอลังการมากครับ ใครมาศรีสะเกษห้ามพลาดเลย! 🌄✨",
            "photo_img": BRAIN_DIR / "pha_mor_edang_1788604943999.jpg",
        }
    },
    {
        "username": "kanyanat_p",
        "first_name": "กัญญาณัฐ",
        "last_name": "พิมพา",
        "email": "kanyanat.pimpa@gmail.com",
        "display_name": "กัญญาณัฐ พิมพา",
        "category": "นักท่องเที่ยวเชิงประวัติศาสตร์",
        "bio": "หลงรักมนต์เสน่ห์ปราสาทหินขอมโบราณและอารยธรรมอีสาน 🏛️🎒",
        "avatar_img": BRAIN_DIR / "kanyanat_avatar_1788604906302.jpg",
        "post": {
            "place_name": "ปราสาทหินสระกำแพงใหญ่",
            "province": "ศรีสะเกษ",
            "region": "ตะวันออกเฉียงเหนือ",
            "latitude": 15.1017,
            "longitude": 104.1481,
            "caption": "ปราสาทหินสระกำแพงใหญ่ ศิลปะขอมโบราณอายุกว่า 1,000 ปี สถาปัตยกรรมหินทรายและศิลาแลงยังคงความงดงามและสงบเงียบมาก เดินชมเพลินได้ความรู้ประวัติศาสตร์เต็มๆ 🛕🌾",
            "photo_img": BRAIN_DIR / "sa_kamphaeng_yai_1788604963157.jpg",
        }
    },
    {
        "username": "napatsorn_k",
        "first_name": "นภัสสร",
        "last_name": "แก้วมณี",
        "email": "napatsorn.k.travel@gmail.com",
        "display_name": "นภัสสร แก้วมณี",
        "category": "สายคาเฟ่ & วัดสวย",
        "bio": "สายบุญ สายคาเฟ่ แวะเช็คอินมุมสวยๆ ทั่วศรีสะเกษ ☕✨",
        "avatar_img": BRAIN_DIR / "napatsorn_avatar_1788604873579.jpg",
        "post": {
            "place_name": "วัดพระธาตุสุพรรณหงส์",
            "province": "ศรีสะเกษ",
            "region": "ตะวันออกเฉียงเหนือ",
            "latitude": 15.0683,
            "longitude": 104.3879,
            "caption": "พระอุโบสถเรือสุพรรณหงส์จำลองตั้งอยู่กลางสระน้ำ สวยงามวิจิตรงดงามตระการตา มาทำบุญไหว้พระเสริมสิริมงคล บรรยากาศร่มรื่น สบายใจมากค่ะ ⛵🙏",
            "photo_img": BRAIN_DIR / "suphannahong_1788604983096.jpg",
        }
    },
    {
        "username": "teerapat_sisaket",
        "first_name": "ธีรภัทร",
        "last_name": "วงศ์สว่าง",
        "email": "teerapat.sisaket@gmail.com",
        "display_name": "ธีรภัทร วงศ์สว่าง",
        "category": "คนเมืองดอกลำดวน",
        "bio": "เกิดและโตที่ศรีสะเกษ ชวนเที่ยวเมืองน่าอยู่ ของกินอร่อย 🌿🏞️",
        "avatar_img": BRAIN_DIR / "teerapat_avatar_1788604888818.jpg",
        "post": {
            "place_name": "ปราสาทปรางค์กู่",
            "province": "ศรีสะเกษ",
            "region": "ตะวันออกเฉียงเหนือ",
            "latitude": 14.8576,
            "longitude": 103.9856,
            "caption": "ปราสาทปรางค์กู่ โบราณสถานเก่าแก่สร้างด้วยศิลาแลง สมัยพระเจ้าชัยวรมันที่ 7 อโรคยศาลโบราณที่เปี่ยมด้วยมนต์ขลัง ถ่ายรูปมุมไหนก็ดูคลาสสิก แนะนำให้มาช่วงบ่ายแก่ๆ แสงสวยมากครับ ☀️🏛️",
            "photo_img": BRAIN_DIR / "prang_ku_temple_1788605006747.jpg",
        }
    },
    {
        "username": "anucha_photo",
        "first_name": "อนุชา",
        "last_name": "สุทธิชัย",
        "email": "anucha.photo.sk@gmail.com",
        "display_name": "อนุชา สุทธิชัย",
        "category": "ตากล้องอิสระ",
        "bio": "เก็บความทรงจำผ่านเลนส์ ผามออีแดง ดอกลำดวน และท้องฟ้า 📷🌅",
        "avatar_img": BRAIN_DIR / "anucha_avatar_1788604925001.jpg",
        "post": {
            "place_name": "สวนสมเด็จพระศรีนครินทร์ ศรีสะเกษ",
            "province": "ศรีสะเกษ",
            "region": "ตะวันออกเฉียงเหนือ",
            "latitude": 15.1147,
            "longitude": 104.3094,
            "caption": "ป่าดงลำดวนธรรมชาติผืนใหญ่ใจกลางเมืองศรีสะเกษ ต้นลำดวนกว่า 50,000 ต้น ร่มรื่น อากาศบริสุทธิ์ เหมาะกับการมาเดินเล่น พักผ่อนหย่อนใจ ถ่ายรูปกับสะพานแขวนและวิวริมน้ำ 🌳🌉",
            "photo_img": BRAIN_DIR / "srinagarindra_park_1788605024673.jpg",
        }
    },
]


def seed_bots_and_posts():
    print("🚀 Starting Sisaket Tourist Bots & Checkins Seeder...")

    for data in BOTS_DATA:
        username = data["username"]
        email = data["email"]
        first_name = data["first_name"]
        last_name = data["last_name"]

        # Create or get user
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
            }
        )
        if created:
            user.set_password("SisaketBot@2026")
            user.save()
            print(f"✅ Created User: {username} ({first_name} {last_name})")
        else:
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.save()
            print(f"ℹ️ User {username} already exists, updated info.")

        # Update profile
        profile, p_created = Profile.objects.get_or_create(user=user)
        profile.display_name = data["display_name"]
        profile.category = data["category"]
        profile.bio = data["bio"]

        # Upload Avatar to Cloudinary
        avatar_path = data["avatar_img"]
        if avatar_path.exists():
            print(f"  Uploading avatar for {username} to Cloudinary...")
            res_avatar = cloudinary.uploader.upload(
                str(avatar_path),
                folder="avatars",
                transformation=[
                    {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                    {"quality": "auto:good", "fetch_format": "auto"}
                ]
            )
            profile.avatar = res_avatar.get("public_id") or res_avatar.get("secure_url")
            print(f"  Uploaded avatar public_id: {profile.avatar}")
        else:
            print(f"  ⚠️ Avatar file not found: {avatar_path}")
        
        profile.save()

        # Create CheckIn
        post_data = data["post"]
        place_name = post_data["place_name"]
        
        # Check if already posted by this user
        checkin = CheckIn.objects.filter(user=user, place_name=place_name).first()
        if not checkin:
            photo_path = post_data["photo_img"]
            if photo_path.exists():
                print(f"  Uploading photo for '{place_name}' to Cloudinary...")
                res_photo = cloudinary.uploader.upload(
                    str(photo_path),
                    folder="checkins",
                    transformation=[
                        {"width": 1200, "crop": "limit"},
                        {"quality": "auto:good", "fetch_format": "auto"}
                    ]
                )
                photo_id = res_photo.get("public_id") or res_photo.get("secure_url")
                
                checkin = CheckIn.objects.create(
                    user=user,
                    place_name=place_name,
                    province=post_data["province"],
                    region=post_data["region"],
                    latitude=post_data["latitude"],
                    longitude=post_data["longitude"],
                    caption=post_data["caption"],
                    photo=photo_id,
                    aspect_ratio="original",
                    show_user_location=True,
                    user_latitude=post_data["latitude"],
                    user_longitude=post_data["longitude"],
                )
                print(f"  ✅ Created CheckIn (ID: {checkin.id}) for '{place_name}'")
            else:
                print(f"  ⚠️ Photo file not found: {photo_path}")
        else:
            print(f"  ℹ️ Checkin '{place_name}' already exists (ID: {checkin.id})")

    print("\n🎉 Seeding completed successfully!")


if __name__ == "__main__":
    seed_bots_and_posts()
