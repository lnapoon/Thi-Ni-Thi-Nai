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
    'nav_admin_dashboard': 'แดชบอร์ดจัดการระบบ',
    'nav_login': 'เข้าสู่ระบบ',
    'nav_signup': 'สมัครสมาชิก',
    'nav_logout': 'ออกจากระบบ',
    'theme_toggle': 'สลับโหมดมืด/สว่าง',
    'lang_switch': 'เปลี่ยนภาษา',

    // Post Composer & Form
    'composer_title': 'สร้างโพสต์เช็คอินใหม่',
    'composer_tagline': 'บันทึกสถานที่ที่คุณประทับใจและแชร์ให้เพื่อนๆ ได้ชม',
    'composer_caption_placeholder': 'เขียนบรรยาย หรือแชร์ความรู้สึกที่นี่...',
    'composer_place_placeholder': 'ชื่อสถานที่ / คาเฟ่ / แหล่งท่องเที่ยวที่นี่...',
    'composer_add_photo': 'เพิ่มรูปภาพ (สูงสุด 10 รูป)',
    'composer_add_photo_short': 'เพิ่มรูปภาพ',
    'composer_change_photo': 'เปลี่ยนรูป',
    'composer_gps': 'พิกัด',
    'composer_post': 'โพสต์',
    'composer_posting': 'กำลังโพสต์...',
    'composer_tap_photo': 'แตะเพื่อถ่ายรูป หรือเพิ่มรูปภาพ (สูงสุด 10 รูป)',
    'composer_photo_tip': 'รองรับทั้งรูปแนวนอน แนวตั้ง และจัตุรัส สามารถเลือกปรับสัดส่วนได้',
    'composer_aspect_ratio_label': 'เลือกสัดส่วนภาพ:',
    'composer_ratio_original': 'ออริจินัล (พอดีเฟรม)',
    'composer_ratio_1_1': '1:1 (จัตุรัส)',
    'composer_ratio_4_5': '4:5 (แนวตั้ง)',
    'composer_ratio_16_9': '16:9 (แนวนอน)',
    'composer_ratio_9_16': '9:16 (เต็มจอ)',
    'composer_photo_count_badge': '0/10 รูป',
    'composer_source_title': 'เลือกวิธีเพิ่มรูปภาพ',
    'composer_source_desc': 'ระบบจะขออนุญาตเข้าถึงกล้องหรือคลังภาพในอุปกรณ์ของคุณ',
    'composer_source_gallery': 'เลือกจากคลังรูปภาพ',
    'composer_source_gallery_sub': 'เลือกไฟล์รูปภาพที่มีอยู่แล้วในเครื่องของคุณ',
    'composer_source_camera': 'เปิดกล้องถ่ายรูป',
    'composer_source_camera_sub': 'ถ่ายภาพสถานที่จริงสดๆ ด้วยกล้องของคุณทันที',
    'composer_snap': 'ถ่ายภาพ',
    'composer_remove_thumb': 'ลบรูปนี้',
    'form_photo_label': 'รูปภาพสถานที่',
    'form_photo_hint': 'JPG, PNG, WEBP, HEIC (สูงสุด 8 MB)',
    'form_photo_max_hint': '(สูงสุด 10 รูป)',
    'form_location_header': 'ข้อมูลสถานที่และโซนพื้นที่',
    'form_location_desc': 'ระบุชื่อสถานที่ และเลือกโซนภาค/จังหวัดที่ตั้ง',
    'form_place_name_label': 'ชื่อสถานที่ / จุดเช็คอิน',
    'form_place_name_placeholder': 'เช่น วัดพระแก้ว, ถนนคนเดินท่าแพ, หาดไร่เลย์...',
    'form_region_label': 'ภูมิภาค',
    'form_province_label': 'จังหวัด',
    'form_gps_locating': 'กำลังจับพิกัด GPS...',
    'form_gps_refresh': 'จับพิกัดใหม่',
    'form_gps_denied': 'ปฏิเสธการเข้าถึงพิกัด',
    'form_gps_received': 'ได้รับพิกัด',
    'form_gps_unsupported': 'ไม่รองรับ GPS',
    'form_gps_none': 'ไม่ได้ระบุพิกัด',
    'form_caption_label': 'ข้อความบรรยาย',
    'form_caption_placeholder': 'เล่าบรรยากาศ ความรู้สึก หรือสิ่งที่น่าประทับใจของที่นี่...',
    'composer_post_btn': 'โพสต์เช็คอิน',
    'form_btn_submit': 'สร้างจุดเช็คอิน',
    'form_btn_update': 'บันทึกการแก้ไข',
    'form_btn_cancel': 'ยกเลิก',
    'form_camera_title': 'ถ่ายรูปสถานที่',
    'form_camera_retake': 'ถ่ายใหม่',
    'form_camera_confirm': 'ใช้รูปนี้',
    'edit_checkin_title': 'แก้ไขเช็คอิน',

    // Feed & Stories
    'feed_stories_title': 'นักเดินทางแนะนำ',
    'feed_find_more': 'ค้นหาเพิ่ม →',
    'feed_story_you': 'คุณ',
    'feed_empty_title': 'ยังไม่มีจุดเช็คอินในขณะนี้',
    'feed_empty_desc': 'มาเป็นคนแรกที่เริ่มบันทึกและแชร์ภาพถ่ายสถานที่สวยๆ กันเถอะ!',
    'feed_empty_btn': 'เช็คอินสถานที่แรกเลย',
    'feed_empty_guest_btn': 'เข้าสู่ระบบเพื่อเริ่มเช็คอิน',
    'feed_guest_badge': 'บัญชีผู้เยี่ยมชม',
    'feed_guest_title': 'อยากสำรวจจุดเช็คอินเพิ่มเติม?',
    'feed_guest_desc': 'คุณกำลังรับชมในโหมดผู้เยี่ยมชม เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อปลดล็อกฟีดทั้งหมด ค้นหาเพื่อนใหม่ กดถูกใจ และแชร์รูปภาพสถานที่สวยๆ ของคุณเอง',
    'feed_pagination_prev': '« ก่อนหน้า',
    'feed_pagination_next': 'ถัดไป »',
    'feed_pagination_page': 'หน้า',
    'feed_pagination_of': 'จาก',

    // Post Actions & Card
    'action_like': 'ถูกใจ',
    'action_likes_count': 'ถูกใจ',
    'action_comment': 'ความคิดเห็น',
    'action_comments': 'ความคิดเห็น',
    'action_comments_count': 'รายการ',
    'action_people_count': 'คน',
    'action_view_all_comments': 'ดูความคิดเห็นทั้งหมด',
    'action_share': 'แชร์จุดเช็คอิน',
    'action_bookmark': 'บันทึกสถานที่',
    'action_edit': 'แก้ไข',
    'action_delete': 'ลบโพสต์',
    'action_delete_short': 'ลบ',
    'action_follow': 'ติดตาม',
    'action_following': 'กำลังติดตาม',
    'action_gps_badge': 'พิกัด GPS',
    'action_open_gmaps': 'เปิด Google Maps',
    'action_back': 'ย้อนกลับ',
    'ago_suffix': 'ที่แล้ว',

    // Comments Modal & Detail
    'comments_title': 'ความคิดเห็น',
    'comments_empty_title': 'ยังไม่มีความคิดเห็น',
    'comments_empty_desc': 'ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นเลย!',
    'comments_placeholder_prefix': 'แสดงความคิดเห็นในชื่อ',
    'comments_placeholder_detail': 'แสดงความคิดเห็นต่อสถานที่นี้...',
    'comments_placeholder_short': 'เขียนความคิดเห็นของคุณ...',
    'comments_send': 'ส่ง',
    'comments_login_prompt': 'เข้าสู่ระบบเพื่อร่วมพูดคุยและแสดงความคิดเห็น',
    'comments_delete_confirm': 'คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?',
    'comments_delete_btn': 'ลบ',

    // Share Modal
    'share_modal_title': 'แชร์จุดเช็คอิน',
    'share_modal_desc': 'ส่งต่อสถานที่สวยๆ ไปยังโซเชียลมีเดีย',
    'share_apps_title': 'แชร์ไปยังแอปพลิเคชัน',
    'share_copy_link': 'คัดลอก',
    'share_copied': 'คัดลอกแล้ว',
    'share_native': 'แชร์อื่นๆ',

    // Profile Page
    'profile_posts': 'โพสต์',
    'profile_followers': 'ผู้ติดตาม',
    'profile_following': 'กำลังติดตาม',
    'profile_tab_posts': 'โพสต์ของฉัน',
    'profile_tab_saved': 'บันทึกไว้',
    'profile_tab_tagged': 'แท็ก',
    'profile_empty_posts': 'ยังไม่มีรายการเช็คอิน',
    'profile_empty_posts_desc': 'เริ่มต้นแชร์สถานที่แรกที่คุณประทับใจได้เลย',
    'profile_first_checkin_btn': 'โพสต์เช็คอินแรก',
    'profile_empty_saved': 'ยังไม่มีโพสต์ที่บันทึกไว้',
    'profile_empty_saved_desc': 'กดไอคอนบันทึกใต้โพสต์ที่คุณสนใจเพื่อเก็บไว้ดูภายหลัง',
    'profile_empty_likes': 'ยังไม่มีโพสต์ที่กดถูกใจ',
    'profile_empty_likes_desc': 'แตะสองครั้งบนรูปภาพเพื่อกดถูกใจโพสต์ที่คุณชื่นชอบ',
    'profile_empty_tagged': 'ยังไม่มีรูปที่ถูกแท็ก',
    'profile_website': 'เว็บไซต์',
    'profile_fav_music': 'เพลงโปรด',
    'profile_edit_btn': 'แก้ไขโปรไฟล์',
    'profile_share_btn': 'แชร์โปรไฟล์',

    // Edit Profile Page
    'edit_profile_title': 'แก้ไขข้อมูลโปรไฟล์',
    'edit_profile_user_info': 'ข้อมูลผู้ใช้',
    'edit_profile_ig_details': 'ข้อมูลโปรไฟล์เพิ่มเติม',
    'edit_profile_display_name': 'ชื่อที่แสดง',
    'edit_profile_bio': 'ข้อความแนะนำตัว',
    'edit_profile_category': 'หมวดหมู่ / MBTI / สถานะ',
    'edit_profile_social_links': 'ลิงก์ภายนอก / โซเชียล',
    'edit_profile_website_title': 'ชื่อปุ่ม/โซเชียล',
    'edit_profile_website_url': 'URL ลิงก์',
    'edit_profile_music_header': 'เพลงโปรด / แท็กเสียง',
    'edit_profile_music_title': 'ชื่อเพลง / ข้อความเสียง',
    'edit_profile_music_url': 'URL ลิงก์เพลง',
    'edit_profile_avatar_header': 'รูปภาพโปรไฟล์',
    'edit_profile_avatar_change': 'เปลี่ยนรูปโปรไฟล์ใหม่',
    'edit_profile_email': 'อีเมล',
    'edit_profile_first_name': 'ชื่อ',
    'edit_profile_last_name': 'นามสกุล',
    'edit_profile_first_name_ph': 'ชื่อ',
    'edit_profile_last_name_ph': 'นามสกุล',
    'edit_profile_email_ph': 'อีเมล',
    'edit_profile_display_name_ph': 'ชื่อที่แสดง (เช่น ปูนเองก็เหนื่อย🫠)',
    'edit_profile_category_ph': 'หมวดหมู่ / MBTI / สถานะ (เช่น ENFP - T)',
    'edit_profile_bio_ph': 'คำอธิบายโปรไฟล์ (Bio)',
    'edit_profile_website_title_ph': 'ชื่อลิงก์โปรไฟล์/โซเชียล (เช่น Facebook / Monphrakan)',
    'edit_profile_website_url_ph': 'https://facebook.com/yourprofile',
    'edit_profile_music_title_ph': 'เพลงโปรด / แท็กเสียง (เช่น ดาวนำทาง)',
    'edit_profile_music_url_ph': 'https://spotify.com/track/...',
    'edit_profile_save': 'บันทึกข้อมูล',
    'edit_profile_cancel': 'ยกเลิก',
    'file_input_choose': 'เลือกไฟล์',
    'file_input_none': 'ไม่ได้เลือกไฟล์ใด',

    // Search Page
    'search_title': 'ค้นหาผู้ใช้งาน',
    'search_subtitle': 'ค้นหาเพื่อนหรือคนที่คุณสนใจเพื่อติดตามดูจุดเช็คอิน',
    'search_placeholder': 'พิมพ์ชื่อผู้ใช้ (@username) หรือชื่อเพื่อน...',
    'search_suggested_header': 'ผู้ใช้แนะนำสำหรับคุณ',
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
    'map_filter_region_title': 'เลือกภูมิภาค:',
    'map_reset_filters': 'รีเซ็ตตัวกรอง',
    'map_all_regions': 'ทุกภูมิภาค',
    'map_all_provinces_in_zone': '-- เจาะจงทุกจังหวัดในโซน --',
    'map_search_placeholder': 'ค้นหาชื่อสถานที่ หรือคำบรรยาย...',
    'map_btn_zoom': 'ซูมตำแหน่ง',
    'map_showing_all': 'กำลังแสดง: ทั่วประเทศไทย',
    'map_found_prefix': 'พบ',
    'map_found_suffix': 'แห่ง',
    'map_unit_places': 'แห่ง',
    'map_places_in_zone': 'รายการจุดเช็คอินในโซนที่เลือก',
    'map_empty_zone_title': 'ยังไม่มีจุดเช็คอินในจังหวัดหรือเงื่อนไขนี้',
    'map_empty_zone_desc': 'คุณเคยไปเที่ยวที่นี่ไหม? มาเป็นคนแรกที่โพสต์ปักหมุดเช็คอินกันเลย!',
    'map_pin_here': 'ปักหมุดที่นี่เลย',
    'map_view_detail': 'ดูรายละเอียดจุดเช็คอิน',
    'map_close_drawer': 'ปิด',

    // Regions & Provinces
    'ภาคเหนือ': 'ภาคเหนือ',
    'ภาคกลาง': 'ภาคกลาง',
    'ภาคตะวันออกเฉียงเหนือ': 'ภาคตะวันออกเฉียงเหนือ',
    'ภาคตะวันออก': 'ภาคตะวันออก',
    'ภาคตะวันตก': 'ภาคตะวันตก',
    'ภาคใต้': 'ภาคใต้',
    'กระบี่': 'กระบี่',
    'กรุงเทพมหานคร': 'กรุงเทพมหานคร',
    'กาญจนบุรี': 'กาญจนบุรี',
    'กาฬสินธุ์': 'กาฬสินธุ์',
    'กำแพงเพชร': 'กำแพงเพชร',
    'ขอนแก่น': 'ขอนแก่น',
    'จันทบุรี': 'จันทบุรี',
    'ฉะเชิงเทรา': 'ฉะเชิงเทรา',
    'ชลบุรี': 'ชลบุรี',
    'ชัยนาท': 'ชัยนาท',
    'ชัยภูมิ': 'ชัยภูมิ',
    'ชุมพร': 'ชุมพร',
    'เชียงราย': 'เชียงราย',
    'เชียงใหม่': 'เชียงใหม่',
    'ตรัง': 'ตรัง',
    'ตราด': 'ตราด',
    'ตาก': 'ตาก',
    'นครนายก': 'นครนายก',
    'นครปฐม': 'นครปฐม',
    'นครพนม': 'นครพนม',
    'นครราชสีมา': 'นครราชสีมา',
    'นครศรีธรรมราช': 'นครศรีธรรมราช',
    'นครสวรรค์': 'นครสวรรค์',
    'นนทบุรี': 'นนทบุรี',
    'นราธิวาส': 'นราธิวาส',
    'น่าน': 'น่าน',
    'บึงกาฬ': 'บึงกาฬ',
    'บุรีรัมย์': 'บุรีรัมย์',
    'ปทุมธานี': 'ปทุมธานี',
    'ประจวบคีรีขันธ์': 'ประจวบคีรีขันธ์',
    'ปราจีนบุรี': 'ปราจีนบุรี',
    'ปัตตานี': 'ปัตตานี',
    'พระนครศรีอยุธยา': 'พระนครศรีอยุธยา',
    'พะเยา': 'พะเยา',
    'พังงา': 'พังงา',
    'พัทลุง': 'พัทลุง',
    'พิจิตร': 'พิจิตร',
    'พิษณุโลก': 'พิษณุโลก',
    'เพชรบุรี': 'เพชรบุรี',
    'เพชรบูรณ์': 'เพชรบูรณ์',
    'แพร่': 'แพร่',
    'ภูเก็ต': 'ภูเก็ต',
    'มหาสารคาม': 'มหาสารคาม',
    'มุกดาหาร': 'มุกดาหาร',
    'แม่ฮ่องสอน': 'แม่ฮ่องสอน',
    'ยโสธร': 'ยโสธร',
    'ยะลา': 'ยะลา',
    'ร้อยเอ็ด': 'ร้อยเอ็ด',
    'ระนอง': 'ระนอง',
    'ระยอง': 'ระยอง',
    'ราชบุรี': 'ราชบุรี',
    'ลพบุรี': 'ลพบุรี',
    'ลำปาง': 'ลำปาง',
    'ลำพูน': 'ลำพูน',
    'เลย': 'เลย',
    'ศรีสะเกษ': 'ศรีสะเกษ',
    'สกลนคร': 'สกลนคร',
    'สงขลา': 'สงขลา',
    'สตูล': 'สตูล',
    'สมุทรปราการ': 'สมุทรปราการ',
    'สมุทรสงคราม': 'สมุทรสงคราม',
    'สมุทรสาคร': 'สมุทรสาคร',
    'สระแก้ว': 'สระแก้ว',
    'สระบุรี': 'สระบุรี',
    'สิงห์บุรี': 'สิงห์บุรี',
    'สุโขทัย': 'สุโขทัย',
    'สุพรรณบุรี': 'สุพรรณบุรี',
    'สุราษฎร์ธานี': 'สุราษฎร์ธานี',
    'สุรินทร์': 'สุรินทร์',
    'หนองคาย': 'หนองคาย',
    'หนองบัวลำภู': 'หนองบัวลำภู',
    'อ่างทอง': 'อ่างทอง',
    'อำนาจเจริญ': 'อำนาจเจริญ',
    'อุดรธานี': 'อุดรธานี',
    'อุตรดิตถ์': 'อุตรดิตถ์',
    'อุทัยธานี': 'อุทัยธานี',
    'อุบลราชธานี': 'อุบลราชธานี',

    // Auth Pages & Modals
    'auth_login_welcome': 'ยินดีต้อนรับกลับมา',
    'auth_login_welcome_sub': 'เข้าสู่ระบบเพื่อแชร์และดูจุดเช็คอินของเพื่อนๆ',
    'auth_signup_welcome': 'สร้างบัญชีผู้ใช้ใหม่',
    'auth_signup_welcome_sub': 'สมัครสมาชิกง่ายๆ เพียงตั้งชื่อผู้ใช้และรหัสผ่าน',
    'auth_username_label': 'ชื่อผู้ใช้',
    'auth_username_placeholder': 'ระบุชื่อผู้ใช้',
    'auth_email_label': 'อีเมล',
    'auth_password_label': 'รหัสผ่าน',
    'auth_password_placeholder': 'ระบุรหัสผ่าน',
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
    'auth_login_title': 'เข้าสู่ระบบเพื่อใช้งาน',
    'auth_login_desc': 'เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อสร้างโพสต์เช็คอิน กดถูกใจ แสดงความคิดเห็น และบันทึกสถานที่โปรดของคุณ',
    'auth_btn_login': 'เข้าสู่ระบบ',
    'auth_btn_signup': 'สมัครสมาชิกใหม่',
    'auth_btn_later': 'ไว้ทีหลัง',

    // PDPA & Policies
    'pdpa_title': 'นโยบายคุ้มครองข้อมูล (PDPA)',
    'pdpa_banner_title': 'การคุ้มครองข้อมูลส่วนบุคคลและคุกกี้ (PDPA)',
    'pdpa_banner_desc': 'เว็บไซต์นี้ใช้คุกกี้ที่จำเป็น และขอสิทธิ์เข้าถึงพิกัด GPS เฉพาะตอนที่คุณแชร์สถานที่ เพื่อประสบการณ์ใช้งานที่ดีที่สุดตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล',
    'pdpa_btn_accept': 'ยินยอมทั้งหมด',
    'pdpa_btn_read': 'อ่านนโยบาย',
    'pdpa_btn_understand': 'รับทราบและเข้าใจแล้ว',

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
    'toast_link_copied': 'คัดลอกลิงก์เรียบร้อยแล้ว!',
    'toast_followed': 'ติดตามแล้ว',
    'toast_unfollowed': 'เลิกติดตามแล้ว',
    'toast_max_photos_alert': 'สามารถเลือกรูปภาพได้สูงสุด 10 รูปต่อโพสต์',
    'toast_photo_size_alert': 'มีขนาดเกิน 8MB กรุณาเลือกรูปภาพที่มีขนาดเล็กลง',
    'toast_require_photo_alert': 'กรุณาเลือกรูปภาพอย่างน้อย 1 รูปสำหรับจุดเช็คอิน',
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
    'lang_switch': 'Language',

    // Post Composer & Form
    'composer_title': 'Create New Check-in',
    'composer_tagline': 'Capture places you love and share them with friends',
    'composer_caption_placeholder': 'Write a caption, or share your thoughts here...',
    'composer_place_placeholder': 'Place name / Cafe / Attraction name...',
    'composer_add_photo': 'Add Photos (Max 10)',
    'composer_add_photo_short': 'Add Photo',
    'composer_change_photo': 'Change Photo',
    'composer_gps': 'GPS',
    'composer_post': 'Post',
    'composer_posting': 'Posting...',
    'composer_tap_photo': 'Tap to take photos or select images (Up to 10 photos)',
    'composer_photo_tip': 'Supports landscape, portrait, and square photos with adjustable aspect ratios',
    'composer_aspect_ratio_label': 'Select Aspect Ratio:',
    'composer_ratio_original': 'Original (Fit Frame)',
    'composer_ratio_1_1': '1:1 (Square)',
    'composer_ratio_4_5': '4:5 (Portrait)',
    'composer_ratio_16_9': '16:9 (Landscape)',
    'composer_ratio_9_16': '9:16 (Full Screen)',
    'composer_photo_count_badge': '0/10 photos',
    'composer_source_title': 'Choose How to Add Photo',
    'composer_source_desc': 'The app will request permission to access your camera or photo gallery',
    'composer_source_gallery': 'Choose from Photo Gallery',
    'composer_source_gallery_sub': 'Select existing photos from your device',
    'composer_source_camera': 'Open Camera',
    'composer_source_camera_sub': 'Take live photos of the place right now',
    'composer_snap': 'Take Photo',
    'composer_remove_thumb': 'Remove photo',
    'form_photo_label': 'Place Photos',
    'form_photo_hint': 'JPG, PNG, WEBP, HEIC (Max 8 MB)',
    'form_photo_max_hint': '(Max 10 photos)',
    'form_location_header': 'Location & Zone Information',
    'form_location_desc': 'Specify place name and select region / province',
    'form_place_name_label': 'Place Name / Check-in Spot',
    'form_place_name_placeholder': 'e.g. Wat Phra Kaew, Tha Phae Walking Street, Railay Beach...',
    'form_region_label': 'Region',
    'form_province_label': 'Province',
    'form_gps_locating': 'Locating GPS coordinates...',
    'form_gps_refresh': 'Refresh GPS',
    'form_gps_denied': 'GPS Access Denied',
    'form_gps_received': 'GPS Received',
    'form_gps_unsupported': 'GPS Not Supported',
    'form_gps_none': 'No GPS coordinates',
    'form_caption_label': 'Caption / Description',
    'form_caption_placeholder': 'Share the atmosphere, feelings, or highlights of this place...',
    'composer_post_btn': 'Post Check-in',
    'form_btn_submit': 'Create Check-in',
    'form_btn_update': 'Save Changes',
    'form_btn_cancel': 'Cancel',
    'form_camera_title': 'Take Place Photo',
    'form_camera_retake': 'Retake',
    'form_camera_confirm': 'Use This Photo',
    'edit_checkin_title': 'Edit Check-in',

    // Feed & Stories
    'feed_stories_title': 'Top Travelers',
    'feed_find_more': 'Find More →',
    'feed_story_you': 'You',
    'feed_empty_title': 'No check-ins at this time',
    'feed_empty_desc': 'Be the first to capture and share beautiful places!',
    'feed_empty_btn': 'Check-in first place',
    'feed_empty_guest_btn': 'Log in to start check-in',
    'feed_guest_badge': 'Guest Mode',
    'feed_guest_title': 'Want to explore more check-ins?',
    'feed_guest_desc': 'You are viewing in Guest Mode. Log in or sign up for free to unlock full feed, find friends, like, and share your own travel photos.',
    'feed_pagination_prev': '« Previous',
    'feed_pagination_next': 'Next »',
    'feed_pagination_page': 'Page',
    'feed_pagination_of': 'of',

    // Post Actions & Card
    'action_like': 'Like',
    'action_likes_count': 'likes',
    'action_comment': 'Comments',
    'action_comments': 'Comments',
    'action_comments_count': 'comments',
    'action_people_count': 'people',
    'action_view_all_comments': 'View all comments',
    'action_share': 'Share Check-in',
    'action_bookmark': 'Save Place',
    'action_edit': 'Edit',
    'action_delete': 'Delete Post',
    'action_delete_short': 'Delete',
    'action_follow': 'Follow',
    'action_following': 'Following',
    'action_gps_badge': 'GPS Coordinates',
    'action_open_gmaps': 'Open Google Maps',
    'action_back': 'Back',
    'ago_suffix': 'ago',

    // Comments Modal & Detail
    'comments_title': 'Comments',
    'comments_empty_title': 'No comments yet',
    'comments_empty_desc': 'No comments yet. Be the first to comment!',
    'comments_placeholder_prefix': 'Comment as',
    'comments_placeholder_detail': 'Share your thoughts on this place...',
    'comments_placeholder_short': 'Write a comment...',
    'comments_send': 'Send',
    'comments_login_prompt': 'Log in to join the conversation and comment',
    'comments_delete_confirm': 'Are you sure you want to delete this comment?',
    'comments_delete_btn': 'Delete',

    // Share Modal
    'share_modal_title': 'Share Check-in',
    'share_modal_desc': 'Share beautiful places to social media',
    'share_apps_title': 'Share to Applications',
    'share_copy_link': 'Copy',
    'share_copied': 'Copied',
    'share_native': 'More Share Options',

    // Profile Page
    'profile_posts': 'posts',
    'profile_followers': 'followers',
    'profile_following': 'following',
    'profile_tab_posts': 'My Posts',
    'profile_tab_saved': 'Saved',
    'profile_tab_tagged': 'Tagged',
    'profile_empty_posts': 'No check-in posts yet',
    'profile_empty_posts_desc': 'Start sharing your first memorable place now',
    'profile_first_checkin_btn': 'Post first check-in',
    'profile_empty_saved': 'No saved check-in posts yet',
    'profile_empty_saved_desc': 'Tap the bookmark icon under posts you like to view later',
    'profile_empty_likes': 'No liked check-in posts yet',
    'profile_empty_likes_desc': 'Double tap on photos to like posts you enjoy',
    'profile_empty_tagged': 'No tagged photos yet',
    'profile_website': 'Website',
    'profile_fav_music': 'Favorite Music',
    'profile_edit_btn': 'Edit profile',
    'profile_share_btn': 'Share profile',

    // Edit Profile Page
    'edit_profile_title': 'Edit Profile Information',
    'edit_profile_user_info': 'User Information',
    'edit_profile_ig_details': 'Additional Profile Details',
    'edit_profile_display_name': 'Display Name',
    'edit_profile_bio': 'Bio / Introduction',
    'edit_profile_category': 'Category / MBTI / Status',
    'edit_profile_social_links': 'External / Social Links',
    'edit_profile_website_title': 'Button / Social Title',
    'edit_profile_website_url': 'Link URL',
    'edit_profile_music_header': 'Favorite Music / Audio Tag',
    'edit_profile_music_title': 'Song Title / Audio Label',
    'edit_profile_music_url': 'Music URL Link',
    'edit_profile_avatar_header': 'Profile Picture',
    'edit_profile_avatar_change': 'Change Profile Picture',
    'edit_profile_email': 'Email Address',
    'edit_profile_first_name': 'First Name',
    'edit_profile_last_name': 'Last Name',
    'edit_profile_first_name_ph': 'First Name',
    'edit_profile_last_name_ph': 'Last Name',
    'edit_profile_email_ph': 'Email Address',
    'edit_profile_display_name_ph': 'Display Name (e.g. Alex Traveling)',
    'edit_profile_category_ph': 'Category / MBTI / Status (e.g. ENFP - T)',
    'edit_profile_bio_ph': 'Profile Bio / Introduction',
    'edit_profile_website_title_ph': 'Social Link Title (e.g. Facebook / Instagram)',
    'edit_profile_website_url_ph': 'https://facebook.com/yourprofile',
    'edit_profile_music_title_ph': 'Favorite Music / Audio Tag (e.g. Guiding Star)',
    'edit_profile_music_url_ph': 'https://spotify.com/track/...',
    'edit_profile_save': 'Save Information',
    'edit_profile_cancel': 'Cancel',
    'file_input_choose': 'Choose File',
    'file_input_none': 'No file chosen',

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
    'map_showing_all': 'Showing: All across Thailand',
    'map_found_prefix': 'Found',
    'map_found_suffix': 'places',
    'map_unit_places': 'places',
    'map_places_in_zone': 'Check-in spots in selected zone',
    'map_empty_zone_title': 'No check-ins in this province or filter',
    'map_empty_zone_desc': 'Have you traveled here? Be the first to pin a check-in!',
    'map_pin_here': 'Pin Check-in Here',
    'map_view_detail': 'View Check-in Details',
    'map_close_drawer': 'Close',

    // Regions & Provinces
    'ภาคเหนือ': 'Northern Thailand',
    'ภาคกลาง': 'Central Thailand',
    'ภาคตะวันออกเฉียงเหนือ': 'Northeastern Thailand',
    'ภาคตะวันออก': 'Eastern Thailand',
    'ภาคตะวันตก': 'Western Thailand',
    'ภาคใต้': 'Southern Thailand',
    'กระบี่': 'Krabi',
    'กรุงเทพมหานคร': 'Bangkok',
    'กาญจนบุรี': 'Kanchanaburi',
    'กาฬสินธุ์': 'Kalasin',
    'กำแพงเพชร': 'Kamphaeng Phet',
    'ขอนแก่น': 'Khon Kaen',
    'จันทบุรี': 'Chanthaburi',
    'ฉะเชิงเทรา': 'Chachoengsao',
    'ชลบุรี': 'Chonburi',
    'ชัยนาท': 'Chainat',
    'ชัยภูมิ': 'Chaiyaphum',
    'ชุมพร': 'Chumphon',
    'เชียงราย': 'Chiang Rai',
    'เชียงใหม่': 'Chiang Mai',
    'ตรัง': 'Trang',
    'ตราด': 'Trat',
    'ตาก': 'Tak',
    'นครนายก': 'Nakhon Nayok',
    'นครปฐม': 'Nakhon Pathom',
    'นครพนม': 'Nakhon Phanom',
    'นครราชสีมา': 'Nakhon Ratchasima',
    'นครศรีธรรมราช': 'Nakhon Si Thammarat',
    'นครสวรรค์': 'Nakhon Sawan',
    'นนทบุรี': 'Nonthaburi',
    'นราธิวาส': 'Narathiwat',
    'น่าน': 'Nan',
    'บึงกาฬ': 'Bueng Kan',
    'บุรีรัมย์': 'Buriram',
    'ปทุมธานี': 'Pathum Thani',
    'ประจวบคีรีขันธ์': 'Prachuap Khiri Khan',
    'ปราจีนบุรี': 'Prachinburi',
    'ปัตตานี': 'Pattani',
    'พระนครศรีอยุธยา': 'Phra Nakhon Si Ayutthaya',
    'พะเยา': 'Phayao',
    'พังงา': 'Phang Nga',
    'พัทลุง': 'Phatthalung',
    'พิจิตร': 'Phichit',
    'พิษณุโลก': 'Phitsanulok',
    'เพชรบุรี': 'Phetchaburi',
    'เพชรบูรณ์': 'Phetchabun',
    'แพร่': 'Phrae',
    'ภูเก็ต': 'Phuket',
    'มหาสารคาม': 'Maha Sarakham',
    'มุกดาหาร': 'Mukdahan',
    'แม่ฮ่องสอน': 'Mae Hong Son',
    'ยโสธร': 'Yasothon',
    'ยะลา': 'Yala',
    'ร้อยเอ็ด': 'Roi Et',
    'ระนอง': 'Ranong',
    'ระยอง': 'Rayong',
    'ราชบุรี': 'Ratchaburi',
    'ลพบุรี': 'Lopburi',
    'ลำปาง': 'Lampang',
    'ลำพูน': 'Lamphun',
    'เลย': 'Loei',
    'ศรีสะเกษ': 'Sisaket',
    'สกลนคร': 'Sakon Nakhon',
    'สงขลา': 'Songkhla',
    'สตูล': 'Satun',
    'สมุทรปราการ': 'Samut Prakan',
    'สมุทรสงคราม': 'Samut Songkhram',
    'สมุทรสาคร': 'Samut Sakhon',
    'สระแก้ว': 'Sa Kaeo',
    'สระบุรี': 'Saraburi',
    'สิงห์บุรี': 'Sing Buri',
    'สุโขทัย': 'Sukhothai',
    'สุพรรณบุรี': 'Suphan Buri',
    'สุราษฎร์ธานี': 'Surat Thani',
    'สุรินทร์': 'Surin',
    'หนองคาย': 'Nong Khai',
    'หนองบัวลำภู': 'Nong Bua Lamphu',
    'อ่างทอง': 'Ang Thong',
    'อำนาจเจริญ': 'Amnat Charoen',
    'อุดรธานี': 'Udon Thani',
    'อุตรดิตถ์': 'Uttaradit',
    'อุทัยธานี': 'Uthai Thani',
    'อุบลราชธานี': 'Ubon Ratchathani',

    // Auth Pages & Modals
    'auth_login_welcome': 'Welcome Back',
    'auth_login_welcome_sub': 'Log in to share and explore friends check-ins',
    'auth_signup_welcome': 'Create New Account',
    'auth_signup_welcome_sub': 'Sign up quickly by setting username and password',
    'auth_username_label': 'Username',
    'auth_username_placeholder': 'Enter your username',
    'auth_email_label': 'Email Address',
    'auth_password_label': 'Password',
    'auth_password_placeholder': 'Enter your password',
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
    'auth_login_title': 'Log In to Continue',
    'auth_login_desc': 'Log in or sign up for free to share check-ins, like, comment, and save your favorite travel spots.',
    'auth_btn_login': 'Log In',
    'auth_btn_signup': 'Sign Up',
    'auth_btn_later': 'Maybe Later',

    // PDPA & Policies
    'pdpa_title': 'Privacy Policy (PDPA)',
    'pdpa_banner_title': 'Privacy Policy & Cookies (PDPA)',
    'pdpa_banner_desc': 'This site uses essential cookies and requests GPS coordinates only when you share places, for the best experience compliant with PDPA.',
    'pdpa_btn_accept': 'Accept All',
    'pdpa_btn_read': 'Read Policy',
    'pdpa_btn_understand': 'I understand',

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
    'toast_link_copied': 'Link copied to clipboard!',
    'toast_followed': 'Followed successfully',
    'toast_unfollowed': 'Unfollowed',
    'toast_max_photos_alert': 'You can select up to 10 photos per post',
    'toast_photo_size_alert': 'exceeds 8MB. Please select smaller images.',
    'toast_require_photo_alert': 'Please select at least 1 photo for your check-in',
  }
};

