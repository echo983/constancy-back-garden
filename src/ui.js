/**
 * Constancy · 后花园 (Back Garden) UI Module
 * Sleek, dark-themed responsive admin & search dashboard
 */

export function renderLoginHtml(errorMessage = "") {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Constancy · 后花园 登录</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #121826;
      --card-border: #1f293d;
      --accent: #38bdf8;
      --accent-hover: #0284c7;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .login-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 18px;
      padding: 2.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      text-align: center;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #0284c7, #6366f1);
      border-radius: 16px;
      font-size: 1.8rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35);
    }
    h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.4rem; color: #fff; }
    p.desc { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.8rem; line-height: 1.5; }
    .form-group { text-align: left; margin-bottom: 1.2rem; }
    label { display: block; font-size: 0.82rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.4rem; }
    input {
      width: 100%;
      background: #0b0f19;
      border: 1px solid var(--card-border);
      color: #fff;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s;
    }
    input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25); }
    .btn-login {
      width: 100%;
      background: var(--accent);
      color: #0b0f19;
      border: none;
      padding: 0.85rem;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 0.6rem;
      transition: all 0.2s;
    }
    .btn-login:hover { background: #7dd3fc; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.35); }
    .error-box {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      font-size: 0.82rem;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      margin-bottom: 1.2rem;
      display: ${errorMessage ? "block" : "none"};
      text-align: left;
    }
    .footer-hint {
      margin-top: 1.5rem;
      font-size: 0.75rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="logo-badge">🧬</div>
    <h1>Constancy · 后花园</h1>
    <p class="desc">多模态人基常热记忆外脑控制台<br>请输入授权凭据解锁访问</p>

    <div class="error-box" id="errorMsg">${errorMessage}</div>

    <form id="loginForm">
      <div class="form-group">
        <label>授权账号邮箱 (Email)</label>
        <input type="email" id="email" required placeholder="如: echo983@example.com" autocomplete="username">
      </div>
      <div class="form-group">
        <label>通行口令 (Passkey)</label>
        <input type="password" id="passkey" required placeholder="输入管理员口令" autocomplete="current-password">
      </div>
      <button type="submit" class="btn-login" id="submitBtn">登录进入后花园</button>
    </form>

    <p class="footer-hint">Protected by Cloudflare Edge & Constancy Auth</p>
  </div>

  <script>
    const savedEmail = localStorage.getItem("constancy_user_email");
    if (savedEmail) document.getElementById("email").value = savedEmail;

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const passkey = document.getElementById("passkey").value.trim();
      const btn = document.getElementById("submitBtn");
      const errBox = document.getElementById("errorMsg");
      errBox.style.display = "none";
      btn.disabled = true;
      btn.innerText = "正在验证...";

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, passkey })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "登录失败，请检查邮箱与口令");
        }
        localStorage.setItem("constancy_user_email", email);
        window.location.reload();
      } catch (err) {
        errBox.innerText = "❌ " + err.message;
        errBox.style.display = "block";
        btn.disabled = false;
        btn.innerText = "登录进入后花园";
      }
    });
  </script>
