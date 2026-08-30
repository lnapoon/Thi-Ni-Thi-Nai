/**
 * Social interactions for "Thi Ni Thi Nai Rue"
 * - Instagram-style double tap to like
 * - Animated like / bookmark toggles
 * - Inline & detail AJAX comments
 * - Follow / Unfollow with dynamic count update
 * - Web Share API & Share Modal
 * - Followers / Following user list modals
 */

document.addEventListener('DOMContentLoaded', function () {
  const getCsrfToken = () => {
    const input = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (input) return input.value;
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  };

  /* ----------------------------------------------------
   * 1. DOUBLE TAP TO LIKE (Instagram Style)
   * ---------------------------------------------------- */
  document.querySelectorAll('.double-tap-like-area').forEach(wrapper => {
    let lastTap = 0;
    wrapper.addEventListener('pointerup', function (e) {
      const now = new Date().getTime();
      const timesince = now - lastTap;
      if (timesince < 300 && timesince > 0) {
        // Double tap triggered
        e.preventDefault();
        const checkinId = wrapper.dataset.checkinId;
        const likeBtn = document.querySelector(`.btn-like[data-checkin-id="${checkinId}"]`);
        
        // Show big animated bursting heart on image
        triggerHeartBurst(wrapper);

        // If not already liked, trigger like
        if (likeBtn && !likeBtn.classList.contains('liked')) {
          likeBtn.click();
        }
      }
      lastTap = now;
    });
  });

  function triggerHeartBurst(container) {
    const heart = document.createElement('div');
    heart.className = 'insta-heart-burst';
    heart.innerHTML = '<i class="bi bi-heart-fill"></i>';
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 900);
  }

  /* ----------------------------------------------------
   * 2. AJAX LIKE BUTTON WITH POP ANIMATION
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-like');
    if (!btn) return;

    e.preventDefault();
    const url = btn.dataset.url || btn.getAttribute('href') || (btn.form && btn.form.action);
    if (!url) return;

    // Trigger local animation immediately
    btn.classList.add('heart-pulse');
    setTimeout(() => btn.classList.remove('heart-pulse'), 400);

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success || data.liked !== undefined) {
        const isLiked = data.liked;
        const count = data.likes_count;

        // Update all like buttons matching this checkin
        const checkinId = btn.dataset.checkinId;
        const targets = checkinId ? document.querySelectorAll(`.btn-like[data-checkin-id="${checkinId}"]`) : [btn];

        targets.forEach(b => {
          const icon = b.querySelector('i');
          const countSpan = b.querySelector('.like-count');

          if (isLiked) {
            b.classList.add('liked');
            if (icon) {
              icon.className = 'bi bi-heart-fill text-danger';
            }
          } else {
            b.classList.remove('liked');
            if (icon) {
              icon.className = 'bi bi-heart text-dark';
            }
          }

          if (countSpan) {
            countSpan.textContent = count;
          }
        });
      }
    })
    .catch(err => console.error('Like error:', err));
  });

  /* ----------------------------------------------------
   * 3. AJAX BOOKMARK (SAVE) BUTTON
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-bookmark');
    if (!btn) return;

    e.preventDefault();
    const url = btn.dataset.url;
    if (!url) return;

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const isBookmarked = data.bookmarked;
        const checkinId = btn.dataset.checkinId;
        const targets = checkinId ? document.querySelectorAll(`.btn-bookmark[data-checkin-id="${checkinId}"]`) : [btn];

        targets.forEach(b => {
          const icon = b.querySelector('i');
          if (isBookmarked) {
            b.classList.add('bookmarked');
            if (icon) icon.className = 'bi bi-bookmark-fill text-warning';
            showToast('บันทึกไปยังคอลเลกชันแล้ว 🔖');
          } else {
            b.classList.remove('bookmarked');
            if (icon) icon.className = 'bi bi-bookmark text-dark';
            showToast('นำออกจากรายการบันทึกแล้ว');
          }
        });
      }
    })
    .catch(err => console.error('Bookmark error:', err));
  });

  /* ----------------------------------------------------
   * 4. AJAX COMMENTS (Quick Feed & Detail)
   * ---------------------------------------------------- */
  document.body.addEventListener('submit', function (e) {
    const form = e.target.closest('.ajax-comment-form');
    if (!form) return;

    e.preventDefault();
    const input = form.querySelector('input[name="text"], textarea[name="text"]');
    const text = input ? input.value.trim() : '';
    if (!text) return;

    const url = form.action;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (submitBtn) submitBtn.disabled = false;
      if (data.success) {
        if (input) input.value = '';

        const checkinId = form.dataset.checkinId;
        const commentsList = document.querySelector(`.comments-list[data-checkin-id="${checkinId}"]`);
        
        if (commentsList) {
          const commentEl = createCommentElement(data.comment);
          commentsList.appendChild(commentEl);
          commentEl.classList.add('highlight-fade');
        }

        // Update comment counter badges
        document.querySelectorAll(`.comment-count[data-checkin-id="${checkinId}"]`).forEach(el => {
          el.textContent = data.comments_count;
        });

        // Hide "No comments yet" placeholder if present
        const emptyPlaceholder = document.querySelector(`.empty-comments-placeholder[data-checkin-id="${checkinId}"]`);
        if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';

        showToast('แสดงความคิดเห็นเรียบร้อย 💬');
      } else {
        showToast(data.error || 'เกิดข้อผิดพลาดในการส่งความคิดเห็น', 'danger');
      }
    })
    .catch(err => {
      if (submitBtn) submitBtn.disabled = false;
      console.error('Comment error:', err);
    });
  });

  function createCommentElement(c) {
    const div = document.createElement('div');
    div.className = 'd-flex align-items-start gap-2 py-2 comment-item border-bottom border-light';
    div.dataset.commentId = c.id;

    const avatarHtml = c.avatar_url 
      ? `<img src="${c.avatar_url}" alt="${c.username}" class="rounded-circle border" width="28" height="28" style="object-fit:cover;">`
      : `<div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width:28px; height:28px; font-size: 0.75rem;"><i class="bi bi-person-fill"></i></div>`;

    div.innerHTML = `
      <a href="/accounts/profile/${c.username}/" class="text-decoration-none flex-shrink-0">
        ${avatarHtml}
      </a>
      <div class="flex-grow-1" style="font-size: 0.85rem;">
        <div>
          <a href="/accounts/profile/${c.username}/" class="fw-bold text-dark text-decoration-none me-1">@${c.username}</a>
          <span class="text-secondary">${escapeHtml(c.text)}</span>
        </div>
        <div class="d-flex align-items-center gap-2 text-muted mt-1" style="font-size: 0.75rem;">
          <span>${c.created_at_text}</span>
          ${c.can_delete ? `<button type="button" class="btn btn-link btn-sm text-danger p-0 border-0 btn-delete-comment" data-url="/comment/${c.id}/delete/" style="font-size: 0.75rem;">ลบ</button>` : ''}
        </div>
      </div>
    `;
    return div;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* ----------------------------------------------------
   * 5. DELETE COMMENT
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-delete-comment');
    if (!btn) return;

    if (!confirm('คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?')) return;

    const url = btn.dataset.url;
    const commentItem = btn.closest('.comment-item');

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (commentItem) {
          commentItem.style.transition = 'all 0.3s ease';
          commentItem.style.opacity = '0';
          commentItem.style.transform = 'translateX(20px)';
          setTimeout(() => commentItem.remove(), 300);
        }
        showToast('ลบความคิดเห็นเรียบร้อยแล้ว');
      }
    })
    .catch(err => console.error('Delete comment error:', err));
  });

  /* ----------------------------------------------------
   * 6. FOLLOW / UNFOLLOW SYSTEM
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-toggle-follow');
    if (!btn) return;

    e.preventDefault();
    const url = btn.dataset.url;
    const username = btn.dataset.username;
    if (!url) return;

    btn.disabled = true;

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      }
    })
    .then(res => res.json())
    .then(data => {
      btn.disabled = false;
      if (data.success) {
        const isFollowing = data.following;
        
        // Update all buttons for this username
        document.querySelectorAll(`.btn-toggle-follow[data-username="${username}"]`).forEach(b => {
          if (isFollowing) {
            b.className = 'btn btn-light border btn-sm rounded-pill px-3 fw-semibold btn-toggle-follow following';
            b.innerHTML = '<i class="bi bi-check2 me-1 text-success"></i> กำลังติดตาม';
          } else {
            b.className = 'btn btn-primary btn-sm rounded-pill px-3 fw-semibold btn-toggle-follow';
            b.innerHTML = '<i class="bi bi-person-plus-fill me-1"></i> ติดตาม';
          }
        });

        // Update profile follower counters
        const followersCountEl = document.getElementById('profile-followers-count');
        if (followersCountEl && data.followers_count !== undefined) {
          followersCountEl.textContent = data.followers_count;
        }

        showToast(isFollowing ? `ติดตาม @${username} แล้ว ✨` : `เลิกติดตาม @${username} แล้ว`);
      }
    })
    .catch(err => {
      btn.disabled = false;
      console.error('Follow error:', err);
    });
  });

  /* ----------------------------------------------------
   * 7. SHARE & REPOST (Web Share API + Modal Fallback)
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-share-post');
    if (!btn) return;

    e.preventDefault();
    const title = btn.dataset.title || 'เช็คอินสถานที่ท่องเที่ยว';
    const text = btn.dataset.text || 'ดูจุดเช็คอินนี้บน ที่นี้ที่ไหนหรือ';
    const url = btn.dataset.url || window.location.href;

    // Use Web Share API if available (Mobile browsers)
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      }).catch(err => {
        if (err.name !== 'AbortError') {
          openShareModal(title, url);
        }
      });
    } else {
      openShareModal(title, url);
    }
  });

  function openShareModal(title, url) {
    const modalEl = document.getElementById('shareModal');
    if (!modalEl) return;

    document.getElementById('shareModalTitle').textContent = title;
    const linkInput = document.getElementById('shareModalLinkInput');
    if (linkInput) linkInput.value = url;

    // Update social direct links
    const encUrl = encodeURIComponent(url);
    const encText = encodeURIComponent(title + ' - ที่นี้ที่ไหนหรือ');

    const lineBtn = document.getElementById('shareLineBtn');
    if (lineBtn) lineBtn.href = `https://social-plugins.line.me/lineit/share?url=${encUrl}`;

    const fbBtn = document.getElementById('shareFbBtn');
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;

    const twitterBtn = document.getElementById('shareTwitterBtn');
    if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?url=${encUrl}&text=${encText}`;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  // Copy share link button
  const copyShareBtn = document.getElementById('copyShareLinkBtn');
  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', function () {
      const input = document.getElementById('shareModalLinkInput');
      if (input) {
        navigator.clipboard.writeText(input.value).then(() => {
          showToast('คัดลอกลิงก์สำเร็จแล้ว! 📋');
          copyShareBtn.innerHTML = '<i class="bi bi-check2 text-success me-1"></i> คัดลอกแล้ว';
          setTimeout(() => {
            copyShareBtn.innerHTML = '<i class="bi bi-clipboard me-1"></i> คัดลอก';
          }, 2000);
        });
      }
    });
  }

  /* ----------------------------------------------------
   * 8. FOLLOWERS & FOLLOWING USER LIST MODALS
   * ---------------------------------------------------- */
  document.querySelectorAll('.open-users-modal').forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const url = this.dataset.url;
      const modalEl = document.getElementById('usersListModal');
      if (!modalEl || !url) return;

      const modalTitle = document.getElementById('usersListModalTitle');
      const modalBody = document.getElementById('usersListModalBody');
      modalBody.innerHTML = '<div class="text-center py-4 text-muted"><div class="spinner-border spinner-border-sm text-primary me-2"></div> กำลังโหลด...</div>';

      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          modalTitle.textContent = data.title;
          if (data.users.length === 0) {
            modalBody.innerHTML = '<div class="text-center py-4 text-muted small">ยังไม่มีผู้ใช้งานในรายการนี้</div>';
            return;
          }

          let html = '<div class="list-group list-group-flush">';
          data.users.forEach(u => {
            const avatarHtml = u.avatar_url
              ? `<img src="${u.avatar_url}" alt="${u.username}" class="rounded-circle border" width="40" height="40" style="object-fit:cover;">`
              : `<div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width:40px; height:40px;"><i class="bi bi-person-fill fs-5"></i></div>`;

            let followBtn = '';
            if (!u.is_self) {
              if (u.is_following) {
                followBtn = `<button class="btn btn-light border btn-sm rounded-pill px-3 fw-semibold btn-toggle-follow following" data-username="${u.username}" data-url="/accounts/follow/${u.username}/"><i class="bi bi-check2 me-1 text-success"></i> กำลังติดตาม</button>`;
              } else {
                followBtn = `<button class="btn btn-primary btn-sm rounded-pill px-3 fw-semibold btn-toggle-follow" data-username="${u.username}" data-url="/accounts/follow/${u.username}/"><i class="bi bi-person-plus-fill me-1"></i> ติดตาม</button>`;
              }
            }

            html += `
              <div class="list-group-item d-flex align-items-center justify-content-between px-0 py-2 border-light">
                <a href="/accounts/profile/${u.username}/" class="d-flex align-items-center text-decoration-none text-dark gap-2">
                  ${avatarHtml}
                  <div>
                    <div class="fw-bold" style="font-size:0.9rem;">${escapeHtml(u.display_name)}</div>
                    <div class="text-muted small" style="font-size:0.75rem;">@${u.username}</div>
                  </div>
                </a>
                <div>${followBtn}</div>
              </div>
            `;
          });
          html += '</div>';
          modalBody.innerHTML = html;
        }
      })
      .catch(err => {
        modalBody.innerHTML = '<div class="text-danger text-center py-3">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
      });
    });
  });

  /* ----------------------------------------------------
   * GLOBAL TOAST HELPER
   * ---------------------------------------------------- */
  function showToast(message, type = 'dark') {
    let container = document.getElementById('global-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'global-toast-container';
      container.className = 'toast-container position-fixed top-0 start-50 translate-middle-x p-3';
      container.style.zIndex = '1090';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 shadow rounded-pill`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
      <div class="d-flex px-3 py-2">
        <div class="toast-body p-0 fw-medium small">${message}</div>
      </div>
    `;

    container.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 2500 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }
});
