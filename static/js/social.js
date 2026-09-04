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

  function requireAuth(customMessage = null) {
    if (window.IS_AUTHENTICATED) return false;
    const modalEl = document.getElementById('authRequiredModal');
    if (modalEl && window.bootstrap) {
      if (customMessage) {
        const descEl = document.getElementById('authRequiredModalDesc');
        if (descEl) descEl.textContent = customMessage;
      }
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    } else {
      window.location.href = '/accounts/login/';
    }
    return true;
  }

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
    if (requireAuth('เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อกดถูกใจและบันทึกสถานที่นี้')) return;
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
    .then(res => {
      if (res.status === 401) {
        likeInFlight.delete(checkinId);
        updateLikeUI(checkinId, wasLiked, currentCount);
        requireAuth();
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      likeInFlight.delete(checkinId);
      if (data.login_required) {
        updateLikeUI(checkinId, wasLiked, currentCount);
        requireAuth();
        return;
      }
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
    if (requireAuth('เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อกดถูกใจและบันทึกสถานที่นี้')) return;

    const checkinId = btn.dataset.checkinId;
    const url = btn.dataset.url || btn.getAttribute('href') || (btn.form && btn.form.action);
    if (checkinId && url) {
      handleToggleLike(checkinId, url, false);
    }
  });

  /* ----------------------------------------------------
   * 2. DOUBLE TAP TO LIKE (Instagram Style)
   * ---------------------------------------------------- */
  document.querySelectorAll('.double-tap-like-area, .card-img-wrapper').forEach(wrapper => {
    let lastTapTime = 0;
    let tapTimeout = null;

    wrapper.addEventListener('pointerup', function (e) {
      const now = Date.now();
      const diff = now - lastTapTime;

      if (diff < 350 && diff > 40) {
        // Double tap confirmed
        clearTimeout(tapTimeout);
        e.preventDefault();

        if (requireAuth('เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อกดถูกใจและบันทึกสถานที่นี้')) {
          lastTapTime = 0;
          return;
        }

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
    if (requireAuth('เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อบันทึกสถานที่โปรดของคุณ')) return;

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

    showToast(newBookmarked ? 'บันทึกไปยังคอลเลกชันแล้ว' : 'นำออกจากรายการบันทึกแล้ว');

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      }
    })
    .then(res => {
      if (res.status === 401) {
        requireAuth();
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      if (data.login_required) {
        requireAuth();
        return;
      }
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
   * 4. COMMENTS SYSTEM (Modal Drawer & In-Page)
   * ---------------------------------------------------- */
  // Open Comments Modal or focus in-page input
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-open-comments, .btn-comment-focus, .btn-comment-modal');
    if (!btn) return;

    e.preventDefault();

    const checkinId = btn.dataset.checkinId;
    if (!checkinId) return;

    // Check if in detail page with #comment-input-box
    const inPageForm = document.getElementById('comment-input-box');
    if (inPageForm && inPageForm.dataset.checkinId === checkinId) {
      const inPageInput = inPageForm.querySelector('input[name="text"]');
      if (inPageInput) {
        inPageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => inPageInput.focus(), 300);
        return;
      }
    }

    // Otherwise open the global postCommentsModal
    openPostCommentsModal(checkinId, btn.dataset.commentUrl);
  });

  function openPostCommentsModal(checkinId, customUrl = null) {
    const modalEl = document.getElementById('postCommentsModal');
    if (!modalEl || !window.bootstrap) return;

    const modalTitle = document.getElementById('postCommentsModalTitle');
    const authorLink = document.getElementById('modalPostAuthorLink');
    const authorAvatar = document.getElementById('modalPostAuthorAvatar');
    const authorName = document.getElementById('modalPostAuthorName');
    const placeBadge = document.getElementById('modalPostPlaceName');
    const captionEl = document.getElementById('modalPostCaption');
    const commentsList = document.getElementById('modalCommentsList');
    const commentForm = document.getElementById('modalCommentForm');
    const commentInput = document.getElementById('modalCommentInput');

    if (modalTitle) modalTitle.textContent = 'ความคิดเห็น';
    if (placeBadge) placeBadge.textContent = '';
    if (captionEl) captionEl.textContent = '';
    if (commentsList) {
      commentsList.innerHTML = '<div class="text-center py-4 text-muted"><div class="spinner-border spinner-border-sm text-primary me-2"></div> กำลังโหลดความคิดเห็น...</div>';
    }

    if (commentForm) {
      commentForm.dataset.checkinId = checkinId;
      commentForm.action = `/checkin/${checkinId}/comment/`;
    }

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    const fetchUrl = customUrl || `/checkin/${checkinId}/comment/`;

    fetch(fetchUrl, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Populate author header
        if (modalTitle) modalTitle.textContent = `ความคิดเห็น (${data.comments_count})`;
        if (authorLink) authorLink.href = `/accounts/profile/${data.author_username}/`;
        if (authorName) {
          authorName.href = `/accounts/profile/${data.author_username}/`;
          authorName.textContent = `@${data.author_username}`;
        }
        if (authorAvatar) {
          authorAvatar.innerHTML = data.author_avatar 
            ? `<img src="${data.author_avatar}" alt="${data.author_username}" class="rounded-circle border" width="34" height="34" style="object-fit:cover;">`
            : `<div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width:34px; height:34px; font-size:0.8rem;"><i class="bi bi-person-fill"></i></div>`;
        }
        if (placeBadge) {
          placeBadge.innerHTML = `<i class="bi bi-geo-alt-fill text-danger me-1"></i>${escapeHtml(data.place_name || '')}`;
        }
        if (captionEl) {
          captionEl.textContent = data.caption || 'ไม่มีคำบรรยาย';
        }

        // Render Comments List
        if (commentsList) {
          if (!data.comments || data.comments.length === 0) {
            commentsList.innerHTML = `
              <div class="empty-modal-comments d-flex flex-column align-items-center justify-content-center text-center py-5 my-auto">
                <h5 class="fw-bold mb-1 text-dark">No comments yet</h5>
                <p class="text-muted small mb-0">Start the conversation.</p>
              </div>
            `;
          } else {
            commentsList.innerHTML = '';
            data.comments.forEach(c => {
              const el = createCommentElement(c);
              commentsList.appendChild(el);
            });
          }
        }

        // Auto focus input if authenticated
        if (commentInput) {
          setTimeout(() => commentInput.focus(), 300);
        }
      } else {
        if (commentsList) {
          commentsList.innerHTML = '<div class="text-center py-3 text-danger small">ไม่สามารถโหลดความคิดเห็นได้</div>';
        }
      }
    })
    .catch(err => {
      console.error('Fetch comments error:', err);
      if (commentsList) {
        commentsList.innerHTML = '<div class="text-center py-3 text-danger small">เกิดข้อผิดพลาดในการเชื่อมต่อ</div>';
      }
    });
  }

  // Handle Comment Form Submission (Both Modal Form & In-Page Form)
  document.body.addEventListener('submit', function (e) {
    const form = e.target.closest('#modalCommentForm, .ajax-comment-form, .feed-quick-comment-box');
    if (!form) return;

    e.preventDefault();
    if (requireAuth('เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อร่วมแสดงความคิดเห็น')) return;

    const input = form.querySelector('input[name="text"], textarea[name="text"]');
    const text = input ? input.value.trim() : '';
    if (!text) return;

    const checkinId = form.dataset.checkinId;
    const url = form.action || form.dataset.url || `/checkin/${checkinId}/comment/`;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    if (!formData.has('text')) {
      formData.append('text', text);
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCsrfToken(),
      },
      body: formData
    })
    .then(res => {
      if (res.status === 401) {
        if (submitBtn) submitBtn.disabled = false;
        requireAuth();
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (submitBtn) submitBtn.disabled = false;
      if (!data) return;

      if (data.login_required) {
        requireAuth();
        return;
      }

      if (data.success) {
        if (input) input.value = '';

        // 1. Append to Modal Comments List if open
        const modalCommentsList = document.getElementById('modalCommentsList');
        if (modalCommentsList) {
          const emptyModalEl = modalCommentsList.querySelector('.empty-modal-comments');
          if (emptyModalEl) emptyModalEl.remove();

          const newCommentEl = createCommentElement(data.comment);
          modalCommentsList.appendChild(newCommentEl);
          newCommentEl.classList.add('highlight-fade');

          // Scroll to bottom of modal list
          const modalBody = modalCommentsList.closest('.modal-body');
          if (modalBody) {
            modalBody.scrollTop = modalBody.scrollHeight;
          }
        }

        // 2. Append to In-Page Comments List if present
        const pageCommentsList = document.querySelector(`.comments-list[data-checkin-id="${checkinId}"]`);
        if (pageCommentsList) {
          const emptyPlaceholder = document.querySelector(`.empty-comments-placeholder[data-checkin-id="${checkinId}"]`);
          if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';

          const pageCommentEl = createCommentElement(data.comment);
          pageCommentsList.appendChild(pageCommentEl);
          pageCommentEl.classList.add('highlight-fade');
        }

        // 3. Update all comment counter badges across the page
        document.querySelectorAll(`.comment-count[data-checkin-id="${checkinId}"], .comments-count-badge[data-checkin-id="${checkinId}"]`).forEach(el => {
          el.textContent = data.comments_count;
        });

        const modalTitle = document.getElementById('postCommentsModalTitle');
        if (modalTitle) {
          modalTitle.textContent = `ความคิดเห็น (${data.comments_count})`;
        }

        showToast('แสดงความคิดเห็นเรียบร้อย');
      } else {
        showToast(data.error || 'เกิดข้อผิดพลาดในการส่งความคิดเห็น', 'danger');
      }
    })
    .catch(err => {
      if (submitBtn) submitBtn.disabled = false;
      console.error('Comment error:', err);
      showToast('ไม่สามารถส่งความคิดเห็นได้', 'danger');
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
          <span>${c.created_at_text || 'เมื่อสักครู่'}</span>
          ${c.can_delete ? `<button type="button" class="btn btn-link btn-sm text-danger p-0 border-0 btn-delete-comment" data-url="/comment/${c.id}/delete/" style="font-size: 0.75rem;">ลบ</button>` : ''}
        </div>
      </div>
    `;
    return div;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
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
    const commentId = commentItem ? commentItem.dataset.commentId : null;

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
        // Remove from DOM with smooth transition
        const targets = commentId 
          ? document.querySelectorAll(`.comment-item[data-comment-id="${commentId}"]`) 
          : [commentItem];

        targets.forEach(item => {
          if (item) {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            setTimeout(() => item.remove(), 300);
          }
        });

        // Update comment counter if provided
        if (data.comments_count !== undefined) {
          const checkinId = data.checkin_id;
          if (checkinId) {
            document.querySelectorAll(`.comment-count[data-checkin-id="${checkinId}"], .comments-count-badge[data-checkin-id="${checkinId}"]`).forEach(el => {
              el.textContent = data.comments_count;
            });
          }
          const modalTitle = document.getElementById('postCommentsModalTitle');
          if (modalTitle) {
            modalTitle.textContent = `ความคิดเห็น (${data.comments_count})`;
          }
        }

        showToast('ลบความคิดเห็นเรียบร้อยแล้ว');
      } else {
        showToast(data.error || 'ไม่สามารถลบความคิดเห็นได้', 'danger');
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
    if (requireAuth('เข้าสู่ระบบหรือสมัครสมาชิกฟรี เพื่อติดตามเพื่อนนักเดินทาง')) return;

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

    showToast(newFollowing ? `ติดตาม @${username} แล้ว` : `เลิกติดตาม @${username} แล้ว`);

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
   * 7. SOCIAL SHARE MODAL & EXTERNAL PLATFORM LINKS
   * ---------------------------------------------------- */
  let currentShareData = { title: '', text: '', url: '' };

  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-share, .btn-share-post, [data-action="share"]');
    if (!btn) return;

    e.preventDefault();
    const title = btn.dataset.title || 'เช็คอินสถานที่ท่องเที่ยว';
    const text = btn.dataset.text || `ดูจุดเช็คอิน ${title} บน ที่นี่ Check-in`;
    const url = btn.dataset.url || window.location.href;

    openShareModal(title, text, url);
  });

  function openShareModal(title, text, url) {
    const modalEl = document.getElementById('shareModal');
    if (!modalEl || !window.bootstrap) return;

    currentShareData = { title, text, url };

    const linkInput = document.getElementById('shareModalLinkInput');
    if (linkInput) linkInput.value = url;

    const encUrl = encodeURIComponent(url);
    const encText = encodeURIComponent((title || 'ที่นี่ Check-in') + '\n' + url);

    // 1. LINE
    const lineBtn = document.getElementById('shareLineBtn');
    if (lineBtn) lineBtn.href = `https://social-plugins.line.me/lineit/share?url=${encUrl}`;

    // 2. Facebook
    const fbBtn = document.getElementById('shareFbBtn');
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;

    // 3. Messenger
    const messengerBtn = document.getElementById('shareMessengerBtn');
    if (messengerBtn) {
      messengerBtn.href = `https://www.facebook.com/dialog/send?link=${encUrl}&app_id=291494419107518&redirect_uri=${encUrl}`;
      messengerBtn.onclick = function(e) {
        window.open(`https://www.facebook.com/dialog/send?link=${encUrl}&app_id=291494419107518&redirect_uri=${encUrl}`, '_blank');
        e.preventDefault();
      };
    }

    // 4. X (Twitter)
    const twitterBtn = document.getElementById('shareTwitterBtn');
    if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?url=${encUrl}&text=${encodeURIComponent(title || 'ที่นี่ Check-in')}`;

    // 5. WhatsApp
    const whatsappBtn = document.getElementById('shareWhatsappBtn');
    if (whatsappBtn) whatsappBtn.href = `https://api.whatsapp.com/send?text=${encText}`;

    // 6. Telegram
    const telegramBtn = document.getElementById('shareTelegramBtn');
    if (telegramBtn) telegramBtn.href = `https://t.me/share/url?url=${encUrl}&text=${encodeURIComponent(title || 'ที่นี่ Check-in')}`;

    // 7. Email
    const emailBtn = document.getElementById('shareEmailBtn');
    if (emailBtn) emailBtn.href = `mailto:?subject=${encodeURIComponent(title || 'ที่นี่ Check-in')}&body=${encText}`;

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  // Copy Link Button
  const copyShareBtn = document.getElementById('copyShareLinkBtn');
  const copyBtnText = document.getElementById('copyShareBtnText');

  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', function () {
      const url = currentShareData.url || window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showCopyFeedback();
        }).catch(() => {
          fallbackCopyText(url);
        });
      } else {
        fallbackCopyText(url);
      }
    });
  }

  function showCopyFeedback() {
    showToast('📋 คัดลอกลิงก์เรียบร้อยแล้ว!');
    if (copyShareBtn) {
      const originalHTML = copyShareBtn.innerHTML;
      copyShareBtn.innerHTML = '<i class="bi bi-check2 me-1"></i> คัดลอกแล้ว';
      copyShareBtn.classList.remove('btn-primary');
      copyShareBtn.classList.add('btn-success');
      setTimeout(() => {
        copyShareBtn.innerHTML = originalHTML;
        copyShareBtn.classList.remove('btn-success');
        copyShareBtn.classList.add('btn-primary');
      }, 2000);
    }
  }

  function fallbackCopyText(text) {
    const input = document.getElementById('shareModalLinkInput');
    if (input) {
      input.select();
      document.execCommand('copy');
      showCopyFeedback();
    }
  }

  // Native System Share Button
  const shareNativeBtn = document.getElementById('shareNativeSystemBtn');
  if (shareNativeBtn) {
    shareNativeBtn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({
          title: currentShareData.title || 'ที่นี่ Check-in',
          text: currentShareData.text || 'ดูจุดเช็คอินนี้บน ที่นี่ Check-in',
          url: currentShareData.url || window.location.href
        }).catch(err => {
          if (err.name !== 'AbortError') {
            showToast('อุปกรณ์ไม่รองรับการแชร์ระบบ');
          }
        });
      } else {
        showToast('อุปกรณ์ไม่รองรับระบบแชร์ของเครื่อง กรุณาเลือกคัดลอกลิงก์หรือแชร์ผ่านแอป');
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
   * 8. MULTI-PHOTO INSTAGRAM CAROUSELS
   * ---------------------------------------------------- */
  function initMultiPhotoCarousels() {
    document.querySelectorAll('.post-carousel-container').forEach(carousel => {
      if (carousel.dataset.carouselInitialized) return;
      carousel.dataset.carouselInitialized = 'true';

      const track = carousel.querySelector('.post-carousel-track');
      const slides = carousel.querySelectorAll('.post-carousel-slide');
      const totalSlides = slides.length;
      if (totalSlides <= 1) return;

      const prevBtn = carousel.querySelector('.btn-prev');
      const nextBtn = carousel.querySelector('.btn-next');
      const counterBadge = carousel.querySelector('.post-carousel-badge-counter');
      const dots = carousel.querySelectorAll('.post-carousel-dot');

      let currentIndex = 0;

      function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        currentIndex = index;

        if (track) {
          track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        if (counterBadge) {
          counterBadge.textContent = `${currentIndex + 1}/${totalSlides}`;
        }

        dots.forEach((d, idx) => {
          if (idx === currentIndex) {
            d.classList.add('active');
          } else {
            d.classList.remove('active');
          }
        });

        if (prevBtn) {
          prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
        }
        if (nextBtn) {
          nextBtn.style.display = currentIndex === totalSlides - 1 ? 'none' : 'flex';
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          goToSlide(currentIndex - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          goToSlide(currentIndex + 1);
        });
      }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          goToSlide(idx);
        });
      });

      // Touch / Swipe Handling
      let touchStartX = 0;
      let touchEndX = 0;
      let isSwiping = false;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40) {
          if (diffX > 0) {
            goToSlide(currentIndex + 1); // Swipe Left -> Next
          } else {
            goToSlide(currentIndex - 1); // Swipe Right -> Prev
          }
        }
        isSwiping = false;
      }, { passive: true });

      // Initialize initial state
      goToSlide(0);
    });
  }

  initMultiPhotoCarousels();
  window.initMultiPhotoCarousels = initMultiPhotoCarousels;

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
