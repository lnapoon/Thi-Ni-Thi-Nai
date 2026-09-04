"""
Master data for Thailand's 6 Geographic Regions and 77 Provinces.
Includes center coordinates (Latitude, Longitude) for map panning/zooming.
"""

REGIONS_DATA = {
    "ภาคเหนือ": {
        "id": "north",
        "name": "ภาคเหนือ",
        "name_en": "Northern Thailand",
        "lat": 18.7883,
        "lng": 98.9853,
        "zoom": 7,
        "provinces": [
            {"name": "เชียงใหม่", "name_en": "Chiang Mai", "lat": 18.7883, "lng": 98.9853, "zoom": 10},
            {"name": "เชียงราย", "name_en": "Chiang Rai", "lat": 19.9072, "lng": 99.8325, "zoom": 10},
            {"name": "น่าน", "name_en": "Nan", "lat": 18.7756, "lng": 100.7730, "zoom": 10},
            {"name": "พะเยา", "name_en": "Phayao", "lat": 19.1664, "lng": 99.9019, "zoom": 10},
            {"name": "แพร่", "name_en": "Phrae", "lat": 18.1446, "lng": 100.1413, "zoom": 10},
            {"name": "แม่ฮ่องสอน", "name_en": "Mae Hong Son", "lat": 19.3021, "lng": 97.9654, "zoom": 10},
            {"name": "ลำปาง", "name_en": "Lampang", "lat": 18.2888, "lng": 99.4928, "zoom": 10},
            {"name": "ลำพูน", "name_en": "Lamphun", "lat": 18.5745, "lng": 99.0087, "zoom": 10},
            {"name": "อุตรดิตถ์", "name_en": "Uttaradit", "lat": 17.6201, "lng": 100.0993, "zoom": 10},
        ],
    },
    "ภาคกลาง": {
        "id": "central",
        "name": "ภาคกลาง",
        "name_en": "Central Thailand",
        "lat": 13.7563,
        "lng": 100.5018,
        "zoom": 8,
        "provinces": [
            {"name": "กรุงเทพมหานคร", "name_en": "Bangkok", "lat": 13.7563, "lng": 100.5018, "zoom": 11},
            {"name": "นนทบุรี", "name_en": "Nonthaburi", "lat": 13.8591, "lng": 100.5217, "zoom": 11},
            {"name": "ปทุมธานี", "name_en": "Pathum Thani", "lat": 14.0208, "lng": 100.5250, "zoom": 11},
            {"name": "สมุทรปราการ", "name_en": "Samut Prakan", "lat": 13.5991, "lng": 100.5998, "zoom": 11},
            {"name": "พระนครศรีอยุธยา", "name_en": "Phra Nakhon Si Ayutthaya", "lat": 14.3532, "lng": 100.5684, "zoom": 11},
            {"name": "อ่างทอง", "name_en": "Ang Thong", "lat": 14.5896, "lng": 100.4550, "zoom": 11},
            {"name": "ลพบุรี", "name_en": "Lopburi", "lat": 14.7995, "lng": 100.6534, "zoom": 10},
            {"name": "สิงห์บุรี", "name_en": "Sing Buri", "lat": 14.8879, "lng": 100.4042, "zoom": 11},
            {"name": "ชัยนาท", "name_en": "Chainat", "lat": 15.1852, "lng": 100.1252, "zoom": 11},
            {"name": "สระบุรี", "name_en": "Saraburi", "lat": 14.5289, "lng": 100.9108, "zoom": 11},
            {"name": "นครนายก", "name_en": "Nakhon Nayok", "lat": 14.2069, "lng": 101.2131, "zoom": 11},
            {"name": "สุพรรณบุรี", "name_en": "Suphan Buri", "lat": 14.4745, "lng": 100.1177, "zoom": 10},
            {"name": "นครปฐม", "name_en": "Nakhon Pathom", "lat": 13.8196, "lng": 100.0622, "zoom": 11},
            {"name": "สมุทรสาคร", "name_en": "Samut Sakhon", "lat": 13.5475, "lng": 100.2744, "zoom": 11},
            {"name": "สมุทรสงคราม", "name_en": "Samut Songkhram", "lat": 13.4098, "lng": 99.9996, "zoom": 11},
            {"name": "กำแพงเพชร", "name_en": "Kamphaeng Phet", "lat": 16.4828, "lng": 99.5227, "zoom": 10},
            {"name": "พิจิตร", "name_en": "Phichit", "lat": 16.4419, "lng": 100.3488, "zoom": 10},
            {"name": "พิษณุโลก", "name_en": "Phitsanulok", "lat": 16.8211, "lng": 100.2659, "zoom": 10},
            {"name": "เพชรบูรณ์", "name_en": "Phetchabun", "lat": 16.4190, "lng": 101.1591, "zoom": 10},
            {"name": "สุโขทัย", "name_en": "Sukhothai", "lat": 17.0078, "lng": 99.8235, "zoom": 10},
            {"name": "นครสวรรค์", "name_en": "Nakhon Sawan", "lat": 15.6987, "lng": 100.1199, "zoom": 10},
            {"name": "อุทัยธานี", "name_en": "Uthai Thani", "lat": 15.3835, "lng": 100.0246, "zoom": 10},
        ],
    },
    "ภาคตะวันออกเฉียงเหนือ": {
        "id": "northeast",
        "name": "ภาคตะวันออกเฉียงเหนือ",
        "name_en": "Northeastern Thailand",
        "lat": 15.6705,
        "lng": 103.2036,
        "zoom": 7,
        "provinces": [
            {"name": "นครราชสีมา", "name_en": "Nakhon Ratchasima", "lat": 14.9799, "lng": 102.0978, "zoom": 10},
            {"name": "ขอนแก่น", "name_en": "Khon Kaen", "lat": 16.4419, "lng": 102.8359, "zoom": 10},
            {"name": "อุดรธานี", "name_en": "Udon Thani", "lat": 17.4157, "lng": 102.7872, "zoom": 10},
            {"name": "อุบลราชธานี", "name_en": "Ubon Ratchathani", "lat": 15.2448, "lng": 104.8473, "zoom": 10},
            {"name": "ชัยภูมิ", "name_en": "Chaiyaphum", "lat": 15.8105, "lng": 102.0315, "zoom": 10},
            {"name": "บุรีรัมย์", "name_en": "Buriram", "lat": 14.9930, "lng": 103.1029, "zoom": 10},
            {"name": "สุรินทร์", "name_en": "Surin", "lat": 14.8818, "lng": 103.4936, "zoom": 10},
            {"name": "ศรีสะเกษ", "name_en": "Sisaket", "lat": 15.1186, "lng": 104.3220, "zoom": 10},
            {"name": "ยโสธร", "name_en": "Yasothon", "lat": 15.7926, "lng": 104.1453, "zoom": 10},
            {"name": "มุกดาหาร", "name_en": "Mukdahan", "lat": 16.5436, "lng": 104.7235, "zoom": 10},
            {"name": "ร้อยเอ็ด", "name_en": "Roi Et", "lat": 16.0538, "lng": 103.6520, "zoom": 10},
            {"name": "กาฬสินธุ์", "name_en": "Kalasin", "lat": 16.4322, "lng": 103.5063, "zoom": 10},
            {"name": "มหาสารคาม", "name_en": "Maha Sarakham", "lat": 16.1851, "lng": 103.3007, "zoom": 10},
            {"name": "หนองคาย", "name_en": "Nong Khai", "lat": 17.8783, "lng": 102.7413, "zoom": 10},
            {"name": "หนองบัวลำภู", "name_en": "Nong Bua Lamphu", "lat": 17.2044, "lng": 102.4407, "zoom": 10},
            {"name": "เลย", "name_en": "Loei", "lat": 17.4860, "lng": 101.7223, "zoom": 10},
            {"name": "สกลนคร", "name_en": "Sakon Nakhon", "lat": 17.1546, "lng": 104.1486, "zoom": 10},
            {"name": "นครพนม", "name_en": "Nakhon Phanom", "lat": 17.3998, "lng": 104.7694, "zoom": 10},
            {"name": "อำนาจเจริญ", "name_en": "Amnat Charoen", "lat": 15.8657, "lng": 104.6258, "zoom": 10},
            {"name": "บึงกาฬ", "name_en": "Bueng Kan", "lat": 18.3633, "lng": 103.6548, "zoom": 10},
        ],
    },
    "ภาคตะวันออก": {
        "id": "east",
        "name": "ภาคตะวันออก",
        "name_en": "Eastern Thailand",
        "lat": 13.1022,
        "lng": 101.5582,
        "zoom": 8,
        "provinces": [
            {"name": "ชลบุรี", "name_en": "Chonburi", "lat": 13.3611, "lng": 100.9847, "zoom": 10},
            {"name": "ระยอง", "name_en": "Rayong", "lat": 12.6814, "lng": 101.2816, "zoom": 10},
            {"name": "จันทบุรี", "name_en": "Chanthaburi", "lat": 12.6114, "lng": 102.1039, "zoom": 10},
            {"name": "ตราด", "name_en": "Trat", "lat": 12.2428, "lng": 102.5175, "zoom": 10},
            {"name": "ฉะเชิงเทรา", "name_en": "Chachoengsao", "lat": 13.6904, "lng": 101.0779, "zoom": 10},
            {"name": "ปราจีนบุรี", "name_en": "Prachinburi", "lat": 14.0510, "lng": 101.3734, "zoom": 10},
            {"name": "สระแก้ว", "name_en": "Sa Kaeo", "lat": 13.8140, "lng": 102.0583, "zoom": 10},
        ],
    },
    "ภาคตะวันตก": {
        "id": "west",
        "name": "ภาคตะวันตก",
        "name_en": "Western Thailand",
        "lat": 14.0228,
        "lng": 99.5328,
        "zoom": 8,
        "provinces": [
            {"name": "กาญจนบุรี", "name_en": "Kanchanaburi", "lat": 14.0228, "lng": 99.5328, "zoom": 10},
            {"name": "ตาก", "name_en": "Tak", "lat": 16.8837, "lng": 99.1258, "zoom": 10},
            {"name": "ประจวบคีรีขันธ์", "name_en": "Prachuap Khiri Khan", "lat": 11.8124, "lng": 99.7972, "zoom": 10},
            {"name": "เพชรบุรี", "name_en": "Phetchaburi", "lat": 13.1114, "lng": 99.9391, "zoom": 10},
            {"name": "ราชบุรี", "name_en": "Ratchaburi", "lat": 13.5358, "lng": 99.8164, "zoom": 10},
        ],
    },
    "ภาคใต้": {
        "id": "south",
        "name": "ภาคใต้",
        "name_en": "Southern Thailand",
        "lat": 8.5633,
        "lng": 99.3331,
        "zoom": 7,
        "provinces": [
            {"name": "กระบี่", "name_en": "Krabi", "lat": 8.0863, "lng": 98.9063, "zoom": 10},
            {"name": "ชุมพร", "name_en": "Chumphon", "lat": 10.4930, "lng": 99.1800, "zoom": 10},
            {"name": "ตรัง", "name_en": "Trang", "lat": 7.5563, "lng": 99.6114, "zoom": 10},
            {"name": "นครศรีธรรมราช", "name_en": "Nakhon Si Thammarat", "lat": 8.4304, "lng": 99.9631, "zoom": 10},
            {"name": "นราธิวาส", "name_en": "Narathiwat", "lat": 6.4255, "lng": 101.8253, "zoom": 10},
            {"name": "ปัตตานี", "name_en": "Pattani", "lat": 6.8696, "lng": 101.2501, "zoom": 10},
            {"name": "พังงา", "name_en": "Phang Nga", "lat": 8.4501, "lng": 98.5255, "zoom": 10},
            {"name": "พัทลุง", "name_en": "Phatthalung", "lat": 7.6167, "lng": 100.0740, "zoom": 10},
            {"name": "ภูเก็ต", "name_en": "Phuket", "lat": 7.8804, "lng": 98.3923, "zoom": 11},
            {"name": "ยะลา", "name_en": "Yala", "lat": 6.5411, "lng": 101.2813, "zoom": 10},
            {"name": "ระนอง", "name_en": "Ranong", "lat": 9.9658, "lng": 98.6348, "zoom": 10},
            {"name": "สงขลา", "name_en": "Songkhla", "lat": 7.1898, "lng": 100.5954, "zoom": 10},
            {"name": "สตูล", "name_en": "Satun", "lat": 6.6238, "lng": 100.0674, "zoom": 10},
            {"name": "สุราษฎร์ธานี", "name_en": "Surat Thani", "lat": 9.1388, "lng": 99.3215, "zoom": 10},
        ],
    },
}

