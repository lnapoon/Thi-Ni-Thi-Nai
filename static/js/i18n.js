/**
 * Complete Internationalization (i18n) Engine for "Thi Ni Check-in"
 * Full-site bidirectional translation (Thai 🇹🇭 <-> English 🇬🇧)
 * Features:
 * - Direct data-i18n key-based lookup
 * - Intelligent Deep DOM Text Node & Attribute Auto-Translator
 * - Dynamic MutationObserver for AJAX-loaded contents (Comments, Modals, Feeds)
 * - Persistent choice in localStorage & Cookie
 */

const APP_TRANSLATIONS = {
  th: {
    // Brand & Header
    'brand_name': 'ที่นี่ Check-in',
    'brand_tagline': 'แบ่งปันสถานที่ที่คุณรัก',
    'nav_home': 'หน้าหลัก',
    'nav_map': 'แผนที่',
    'nav_search': 'ค้นหา',
    'nav_search_friends': 'ค้นหาเพื่อน',
    'nav_create_checkin': 'เช็คอินใหม่',
    'nav_profile': 'โปรไฟล์',
    'nav_my_profile': 'โปรไฟล์ของฉัน',
    'nav_edit_profile': 'แก้ไขข้อมูลและรูปโปรไฟล์',
    'nav_profile_settings': 'ตั้งค่าโปรไฟล์',
    'nav_about': 'เกี่ยวกับแอปพลิเคชัน',
    'nav_admin_dashboard': 'แดชบอร์ดจัดการระบบ (Admin)',
    'nav_login': 'เข้าสู่ระบบ',
    'nav_signup': 'สมัครสมาชิก',
    'nav_logout': 'ออกจากระบบ',
    'theme_toggle': 'สลับโหมดมืด/สว่าง',
    'lang_switch': 'เปลี่ยนภาษา',

    // Post Composer & Form
    'composer_title': 'สร้างโพสต์เช็คอินใหม่',
    'composer_caption_placeholder': 'เขียนบรรยาย หรือแชร์ความรู้สึกที่นี่...',
    'composer_place_placeholder': 'ชื่อสถานที่ / คาเฟ่ / แหล่งท่องเที่ยวที่นี่...',
    'composer_add_photo': 'เพิ่มรูปภาพ',
    'composer_change_photo': 'เปลี่ยนรูป',
    'composer_gps': 'พิกัด',
    'composer_post': 'โพสต์',
    'composer_posting': 'กำลังโพสต์...',
    'composer_tap_photo': 'แตะเพื่อถ่ายรูป หรือเลือกรูปภาพ',
    'composer_photo_tip': 'รองรับการเปิดกล้องถ่ายภาพสด หรือเลือกจากคลังรูปภาพในเครื่อง',
    'composer_source_title': 'เลือกวิธีเพิ่มรูปภาพ',
    'composer_source_desc': 'ระบบจะขออนุญาตเข้าถึงกล้องหรือคลังภาพในอุปกรณ์ของคุณ',
    'composer_source_gallery': 'เลือกจากคลังรูปภาพ (Gallery / Files)',
    'composer_source_gallery_sub': 'เลือกไฟล์รูปภาพที่มีอยู่แล้วในเครื่องของคุณ',
    'composer_source_camera': 'เปิดกล้องถ่ายรูป (Camera)',
    'composer_source_camera_sub': 'ถ่ายภาพสถานที่จริงสดๆ ด้วยกล้องของคุณทันที',
    'composer_snap': 'ถ่ายภาพ',
    'form_photo_label': 'รูปภาพสถานที่',
    'form_photo_hint': 'JPG, PNG, WEBP (สูงสุด 5 MB)',
    'form_location_header': 'ข้อมูลสถานที่และโซนพื้นที่',
    'form_location_desc': 'ระบุชื่อสถานที่ และเลือกโซนภาค/จังหวัดที่ตั้ง',
    'form_place_name_label': 'ชื่อสถานที่ / จุดเช็คอิน',
    'form_place_name_placeholder': 'เช่น วัดพระแก้ว, ถนนคนเดินท่าแพ, หาดไร่เลย์...',
    'form_region_label': 'ภูมิภาค',
    'form_province_label': 'จังหวัด',
    'form_gps_locating': 'กำลังจับพิกัด GPS...',
    'form_gps_refresh': 'จับพิกัดใหม่',
    'form_caption_label': 'ข้อความบรรยาย',
    'form_caption_placeholder': 'เล่าบรรยากาศ ความรู้สึก หรือสิ่งที่น่าประทับใจของที่นี่...',
    'form_btn_submit': 'สร้างจุดเช็คอิน',
    'form_btn_update': 'บันทึกการแก้ไข',
    'form_btn_cancel': 'ยกเลิก',
    'form_camera_title': 'ถ่ายรูปสถานที่',
    'form_camera_retake': 'ถ่ายใหม่',
    'form_camera_confirm': 'ใช้รูปนี้',

    // Post Actions & Card
    'action_like': 'ถูกใจ',
    'action_likes_count': 'ถูกใจ',
    'action_comment': 'ความคิดเห็น',
    'action_comments': 'ความคิดเห็น',
    'action_comments_count': 'รายการ',
    'action_view_all_comments': 'ดูความคิดเห็นทั้งหมด',
    'action_share': 'แชร์จุดเช็คอิน',
    'action_bookmark': 'บันทึกสถานที่',
    'action_edit': 'แก้ไข',
    'action_delete': 'ลบ',
    'action_follow': 'ติดตาม',
    'action_following': 'กำลังติดตาม',
    'action_gps_badge': 'พิกัด GPS',
    'action_open_gmaps': 'เปิด Google Maps',
    'action_back': 'ย้อนกลับ',

    // Comments Modal & Detail
    'comments_title': 'ความคิดเห็น',
    'comments_empty_title': 'ยังไม่มีความคิดเห็น',
    'comments_empty_desc': 'เป็นคนแรกที่แสดงความคิดเห็นเลย!',
    'comments_placeholder_prefix': 'แสดงความคิดเห็นในชื่อ',
    'comments_send': 'ส่ง',
    'comments_login_prompt': 'เข้าสู่ระบบเพื่อร่วมพูดคุยและแสดงความคิดเห็น',
    'comments_delete_confirm': 'คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?',
    'comments_delete_btn': 'ลบ',

    // Share Modal
    'share_modal_title': 'แชร์จุดเช็คอิน',
    'share_modal_desc': 'ส่งต่อสถานที่สวยๆ ให้เพื่อนๆ ของคุณ',
    'share_copy_link': 'คัดลอก',
    'share_copied': 'คัดลอกแล้ว',

    // Profile Page
    'profile_posts': 'โพสต์',
    'profile_followers': 'ผู้ติดตาม',
    'profile_following': 'กำลังติดตาม',
    'profile_tab_posts': 'โพสต์ของฉัน',
    'profile_tab_saved': 'บันทึกไว้',
    'profile_tab_tagged': 'แท็ก',
    'profile_empty_posts': 'ยังไม่มีโพสต์เช็คอิน',
    'profile_empty_saved': 'ยังไม่ได้บันทึกสถานที่ใดไว้',
    'profile_empty_tagged': 'ยังไม่มีรูปที่ถูกแท็ก',
    'profile_website': 'เว็บไซต์',
    'profile_fav_music': 'เพลงโปรด',
    'profile_edit_btn': 'แก้ไขโปรไฟล์',
    'profile_share_btn': 'แชร์โปรไฟล์',

    // Edit Profile Page
    'edit_profile_title': 'แก้ไขข้อมูลโปรไฟล์',
    'edit_profile_user_info': 'ข้อมูลผู้ใช้',
    'edit_profile_display_name': 'ชื่อที่แสดง (Display Name)',
    'edit_profile_bio': 'ข้อความแนะนำตัว (Bio)',
    'edit_profile_category': 'หมวดหมู่ / MBTI / สถานะ',
    'edit_profile_social_links': 'ลิงก์ภายนอก / โซเชียล',
    'edit_profile_website_title': 'ชื่อปุ่ม/โซเชียล',
    'edit_profile_website_url': 'URL ลิงก์',
    'edit_profile_music_header': 'เพลงโปรด / แท็กเสียง',
    'edit_profile_music_title': 'ชื่อเพลง / ข้อความเสียง',
    'edit_profile_music_url': 'URL ลิงก์เพลง (Optional)',
    'edit_profile_avatar_header': 'รูปภาพโปรไฟล์',
    'edit_profile_avatar_change': 'เปลี่ยนรูปโปรไฟล์ใหม่',
    'edit_profile_email': 'อีเมล',
    'edit_profile_save': 'บันทึกการเปลี่ยนแปลง',
    'edit_profile_cancel': 'ยกเลิก',

    // Search Page
    'search_title': 'ค้นหาผู้ใช้งาน (Search Users)',
    'search_subtitle': 'ค้นหาเพื่อนหรือคนที่คุณสนใจเพื่อติดตามดูจุดเช็คอิน',
    'search_placeholder': 'พิมพ์ชื่อผู้ใช้ (@username) หรือชื่อเพื่อน...',
    'search_suggested_header': 'ผู้ใช้แนะนำสำหรับคุณ (Suggested)',
    'search_results_for': 'ผลการค้นหาสำหรับ',
    'search_see_suggested': 'ดูผู้ใช้แนะนำ',
    'search_empty_title': 'ไม่พบผู้ใช้งานที่ตรงกับการค้นหา',
    'search_empty_desc': 'ลองค้นหาด้วยชื่อผู้ใช้ (@username) หรือคำอื่นดูนะครับ',
    'search_checkin_unit': 'เช็คอิน',
    'search_follower_unit': 'ผู้ติดตาม',

    // Map Page
    'map_title': 'สำรวจจุดเช็คอินตามโซนและจังหวัด',
    'map_subtitle': 'เลือกโซนภูมิภาคและเจาะลึกรายจังหวัดเพื่อดูสถานที่ท่องเที่ยวยอดนิยม',
    'map_stat_pins': 'จุดบนแผนที่',
    'map_checkin_here': 'เช็คอินที่นี่',
    'map_filter_region_title': 'เลือกภูมิภาค (Region):',
    'map_reset_filters': 'รีเซ็ตตัวกรอง',
    'map_all_regions': 'ทุกภูมิภาค',
    'map_all_provinces_in_zone': '-- เจาะจงทุกจังหวัดในโซน --',
    'map_search_placeholder': 'ค้นหาชื่อสถานที่ หรือคำบรรยาย...',
    'map_btn_zoom': 'ซูมตำแหน่ง',
    'map_view_detail': 'ดูรายละเอียดจุดเช็คอิน',
    'map_close_drawer': 'ปิด',

    // Auth Pages
    'auth_login_welcome': 'ยินดีต้อนรับกลับมา',
    'auth_login_welcome_sub': 'เข้าสู่ระบบเพื่อแชร์และดูจุดเช็คอินของเพื่อนๆ',
    'auth_signup_welcome': 'สร้างบัญชีผู้ใช้ใหม่',
    'auth_signup_welcome_sub': 'สมัครสมาชิกง่ายๆ เพียงตั้งชื่อผู้ใช้และรหัสผ่าน',
    'auth_username_label': 'ชื่อผู้ใช้ (Username)',
    'auth_username_placeholder': 'ระบุชื่อผู้ใช้',
    'auth_email_label': 'อีเมล (Email)',
    'auth_password_label': 'รหัสผ่าน (Password)',
    'auth_password_placeholder': 'ระบุรหัสผ่าน',
    'auth_forgot_password': 'ลืมรหัสผ่าน?',
    'auth_password_confirm_label': 'ยืนยันรหัสผ่าน',
    'auth_or_login_with': 'หรือเข้าสู่ระบบด้วย',
    'auth_or_signup_with': 'หรือเชื่อมต่อด้วย',
    'auth_google_login': 'เข้าสู่ระบบด้วย Google',
    'auth_github_login': 'เข้าสู่ระบบด้วย GitHub',
    'auth_no_account': 'ยังไม่มีบัญชีผู้ใช้?',
    'auth_have_account': 'มีบัญชีผู้ใช้แล้ว?',
    'auth_signup_here': 'สมัครสมาชิกที่นี่',
    'auth_login_here': 'เข้าสู่ระบบที่นี่',
    'auth_pdpa_agree': 'ฉันยอมรับ ข้อกำหนดการใช้งานและนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
    'auth_signup_submit': 'ยืนยันการสมัครสมาชิก',

    // Auth Modal
    'auth_login_title': 'เข้าสู่ระบบเพื่อใช้งาน',
    'auth_login_desc': 'เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อสร้างโพสต์เช็คอิน กดถูกใจ แสดงความคิดเห็น และบันทึกสถานที่โปรดของคุณ',
    'auth_btn_login': 'เข้าสู่ระบบ',
    'auth_btn_signup': 'สมัครสมาชิกใหม่ (ฟรี)',
    'auth_btn_later': 'ไว้ทีหลัง',

    // Delete Confirmation Page / Modal
    'delete_confirm_title': 'ยืนยันการลบเช็คอิน?',
    'delete_confirm_desc': 'การกระทำนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่ว่าต้องการลบเช็คอินนี้?',
    'delete_btn_confirm': 'ยืนยันการลบ',

    // About Page
    'about_title': 'เกี่ยวกับแอปพลิเคชัน',
    'about_back_to_settings': 'กลับไปการตั้งค่า',
    'about_slogan': 'แพลตฟอร์มคอมมูนิตี้ท่องเที่ยวและเช็คอินสถานที่จริง แบ่งปันภาพถ่าย พิกัด GPS และเรื่องราวการเดินทางทั่วไทย',
    'about_feat1_title': 'อัปโหลดภาพถ่ายเก็บไว้บน Cloudinary Storage ปลอดภัย',
    'about_feat1_desc': 'จัดเก็บและประมวลผลรูปภาพความเร็วสูง พร้อมระบบสำรองข้อมูลบน Cloud',
    'about_feat2_title': 'ดึงพิกัด Geolocation อัตโนมัติและแสดงบนแผนที่ Leaflet',
    'about_feat2_desc': 'ระบุตำแหน่งสถานที่จริงด้วย GPS และแสดงหมุดจุดเช็คอินบนแผนที่แบบ Interactive',
    'about_feat3_title': 'ฐานข้อมูลความเร็วสูง Neon PostgreSQL Cloud Database',
    'about_feat3_desc': 'เชื่อมต่อฐานข้อมูลระบบคลาวด์ เสถียร และรองรับการค้นหาพิกัดพื้นที่อย่างรวดเร็ว',
    'about_team_title': 'พัฒนาโดยทีม CS68',
    'about_team_desc': 'ผู้รับผิดชอบและออกแบบแอปพลิเคชัน',

    // Error Pages
    'error_404_title': '404 - ไม่พบหน้าที่คุณค้นหา',
    'error_404_desc': 'หน้าที่คุณพยายามเปิดอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ',
    'error_403_title': '403 - ไม่มีสิทธิ์เข้าถึง',
    'error_403_desc': 'ขออภัย คุณไม่มีสิทธิ์ในการเข้าถึง ดัดแปลง หรือลบข้อมูลส่วนนี้ (สงวนสิทธิ์เฉพาะเจ้าของโพสต์เท่านั้น)',
    'error_500_title': '500 - เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
    'error_500_desc': 'ระบบพบปัญหาชั่วคราวในการประมวลผล กรุณาลองใหม่อีกครั้งในภายหลัง',
    'error_back_home': 'กลับสู่หน้าหลัก',

    // Toast Notifications
    'toast_liked': 'ถูกใจสถานที่นี้แล้ว',
    'toast_unliked': 'ยกเลิกถูกใจแล้ว',
    'toast_saved': 'บันทึกไปยังคอลเลกชันแล้ว',
    'toast_unsaved': 'นำออกจากรายการบันทึกแล้ว',
    'toast_comment_success': 'แสดงความคิดเห็นเรียบร้อย',
    'toast_comment_deleted': 'ลบความคิดเห็นเรียบร้อยแล้ว',
    'toast_link_copied': 'คัดลอกลิงก์สำเร็จแล้ว',
    'toast_followed': 'ติดตามแล้ว',
    'toast_unfollowed': 'เลิกติดตามแล้ว',
  },

  en: {
    // Brand & Header
    'brand_name': 'Thi-Ni Check-in',
    'brand_tagline': 'Share places you love',
    'nav_home': 'Home',
    'nav_map': 'Map',
    'nav_search': 'Search',
    'nav_search_friends': 'Find Friends',
    'nav_create_checkin': 'New Check-in',
    'nav_profile': 'Profile',
    'nav_my_profile': 'My Profile',
    'nav_edit_profile': 'Edit Profile & Avatar',
    'nav_profile_settings': 'Profile Settings',
    'nav_about': 'About Application',
    'nav_admin_dashboard': 'Admin Dashboard',
    'nav_login': 'Log In',
    'nav_signup': 'Sign Up',
    'nav_logout': 'Log Out',
    'theme_toggle': 'Toggle Dark/Light Mode',
    'lang_switch': 'Change Language',

    // Post Composer & Form
    'composer_title': 'Create New Check-in',
    'composer_caption_placeholder': 'Write a caption, or share your thoughts here...',
    'composer_place_placeholder': 'Place name / Cafe / Attraction name...',
    'composer_add_photo': 'Add Photo',
    'composer_change_photo': 'Change Photo',
    'composer_gps': 'GPS',
    'composer_post': 'Post',
    'composer_posting': 'Posting...',
    'composer_tap_photo': 'Tap to take a photo or select an image',
    'composer_photo_tip': 'Supports live camera capture or choosing from your photo gallery',
    'composer_source_title': 'Choose How to Add Photo',
    'composer_source_desc': 'The app will request permission to access your camera or photo gallery',
    'composer_source_gallery': 'Choose from Photo Gallery (Gallery / Files)',
    'composer_source_gallery_sub': 'Select existing photos from your device',
    'composer_source_camera': 'Open Camera (Camera)',
    'composer_source_camera_sub': 'Take live photos of the place right now',
    'composer_snap': 'Take Photo',
    'form_photo_label': 'Place Photo',
    'form_photo_hint': 'JPG, PNG, WEBP (Max 5 MB)',
    'form_location_header': 'Location and Zone Information',
    'form_location_desc': 'Specify place name and select region / province',
    'form_place_name_label': 'Place Name / Check-in Spot',
    'form_place_name_placeholder': 'e.g. Wat Phra Kaew, Tha Phae Walking Street, Railay Beach...',
    'form_region_label': 'Region',
    'form_province_label': 'Province',
    'form_gps_locating': 'Locating GPS coordinates...',
    'form_gps_refresh': 'Refresh GPS',
    'form_caption_label': 'Caption / Description',
    'form_caption_placeholder': 'Share the atmosphere, feelings, or highlights of this place...',
    'form_btn_submit': 'Create Check-in',
    'form_btn_update': 'Save Changes',
    'form_btn_cancel': 'Cancel',
    'form_camera_title': 'Take Place Photo',
    'form_camera_retake': 'Retake',
    'form_camera_confirm': 'Use This Photo',

    // Post Actions & Card
    'action_like': 'Like',
    'action_likes_count': 'likes',
    'action_comment': 'Comments',
    'action_comments': 'Comments',
    'action_comments_count': 'comments',
    'action_view_all_comments': 'View all comments',
    'action_share': 'Share Check-in',
    'action_bookmark': 'Save Place',
    'action_edit': 'Edit',
    'action_delete': 'Delete',
    'action_follow': 'Follow',
    'action_following': 'Following',
    'action_gps_badge': 'GPS Coordinates',
    'action_open_gmaps': 'Open Google Maps',
    'action_back': 'Back',

    // Comments Modal & Detail
    'comments_title': 'Comments',
    'comments_empty_title': 'No comments yet',
    'comments_empty_desc': 'Be the first to share your thoughts!',
    'comments_placeholder_prefix': 'Comment as',
    'comments_send': 'Send',
    'comments_login_prompt': 'Log in to join the conversation and comment',
    'comments_delete_confirm': 'Are you sure you want to delete this comment?',
    'comments_delete_btn': 'Delete',

    // Share Modal
    'share_modal_title': 'Share Check-in',
    'share_modal_desc': 'Share beautiful places with your friends',
    'share_copy_link': 'Copy',
    'share_copied': 'Copied',

    // Profile Page
    'profile_posts': 'posts',
    'profile_followers': 'followers',
    'profile_following': 'following',
    'profile_tab_posts': 'My Posts',
    'profile_tab_saved': 'Saved',
    'profile_tab_tagged': 'Tagged',
    'profile_empty_posts': 'No check-in posts yet',
    'profile_empty_saved': 'No saved places yet',
    'profile_empty_tagged': 'No tagged photos yet',
    'profile_website': 'Website',
    'profile_fav_music': 'Favorite Music',
    'profile_edit_btn': 'Edit profile',
    'profile_share_btn': 'Share profile',

    // Edit Profile Page
    'edit_profile_title': 'Edit Profile Information',
    'edit_profile_user_info': 'User Information',
    'edit_profile_display_name': 'Display Name',
    'edit_profile_bio': 'Bio / Introduction',
    'edit_profile_category': 'Category / MBTI / Status',
    'edit_profile_social_links': 'External / Social Links',
    'edit_profile_website_title': 'Button / Social Title',
    'edit_profile_website_url': 'Link URL',
    'edit_profile_music_header': 'Favorite Music / Audio Tag',
    'edit_profile_music_title': 'Song Title / Audio Label',
    'edit_profile_music_url': 'Music URL Link (Optional)',
    'edit_profile_avatar_header': 'Profile Picture',
    'edit_profile_avatar_change': 'Change Profile Picture',
    'edit_profile_email': 'Email Address',
    'edit_profile_save': 'Save Changes',
    'edit_profile_cancel': 'Cancel',

    // Search Page
    'search_title': 'Search Users',
    'search_subtitle': 'Search friends or people you are interested in to see their check-ins',
    'search_placeholder': 'Type username (@username) or friend name...',
    'search_suggested_header': 'Suggested Users for You',
    'search_results_for': 'Search results for',
    'search_see_suggested': 'View Suggested Users',
    'search_empty_title': 'No users found matching your search',
    'search_empty_desc': 'Try searching by username (@username) or other keywords',
    'search_checkin_unit': 'check-ins',
    'search_follower_unit': 'followers',

    // Map Page
    'map_title': 'Explore Check-ins by Zone and Province',
    'map_subtitle': 'Select a region or drill down by province to discover top travel spots',
    'map_stat_pins': 'points on map',
    'map_checkin_here': 'Check-in Here',
    'map_filter_region_title': 'Select Region:',
    'map_reset_filters': 'Reset Filters',
    'map_all_regions': 'All Regions',
    'map_all_provinces_in_zone': '-- All Provinces in Zone --',
    'map_search_placeholder': 'Search place name or caption...',
    'map_btn_zoom': 'Zoom Location',
    'map_view_detail': 'View Check-in Details',
    'map_close_drawer': 'Close',

    // Auth Pages
    'auth_login_welcome': 'Welcome Back',
    'auth_login_welcome_sub': 'Log in to share and explore friends check-ins',
    'auth_signup_welcome': 'Create New Account',
    'auth_signup_welcome_sub': 'Sign up quickly by setting username and password',
    'auth_username_label': 'Username',
    'auth_username_placeholder': 'Enter your username',
    'auth_email_label': 'Email Address',
    'auth_password_label': 'Password',
    'auth_password_placeholder': 'Enter your password',
    'auth_forgot_password': 'Forgot password?',
    'auth_password_confirm_label': 'Confirm Password',
    'auth_or_login_with': 'Or log in with',
    'auth_or_signup_with': 'Or connect with',
    'auth_google_login': 'Log in with Google',
    'auth_github_login': 'Log in with GitHub',
    'auth_no_account': 'Do not have an account?',
    'auth_have_account': 'Already have an account?',
    'auth_signup_here': 'Sign up here',
    'auth_login_here': 'Log in here',
    'auth_pdpa_agree': 'I agree to the Terms of Service & Privacy Policy (PDPA)',
    'auth_signup_submit': 'Confirm Registration',

    // Auth Modal
    'auth_login_title': 'Log In to Continue',
    'auth_login_desc': 'Log in or sign up for free to share check-ins, like, comment, and save your favorite travel spots.',
    'auth_btn_login': 'Log In',
    'auth_btn_signup': 'Sign Up (Free)',
    'auth_btn_later': 'Maybe Later',

    // Delete Confirmation Page / Modal
    'delete_confirm_title': 'Confirm Check-in Deletion?',
    'delete_confirm_desc': 'This action cannot be undone. Are you sure you want to delete this check-in?',
    'delete_btn_confirm': 'Confirm Delete',

    // About Page
    'about_title': 'About Application',
    'about_back_to_settings': 'Back to Settings',
    'about_slogan': 'A travel community platform for sharing authentic check-ins, photos, GPS coordinates, and journey stories across Thailand.',
    'about_feat1_title': 'Secure photo storage powered by Cloudinary Storage',
    'about_feat1_desc': 'High-speed image processing and storage with cloud backup redundancy',
    'about_feat2_title': 'Auto Geolocation retrieval & Interactive Leaflet Map',
    'about_feat2_desc': 'Pinpoint authentic coordinates via GPS and view check-in markers on dynamic maps',
    'about_feat3_title': 'High-performance Neon PostgreSQL Cloud Database',
    'about_feat3_desc': 'Connected to cloud database with high availability and fast geospatial queries',
    'about_team_title': 'Developed by CS68 Team',
    'about_team_desc': 'Application Designers and Engineering Team',

    // Error Pages
    'error_404_title': '404 - Page Not Found',
    'error_404_desc': 'The page you are looking for might have been moved, deleted, or does not exist.',
    'error_403_title': '403 - Access Forbidden',
    'error_403_desc': 'Sorry, you do not have permission to access, edit, or delete this item.',
    'error_500_title': '500 - Internal Server Error',
    'error_500_desc': 'The server encountered a temporary error. Please try again later.',
    'error_back_home': 'Back to Home',

    // Toast Notifications
    'toast_liked': 'Liked this place',
    'toast_unliked': 'Unliked',
    'toast_saved': 'Saved to your collection',
    'toast_unsaved': 'Removed from saved',
    'toast_comment_success': 'Comment added successfully',
    'toast_comment_deleted': 'Comment deleted successfully',
    'toast_link_copied': 'Link copied to clipboard',
    'toast_followed': 'Followed successfully',
    'toast_unfollowed': 'Unfollowed',
  }
};

