/**
 * Social interactions for "Thi Ni Thi Nai Rue"
 * - Instagram-style double tap to like with instant heart burst
 * - Super-fast Optimistic UI Likes & Bookmarks (Instant Visual Feedback)
 * - Real-time AJAX comments
 * - Follow / Unfollow with instant count update
 * - Web Share API & Share Modal
 * - Followers / Following user list modals
 */

function initSocialInteractions() {
  const getCsrfToken = () => {
    const input = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (input) return input.value;
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  };

  /* ----------------------------------------------------
   * 1. OPTIMISTIC LIKE HANDLER (Instant Heart & Counter)
   * ---------------------------------------------------- */
  const likeInFlight = new Set();

  function updateLikeUI(checkinId, isLiked, count) {
    // 1. Update all like buttons matching this checkin
    const buttons = document.querySelectorAll(`.btn-like[data-checkin-id="${checkinId}"]`);
    buttons.forEach(b => {
      const icon = b.querySelector('i');
      if (isLiked) {
        b.classList.add('liked');
        b.classList.add('heart-pulse');
        setTimeout(() => b.classList.remove('heart-pulse'), 400);
        if (icon) icon.className = 'bi bi-heart-fill text-danger';
      } else {
        b.classList.remove('liked');
        if (icon) icon.className = 'bi bi-heart text-dark';
      }
    });

    // 2. Update all like count labels across the page
    const countSpans = document.querySelectorAll(`.like-count[data-checkin-id="${checkinId}"]`);
    countSpans.forEach(span => {
      if (count !== undefined && count !== null) {
        span.textContent = count;
        span.classList.add('scale-pop');
        setTimeout(() => span.classList.remove('scale-pop'), 300);
      }
    });
  }

  function handleToggleLike(checkinId, url, forceLikeOnly = false) {
    if (!url || likeInFlight.has(checkinId)) return;

    // Find any like button for this checkin to read current state
    const btn = document.querySelector(`.btn-like[data-checkin-id="${checkinId}"]`);
    const countSpan = document.querySelector(`.like-count[data-checkin-id="${checkinId}"]`);
    
    const wasLiked = btn ? btn.classList.contains('liked') : false;
    let currentCount = countSpan ? parseInt(countSpan.textContent.trim(), 10) || 0 : 0;

    // If forceLikeOnly is requested (e.g. from double tap) and already liked, skip network
    if (forceLikeOnly && wasLiked) {
      return;
    }

    const optimisticLiked = forceLikeOnly ? true : !wasLiked;
    const optimisticCount = Math.max(0, currentCount + (optimisticLiked ? 1 : -1));

    // INSTANT OPTIMISTIC UI UPDATE (Zero Lag!)
    updateLikeUI(checkinId, optimisticLiked, optimisticCount);

    likeInFlight.add(checkinId);

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      }
    })
    .then(res => res.json())
    .then(data => {
      likeInFlight.delete(checkinId);
      if (data.success || data.liked !== undefined) {
        // Sync exact server count
        updateLikeUI(checkinId, data.liked, data.likes_count);
      } else {
        // Revert on error
        updateLikeUI(checkinId, wasLiked, currentCount);
        showToast('เกิดข้อผิดพลาดในการกดถูกใจ', 'danger');
      }
    })
    .catch(err => {
      likeInFlight.delete(checkinId);
      console.error('Like error:', err);
      // Revert on network failure
      updateLikeUI(checkinId, wasLiked, currentCount);
      showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 'danger');
    });
  }

  // Click on Like Button
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-like');
    if (!btn) return;

    e.preventDefault();
    const checkinId = btn.dataset.checkinId;
    const url = btn.dataset.url || btn.getAttribute('href') || (btn.form && btn.form.action);
    if (checkinId && url) {
      handleToggleLike(checkinId, url, false);
    }
  });

  /* ----------------------------------------------------
   * 2. DOUBLE TAP TO LIKE (Instagram Style)
   * ---------------------------------------------------- */
  document.querySelectorAll('.double-tap-like-area').forEach(wrapper => {
    let lastTapTime = 0;
    let tapTimeout = null;

    wrapper.addEventListener('pointerup', function (e) {
      const now = Date.now();
      const diff = now - lastTapTime;

      if (diff < 350 && diff > 40) {
        // Double tap confirmed
        clearTimeout(tapTimeout);
        e.preventDefault();

        const checkinId = wrapper.dataset.checkinId;
        const btn = document.querySelector(`.btn-like[data-checkin-id="${checkinId}"]`);
        const url = btn ? (btn.dataset.url || btn.getAttribute('href')) : null;

        // Big bursting heart animation
        triggerHeartBurst(wrapper, e);

        // Optimistically like if not liked
        if (checkinId && url) {
          handleToggleLike(checkinId, url, true);
        }
        lastTapTime = 0;
      } else {
        lastTapTime = now;
      }
    });
  });

  function triggerHeartBurst(container, event) {
    const heart = document.createElement('div');
    heart.className = 'insta-heart-burst';
    heart.innerHTML = '<i class="bi bi-heart-fill"></i>';

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 850);
  }

  /* ----------------------------------------------------
   * 3. AJAX BOOKMARK (SAVE) BUTTON
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-bookmark');
    if (!btn) return;

    e.preventDefault();
    const url = btn.dataset.url;
    const checkinId = btn.dataset.checkinId;
    if (!url) return;

    const wasBookmarked = btn.classList.contains('bookmarked');
    const newBookmarked = !wasBookmarked;

    // Optimistic UI
    const targets = checkinId ? document.querySelectorAll(`.btn-bookmark[data-checkin-id="${checkinId}"]`) : [btn];
    targets.forEach(b => {
      const icon = b.querySelector('i');
      if (newBookmarked) {
        b.classList.add('bookmarked');
        if (icon) icon.className = 'bi bi-bookmark-fill text-warning';
      } else {
        b.classList.remove('bookmarked');
        if (icon) icon.className = 'bi bi-bookmark text-dark';
      }
    });

    showToast(newBookmarked ? 'บันทึกไปยังคอลเลกชันแล้ว 🔖' : 'นำออกจากรายการบันทึกแล้ว');

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
        targets.forEach(b => {
          const icon = b.querySelector('i');
          if (data.bookmarked) {
            b.classList.add('bookmarked');
            if (icon) icon.className = 'bi bi-bookmark-fill text-warning';
          } else {
            b.classList.remove('bookmarked');
            if (icon) icon.className = 'bi bi-bookmark text-dark';
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

        // Hide empty placeholder
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
   * 6. FOLLOW / UNFOLLOW SYSTEM (Instant Optimistic UI)
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-toggle-follow');
    if (!btn) return;

    e.preventDefault();
    const url = btn.dataset.url;
    const username = btn.dataset.username;
    if (!url) return;

    const wasFollowing = btn.classList.contains('following');
    const newFollowing = !wasFollowing;

    // Optimistic Update
    document.querySelectorAll(`.btn-toggle-follow[data-username="${username}"]`).forEach(b => {
      if (newFollowing) {
        b.className = 'btn btn-light border btn-sm rounded-pill px-3 fw-semibold btn-toggle-follow following';
        b.innerHTML = '<i class="bi bi-check2 me-1 text-success"></i> กำลังติดตาม';
      } else {
        b.className = 'btn btn-primary btn-sm rounded-pill px-3 fw-semibold btn-toggle-follow';
        b.innerHTML = '<i class="bi bi-person-plus-fill me-1"></i> ติดตาม';
      }
    });

    const followersCountEl = document.getElementById('profile-followers-count');
    if (followersCountEl) {
      let cur = parseInt(followersCountEl.textContent.trim(), 10) || 0;
      followersCountEl.textContent = Math.max(0, cur + (newFollowing ? 1 : -1));
    }

    showToast(newFollowing ? `ติดตาม @${username} แล้ว ✨` : `เลิกติดตาม @${username} แล้ว`);

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
        if (followersCountEl && data.followers_count !== undefined) {
          followersCountEl.textContent = data.followers_count;
        }
      }
    })
    .catch(err => console.error('Follow error:', err));
  });

  /* ----------------------------------------------------
   * 7. SHARE & REPOST (Web Share API + Modal Fallback)
   * ---------------------------------------------------- */
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-share-post');
    if (!btn) return;

    e.preventDefault();
    const title = btn.dataset.title || 'เช็คอินสถานที่ท่องเที่ยว';
    const text = btn.dataset.text || 'ดูจุดเช็คอินนี้บน ที่นี่ Check-in';
    const url = btn.dataset.url || window.location.href;

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

    const encUrl = encodeURIComponent(url);
    const encText = encodeURIComponent(title + ' - ที่นี่ Check-in');

    const lineBtn = document.getElementById('shareLineBtn');
    if (lineBtn) lineBtn.href = `https://social-plugins.line.me/lineit/share?url=${encUrl}`;

    const fbBtn = document.getElementById('shareFbBtn');
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;

    const twitterBtn = document.getElementById('shareTwitterBtn');
    if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?url=${encUrl}&text=${encText}`;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

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
    const bsToast = new bootstrap.Toast(toast, { delay: 2000 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }
}

document.addEventListener('DOMContentLoaded', initSocialInteractions);
document.addEventListener('turbo:load', initSocialInteractions);