# Flat maps for easy lookup
PROVINCE_TO_REGION = {}
ALL_PROVINCES = []
PROVINCE_COORDINATES = {}
PROVINCE_EN_MAP = {}
REGION_EN_MAP = {}

for reg_name, reg_info in REGIONS_DATA.items():
    REGION_EN_MAP[reg_name] = reg_info.get("name_en", reg_name)
    for p in reg_info["provinces"]:
        p_name = p["name"]
        p_name_en = p.get("name_en", p_name)
        PROVINCE_TO_REGION[p_name] = reg_name
        ALL_PROVINCES.append(p_name)
        PROVINCE_EN_MAP[p_name] = p_name_en
        PROVINCE_COORDINATES[p_name] = {
            "lat": p["lat"],
            "lng": p["lng"],
            "zoom": p.get("zoom", 10),
            "region": reg_name,
            "name_en": p_name_en,
        }

REGION_CHOICES = [("", "-- ทุกภูมิภาค --")] + [(k, k) for k in REGIONS_DATA.keys()]
PROVINCE_CHOICES = [("", "-- เลือกจังหวัด --")] + [(p, p) for p in sorted(ALL_PROVINCES)]


# Sort provinces by length descending to match longer names first
SORTED_PROVINCES_BY_LENGTH = sorted(ALL_PROVINCES, key=lambda x: len(x), reverse=True)


