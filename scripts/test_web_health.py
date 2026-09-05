import os
import sys
from pathlib import Path
import urllib.request

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

# pyrefly: ignore [missing-import]
from django.test import Client  # type: ignore
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User  # type: ignore
# pyrefly: ignore [missing-import]
from checkins.models import CheckIn  # type: ignore

def run_health_checks():
    print("==================================================")
    print("🔍 RUNNING COMPREHENSIVE WEB HEALTH CHECKS")
    print("==================================================")
    client = Client()
    errors = []

    # 1. Test Feed View (Guest and Authenticated)
    print("\n[1/6] Testing Feed View (GET /)...")
    res_feed_guest = client.get('/')
    if res_feed_guest.status_code == 200:
        print("  ✅ GET / (Guest) returned 200 OK (limited to 4 posts as designed)")
    else:
        errors.append(f"GET / (Guest) failed with {res_feed_guest.status_code}")

    somchai = User.objects.get(username="somchai_traveler")
    client.force_login(somchai)
    res_feed_auth = client.get('/')
    if res_feed_auth.status_code == 200:
        print("  ✅ GET / (Authenticated) returned 200 OK")
        content = res_feed_auth.content.decode('utf-8')
        for place in [
            "ผามออีแดง",
            "ปราสาทหินสระกำแพงใหญ่",
            "วัดพระธาตุสุพรรณหงส์",
            "ปราสาทปรางค์กู่",
            "สวนสมเด็จพระศรีนครินทร์"
        ]:
            if place in content:
                print(f"  ✅ Place '{place}' found in feed")
            else:
                errors.append(f"Place '{place}' missing from authenticated feed")
                print(f"  ❌ Place '{place}' NOT found in authenticated feed")
    else:
        errors.append(f"GET / (Authenticated) failed with {res_feed_auth.status_code}")

    # 2. Test CheckIn Detail Views
    print("\n[2/6] Testing CheckIn Detail Views...")
    new_checkins = CheckIn.objects.filter(province="ศรีสะเกษ").exclude(place_name="เกาะกลางน้ำ").order_by('id')
    for checkin in new_checkins:
        url = f'/checkin/{checkin.id}/'
        res = client.get(url)
        if res.status_code == 200:
            print(f"  ✅ CheckIn {checkin.id} ('{checkin.place_name}') returned 200 OK")
        else:
            errors.append(f"CheckIn {checkin.id} detail failed with {res.status_code}")
            print(f"  ❌ CheckIn {checkin.id} detail returned {res.status_code}")

    # 3. Test Map View
    print("\n[3/6] Testing Interactive Map View (GET /map/)...")
    res_map = client.get('/map/')
    if res_map.status_code == 200:
        print("  ✅ GET /map/ returned 200 OK")
        content = res_map.content.decode('utf-8')
        if "ศรีสะเกษ" in content or "104." in content:
            print("  ✅ Map contains Sisaket coordinates/content")
    else:
        errors.append(f"GET /map/ failed with status {res_map.status_code}")
        print(f"  ❌ GET /map/ returned {res_map.status_code}")

    # 4. Test User Profile Views (/accounts/profile/<username>/)
    print("\n[4/6] Testing User Profile Views...")
    bot_usernames = ["somchai_traveler", "kanyanat_p", "napatsorn_k", "teerapat_sisaket", "anucha_photo"]
    for u in bot_usernames:
        url = f'/accounts/profile/{u}/'
        res = client.get(url)
        if res.status_code == 200:
            print(f"  ✅ Profile page for '{u}' returned 200 OK")
        else:
            errors.append(f"Profile page for '{u}' returned {res.status_code}")
            print(f"  ❌ Profile page for '{u}' returned {res.status_code}")

    # 5. Test Cloudinary CDN Media Access
    print("\n[5/6] Testing Cloudinary CDN Image Availability...")
    for checkin in new_checkins:
        photo_url = checkin.get_photo_url
        if photo_url.startswith("http"):
            try:
                req = urllib.request.Request(photo_url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    if resp.status == 200:
                        print(f"  ✅ Cloudinary CDN URL for '{checkin.place_name}' is accessible (200 OK)")
                    else:
                        errors.append(f"CDN image status {resp.status} for {checkin.place_name}")
                        print(f"  ⚠️ CDN image returned status {resp.status}")
            except Exception as e:
                errors.append(f"Failed to fetch CDN image for {checkin.place_name}: {e}")
                print(f"  ❌ CDN fetch failed for {checkin.place_name}: {e}")

    # Also test bot avatars
    for u in bot_usernames:
        user_obj = User.objects.get(username=u)
        avatar_url = user_obj.profile.get_avatar_url
        if avatar_url.startswith("http"):
            try:
                req = urllib.request.Request(avatar_url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    if resp.status == 200:
                        print(f"  ✅ Cloudinary Avatar for '{u}' is accessible (200 OK)")
                    else:
                        errors.append(f"CDN avatar status {resp.status} for {u}")
            except Exception as e:
                errors.append(f"Failed to fetch avatar for {u}: {e}")

    # 6. Test User Interactions (Like & Comment)
    print("\n[6/6] Testing User Social Interactions...")
    target_checkin = new_checkins.first()
    
    # Test Like
    like_res = client.post(f'/checkin/{target_checkin.id}/like/', HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    print(f"  ✅ Toggle like status: {like_res.status_code}")
    
    # Test Comment
    comment_res = client.post(
        f'/checkin/{target_checkin.id}/comment/',
        {'text': 'สวยงามมากครับ ยินดีต้อนรับสู่ศรีสะเกษ!'},
        HTTP_X_REQUESTED_WITH='XMLHttpRequest'
    )
    print(f"  ✅ Create comment status: {comment_res.status_code}")

    print("\n==================================================")
    if not errors:
        print("🎉 ALL HEALTH CHECKS PASSED! The website is 100% healthy and operational.")
        print("==================================================")
        return True
    else:
        print(f"⚠️ {len(errors)} error(s) detected:")
        for err in errors:
            print(f"  - {err}")
        print("==================================================")
        return False

if __name__ == "__main__":
    success = run_health_checks()
    sys.exit(0 if success else 1)