/**
 * Universal Bidirectional Phrase Dictionary (Thai <-> English)
 * Scans DOM text nodes and attributes across ANY page to guarantee 100% complete coverage.
 * Automatically sorted by length (descending) to avoid partial sub-phrase replacement conflicts.
 */
const RAW_AUTO_PHRASES = [
  // Full Sentences & Paragraphs
  { th: 'บันทึกสถานที่ที่คุณประทับใจและแชร์ให้เพื่อนๆ ได้ชม', en: 'Capture places you love and share them with friends' },
  { th: 'แพลตฟอร์มคอมมูนิตี้ท่องเที่ยวและเช็คอินสถานที่จริง แบ่งปันภาพถ่าย พิกัด GPS และเรื่องราวการเดินทางทั่วไทย', en: 'A travel community platform for sharing authentic check-ins, photos, GPS coordinates, and journey stories across Thailand.' },
  { th: 'จัดเก็บและประมวลผลรูปภาพความเร็วสูง พร้อมระบบสำรองข้อมูลบน Cloud', en: 'High-speed image processing and storage with cloud backup redundancy' },
  { th: 'ระบุตำแหน่งสถานที่จริงด้วย GPS และแสดงหมุดจุดเช็คอินบนแผนที่แบบ Interactive', en: 'Pinpoint authentic coordinates via GPS and view check-in markers on dynamic maps' },
  { th: 'เชื่อมต่อฐานข้อมูลระบบคลาวด์ เสถียร และรองรับการค้นหาพิกัดพื้นที่อย่างรวดเร็ว', en: 'Connected to cloud database with high availability and fast geospatial queries' },
  { th: 'การกระทำนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่ว่าต้องการลบเช็คอินนี้?', en: 'This action cannot be undone. Are you sure you want to delete this check-in?' },
  { th: 'ขออภัย คุณไม่มีสิทธิ์ในการเข้าถึง ดัดแปลง หรือลบข้อมูลส่วนนี้ (สงวนสิทธิ์เฉพาะเจ้าของโพสต์เท่านั้น)', en: 'Sorry, you do not have permission to access, edit, or delete this item.' },
  { th: 'หน้าที่คุณพยายามเปิดอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ', en: 'The page you are looking for might have been moved, deleted, or does not exist.' },
  { th: 'ระบบพบปัญหาชั่วคราวในการประมวลผล กรุณาลองใหม่อีกครั้งในภายหลัง', en: 'The server encountered a temporary error. Please try again later.' },
  { th: 'เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อสร้างโพสต์เช็คอิน กดถูกใจ แสดงความคิดเห็น และบันทึกสถานที่โปรดของคุณ', en: 'Log in or sign up for free to create check-ins, like, comment, and save your favorite travel spots.' },
  { th: 'เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อกดถูกใจและบันทึกสถานที่นี้', en: 'Log in or sign up for free to like and save this place' },
  { th: 'เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อบันทึกสถานที่โปรดของคุณ', en: 'Log in or sign up for free to save your favorite place' },
  { th: 'เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อร่วมแสดงความคิดเห็น', en: 'Log in or sign up for free to join the discussion' },
  { th: 'เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อติดตามเพื่อนนักเดินทาง', en: 'Log in or sign up for free to follow fellow travelers' },
  { th: 'เว็บไซต์นี้ใช้คุกกี้ที่จำเป็น และขอสิทธิ์เข้าถึงพิกัด GPS เฉพาะตอนที่คุณแชร์สถานที่ เพื่อประสบการณ์ใช้งานที่ดีที่สุดตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล', en: 'This site uses essential cookies and requests GPS coordinates only when you share places, for the best experience compliant with PDPA.' },
  { th: 'รองรับการเปิดกล้องถ่ายภาพสด หรือเลือกจากคลังรูปภาพในเครื่อง', en: 'Supports live camera capture or choosing from your photo gallery' },
  { th: 'รองรับทั้งรูปแนวนอน แนวตั้ง และจัตุรัส สามารถเลือกปรับสัดส่วนได้', en: 'Supports landscape, portrait, and square photos with adjustable aspect ratios' },
  { th: 'ระบบจะขออนุญาตเข้าถึงกล้องหรือคลังภาพในอุปกรณ์ของคุณ', en: 'The app will request camera or photo library access' },
  { th: 'ถ่ายภาพสถานที่จริงสดๆ ด้วยกล้องของคุณทันที', en: 'Take live photos with your camera instantly' },
  { th: 'เลือกไฟล์รูปภาพที่มีอยู่แล้วในเครื่องของคุณ', en: 'Select existing photos from your device' },
  { th: 'เล่าบรรยากาศ ความรู้สึก หรือสิ่งที่น่าประทับใจของที่นี่...', en: 'Share the atmosphere, feelings, or highlights of this place...' },
  { th: 'เช่น วัดพระแก้ว, ถนนคนเดินท่าแพ, หาดไร่เลย์...', en: 'e.g. Wat Phra Kaew, Tha Phae Walking Street, Railay Beach...' },
  { th: 'ค้นหาเพื่อนหรือคนที่คุณสนใจเพื่อติดตามดูจุดเช็คอิน', en: 'Search friends or people you are interested in to see their check-ins' },
  { th: 'ลองค้นหาด้วยชื่อผู้ใช้ (@username) หรือคำอื่นดูนะครับ', en: 'Try searching by username (@username) or other keywords' },
  { th: 'ลองพิมพ์ชื่อผู้ใช้ใหม่ หรือค้นหาคำอื่นดูนะครับ', en: 'Try typing a new username or search other terms' },
  { th: 'เลือกโซนภูมิภาคและเจาะลึกรายจังหวัดเพื่อดูสถานที่ท่องเที่ยวยอดนิยม', en: 'Select a region or drill down by province to discover top travel spots' },
  { th: 'มาเป็นคนแรกที่เริ่มบันทึกและแชร์ภาพถ่ายสถานที่สวยๆ กันเถอะ!', en: 'Be the first to capture and share beautiful places!' },
  { th: 'ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นเลย!', en: 'No comments yet. Be the first to comment!' },
  { th: 'คุณเคยไปเที่ยวที่นี่ไหม? มาเป็นคนแรกที่โพสต์ปักหมุดเช็คอินกันเลย!', en: 'Have you traveled here? Be the first to pin a check-in!' },
  { th: 'กดไอคอนบันทึกใต้โพสต์ที่คุณสนใจเพื่อเก็บไว้ดูภายหลัง', en: 'Tap the bookmark icon under posts you like to view later' },
  { th: 'แตะสองครั้งบนรูปภาพเพื่อกดถูกใจโพสต์ที่คุณชื่นชอบ', en: 'Double tap on photos to like posts you enjoy' },
  { th: 'เริ่มต้นแชร์สถานที่แรกที่คุณประทับใจได้เลย', en: 'Start sharing your first memorable place now' },
  { th: 'คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?', en: 'Are you sure you want to delete this comment?' },
  { th: 'ส่งต่อสถานที่สวยๆ ไปยังโซเชียลมีเดีย', en: 'Share beautiful places to social media' },
  { th: 'ส่งต่อสถานที่สวยๆ ให้เพื่อนๆ ของคุณ', en: 'Share beautiful places with your friends' },
  { th: 'ระบุชื่อสถานที่ และเลือกโซนภาค/จังหวัดที่ตั้ง', en: 'Specify place name and select region / province' },
  { th: 'สมัครสมาชิกง่ายๆ เพียงตั้งชื่อผู้ใช้และรหัสผ่าน', en: 'Sign up quickly by setting username and password' },
  { th: 'เข้าสู่ระบบเพื่อแชร์และดูจุดเช็คอินของเพื่อนๆ', en: 'Log in to share and explore friends check-ins' },
  { th: 'เข้าสู่ระบบเพื่อร่วมพูดคุยและแสดงความคิดเห็น', en: 'Log in to join the conversation and comment' },

  // Post Composer & Form
  { th: 'เลือกสัดส่วนภาพ:', en: 'Select Aspect Ratio:' },
  { th: 'เลือกสัดส่วนภาพ', en: 'Select Aspect Ratio' },
  { th: 'ออริจินัล', en: 'Original' },
  { th: '1:1', en: '1:1' },
  { th: '4:5', en: '4:5' },
  { th: '16:9', en: '16:9' },
  { th: '9:16', en: '9:16' },
  { th: 'เพิ่มรูปภาพ (สูงสุด 10 รูป)', en: 'Add Photos (Max 10)' },
  { th: '(สูงสุด 10 รูป)', en: '(Max 10 photos)' },
  { th: 'แตะเพื่อถ่ายรูป หรือเพิ่มรูปภาพ (สูงสุด 10 รูป)', en: 'Tap to take photos or select images (Up to 10 photos)' },
  { th: 'แตะเพื่อถ่ายรูป หรือเลือกรูปภาพ', en: 'Tap to take a photo or select an image' },
  { th: 'เลือกจากคลังรูปภาพ', en: 'Choose from Photo Gallery' },
  { th: 'เปิดกล้องถ่ายรูป', en: 'Open Camera' },
  { th: 'เปิดกล้องถ่ายภาพ', en: 'Open Live Camera' },
  { th: 'เปิดแอปกล้องของเครื่อง', en: 'Open device camera app' },
  { th: 'เลือกวิธีเพิ่มรูปภาพ', en: 'Choose Photo Source' },
  { th: 'รูปภาพสถานที่', en: 'Place Photo' },
  { th: 'ข้อมูลสถานที่และโซนพื้นที่', en: 'Location and Zone Information' },
  { th: 'ชื่อสถานที่ / จุดเช็คอิน', en: 'Place Name / Check-in Spot' },
  { th: 'ชื่อสถานที่ / คาเฟ่ / แหล่งท่องเที่ยวที่นี่...', en: 'Place name / Cafe / Attraction name...' },
  { th: 'เขียนบรรยาย หรือแชร์ความรู้สึกที่นี่...', en: 'Write a caption, or share your thoughts here...' },
  { th: 'สร้างโพสต์เช็คอินใหม่', en: 'Create New Check-in' },
  { th: 'สร้างจุดเช็คอินใหม่', en: 'Create New Check-in' },
  { th: 'สร้างจุดเช็คอิน', en: 'Create Check-in' },
  { th: 'โพสต์เช็คอิน', en: 'Post Check-in' },
  { th: 'แก้ไขเช็คอิน', en: 'Edit Check-in' },
  { th: 'บันทึกการแก้ไข', en: 'Save Changes' },
  { th: 'บันทึกการเปลี่ยนแปลง', en: 'Save Changes' },
  { th: 'บันทึกข้อมูล', en: 'Save Information' },
  { th: 'กำลังจับพิกัด GPS...', en: 'Locating GPS coordinates...' },
  { th: 'กำลังดึงพิกัด...', en: 'Locating GPS...' },
  { th: 'จับพิกัดใหม่', en: 'Refresh GPS' },
  { th: 'ปฏิเสธการเข้าถึงพิกัด', en: 'GPS Access Denied' },
  { th: 'ได้รับพิกัด', en: 'GPS Received' },
  { th: 'ไม่รองรับ GPS', en: 'GPS Not Supported' },
  { th: 'ไม่ได้ระบุพิกัด', en: 'No GPS specified' },
  { th: '-- ทุกภูมิภาค (ทั้งหมด) --', en: '-- All Regions --' },
  { th: '-- ทุกภูมิภาค --', en: '-- All Regions --' },
  { th: 'ทุกภูมิภาค (ทั้งหมด)', en: 'All Regions' },
  { th: 'สลับกล้องหน้า/หลัง', en: 'Switch camera front/back' },
  { th: 'กำลังเปิดกล้อง...', en: 'Starting camera...' },
  { th: 'ถ่ายรูปสถานที่', en: 'Take Place Photo' },
  { th: 'กดถ่ายรูป', en: 'Snap photo' },
  { th: 'ถ่ายใหม่', en: 'Retake' },
  { th: 'ใช้รูปนี้', en: 'Use This Photo' },
  { th: 'สลับกล้อง', en: 'Flip Camera' },
  { th: 'ปิดกล้อง', en: 'Close Camera' },
  { th: 'ลบรูปนี้', en: 'Remove this photo' },
  { th: 'ข้อความบรรยาย', en: 'Caption / Description' },
  { th: 'ตัวอักษร', en: 'characters' },
  { th: 'รูปภาพปัจจุบัน', en: 'Current Photo' },
  { th: 'เลือกรูปภาพแล้ว', en: 'Photo Selected' },
  { th: 'แตะเพื่อเปลี่ยนรูป', en: 'Tap to change photo' },
  { th: 'เปลี่ยนรูป', en: 'Change Photo' },
  { th: 'เพิ่มรูปภาพ', en: 'Add Photo' },
  { th: 'กำลังโพสต์...', en: 'Posting...' },
  { th: 'โพสต์', en: 'Post' },

  // Feed, Stories, Cards
  { th: 'นักเดินทางแนะนำ', en: 'Top Travelers' },
  { th: 'ค้นหาเพิ่ม →', en: 'Find More →' },
  { th: 'ค้นหาเพิ่ม', en: 'Find More' },
  { th: 'บัญชีผู้เยี่ยมชม', en: 'Guest Mode' },
  { th: 'อยากสำรวจจุดเช็คอินเพิ่มเติม?', en: 'Want to explore more check-ins?' },
  { th: 'สมัครสมาชิกใหม่', en: 'Sign Up' },
  { th: 'สมัครสมาชิกฟรี', en: 'Sign Up Free' },
  { th: 'เข้าสู่ระบบเพื่อเริ่มเช็คอิน', en: 'Log in to start check-in' },
  { th: 'เช็คอินสถานที่แรกเลย', en: 'Check-in first place' },
  { th: 'ยังไม่มีจุดเช็คอินในขณะนี้', en: 'No check-ins at this time' },
  { th: 'ดูความคิดเห็นทั้งหมด', en: 'View all comments' },
  { th: 'แชร์ไปยังแอปพลิเคชัน', en: 'Share to Applications' },
  { th: 'แชร์จุดเช็คอิน', en: 'Share Check-in' },
  { th: 'บันทึกสถานที่', en: 'Save Place' },
  { th: 'เปิด Google Maps', en: 'Open Google Maps' },
  { th: 'พิกัด GPS', en: 'GPS Coordinates' },
  { th: 'ดูรายละเอียดจุดเช็คอิน', en: 'View Check-in Details' },
  { th: 'ดูรายละเอียด', en: 'View Details' },
  { th: 'ลบโพสต์', en: 'Delete Post' },
  { th: 'ความคิดเห็น', en: 'Comments' },
  { th: 'ถูกใจ', en: 'Like' },
  { th: 'แชร์อื่นๆ', en: 'More Share Options' },
  { th: 'คัดลอกลิงก์', en: 'Copy Link' },
  { th: 'คัดลอกแล้ว', en: 'Copied' },
  { th: 'คัดลอก', en: 'Copy' },

  // Profile & Edit Profile
  { th: 'แก้ไขข้อมูลและรูปโปรไฟล์', en: 'Edit Profile & Avatar' },
  { th: 'แก้ไขข้อมูลโปรไฟล์', en: 'Edit Profile Information' },
  { th: 'ตั้งค่าโปรไฟล์', en: 'Profile Settings' },
  { th: 'โปรไฟล์ของฉัน', en: 'My Profile' },
  { th: 'โปรไฟล์', en: 'Profile' },
  { th: 'แก้ไขโปรไฟล์', en: 'Edit Profile' },
  { th: 'แก้ไขโปรไฟล์', en: 'Edit profile' },
  { th: 'แชร์โปรไฟล์', en: 'Share profile' },
  { th: 'แชร์โปรไฟล์', en: 'Share Profile' },
  { th: 'กำลังติดตาม', en: 'Following' },
  { th: 'กำลังติดตาม', en: 'following' },
  { th: 'ผู้ติดตาม', en: 'Followers' },
  { th: 'ผู้ติดตาม', en: 'followers' },
  { th: 'ติดตาม', en: 'Follow' },
  { th: 'โพสต์ของฉัน', en: 'My Posts' },
  { th: 'โพสต์', en: 'Posts' },
  { th: 'โพสต์', en: 'posts' },
  { th: 'บันทึกไว้', en: 'Saved' },
  { th: 'แท็ก', en: 'Tagged' },
  { th: 'ยังไม่มีรายการเช็คอิน', en: 'No check-in posts yet' },
  { th: 'ยังไม่มีโพสต์เช็คอิน', en: 'No check-in posts yet' },
  { th: 'โพสต์เช็คอินแรก', en: 'Post first check-in' },
  { th: 'ยังไม่มีโพสต์ที่บันทึกไว้', en: 'No saved check-in posts yet' },
  { th: 'ยังไม่ได้บันทึกสถานที่ใดไว้', en: 'No saved places yet' },
  { th: 'ยังไม่มีโพสต์ที่กดถูกใจ', en: 'No liked check-in posts yet' },
  { th: 'ยังไม่มีรูปที่ถูกแท็ก', en: 'No tagged photos yet' },
  { th: 'ชื่อที่แสดง', en: 'Display Name' },
  { th: 'ข้อความแนะนำตัว', en: 'Bio / Introduction' },
  { th: 'หมวดหมู่ / MBTI / สถานะ', en: 'Category / MBTI / Status' },
  { th: 'ข้อมูลโปรไฟล์เพิ่มเติม', en: 'Additional Profile Details' },
  { th: 'รายละเอียดโปรไฟล์สไตล์ IG', en: 'Additional Profile Details' },
  { th: 'ลิงก์ภายนอก / โซเชียล', en: 'External / Social Links' },
  { th: 'ชื่อปุ่ม/โซเชียล', en: 'Button / Social Title' },
  { th: 'URL ลิงก์', en: 'Link URL' },
  { th: 'เพลงโปรด / แท็กเสียง', en: 'Favorite Music / Audio Tag' },
  { th: 'ชื่อเพลง / ข้อความเสียง', en: 'Song Title / Audio Label' },
  { th: 'URL ลิงก์เพลง', en: 'Music URL Link' },
  { th: 'รูปภาพโปรไฟล์', en: 'Profile Picture' },
  { th: 'เปลี่ยนรูปโปรไฟล์ใหม่', en: 'Change Profile Picture' },
  { th: 'ข้อมูลผู้ใช้', en: 'User Information' },
  { th: 'เว็บไซต์', en: 'Website' },
  { th: 'เพลงโปรด', en: 'Favorite Music' },
  { th: 'ชื่อ', en: 'First Name' },
  { th: 'ชื่อ', en: 'First name' },
  { th: 'นามสกุล', en: 'Last Name' },
  { th: 'นามสกุล', en: 'Last name' },
  { th: 'อีเมล', en: 'Email Address' },
  { th: 'อีเมล', en: 'Email address' },
  { th: 'ชื่อที่แสดง (เช่น ปูนเองก็เหนื่อย🫠)', en: 'Display Name (e.g. Alex Traveling)' },
  { th: 'หมวดหมู่ / MBTI / สถานะ (เช่น ENFP - T)', en: 'Category / MBTI / Status (e.g. ENFP - T)' },
  { th: 'คำอธิบายโปรไฟล์ (Bio)', en: 'Profile Bio / Introduction' },
  { th: 'ชื่อลิงก์โปรไฟล์/โซเชียล (เช่น Facebook / Monphrakan)', en: 'Social Link Title (e.g. Facebook / Instagram)' },
  { th: 'เพลงโปรด / แท็กเสียง (เช่น ดาวนำทาง)', en: 'Favorite Music / Audio Tag (e.g. Guiding Star)' },

  // Search & Map
  { th: 'ค้นหาผู้ใช้งาน', en: 'Search Users' },
  { th: 'ค้นหาเพื่อนและผู้ใช้งาน', en: 'Find Friends & Users' },
  { th: 'ค้นหาเพื่อน', en: 'Find Friends' },
  { th: 'ค้นหา', en: 'Search' },
  { th: 'ผู้ใช้แนะนำสำหรับคุณ', en: 'Suggested Users for You' },
  { th: 'ดูผู้ใช้แนะนำ', en: 'View Suggested Users' },
  { th: 'ผลการค้นหาสำหรับ', en: 'Search results for' },
  { th: 'ไม่พบผู้ใช้งานที่ตรงกับการค้นหา', en: 'No users found matching your search' },
  { th: 'ไม่พบผู้ใช้งานที่ตรงกับ', en: 'No users found matching' },
  { th: 'ผู้ดูแลระบบ', en: 'Admin' },
  { th: 'แผงควบคุมระบบ', en: 'Admin Dashboard' },
  { th: 'แผงควบคุมและสถิติระบบ', en: 'Admin Dashboard' },
  { th: 'แดชบอร์ดจัดการระบบ', en: 'Admin Dashboard' },
  { th: 'สำรวจจุดเช็คอินตามโซนและจังหวัด', en: 'Explore Check-ins by Zone and Province' },
  { th: 'เลือกภูมิภาค:', en: 'Select Region:' },
  { th: 'เลือกภูมิภาค', en: 'Select Region' },
  { th: 'รีเซ็ตตัวกรอง', en: 'Reset Filters' },
  { th: 'ทุกภูมิภาค', en: 'All Regions' },
  { th: '-- เจาะจงทุกจังหวัดในโซน --', en: '-- All Provinces in Zone --' },
  { th: '-- เลือกจังหวัด --', en: '-- Select Province --' },
  { th: 'ค้นหาชื่อสถานที่ หรือคำบรรยาย...', en: 'Search place name or caption...' },
  { th: 'ซูมตำแหน่ง', en: 'Zoom Location' },
  { th: 'กำลังแสดง: ทั่วประเทศไทย', en: 'Showing: All across Thailand' },
  { th: 'รายการจุดเช็คอินในโซนที่เลือก', en: 'Check-in spots in selected zone' },
  { th: 'ยังไม่มีจุดเช็คอินในจังหวัดหรือเงื่อนไขนี้', en: 'No check-ins in this province or filter' },
  { th: 'ปักหมุดที่นี่เลย', en: 'Pin Check-in Here' },
  { th: 'จุดบนแผนที่', en: 'points on map' },
  { th: 'เช็คอินที่นี่', en: 'Check-in Here' },
  { th: 'ภูมิภาค', en: 'Region' },
  { th: 'จังหวัด', en: 'Province' },
  { th: 'ทุกจังหวัด', en: 'All Provinces' },

  // Thailand 6 Geographic Regions
  { th: 'ภาคตะวันออกเฉียงเหนือ', en: 'Northeastern Thailand' },
  { th: 'ภาคตะวันออก', en: 'Eastern Thailand' },
  { th: 'ภาคตะวันตก', en: 'Western Thailand' },
  { th: 'ภาคเหนือ', en: 'Northern Thailand' },
  { th: 'ภาคกลาง', en: 'Central Thailand' },
  { th: 'ภาคใต้', en: 'Southern Thailand' },

  // Thailand 77 Provinces
  { th: 'พระนครศรีอยุธยา', en: 'Phra Nakhon Si Ayutthaya' },
  { th: 'ประจวบคีรีขันธ์', en: 'Prachuap Khiri Khan' },
  { th: 'กรุงเทพมหานคร', en: 'Bangkok' },
  { th: 'นครศรีธรรมราช', en: 'Nakhon Si Thammarat' },
  { th: 'อุบลราชธานี', en: 'Ubon Ratchathani' },
  { th: 'สมุทรสงคราม', en: 'Samut Songkhram' },
  { th: 'สมุทรปราการ', en: 'Samut Prakan' },
  { th: 'หนองบัวลำภู', en: 'Nong Bua Lamphu' },
  { th: 'นครราชสีมา', en: 'Nakhon Ratchasima' },
  { th: 'สุราษฎร์ธานี', en: 'Surat Thani' },
  { th: 'อำนาจเจริญ', en: 'Amnat Charoen' },
  { th: 'มหาสารคาม', en: 'Maha Sarakham' },
  { th: 'กำแพงเพชร', en: 'Kamphaeng Phet' },
  { th: 'แม่ฮ่องสอน', en: 'Mae Hong Son' },
  { th: 'สมุทรสาคร', en: 'Samut Sakhon' },
  { th: 'กาญจนบุรี', en: 'Kanchanaburi' },
  { th: 'ฉะเชิงเทรา', en: 'Chachoengsao' },
  { th: 'สุพรรณบุรี', en: 'Suphan Buri' },
  { th: 'นครสวรรค์', en: 'Nakhon Sawan' },
  { th: 'ปราจีนบุรี', en: 'Prachinburi' },
  { th: 'นครนายก', en: 'Nakhon Nayok' },
  { th: 'นครพนม', en: 'Nakhon Phanom' },
  { th: 'นครปฐม', en: 'Nakhon Pathom' },
  { th: 'เพชรบูรณ์', en: 'Phetchabun' },
  { th: 'พิษณุโลก', en: 'Phitsanulok' },
  { th: 'อุตรดิตถ์', en: 'Uttaradit' },
  { th: 'จันทบุรี', en: 'Chanthaburi' },
  { th: 'อุดรธานี', en: 'Udon Thani' },
  { th: 'ปทุมธานี', en: 'Pathum Thani' },
  { th: 'อุทัยธานี', en: 'Uthai Thani' },
  { th: 'เชียงใหม่', en: 'Chiang Mai' },
  { th: 'เชียงราย', en: 'Chiang Rai' },
  { th: 'ศรีสะเกษ', en: 'Sisaket' },
  { th: 'มุกดาหาร', en: 'Mukdahan' },
  { th: 'กาฬสินธุ์', en: 'Kalasin' },
  { th: 'สกลนคร', en: 'Sakon Nakhon' },
  { th: 'นราธิวาส', en: 'Narathiwat' },
  { th: 'พัทลุง', en: 'Phatthalung' },
  { th: 'นนทบุรี', en: 'Nonthaburi' },
  { th: 'ขอนแก่น', en: 'Khon Kaen' },
  { th: 'บุรีรัมย์', en: 'Buriram' },
  { th: 'สุรินทร์', en: 'Surin' },
  { th: 'ร้อยเอ็ด', en: 'Roi Et' },
  { th: 'หนองคาย', en: 'Nong Khai' },
  { th: 'บึงกาฬ', en: 'Bueng Kan' },
  { th: 'สระแก้ว', en: 'Sa Kaeo' },
  { th: 'เพชรบุรี', en: 'Phetchaburi' },
  { th: 'ราชบุรี', en: 'Ratchaburi' },
  { th: 'ชุมพร', en: 'Chumphon' },
  { th: 'ปัตตานี', en: 'Pattani' },
  { th: 'สงขลา', en: 'Songkhla' },
  { th: 'อ่างทอง', en: 'Ang Thong' },
  { th: 'สิงห์บุรี', en: 'Sing Buri' },
  { th: 'ชัยภูมิ', en: 'Chaiyaphum' },
  { th: 'สุโขทัย', en: 'Sukhothai' },
  { th: 'ชลบุรี', en: 'Chonburi' },
  { th: 'ระยอง', en: 'Rayong' },
  { th: 'พังงา', en: 'Phang Nga' },
  { th: 'ภูเก็ต', en: 'Phuket' },
  { th: 'ระนอง', en: 'Ranong' },
  { th: 'สระบุรี', en: 'Saraburi' },
  { th: 'พิจิตร', en: 'Phichit' },
  { th: 'ยโสธร', en: 'Yasothon' },
  { th: 'กระบี่', en: 'Krabi' },
  { th: 'ลำปาง', en: 'Lampang' },
  { th: 'ลำพูน', en: 'Lamphun' },
  { th: 'ชัยนาท', en: 'Chainat' },
  { th: 'ลพบุรี', en: 'Lopburi' },
  { th: 'พะเยา', en: 'Phayao' },
  { th: 'ตรัง', en: 'Trang' },
  { th: 'สตูล', en: 'Satun' },
  { th: 'ยะลา', en: 'Yala' },
  { th: 'ตราด', en: 'Trat' },
  { th: 'แพร่', en: 'Phrae' },
  { th: 'น่าน', en: 'Nan' },
  { th: 'ตาก', en: 'Tak' },
  { th: 'เลย', en: 'Loei' },

  // Auth, PDPA, Errors
  { th: 'ยินดีต้อนรับกลับมา', en: 'Welcome Back' },
  { th: 'สร้างบัญชีผู้ใช้ใหม่', en: 'Create New Account' },
  { th: 'ชื่อผู้ใช้', en: 'Username' },
  { th: 'รหัสผ่าน', en: 'Password' },
  { th: 'ยืนยันรหัสผ่าน', en: 'Confirm Password' },
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
  { th: 'เข้าสู่ระบบเพื่อใช้งาน', en: 'Log In to Continue' },
  { th: 'เข้าสู่ระบบ / สมัครสมาชิก', en: 'Log In / Sign Up' },
  { th: 'เข้าสู่ระบบ', en: 'Log In' },
  { th: 'สมัครสมาชิก', en: 'Sign Up' },
  { th: 'สมัคร', en: 'Sign Up' },
  { th: 'ออกจากระบบ', en: 'Log Out' },
  { th: 'ไว้ทีหลัง', en: 'Maybe Later' },
  { th: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)', en: 'Privacy Policy (PDPA)' },
  { th: 'การคุ้มครองข้อมูลส่วนบุคคลและคุกกี้ (PDPA)', en: 'Privacy Policy & Cookies (PDPA)' },
  { th: 'ฉันยอมรับ ข้อกำหนดการใช้งานและนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)', en: 'I agree to the Terms of Service & Privacy Policy (PDPA)' },
  { th: 'นโยบายคุ้มครองข้อมูล (PDPA)', en: 'Privacy Policy (PDPA)' },
  { th: 'ยินยอมทั้งหมด', en: 'Accept All' },
  { th: 'อ่านนโยบาย', en: 'Read Policy' },
  { th: 'รับทราบและเข้าใจแล้ว', en: 'I understand' },
  { th: 'ยืนยันการลบเช็คอิน?', en: 'Confirm Check-in Deletion?' },
  { th: 'ยืนยันการลบเช็คอิน', en: 'Confirm Check-in Deletion' },
  { th: 'ยืนยันการลบ', en: 'Confirm Delete' },
  { th: '404 - ไม่พบหน้าที่คุณค้นหา', en: '404 - Page Not Found' },
  { th: '403 - ไม่มีสิทธิ์เข้าถึง', en: '403 - Access Forbidden' },
  { th: '500 - เกิดข้อผิดพลาดของเซิร์ฟเวอร์', en: '500 - Internal Server Error' },
  { th: 'กลับสู่หน้าหลัก', en: 'Back to Home' },
  { th: 'กลับไปการตั้งค่า', en: 'Back to Settings' },
  { th: 'ย้อนกลับ', en: 'Back' },
  { th: 'ยกเลิก', en: 'Cancel' },
  { th: 'ปิด', en: 'Close' },
  { th: 'ส่ง', en: 'Send' },
  { th: 'ลบ', en: 'Delete' },
  { th: 'แก้ไข', en: 'Edit' },
  { th: 'ติดตาม', en: 'Follow' },
  { th: 'เลิกติดตาม', en: 'Unfollow' },
  { th: 'ที่แล้ว', en: 'ago' },
  { th: 'รายการ', en: 'comments' },
  { th: 'คน', en: 'people' },
  { th: 'เช็คอิน', en: 'check-ins' },
  { th: 'ก่อนหน้า', en: 'Previous' },
  { th: 'ถัดไป', en: 'Next' },
  { th: 'หน้าหลัก', en: 'Home' },
  { th: 'แผนที่', en: 'Map' },
  { th: 'เกี่ยวกับแอปพลิเคชัน', en: 'About Application' },
  { th: 'แดชบอร์ดจัดการระบบ', en: 'Admin Dashboard' },
  { th: 'ภาษา / Language', en: 'Language' },
  { th: 'ภาษา', en: 'Language' },
  { th: 'พัฒนาโดยทีม CS68', en: 'Developed by CS68 Team' },
  { th: 'ผู้รับผิดชอบและออกแบบแอปพลิเคชัน', en: 'Application Designers and Engineering Team' },
  { th: 'อัปโหลดภาพถ่ายเก็บไว้บน Cloudinary Storage ปลอดภัย', en: 'Secure photo storage powered by Cloudinary Storage' },
  { th: 'ดึงพิกัด Geolocation อัตโนมัติและแสดงบนแผนที่ Leaflet', en: 'Auto Geolocation retrieval & Interactive Leaflet Map' },
  { th: 'ฐานข้อมูลความเร็วสูง Neon PostgreSQL Cloud Database', en: 'High-performance Neon PostgreSQL Cloud Database' },
  { th: 'พบ', en: 'Found' },
  { th: 'แห่ง', en: 'places' },
];