def infer_location_from_text_or_coords(place_name="", caption="", lat=None, lng=None):
    """
    Helper to guess province and region based on text mention or nearest province coordinates.
    """
    found_prov = ""
    found_region = ""

    combined_text = f"{place_name} {caption}"

    # 1. Match explicit prefix "จ." or "จังหวัด" first
    for prov in SORTED_PROVINCES_BY_LENGTH:
        if f"จ.{prov}" in combined_text or f"จังหวัด{prov}" in combined_text:
            found_prov = prov
            found_region = PROVINCE_TO_REGION.get(prov, "")
            return found_region, found_prov

    # 2. Match exact province name anywhere in text (longer names first)
    for prov in SORTED_PROVINCES_BY_LENGTH:
        if len(prov) <= 3 and prov in ["เลย", "ตาก", "แพร่", "น่าน"]:
            if f" {prov} " in f" {combined_text} " or f"ที่{prov}" in combined_text or f"ไป{prov}" in combined_text or f"เมือง{prov}" in combined_text:
                found_prov = prov
                found_region = PROVINCE_TO_REGION.get(prov, "")
                return found_region, found_prov
        elif prov in combined_text:
            found_prov = prov
            found_region = PROVINCE_TO_REGION.get(prov, "")
            return found_region, found_prov

    # 3. If not in text, check closest GPS coordinates
    if not found_prov and lat is not None and lng is not None:
        min_dist_sq = float("inf")
        closest_prov = None
        for prov, info in PROVINCE_COORDINATES.items():
            d_lat = lat - info["lat"]
            d_lng = lng - info["lng"]
            dist_sq = (d_lat ** 2) + (d_lng ** 2)
            if dist_sq < min_dist_sq:
                min_dist_sq = dist_sq
                closest_prov = prov

        if closest_prov and min_dist_sq < 2.5:
            found_prov = closest_prov
            found_region = PROVINCE_TO_REGION.get(closest_prov, "")

    return found_region, found_prov