</body>
</html>`;
}

export function renderDashboardHtml(userEmail) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Constancy · 后花园 (Back Garden)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #121826;
      --card-border: #1f293d;
      --accent: #38bdf8;
      --accent-hover: #0284c7;
      --accent-glow: rgba(56, 189, 248, 0.25);
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
      --success: #34d399;
      --badge-bg: #1e293b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }
    header {
      border-bottom: 1px solid var(--card-border);
      background: rgba(18, 24, 38, 0.85);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0284c7, #6366f1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px var(--accent-glow);
      flex-shrink: 0;
    }
    .title-group h1 {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .title-group .badge {
      font-size: 0.72rem;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      background: #0369a1;
      color: #e0f2fe;
      font-weight: 600;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-pill {
      font-size: 0.8rem;
      color: #94a3b8;
      background: #0f1523;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      border: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid var(--card-border);
      color: #ef4444;
      font-size: 0.8rem;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-logout:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }

    main {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* Claude Upload Banner */
    .claude-banner {
      background: linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(99, 102, 241, 0.12));
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 12px;
      padding: 0.85rem 1.25rem;
      font-size: 0.85rem;
      color: #bae6fd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .claude-banner span { display: flex; align-items: center; gap: 0.5rem; }

    /* ==================== 1. Google-Style Hero Mode ==================== */
    .hero-section {
      max-width: 780px;
      margin: 5rem auto 3rem auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem;
      animation: fadeIn 0.3s ease-out;
      width: 100%;
    }
    .hero-logo-icon {
      width: 68px;
      height: 68px;
      background: linear-gradient(135deg, #0284c7, #6366f1);
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.4rem;
      box-shadow: 0 8px 30px rgba(2, 132, 199, 0.45);
      margin: 0 auto 0.75rem auto;
    }
    .hero-title {
      font-size: 2.1rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .hero-tagline {
      font-size: 0.96rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }
    .hero-search-panel {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: 0 15px 35px rgba(0,0,0,0.45);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .hero-search-bar {
      display: flex;
      gap: 0.75rem;
    }
    .hero-search-input {
      flex: 1;
      background: #0b0f19;
      border: 1px solid var(--card-border);
      color: var(--text);
      font-size: 1.05rem;
      padding: 0.95rem 1.25rem;
      border-radius: 14px;
      outline: none;
      transition: all 0.2s;
    }
    .hero-search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .btn-hero-search {
      background: var(--accent);
      color: #0b0f19;
      border: none;
      font-weight: 700;
      padding: 0.95rem 1.75rem;
      border-radius: 14px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-hero-search:hover {
      background: #7dd3fc;
      box-shadow: 0 4px 15px var(--accent-glow);
    }
    .hero-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
    }
    .chip {
      background: #0f1523;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .chip:hover { border-color: var(--accent); color: var(--text); background: #162033; }
    .chip-accent {
      background: rgba(56, 189, 248, 0.12) !important;
      color: #38bdf8 !important;
      border-color: rgba(56, 189, 248, 0.45) !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 8px rgba(56, 189, 248, 0.15);
    }
    .chip-accent:hover {
      background: rgba(56, 189, 248, 0.25) !important;
      border-color: #38bdf8 !important;
    }
    .chip-label { font-size: 0.78rem; color: var(--text-dim); }

    /* ==================== 2. Active Search Mode ==================== */
    .search-panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.1rem 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      animation: fadeIn 0.2s ease-out;
    }
    .search-bar-wrap {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .search-input {
      flex: 1;
      background: #0b0f19;
      border: 1px solid var(--card-border);
      color: var(--text);
      font-size: 0.95rem;
      padding: 0.75rem 1.15rem;
      border-radius: 12px;
      outline: none;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .btn-search {
      background: var(--accent);
      color: #0b0f19;
      border: none;
      font-weight: 700;
      padding: 0.75rem 1.4rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      font-size: 0.92rem;
    }
    .btn-search:hover { background: #7dd3fc; box-shadow: 0 4px 12px var(--accent-glow); }
    .btn-back-hero {
      background: #0f1523;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 0.72rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-back-hero:hover { color: #fff; border-color: #475569; background: #1e293b; }

    /* Results Toolbar */
    .results-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      padding-top: 0.4rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .nav-tabs {
      display: flex;
      background: #0f1523;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 0.25rem;
      gap: 0.25rem;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.45rem 0.95rem;
      border-radius: 7px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .tab-btn.active {
      background: var(--card-bg);
      color: var(--text);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    }
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .sort-group {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: #0f1523;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 0.2rem 0.35rem;
    }
    .sort-label {
      font-size: 0.75rem;
      color: var(--text-dim);
      margin-left: 0.25rem;
      margin-right: 0.15rem;
    }
    .btn-sort {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.76rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-sort.active {
      background: var(--card-bg);
      color: var(--accent);
      font-weight: 600;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }
    .results-badge {
      font-size: 0.78rem;
      color: var(--text-muted);
      background: #0f1523;
      border: 1px solid var(--card-border);
      padding: 0.3rem 0.65rem;
      border-radius: 20px;
    }

    /* ==================== 3. Unified Mixed Grid & Cards ==================== */
    .unified-feed-grid, .notes-grid, .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
      align-items: start;
    }

    /* Note Card */
    .note-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .note-card:hover {
      transform: translateY(-2px);
      border-color: #2b3852;
      box-shadow: 0 10px 24px rgba(0,0,0,0.4);
    }
    .note-media-wrap {
      position: relative;
      width: 100%;
      height: 200px;
      background: #000;
      overflow: hidden;
      cursor: pointer;
    }
    .note-media-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
      display: block;
    }
    .note-media-wrap:hover .note-media-img {
      transform: scale(1.03);
    }
    .media-tag {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
    }
    .note-inner {
      padding: 1.1rem 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .note-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }
    .note-tag {
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
      background: #1e293b;
      color: #94a3b8;
    }
    .note-content {
      font-size: 0.85rem;
      color: #cbd5e1;
      background: #0b0f19;
      padding: 0.75rem 0.9rem;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.05);
      line-height: 1.5;
      max-height: 140px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: monospace;
    }
    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: var(--text-dim);
      margin-top: 0.25rem;
    }
    .note-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    /* Standalone Image Card */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      cursor: pointer;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(0,0,0,0.4);
      border-color: #2b3852;
    }
    .card-img-wrap {
      position: relative;
      width: 100%;
      height: 200px;
      background: #0b0f19;
      overflow: hidden;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
      display: block;
    }
    .card:hover .card-img { transform: scale(1.03); }
    .score-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
    }
    .card-body {
      padding: 0.9rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
    }
    .card-title {
      font-weight: 600;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }
    .card-meta {
      font-size: 0.72rem;
      color: var(--text-dim);
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.4rem;
    }

    /* Buttons */
    .btn-copy {
      background: #1f293d;
      border: none;
      color: #94a3b8;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.15s;
    }
    .btn-copy:hover { color: #fff; background: #334155; }
    .btn-delete-note {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #f87171;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.15s;
    }
    .btn-delete-note:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: #ef4444;
      color: #fff;
    }
    .btn-delete-img-card {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #f87171;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.72rem;
      transition: all 0.15s;
    }
    .btn-delete-img-card:hover {
      background: rgba(239, 68, 68, 0.85);
      color: #fff;
      border-color: #ef4444;
    }
    .btn-delete-modal {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-delete-modal:hover {
      background: #dc2626;
      color: #fff;
      border-color: #ef4444;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1.5rem;
    }
    .modal-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 18px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px rgba(0,0,0,0.6);
    }
    .modal-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .modal-img {
      width: 100%;
      max-height: 480px;
      object-fit: contain;
      border-radius: 12px;
      background: #000;
    }
    .exif-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
    }
    .exif-table td {
      padding: 0.4rem 0.6rem;
      border-bottom: 1px solid var(--card-border);
    }
    .exif-table td.label { color: var(--text-dim); width: 30%; }

    .empty-state {
      text-align: center;
      padding: 3.5rem 1rem;
      color: var(--text-muted);
    }
    .empty-state h3 { margin-bottom: 0.5rem; color: #f1f5f9; }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #38bdf8;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      font-size: 0.88rem;
      z-index: 200;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.25s ease;
      pointer-events: none;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .header-inner { flex-direction: column; align-items: stretch; gap: 0.75rem; }
      .nav-tabs { width: 100%; justify-content: center; }
      .claude-banner { flex-direction: column; align-items: flex-start; }
      .hero-section { margin-top: 2rem; }
      .results-toolbar { flex-direction: column; align-items: stretch; }
      .toolbar-right { justify-content: space-between; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="logo-group" id="headerLogo">
        <div class="logo-icon">🧬</div>
        <div class="title-group">
          <h1>Constancy · 后花园 <span class="badge">Back Garden</span></h1>
        </div>
      </div>
      <div class="user-actions">
        <span class="user-pill">👤 ${userEmail}</span>
        <button class="btn-logout" id="logoutBtn">退出登录</button>
      </div>
    </div>
  </header>

  <main>
    <!-- ==================== 1. Google-Style Hero Mode (Default Initial View) ==================== -->
    <div id="heroSection" class="hero-section">
      <div class="hero-brand">
        <div class="hero-logo-icon">🧬</div>
        <h1 class="hero-title">Constancy · 后花园</h1>
        <p class="hero-tagline">数字海马体 · 多模态图文记忆时光轴与跨模态向量检索</p>
      </div>

      <div class="hero-search-panel">
        <div class="hero-search-bar">
          <input type="text" id="heroSearchInput" class="hero-search-input" placeholder="输入关键词检索记忆、便签或视觉图片... (Enter 键开始)" autofocus>
          <button id="heroSearchBtn" class="btn-hero-search">智能检索</button>
        </div>
        <div class="hero-chips">
          <button class="chip chip-accent" id="btnBrowseLatest">🕒 浏览最新时光轴</button>
          <span class="chip-label">快捷检索：</span>
          <button class="chip chip-query" data-query="MinIO 部署架构">MinIO 部署架构</button>
          <button class="chip chip-query" data-query="服务器机柜">服务器机柜</button>
          <button class="chip chip-query" data-query="徽章 图标">徽章 图标</button>
          <button class="chip chip-query" data-query="速查 配置">速查 配置</button>
          <button class="chip chip-query" data-query="街景 夜景">街景 夜景</button>
        </div>
      </div>

      <div class="claude-banner" style="width:100%;">
        <span>💡 <b>资产录入提示</b>：照片与资产入库请直接在 Claude 对话中发送图片，外脑将自动深度识别并录入图库与便签。</span>
        <span style="font-size: 0.78rem; opacity: 0.8;">Voyage-Multimodal-3.5 统一向量引擎</span>
      </div>
    </div>

    <!-- ==================== 2. Active Search / Results Mode ==================== -->
    <div id="activeSection" style="display:none; display:flex; flex-direction:column; gap:1.25rem;">
      <div class="search-panel">
        <div class="search-bar-wrap">
          <input type="text" id="activeSearchInput" class="search-input" placeholder="输入关键词检索记忆、便签或视觉图片... (Enter 键刷新)">
          <button id="activeSearchBtn" class="btn-search">智能检索</button>
          <button id="btnBackHero" class="btn-back-hero" title="返回极简主页">✕ 返回主页</button>
        </div>
        <div class="results-toolbar">
          <div class="nav-tabs">
            <button class="tab-btn active" data-tab="all">🔍 聚合时光轴 (图文混排)</button>
            <button class="tab-btn" data-tab="images">🖼️ 视觉图库</button>
            <button class="tab-btn" data-tab="notes">📝 便签备忘</button>
          </div>
          <div class="toolbar-right">
            <div class="sort-group">
              <span class="sort-label">排序：</span>
              <button class="btn-sort active" id="sortTimeBtn" data-sort="time">🕒 最新优先</button>
              <button class="btn-sort" id="sortScoreBtn" data-sort="score">🎯 匹配度优先</button>
            </div>
            <span id="resultsCountBadge" class="results-badge"></span>
          </div>
        </div>
      </div>

      <!-- Content Container -->
      <div id="contentContainer">
        <div id="loadingState" class="empty-state" style="display:none;">
          <p>⏳ 正在跨模态检索中...</p>
        </div>

        <!-- ALL VIEW (Unified Mixed Feed) -->
        <div id="viewAll">
          <div id="allMixedGrid" class="unified-feed-grid"></div>
        </div>

        <!-- IMAGES VIEW -->
        <div id="viewImages" style="display:none;">
          <div id="imagesGrid" class="results-grid"></div>
        </div>

        <!-- NOTES VIEW -->
        <div id="viewNotes" style="display:none;">
          <div id="notesGrid" class="notes-grid"></div>
        </div>
      </div>
    </div>
  </main>

  <!-- Image Detail Modal -->
  <div id="imgModal" class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header">
        <h3 id="modalTitle" style="font-size:1rem;">图片详情</h3>
        <button class="modal-close" onclick="closeModal('imgModal')">&times;</button>
      </div>
      <div class="modal-body">
        <img id="modalImg" class="modal-img" src="" alt="">
        <p id="modalDesc" style="font-size:0.9rem; line-height:1.6; color:#e2e8f0;"></p>
        <table class="exif-table">
          <tbody id="modalExif"></tbody>
        </table>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem; gap:0.5rem; flex-wrap:wrap;">
          <span id="modalId" style="font-size:0.75rem; color:#64748b; font-family:monospace;"></span>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button id="modalDeleteBtn" class="btn-delete-modal" title="彻底删除此图片及云端存储">🗑️ 删除此图片</button>
            <a id="modalDownload" href="" target="_blank" class="chip" style="color:#38bdf8;">在新窗口查看原图</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentTab = "all";
    let currentSort = "time"; // "time" (default newest first) | "score"
    let currentFeedData = null; // stores { query, tab, notes, images, merged }
    let isHeroMode = true;

    const imageStore = {};
    const noteStore = {};

    // Navigation & Mode Switching
    function switchToActiveMode(query = "") {
      isHeroMode = false;
      document.getElementById("heroSection").style.display = "none";
      const activeSec = document.getElementById("activeSection");
      activeSec.style.display = "flex";
      document.getElementById("activeSearchInput").value = query;
    }

    function resetToHero() {
      isHeroMode = true;
      document.getElementById("heroSection").style.display = "flex";
      document.getElementById("activeSection").style.display = "none";
      document.getElementById("heroSearchInput").value = "";
      document.getElementById("activeSearchInput").value = "";
      document.getElementById("heroSearchInput").focus();
    }

    document.getElementById("headerLogo").addEventListener("click", resetToHero);
    document.getElementById("btnBackHero").addEventListener("click", resetToHero);

    // Hero Search
    document.getElementById("heroSearchBtn").addEventListener("click", () => {
      const q = document.getElementById("heroSearchInput").value.trim();
      executeSearch(q);
    });
    document.getElementById("heroSearchInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executeSearch(document.getElementById("heroSearchInput").value.trim());
      }
    });

    // Browse Latest Button in Hero
    document.getElementById("btnBrowseLatest").addEventListener("click", () => {
      executeSearch("");
    });

    // Chips
    document.querySelectorAll(".chip-query").forEach(c => {
      c.addEventListener("click", () => {
        executeSearch(c.dataset.query);
      });
    });

    // Active Search Bar
    document.getElementById("activeSearchBtn").addEventListener("click", () => {
      executeSearch(document.getElementById("activeSearchInput").value.trim());
    });
    document.getElementById("activeSearchInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executeSearch(document.getElementById("activeSearchInput").value.trim());
      }
    });

    // Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTab = btn.dataset.tab;

        document.getElementById("viewAll").style.display = currentTab === "all" ? "block" : "none";
        document.getElementById("viewImages").style.display = currentTab === "images" ? "block" : "none";
        document.getElementById("viewNotes").style.display = currentTab === "notes" ? "block" : "none";

        const query = document.getElementById("activeSearchInput").value.trim();
        executeSearch(query);
      });
    });

    // Sort Switcher
    const sortTimeBtn = document.getElementById("sortTimeBtn");
    const sortScoreBtn = document.getElementById("sortScoreBtn");

    sortTimeBtn.addEventListener("click", () => {
      if (currentSort === "time") return;
      currentSort = "time";
      sortTimeBtn.classList.add("active");
      sortScoreBtn.classList.remove("active");
      renderCurrentData();
    });

    sortScoreBtn.addEventListener("click", () => {
      if (currentSort === "score") return;
      currentSort = "score";
      sortScoreBtn.classList.add("active");
      sortTimeBtn.classList.remove("active");
      renderCurrentData();
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    });

    // Main Search Executor
    async function executeSearch(query) {
      switchToActiveMode(query);
      showLoading(true);

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, tab: currentTab, limit: 36 })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "检索失败");

        currentFeedData = data;
        renderCurrentData();
      } catch (err) {
        alert("检索发生错误: " + err.message);
      } finally {
        showLoading(false);
      }
    }

    // Render Data based on Current Tab and Current Sort
    function renderCurrentData() {
      if (!currentFeedData) return;

      const badge = document.getElementById("resultsCountBadge");

      if (currentTab === "all") {
        let list = (currentFeedData.merged || []).slice();
        if (currentSort === "time") {
          list.sort((a, b) => {
            const tA = new Date(a.sort_time || a.timestamp || a.captured_at || a.created_at || 0).getTime();
            const tB = new Date(b.sort_time || b.timestamp || b.captured_at || b.created_at || 0).getTime();
            return tB - tA;
          });
        } else {
          list.sort((a, b) => (b.score || 0) - (a.score || 0));
        }
        badge.innerText = "共 " + list.length + " 项 (" + (currentSort === "time" ? "最新优先" : "相关度优先") + ")";
        renderMixedFeed(list, "allMixedGrid");
      } else if (currentTab === "images") {
        let list = (currentFeedData.results || currentFeedData.images || []).slice();
        if (currentSort === "time") {
          list.sort((a, b) => {
            const tA = new Date(a.captured_at || a.created_at || 0).getTime();
            const tB = new Date(b.captured_at || b.created_at || 0).getTime();
            return tB - tA;
          });
        } else {
          list.sort((a, b) => (b.score || 0) - (a.score || 0));
        }
        badge.innerText = "共 " + list.length + " 张视觉图片";
        renderImages(list, "imagesGrid");
      } else if (currentTab === "notes") {
        let list = (currentFeedData.results || currentFeedData.notes || []).slice();
        if (currentSort === "time") {
          list.sort((a, b) => {
            const tA = new Date(a.timestamp || 0).getTime();
            const tB = new Date(b.timestamp || 0).getTime();
            return tB - tA;
          });
        } else {
          list.sort((a, b) => (b.score || 0) - (a.score || 0));
        }
        badge.innerText = "共 " + list.length + " 条便签备忘";
        renderNotes(list, "notesGrid");
      }
    }

    // 1. Mixed Feed Renderer (Notes with Embedded Images + Standalone Images)
    function renderMixedFeed(items, containerId) {
      const container = document.getElementById(containerId);
      if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><h3>暂无匹配记录</h3><p>可尝试切换检索词或浏览全部最新</p></div>';
        return;
      }

      container.innerHTML = items.map(function(item, idx) {
        const key = containerId + "_" + idx;

        if (item.feed_type === "note") {
          noteStore[key] = item;
          const scoreBadge = (item.score && item.score < 1.0) ? ('<span class="score-badge">匹配度 ' + (item.score * 100).toFixed(1) + '%</span>') : '';
          const tagsHtml = (item.tags || []).map(function(t) {
            return '<span class="note-tag">#' + escapeHtml(t) + '</span>';
          }).join('');
          const dateStr = item.date || (item.timestamp ? item.timestamp.slice(0, 10) : '未知日期');

          let mediaHtml = '';
          if (item.image && item.image.url) {
            const imgKey = key + "_img";
            imageStore[imgKey] = item.image;
            mediaHtml = '<div class="note-media-wrap" data-img-key="' + imgKey + '">' +
              '<img class="note-media-img" src="' + escapeHtml(item.image.url) + '" loading="lazy" alt="' + escapeHtml(item.title || '') + '">' +
              '<span class="media-tag">📷 附图</span>' +
              scoreBadge +
            '</div>';
          }

          return '<div class="note-card" id="notecard_' + (item.id || '') + '" data-key="' + key + '">' +
            mediaHtml +
            '<div class="note-inner">' +
              '<div class="note-header">' +
                '<div class="note-title">' +
                  '<span>📌</span>' +
                  '<span>' + escapeHtml(item.title || '无标题便签') + '</span>' +
                '</div>' +
                (!mediaHtml ? scoreBadge : '') +
              '</div>' +
              (tagsHtml ? ('<div class="note-tags">' + tagsHtml + '</div>') : '') +
              '<div class="note-content">' + escapeHtml(item.content || '') + '</div>' +
              '<div class="note-footer">' +
                '<span>📅 ' + dateStr + '</span>' +
                '<div class="note-actions">' +
                  '<button class="btn-copy" data-key="' + key + '">📋 复制</button>' +
                  '<button class="btn-delete-note" data-id="' + (item.id || '') + '" title="删除此便签">🗑️ 删除</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        } else {
          // Standalone Image
          imageStore[key] = item;
          const scoreBadge = (item.score && item.score < 1.0) ? ('<span class="score-badge">相似度 ' + (item.score * 100).toFixed(1) + '%</span>') : '';
          const metaDevice = (item.exif && item.exif.device) ? ('📷 ' + escapeHtml(item.exif.device)) : (item.created_at ? item.created_at.slice(0, 10) : '');
          const metaLoc = (item.location && item.location.lat) ? '<span>📍 有GPS</span>' : '';

          return '<div class="card" data-img-key="' + key + '" id="imgcard_' + (item.id || '') + '">' +
            '<div class="card-img-wrap">' +
              '<img class="card-img" src="' + (item.url || '') + '" loading="lazy" alt="' + escapeHtml(item.title || item.filename || '') + '">' +
              scoreBadge +
            '</div>' +
            '<div class="card-body">' +
              '<div class="card-title">' + escapeHtml(item.title || item.filename || '未命名图片') + '</div>' +
              '<div class="card-desc">' + escapeHtml(item.description || '无详细描述') + '</div>' +
              '<div class="card-meta">' +
                '<span>' + metaDevice + '</span>' +
                '<div style="display:flex; align-items:center; gap:0.4rem;">' +
                  metaLoc +
                  '<button class="btn-delete-img-card" data-id="' + (item.id || '') + '" title="彻底删除此图片">🗑️ 删除</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }
      }).join('');

      container.onclick = function(e) {
        // Delete note
        const delNoteBtn = e.target.closest('.btn-delete-note');
        if (delNoteBtn && delNoteBtn.dataset.id) {
          e.stopPropagation();
          deleteNote(delNoteBtn.dataset.id, delNoteBtn.closest('.note-card'));
          return;
        }

        // Delete image
        const delImgBtn = e.target.closest('.btn-delete-img-card');
        if (delImgBtn && delImgBtn.dataset.id) {
          e.stopPropagation();
          deleteImage(delImgBtn.dataset.id, delImgBtn.closest('.card'));
          return;
        }

        // Copy note content
        const copyBtn = e.target.closest('.btn-copy');
        if (copyBtn && copyBtn.dataset.key && noteStore[copyBtn.dataset.key]) {
          copyContent(copyBtn, noteStore[copyBtn.dataset.key].content || '');
          return;
        }

        // Open image modal from note media
        const noteMedia = e.target.closest('.note-media-wrap');
        if (noteMedia && noteMedia.dataset.imgKey && imageStore[noteMedia.dataset.imgKey]) {
          openImageModal(imageStore[noteMedia.dataset.imgKey]);
          return;
        }

        // Open image modal from standalone card
        const imgCard = e.target.closest('.card');
        if (imgCard && imgCard.dataset.imgKey && imageStore[imgCard.dataset.imgKey]) {
          openImageModal(imageStore[imgCard.dataset.imgKey]);
          return;
        }
      };
    }

    // 2. Standalone Images Renderer
    function renderImages(images, containerId) {
      const container = document.getElementById(containerId);
      if (!images || images.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><p>未找到视觉照片</p></div>';
        return;
      }

      container.innerHTML = images.map(function(img, idx) {
        const key = containerId + "_" + idx;
        imageStore[key] = img;
        const scoreBadge = (img.score && img.score < 1.0) ? ('<span class="score-badge">相似度 ' + (img.score * 100).toFixed(1) + '%</span>') : '';
        const metaDevice = (img.exif && img.exif.device) ? ('📷 ' + escapeHtml(img.exif.device)) : (img.created_at ? img.created_at.slice(0, 10) : '');
        const metaLoc = (img.location && img.location.lat) ? '<span>📍 有GPS</span>' : '';

        return '<div class="card" data-key="' + key + '" id="imgcard_' + (img.id || '') + '">' +
          '<div class="card-img-wrap">' +
            '<img class="card-img" src="' + (img.url || '') + '" loading="lazy" alt="' + escapeHtml(img.title || img.filename || '') + '">' +
            scoreBadge +
          '</div>' +
          '<div class="card-body">' +
            '<div class="card-title">' + escapeHtml(img.title || img.filename || '未命名') + '</div>' +
            '<div class="card-desc">' + escapeHtml(img.description || '无描述') + '</div>' +
            '<div class="card-meta">' +
              '<span>' + metaDevice + '</span>' +
              '<div style="display:flex; align-items:center; gap:0.4rem;">' +
                metaLoc +
                '<button class="btn-delete-img-card" data-id="' + (img.id || '') + '" title="彻底删除此图片">🗑️ 删除</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      container.onclick = function(e) {
        const delBtn = e.target.closest('.btn-delete-img-card');
        if (delBtn && delBtn.dataset.id) {
          e.stopPropagation();
          deleteImage(delBtn.dataset.id, delBtn.closest('.card'));
          return;
        }
        const card = e.target.closest('.card');
        if (card && card.dataset.key && imageStore[card.dataset.key]) {
          openImageModal(imageStore[card.dataset.key]);
        }
      };
    }

    // 3. Notes Renderer (with Embedded Media if Available)
    function renderNotes(notes, containerId) {
      const container = document.getElementById(containerId);
      if (!notes || notes.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><p>未找到便签备忘</p></div>';
        return;
      }

      container.innerHTML = notes.map(function(n, idx) {
        const key = containerId + "_" + idx;
        noteStore[key] = n;
        const scoreBadge = (n.score && n.score < 1.0) ? ('<span class="score-badge">匹配度 ' + (n.score * 100).toFixed(1) + '%</span>') : '';
        const tagsHtml = (n.tags || []).map(function(t) {
          return '<span class="note-tag">#' + escapeHtml(t) + '</span>';
        }).join('');
        const dateStr = n.date || (n.timestamp ? n.timestamp.slice(0, 10) : '未知日期');

        let mediaHtml = '';
        if (n.image && n.image.url) {
          const imgKey = key + "_img";
          imageStore[imgKey] = n.image;
          mediaHtml = '<div class="note-media-wrap" data-img-key="' + imgKey + '">' +
            '<img class="note-media-img" src="' + escapeHtml(n.image.url) + '" loading="lazy" alt="' + escapeHtml(n.title || '') + '">' +
            '<span class="media-tag">📷 附图</span>' +
            scoreBadge +
          '</div>';
        }

        return '<div class="note-card" id="notecard_' + (n.id || '') + '">' +
          mediaHtml +
          '<div class="note-inner">' +
            '<div class="note-header">' +
              '<div class="note-title">' +
                '<span>📌</span>' +
                '<span>' + escapeHtml(n.title || '无标题便签') + '</span>' +
              '</div>' +
              (!mediaHtml ? scoreBadge : '') +
            '</div>' +
            (tagsHtml ? ('<div class="note-tags">' + tagsHtml + '</div>') : '') +
            '<div class="note-content">' + escapeHtml(n.content || '') + '</div>' +
            '<div class="note-footer">' +
              '<span>📅 ' + dateStr + '</span>' +
              '<div class="note-actions">' +
                '<button class="btn-copy" data-key="' + key + '">📋 复制</button>' +
                '<button class="btn-delete-note" data-id="' + (n.id || '') + '" title="删除此便签">🗑️ 删除</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      container.onclick = function(e) {
        const delBtn = e.target.closest('.btn-delete-note');
        if (delBtn && delBtn.dataset.id) {
          e.stopPropagation();
          deleteNote(delBtn.dataset.id, delBtn.closest('.note-card'));
          return;
        }
        const copyBtn = e.target.closest('.btn-copy');
        if (copyBtn && copyBtn.dataset.key && noteStore[copyBtn.dataset.key]) {
          copyContent(copyBtn, noteStore[copyBtn.dataset.key].content || '');
          return;
        }
        const noteMedia = e.target.closest('.note-media-wrap');
        if (noteMedia && noteMedia.dataset.imgKey && imageStore[noteMedia.dataset.imgKey]) {
          openImageModal(imageStore[noteMedia.dataset.imgKey]);
          return;
        }
      };
    }

    // Modal
    let currentModalImg = null;

    function openImageModal(img) {
      currentModalImg = img;
      document.getElementById("modalTitle").innerText = img.title || img.filename || "视觉图像详情";
      document.getElementById("modalImg").src = img.url || "";
      document.getElementById("modalDesc").innerText = img.description || "（暂无文字说明）";
      document.getElementById("modalId").innerText = "Cloudflare ID: " + (img.image_id || img.id || "未知");
      document.getElementById("modalDownload").href = img.url || "#";

      const delBtn = document.getElementById("modalDeleteBtn");
      if (delBtn) {
        delBtn.onclick = function() {
          if (currentModalImg && currentModalImg.id) {
            deleteImage(currentModalImg.id, null);
          }
        };
      }

      const exifTbody = document.getElementById("modalExif");
      exifTbody.innerHTML = "";
      const addRow = function(lbl, val) {
        if (!val) return;
        exifTbody.innerHTML += '<tr><td class="label">' + lbl + '</td><td>' + val + '</td></tr>';
      };

      if (img.exif) {
        addRow("拍摄设备", img.exif.device);
        addRow("拍摄时间", img.exif.dateTime);
        addRow("镜头参数", img.exif.lens);
        addRow("光圈/焦距", [img.exif.aperture, img.exif.focalLength].filter(Boolean).join(" | "));
        addRow("ISO", img.exif.iso);
      }
      if (img.location && img.location.lat) {
        const mapUrl = "https://www.openstreetmap.org/?mlat=" + img.location.lat + "&mlon=" + img.location.lon + "#map=16/" + img.location.lat + "/" + img.location.lon;
        addRow("拍摄地点", "[" + img.location.lat + ", " + img.location.lon + '] &nbsp;<a href="' + mapUrl + '" target="_blank" style="color:#38bdf8;">在地图中查看 ↗</a>');
      }

      document.getElementById("imgModal").style.display = "flex";
    }

    function closeModal(id) {
      document.getElementById(id).style.display = "none";
    }

    // Note Deletion
    async function deleteNote(id, cardEl) {
      if (!id) return;
      if (!confirm("⚠️ 确定要彻底删除该便签备忘吗？\n\n此操作将从向量知识库中物理移除，不可撤回。")) {
        return;
      }
      try {
        const res = await fetch("/api/notes/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "删除便签失败");
        }
        showToast("🗑️ 便签已成功删除");
        if (cardEl) {
          cardEl.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          cardEl.style.opacity = "0";
          cardEl.style.transform = "scale(0.9)";
          setTimeout(() => cardEl.remove(), 300);
        } else {
          document.querySelectorAll('#notecard_' + id).forEach(el => el.remove());
        }
      } catch (err) {
        alert("删除便签失败: " + err.message);
      }
    }

    // Image Deletion
    async function deleteImage(id, cardEl) {
      if (!id) return;
      if (!confirm("⚠️ 确定要彻底删除该视觉图片吗？\n\n此操作将同步销毁 Cloudflare Images 云端存储与向量检索索引，不可撤回。")) {
        return;
      }
      try {
        const res = await fetch("/api/images/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "删除图片失败");
        }
        showToast("🗑️ 图片资产已成功删除");
        closeModal("imgModal");
        if (cardEl) {
          cardEl.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          cardEl.style.opacity = "0";
          cardEl.style.transform = "scale(0.9)";
          setTimeout(() => cardEl.remove(), 300);
        }
        document.querySelectorAll('#imgcard_' + id).forEach(el => {
          el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          el.style.opacity = "0";
          el.style.transform = "scale(0.9)";
          setTimeout(() => el.remove(), 300);
        });
      } catch (err) {
        alert("删除图片失败: " + err.message);
      }
    }

    function showToast(msg) {
      let t = document.getElementById("toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "toast";
        t.className = "toast";
        document.body.appendChild(t);
      }
      t.innerText = msg;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 2500);
    }

    function copyContent(btn, text) {
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerText;
        btn.innerText = "✅ 已复制";
        setTimeout(() => btn.innerText = orig, 1500);
      });
    }

    function showLoading(show) {
      document.getElementById("loadingState").style.display = show ? "block" : "none";
    }

    function escapeHtml(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    // Notice: Initial load does NOT make any background fetch requests!
    // Google-style clean open with 0ms delay!
  </script>
</body>
</html>`;
}
