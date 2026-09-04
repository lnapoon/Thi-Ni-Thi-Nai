// Geolocation & Client-Side Enhancement Helper

document.addEventListener('DOMContentLoaded', function () {
  // 1. Geolocation capture for Check-in Form
  const latInput = document.getElementById('id_latitude');
  const lngInput = document.getElementById('id_longitude');
  const geoStatus = document.getElementById('geo-status');
  const btnGetLocation = document.getElementById('btn-get-location');

  function updateLocationDisplay(lat, lng) {
    if (latInput && lngInput) {
      latInput.value = lat;
      lngInput.value = lng;
    }
    if (geoStatus) {
      const isEn = window.i18n && window.i18n.currentLang === 'en';
      const label = isEn ? 'GPS Received' : 'ได้รับพิกัด';
      geoStatus.innerHTML = `
        <span class="badge bg-success-subtle text-success border border-success-subtle py-1 px-2 rounded-pill">
          <i class="bi bi-geo-alt-fill me-1"></i> <span data-i18n="form_gps_received">${label}</span>: ${lat.toFixed(4)}, ${lng.toFixed(4)}
        </span>
      `;
    }
  }

  function fetchCurrentLocation() {
    const isEn = window.i18n && window.i18n.currentLang === 'en';
    if (!navigator.geolocation) {
      if (geoStatus) {
        const label = isEn ? 'GPS Not Supported' : 'ไม่รองรับ GPS';
        geoStatus.innerHTML = `
          <span class="badge bg-secondary-subtle text-secondary py-1 px-2 rounded-pill">
            <i class="bi bi-info-circle me-1"></i> <span data-i18n="form_gps_unsupported">${label}</span>
          </span>
        `;
      }
      return;
    }

    if (geoStatus) {
      const label = isEn ? 'Locating GPS coordinates...' : 'กำลังจับพิกัด GPS...';
      geoStatus.innerHTML = `
        <span class="badge bg-primary-subtle text-primary py-1 px-2 rounded-pill">
          <span class="spinner-border spinner-border-sm me-1" role="status"></span> <span data-i18n="form_gps_locating">${label}</span>
        </span>
      `;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        updateLocationDisplay(lat, lng);
      },
      function (error) {
        let i18nKey = 'form_gps_none';
        let defaultTh = 'ไม่ได้ระบุพิกัด';
        let defaultEn = 'No GPS coordinates';
        if (error.code === error.PERMISSION_DENIED) {
          i18nKey = 'form_gps_denied';
          defaultTh = 'ปฏิเสธการเข้าถึงพิกัด';
          defaultEn = 'GPS Access Denied';
        }
        const activeEn = window.i18n && window.i18n.currentLang === 'en';
        const label = activeEn ? defaultEn : defaultTh;
        if (geoStatus) {
          geoStatus.innerHTML = `
            <span class="badge bg-light text-muted border py-1 px-2 rounded-pill">
              <i class="bi bi-geo me-1"></i> <span data-i18n="${i18nKey}">${label}</span>
            </span>
          `;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  // If we are on the checkin create form, auto-trigger location or bind button
  if (latInput && lngInput) {
    if (latInput.value && lngInput.value) {
      // Existing value in edit mode
      updateLocationDisplay(parseFloat(latInput.value), parseFloat(lngInput.value));
    } else {
      // Attempt auto-capture on new check-in
      fetchCurrentLocation();
    }
  }

  if (btnGetLocation) {
    btnGetLocation.addEventListener('click', function (e) {
      e.preventDefault();
      fetchCurrentLocation();
    });
  }

  // 2. Image File Preview
  const photoInput = document.getElementById('id_photo');
  const previewContainer = document.getElementById('photo-preview-box');
  const previewImg = document.getElementById('photo-preview-img');
  const previewPlaceholder = document.getElementById('photo-preview-placeholder');

  if (photoInput && previewImg) {
    photoInput.addEventListener('change', function (e) {
      const file = this.files[0];
      if (file) {
        // Client side size warning
        if (file.size > 5 * 1024 * 1024) {
          alert('คำเตือน: ขนาดไฟล์รูปภาพเกิน 5MB กรุณาเลือกรูปภาพที่มีขนาดเล็กลง');
        }
        const reader = new FileReader();
        reader.onload = function (event) {
          previewImg.src = event.target.result;
          previewImg.classList.remove('d-none');
          if (previewPlaceholder) {
            previewPlaceholder.classList.add('d-none');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 3. AJAX Like Toggle Button
  document.querySelectorAll('.ajax-like-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const actionUrl = this.action;
      const csrfToken = this.querySelector('[name=csrfmiddlewaretoken]').value;
      const likeBtn = this.querySelector('.btn-like');
      const likeCountSpan = this.querySelector('.like-count');

      fetch(actionUrl, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.liked) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').className = 'bi bi-heart-fill text-danger';
          } else {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('i').className = 'bi bi-heart';
          }
          if (likeCountSpan) {
            likeCountSpan.textContent = data.likes_count;
          }
        })
        .catch(err => {
          console.error('Like toggle error:', err);
          // Fallback to regular submit if ajax fails
          form.submit();
        });
    });
  });
});