/**
 * Universal Bidirectional Phrase Dictionary (Thai <-> English)
 * Scans DOM text nodes and attributes across ANY page to guarantee 100% coverage
 */
const AUTO_PHRASES = [
  { th: 'หน้าหลัก', en: 'Home' },
  { th: 'แผนที่', en: 'Map' },
  { th: 'ค้นหาผู้ใช้งาน (Search Users)', en: 'Search Users' },
  { th: 'ค้นหาผู้ใช้งาน', en: 'Search Users' },
  { th: 'ค้นหาเพื่อนและผู้ใช้งาน', en: 'Find Friends & Users' },
  { th: 'ค้นหาเพื่อนหรือคนที่คุณสนใจเพื่อติดตามดูจุดเช็คอิน', en: 'Search friends or people you are interested in to see their check-ins' },
  { th: 'พิมพ์ชื่อผู้ใช้ (@username) หรือชื่อเพื่อน...', en: 'Type username (@username) or friend name...' },
  { th: 'ผู้ใช้แนะนำสำหรับคุณ (Suggested)', en: 'Suggested Users for You' },
  { th: 'ผู้ใช้แนะนำสำหรับคุณ', en: 'Suggested Users for You' },
  { th: 'ดูผู้ใช้แนะนำ', en: 'View Suggested Users' },
  { th: 'ไม่พบผู้ใช้งานที่ตรงกับการค้นหา', en: 'No users found matching your search' },
  { th: 'ลองค้นหาด้วยชื่อผู้ใช้ (@username) หรือคำอื่นดูนะครับ', en: 'Try searching by username (@username) or other keywords' },
  { th: 'ลองพิมพ์ชื่อผู้ใช้ใหม่ หรือค้นหาคำอื่นดูนะครับ', en: 'Try typing a new username or search other terms' },
  { th: 'ค้นหาเพื่อน', en: 'Find Friends' },
  { th: 'ค้นหา', en: 'Search' },
  { th: 'เช็คอินใหม่', en: 'New Check-in' },
  { th: 'สร้างจุดเช็คอิน', en: 'Create Check-in' },
  { th: 'สร้างจุดเช็คอินใหม่', en: 'Create New Check-in' },
  { th: 'โปรไฟล์ของฉัน', en: 'My Profile' },
  { th: 'โปรไฟล์', en: 'Profile' },
  { th: 'แก้ไขข้อมูลและรูปโปรไฟล์', en: 'Edit Profile & Avatar' },
  { th: 'แก้ไขโปรไฟล์', en: 'Edit Profile' },
  { th: 'แก้ไขข้อมูลโปรไฟล์', en: 'Edit Profile Information' },
  { th: 'ตั้งค่าโปรไฟล์', en: 'Profile Settings' },
  { th: 'เกี่ยวกับแอปพลิเคชัน', en: 'About Application' },
  { th: 'แดชบอร์ดจัดการระบบ (Admin)', en: 'Admin Dashboard' },
  { th: 'เข้าสู่ระบบ', en: 'Log In' },
  { th: 'สมัครสมาชิก', en: 'Sign Up' },
  { th: 'สมัคร', en: 'Sign Up' },
  { th: 'ออกจากระบบ', en: 'Log Out' },
  { th: 'ยินดีต้อนรับกลับมา', en: 'Welcome Back' },
  { th: 'สร้างบัญชีผู้ใช้ใหม่', en: 'Create New Account' },
  { th: 'ชื่อผู้ใช้ (Username)', en: 'Username' },
  { th: 'ชื่อผู้ใช้', en: 'Username' },
  { th: 'รหัสผ่าน (Password)', en: 'Password' },
  { th: 'รหัสผ่าน', en: 'Password' },
  { th: 'ยืนยันรหัสผ่าน', en: 'Confirm Password' },
  { th: 'อีเมล (Email)', en: 'Email Address' },
  { th: 'อีเมล', en: 'Email Address' },
  { th: 'ระบุชื่อผู้ใช้', en: 'Enter your username' },
  { th: 'ระบุรหัสผ่าน', en: 'Enter your password' },
  { th: 'ยืนยันการสมัครสมาชิก', en: 'Confirm Registration' },
  { th: 'หรือเข้าสู่ระบบด้วย', en: 'Or log in with' },
  { th: 'หรือเชื่อมต่อด้วย', en: 'Or connect with' },
  { th: 'เข้าสู่ระบบด้วย Google', en: 'Log in with Google' },
  { th: 'เข้าสู่ระบบด้วย GitHub', en: 'Log in with GitHub' },
  { th: 'ดำเนินการต่อด้วย Google', en: 'Continue with Google' },
  { th: 'ดำเนินการต่อด้วย GitHub', en: 'Continue with GitHub' },
  { th: 'ยังไม่มีบัญชีผู้ใช้?', en: 'Do not have an account?' },
  { th: 'สมัครสมาชิกที่นี่', en: 'Sign up here' },
  { th: 'มีบัญชีผู้ใช้แล้ว?', en: 'Already have an account?' },
  { th: 'เข้าสู่ระบบที่นี่', en: 'Log in here' },
  { th: 'โพสต์', en: 'Post' },
  { th: 'กำลังโพสต์...', en: 'Posting...' },
  { th: 'เพิ่มรูปภาพ', en: 'Add Photo' },
  { th: 'เปลี่ยนรูป', en: 'Change Photo' },
  { th: 'แตะเพื่อเปลี่ยนรูป', en: 'Tap to change photo' },
  { th: 'รูปภาพปัจจุบัน', en: 'Current Photo' },
  { th: 'เลือกรูปภาพแล้ว', en: 'Photo Selected' },
  { th: 'รูปภาพสถานที่', en: 'Place Photo' },
  { th: 'ข้อมูลสถานที่และโซนพื้นที่', en: 'Location and Zone Info' },
  { th: 'ระบุชื่อสถานที่ และเลือกโซนภาค/จังหวัดที่ตั้ง', en: 'Specify place name and select region / province' },
  { th: 'ชื่อสถานที่ / จุดเช็คอิน', en: 'Place Name / Check-in Spot' },
  { th: 'ภูมิภาค', en: 'Region' },
  { th: 'จังหวัด', en: 'Province' },
  { th: 'กำลังจับพิกัด GPS...', en: 'Locating GPS coordinates...' },
  { th: 'จับพิกัดใหม่', en: 'Refresh GPS' },
  { th: 'ข้อความบรรยาย', en: 'Caption / Description' },
  { th: 'เล่าบรรยากาศ ความรู้สึก หรือสิ่งที่น่าประทับใจของที่นี่...', en: 'Share the atmosphere, feelings, or highlights of this place...' },
  { th: 'เลือกวิธีเพิ่มรูปภาพ', en: 'Choose Photo Source' },
  { th: 'ระบบจะขออนุญาตเข้าถึงกล้องหรือคลังภาพในอุปกรณ์ของคุณ', en: 'The app will request camera or photo library access' },
  { th: 'เปิดกล้องถ่ายรูป (Camera)', en: 'Open Camera (Camera)' },
  { th: 'ถ่ายภาพสถานที่จริงสดๆ ด้วยกล้องของคุณทันที', en: 'Take live photos with your camera instantly' },
  { th: 'เลือกจากคลังรูปภาพ (Gallery / Files)', en: 'Choose from Photo Gallery (Gallery / Files)' },
  { th: 'เลือกไฟล์รูปภาพที่มีอยู่แล้วในเครื่องของคุณ', en: 'Select existing photos from your device' },
  { th: 'ถ่ายรูปสถานที่', en: 'Take Place Photo' },
  { th: 'กำลังเปิดกล้อง...', en: 'Starting camera...' },
  { th: 'สลับกล้องหน้า/หลัง', en: 'Switch camera front/back' },
  { th: 'กดถ่ายรูป', en: 'Snap photo' },
  { th: 'เปิดแอปกล้องของเครื่อง', en: 'Open device camera app' },
  { th: 'ถ่ายใหม่', en: 'Retake' },
  { th: 'ใช้รูปนี้', en: 'Use This Photo' },
  { th: 'พิกัด', en: 'GPS' },
  { th: 'พิกัด GPS', en: 'GPS Coordinates' },
  { th: 'เปิด Google Maps', en: 'Open Google Maps' },
  { th: 'ถูกใจ', en: 'Like' },
  { th: 'ความคิดเห็น', en: 'Comments' },
  { th: 'ดูความคิดเห็นทั้งหมด', en: 'View all comments' },
  { th: 'รายการ', en: 'comments' },
  { th: 'คน', en: 'people' },
  { th: 'บันทึกสถานที่', en: 'Save Place' },
  { th: 'บันทึกไว้', en: 'Saved' },
  { th: 'แท็ก', en: 'Tagged' },
  { th: 'โพสต์ของฉัน', en: 'My Posts' },
  { th: 'ผู้ติดตาม', en: 'Followers' },
  { th: 'กำลังติดตาม', en: 'Following' },
  { th: 'ติดตาม', en: 'Follow' },
  { th: 'เลิกติดตาม', en: 'Unfollow' },
  { th: 'แชร์จุดเช็คอิน', en: 'Share Check-in' },
  { th: 'แชร์โปรไฟล์', en: 'Share profile' },
  { th: 'Share profile', en: 'Share profile' },
  { th: 'Edit profile', en: 'Edit profile' },
  { th: 'Following', en: 'Following' },
  { th: 'Follow', en: 'Follow' },
  { th: 'คัดลอก', en: 'Copy' },
  { th: 'คัดลอกแล้ว', en: 'Copied' },
  { th: 'คัดลอกลิงก์', en: 'Copy Link' },
  { th: 'ลบ', en: 'Delete' },
  { th: 'แก้ไข', en: 'Edit' },
  { th: 'ยกเลิก', en: 'Cancel' },
  { th: 'บันทึกการเปลี่ยนแปลง', en: 'Save Changes' },
  { th: 'บันทึกข้อมูล', en: 'Save Information' },
  { th: 'บันทึก', en: 'Save' },
  { th: 'ส่ง', en: 'Send' },
  { th: 'ไว้ทีหลัง', en: 'Maybe Later' },
  { th: 'ยินยอมทั้งหมด', en: 'Accept All' },
  { th: 'อ่านนโยบาย', en: 'Read Policy' },
  { th: 'รับทราบและเข้าใจแล้ว', en: 'I understand' },
  { th: 'กลับไปการตั้งค่า', en: 'Back to Settings' },
  { th: 'ย้อนกลับ', en: 'Back' },
  { th: 'ผู้ใช้น่าติดตาม', en: 'Recommended Users' },
  { th: 'ไม่พบข้อมูลที่ค้นหา', en: 'No results found' },
  { th: 'ทุกจังหวัด', en: 'All Provinces' },
  { th: 'เลือกภูมิภาค (Region):', en: 'Select Region:' },
  { th: 'เลือกภูมิภาค', en: 'Select Region' },
  { th: 'รีเซ็ตตัวกรอง', en: 'Reset Filters' },
  { th: 'ทุกภูมิภาค', en: 'All Regions' },
  { th: '-- เจาะจงทุกจังหวัดในโซน --', en: '-- All Provinces in Zone --' },
  { th: 'ค้นหาชื่อสถานที่ หรือคำบรรยาย...', en: 'Search place name or caption...' },
  { th: 'ซูมตำแหน่ง', en: 'Zoom Location' },
  { th: 'จุดบนแผนที่', en: 'points on map' },
  { th: 'เช็คอินที่นี่', en: 'Check-in Here' },
  { th: 'สำรวจจุดเช็คอินตามโซนและจังหวัด', en: 'Explore Check-ins by Zone and Province' },
  { th: 'เลือกโซนภูมิภาคและเจาะลึกรายจังหวัดเพื่อดูสถานที่ท่องเที่ยวยอดนิยม', en: 'Select a region or drill down by province to discover top travel spots' },
  { th: 'ยังไม่มีโพสต์เช็คอิน', en: 'No check-in posts yet' },
  { th: 'ยังไม่ได้บันทึกสถานที่ใดไว้', en: 'No saved places yet' },
  { th: 'ยังไม่มีรูปที่ถูกแท็ก', en: 'No tagged photos yet' },
  { th: 'ชื่อที่แสดง (Display Name)', en: 'Display Name' },
  { th: 'ข้อความแนะนำตัว (Bio)', en: 'Bio / Introduction' },
  { th: 'หมวดหมู่ / MBTI / สถานะ', en: 'Category / MBTI / Status' },
  { th: 'ลิงก์ภายนอก / โซเชียล', en: 'External / Social Links' },
  { th: 'ชื่อปุ่ม/โซเชียล', en: 'Button / Social Title' },
  { th: 'URL ลิงก์', en: 'Link URL' },
  { th: 'เพลงโปรด / แท็กเสียง', en: 'Favorite Music / Audio Tag' },
  { th: 'ชื่อเพลง / ข้อความเสียง', en: 'Song Title / Audio Label' },
  { th: 'รูปภาพโปรไฟล์', en: 'Profile Picture' },
  { th: 'เปลี่ยนรูปโปรไฟล์ใหม่', en: 'Change Profile Picture' },
  { th: 'เขียนบรรยาย หรือแชร์ความรู้สึกที่นี่...', en: 'Write a caption, or share your thoughts here...' },
  { th: 'ชื่อสถานที่ / คาเฟ่ / แหล่งท่องเที่ยวที่นี่...', en: 'Place name / Cafe / Attraction name...' },
  { th: 'ค้นหาชื่อผู้ใช้, ชื่อสถานที่, จังหวัด...', en: 'Search username, place name, province...' },
  { th: 'แสดงความคิดเห็นต่อสถานที่นี้...', en: 'Share your thoughts on this place...' },
  { th: 'เขียนความคิดเห็นของคุณ...', en: 'Write a comment...' },
  { th: 'แตะเพื่อถ่ายรูป หรือเลือกรูปภาพ', en: 'Tap to take a photo or select an image' },
  { th: 'เลือกจากคลังรูปภาพ', en: 'Choose from Photo Gallery' },
  { th: 'เปิดกล้องถ่ายภาพ', en: 'Open Live Camera' },
  { th: 'ถ่ายภาพ', en: 'Take Photo' },
  { th: 'สลับกล้อง', en: 'Flip Camera' },
  { th: 'ปิดกล้อง', en: 'Close Camera' },
  { th: 'ปิด', en: 'Close' },
  { th: 'ยืนยันการลบเช็คอิน?', en: 'Confirm Check-in Deletion?' },
  { th: 'ยืนยันการลบเช็คอิน', en: 'Confirm Check-in Deletion' },
  { th: 'การกระทำนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่ว่าต้องการลบเช็คอินนี้?', en: 'This action cannot be undone. Are you sure you want to delete this check-in?' },
  { th: 'ยืนยันการลบ', en: 'Confirm Delete' },
  { th: 'กลับสู่หน้าหลัก', en: 'Back to Home' },
  { th: '404 - ไม่พบหน้าที่คุณค้นหา', en: '404 - Page Not Found' },
  { th: 'หน้าที่คุณพยายามเปิดอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ', en: 'The page you are looking for might have been moved, deleted, or does not exist.' },
  { th: '403 - ไม่มีสิทธิ์เข้าถึง', en: '403 - Access Forbidden' },
  { th: '500 - เกิดข้อผิดพลาดของเซิร์ฟเวอร์', en: '500 - Internal Server Error' },
  { th: 'ระบบพบปัญหาชั่วคราวในการประมวลผล กรุณาลองใหม่อีกครั้งในภายหลัง', en: 'The server encountered a temporary error. Please try again later.' },
  { th: 'พัฒนาโดยทีม CS68', en: 'Developed by CS68 Team' },
  { th: 'ผู้รับผิดชอบและออกแบบแอปพลิเคชัน', en: 'Application Designers and Engineering Team' },
  { th: 'อัปโหลดภาพถ่ายเก็บไว้บน Cloudinary Storage ปลอดภัย', en: 'Secure photo storage powered by Cloudinary Storage' },
  { th: 'ดึงพิกัด Geolocation อัตโนมัติและแสดงบนแผนที่ Leaflet', en: 'Auto Geolocation retrieval & Interactive Leaflet Map' },
  { th: 'ฐานข้อมูลความเร็วสูง Neon PostgreSQL Cloud Database', en: 'High-performance Neon PostgreSQL Cloud Database' },
  { th: 'เข้าสู่ระบบเพื่อร่วมพูดคุยและแสดงความคิดเห็น', en: 'Log in to join the conversation and comment' },
  { th: 'เข้าสู่ระบบ / สมัครสมาชิก', en: 'Log In / Sign Up' },
  { th: 'ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นเลย!', en: 'No comments yet. Be the first to comment!' },
  { th: 'ที่แล้ว', en: 'ago' },
];