// Sort phrases by Thai text length descending so longer matching strings replace first
const AUTO_PHRASES = [...RAW_AUTO_PHRASES].sort((a, b) => b.th.length - a.th.length);

class I18nManager {
  constructor() {
    this.currentLang = this.getInitialLanguage();
    this.originalNodes = new WeakMap();
    this._translateDebounce = null;
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
    if (langDict && langDict[key]) return langDict[key];
    const auto = this.translateText(key);
    if (auto && auto !== key) return auto;
    return fallback || key;
  }

  translateText(text) {
    if (!text || typeof text !== 'string') return text;
    const isEn = this.currentLang === 'en';
    let result = text;
    for (const { th, en } of AUTO_PHRASES) {
      const from = isEn ? th : en;
      const to = isEn ? en : th;
      if (result.includes(from)) {
        result = result.split(from).join(to);
      }
    }
    return result;
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
          if (parent.hasAttribute('data-no-i18n') || parent.hasAttribute('data-i18n')) {
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

      for (const { th, en } of AUTO_PHRASES) {
        const from = isEn ? th : en;
        const to = isEn ? en : th;
        if (translated.includes(from)) {
          translated = translated.split(from).join(to);
        }
      }

      if (currentNode.nodeValue !== translated) {
        currentNode.nodeValue = translated;
      }
    }

    // 3. Scan Common Form Attributes (placeholder, title, value)
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      if (el.hasAttribute('data-i18n-placeholder') || el.dataset.i18nTarget === 'placeholder') {
        return;
      }
      if (!el.dataset.origPlaceholder) {
        el.dataset.origPlaceholder = el.getAttribute('placeholder') || '';
      }
      let ph = el.dataset.origPlaceholder;
      for (const { th, en } of AUTO_PHRASES) {
        const from = isEn ? th : en;
        const to = isEn ? en : th;
        if (ph.includes(from)) ph = ph.split(from).join(to);
      }
      if (ph) el.setAttribute('placeholder', ph);
    });

    document.querySelectorAll('[title]').forEach(el => {
      if (el.hasAttribute('data-i18n-title') || el.dataset.i18nTarget === 'title') {
        return;
      }
      if (!el.dataset.origTitle) {
        el.dataset.origTitle = el.getAttribute('title') || '';
      }
      let title = el.dataset.origTitle;
      for (const { th, en } of AUTO_PHRASES) {
        const from = isEn ? th : en;
        const to = isEn ? en : th;
        if (title && title.includes(from)) title = title.split(from).join(to);
      }
      if (title) el.setAttribute('title', title);
    });

    // 4. Scan Select Options
    document.querySelectorAll('select option').forEach(opt => {
      if (opt.hasAttribute('data-i18n')) {
        return;
      }
      if (!opt.dataset.origText) {
        opt.dataset.origText = opt.textContent;
      }
      let txt = opt.dataset.origText;
      for (const { th, en } of AUTO_PHRASES) {
        const from = isEn ? th : en;
        const to = isEn ? en : th;
        if (txt && txt.includes(from)) txt = txt.split(from).join(to);
      }
      if (txt && opt.textContent !== txt) {
        opt.textContent = txt;
      }
    });

    // 5. Update Dynamic Comments Modal input
    const commentInput = document.getElementById('modalCommentInput');
    if (commentInput && window.CURRENT_USERNAME) {
      const prefix = dict['comments_placeholder_prefix'] || (isEn ? 'Comment as' : 'แสดงความคิดเห็นในชื่อ');
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
