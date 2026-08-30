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
      geoStatus.innerHTML = `
        <span class="badge bg-success-subtle text-success border border-success-subtle py-2 px-3">
          <i class="bi bi-geo-alt-fill me-1"></i> ได้รับพิกัดแล้ว: ${lat.toFixed(4)}, ${lng.toFixed(4)}
        </span>
      `;
    }
  }

  function fetchCurrentLocation() {
    if (!navigator.geolocation) {
      if (geoStatus) {
        geoStatus.innerHTML = `
          <span class="badge bg-secondary-subtle text-secondary py-2 px-3">
            <i class="bi bi-info-circle me-1"></i> อุปกรณ์ไม่รองรับการจับพิกัด GPS (สามารถพิมพ์ชื่อสถานที่ได้)
          </span>
        `;
      }
      return;
    }

    if (geoStatus) {
      geoStatus.innerHTML = `
        <span class="badge bg-primary-subtle text-primary py-2 px-3">
          <span class="spinner-border spinner-border-sm me-1" role="status"></span> กำลังดึงพิกัดตำแหน่งของคุณ...
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
        let msg = 'ไม่สามารถดึงพิกัดได้ (สามารถโพสต์โดยระบุเพียงชื่อสถานที่ได้)';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'ปฏิเสธการเข้าถึงพิกัด (สามารถโพสต์โดยระบุเพียงชื่อสถานที่ได้)';
        }
        if (geoStatus) {
          geoStatus.innerHTML = `
            <span class="badge bg-light text-muted border py-2 px-3">
              <i class="bi bi-geo me-1"></i> ${msg}
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