class I18nManager {
  constructor() {
    this.currentLang = this.getInitialLanguage();
    this.originalNodes = new WeakMap();
  }

  getInitialLanguage() {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'en' || saved === 'th') return saved;

    const cookieMatch = document.cookie.match(/(^|;)\s*app_lang=([^;]+)/);
    if (cookieMatch && (cookieMatch[2] === 'en' || cookieMatch[2] === 'th')) {
      return cookieMatch[2];
    }

    return 'th'; // Default to Thai
  }

  t(key, fallback = '') {
    const langDict = APP_TRANSLATIONS[this.currentLang] || APP_TRANSLATIONS['th'];
    return langDict[key] || fallback || key;
  }

  setLanguage(lang) {
    if (lang !== 'th' && lang !== 'en') return;
    this.currentLang = lang;
    localStorage.setItem('app_lang', lang);
    document.cookie = `app_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.setAttribute('lang', lang);

    this.updateLanguageButtons();
    this.translateEntireDocument();

    // Dispatch global event for other modules
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  }

  updateLanguageButtons() {
    document.querySelectorAll('.btn-lang-toggle').forEach(btn => {
      const btnLang = btn.dataset.lang;
      if (btnLang === this.currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    document.querySelectorAll('.lang-indicator-text').forEach(span => {
      span.textContent = this.currentLang.toUpperCase();
    });
  }

  translateEntireDocument() {
    const isEn = this.currentLang === 'en';
    const dict = APP_TRANSLATIONS[this.currentLang] || APP_TRANSLATIONS['th'];

    // 1. Explicit data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        if (el.dataset.i18nTarget === 'placeholder') {
          el.setAttribute('placeholder', dict[key]);
        } else if (el.dataset.i18nTarget === 'title') {
          el.setAttribute('title', dict[key]);
        } else {
          el.textContent = dict[key];
        }
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      if (dict[key]) el.setAttribute('title', dict[key]);
    });

    // 2. Intelligent Auto Text Node Scanner
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'textarea' || parent.isContentEditable) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.hasAttribute('data-no-i18n')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      const text = currentNode.nodeValue;
      if (!text || !text.trim()) continue;

      if (!this.originalNodes.has(currentNode)) {
        this.originalNodes.set(currentNode, text);
      }

      const orig = this.originalNodes.get(currentNode);
      let translated = orig;

      AUTO_PHRASES.forEach(({ th, en }) => {
        const from = isEn ? th : en;
        const to = isEn ? en : th;
        if (translated.includes(from)) {
          translated = translated.split(from).join(to);
        }
      });

      if (currentNode.nodeValue !== translated) {
        currentNode.nodeValue = translated;
      }
    }

    // 3. Scan Common Attributes (placeholder, title, value)
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      if (!el.dataset.origPlaceholder) {
        el.dataset.origPlaceholder = el.getAttribute('placeholder');
      }
      let ph = el.dataset.origPlaceholder;
      AUTO_PHRASES.forEach(({ th, en }) => {
        const from = isEn ? th : en;
        const to = isEn ? en : th;
        if (ph.includes(from)) ph = ph.split(from).join(to);
      });
      el.setAttribute('placeholder', ph);
    });

    document.querySelectorAll('[title]').forEach(el => {
      if (!el.dataset.origTitle) {
        el.dataset.origTitle = el.getAttribute('title');
      }
      let title = el.dataset.origTitle;
      AUTO_PHRASES.forEach(({ th, en }) => {
        const from = isEn ? th : en;
        const to = isEn ? en : th;
        if (title && title.includes(from)) title = title.split(from).join(to);
      });
      if (title) el.setAttribute('title', title);
    });

    // 4. Update Dynamic Comments Modal input
    const commentInput = document.getElementById('modalCommentInput');
    if (commentInput && window.CURRENT_USERNAME) {
      const prefix = dict['comments_placeholder_prefix'] || 'Comment as';
      commentInput.setAttribute('placeholder', `${prefix} ${window.CURRENT_USERNAME}...`);
    }
  }

  init() {
    document.documentElement.setAttribute('lang', this.currentLang);
    this.updateLanguageButtons();
    this.translateEntireDocument();

    // Event Delegation for language toggle buttons
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-lang-toggle, [data-set-lang]');
      if (!btn) return;

      e.preventDefault();
      const targetLang = btn.dataset.lang || btn.dataset.setLang;
      if (targetLang) {
        this.setLanguage(targetLang);
      } else {
        const nextLang = this.currentLang === 'th' ? 'en' : 'th';
        this.setLanguage(nextLang);
      }
    });

    // MutationObserver to translate any AJAX injected elements
    if (window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        let shouldTranslate = false;
        for (const m of mutations) {
          if (m.addedNodes.length > 0) {
            shouldTranslate = true;
            break;
          }
        }
        if (shouldTranslate && this.currentLang === 'en') {
          clearTimeout(this._translateDebounce);
          this._translateDebounce = setTimeout(() => {
            this.translateEntireDocument();
          }, 60);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
}

// Global Singleton instance
window.i18n = new I18nManager();
window.t = (key, fallback) => window.i18n.t(key, fallback);
window.setAppLanguage = (lang) => window.i18n.setLanguage(lang);
window.getAppLanguage = () => window.i18n.currentLang;

document.addEventListener('DOMContentLoaded', () => window.i18n.init());
document.addEventListener('turbo:load', () => window.i18n.init());
