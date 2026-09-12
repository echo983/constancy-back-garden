/**
 * Constancy · 后花园 (Back Garden) UI Module
 * Sleek, dark-themed responsive admin, cross-modal search & stream browse dashboard
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
      --purple: #a855f7;
      --purple-hover: #9333ea;
      --purple-glow: rgba(168, 85, 247, 0.25);
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
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
      transition: opacity 0.2s;
    }
    .logo-group:hover { opacity: 0.85; }
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
      width: 100%;
    }
    .claude-banner span { display: flex; align-items: center; gap: 0.5rem; }

    /* ==================== 1. Google-Style Hero Mode ==================== */
    .hero-section {
      max-width: 780px;
      margin: 4.5rem auto 2.5rem auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.85rem;
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
      font-size: 0.95rem;
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
    .hero-action-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      align-items: center;
      justify-content: center;
    }
    .btn-hero-stream {
      background: linear-gradient(135deg, #0284c7, #6366f1);
      color: #ffffff;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 22px;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
    }
    .btn-hero-stream:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
      filter: brightness(1.1);
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
    .chip-label { font-size: 0.78rem; color: var(--text-dim); }

    /* ==================== 2. Active Mode (Search & Stream) ==================== */
    #activeSection {
      display: none;
      flex-direction: column;
      gap: 1.25rem;
      animation: fadeIn 0.2s ease-out;
    }
    .search-panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.1rem 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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
    .btn-stream-switch {
      background: #0f1523;
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #c084fc;
      padding: 0.72rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      font-weight: 600;
    }
    .btn-stream-switch:hover {
      background: rgba(168, 85, 247, 0.15);
      border-color: #a855f7;
      color: #e9d5ff;
    }
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
    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .mode-badge {
      font-size: 0.82rem;
      font-weight: 600;
      padding: 0.3rem 0.75rem;
      border-radius: 8px;
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.35);
      white-space: nowrap;
    }
    .mode-badge-stream {
      background: rgba(168, 85, 247, 0.12);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.35);
    }
    .nav-tabs {
      display: flex;
      background: #0b0f19;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 0.25rem;
      gap: 0.25rem;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.4rem 0.85rem;
      border-radius: 7px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .tab-btn.active {
      background: var(--card-bg);
      color: var(--text);
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    }
    .tab-btn-purple.active {
      background: rgba(168, 85, 247, 0.2);
      color: #e9d5ff;
      border: 1px solid rgba(168, 85, 247, 0.4);
    }
    .sort-group {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: #0b0f19;
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
    .stream-sort-indicator {
      font-size: 0.78rem;
      color: #94a3b8;
      background: #0b0f19;
      border: 1px solid var(--card-border);
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      white-space: nowrap;
    }
    .results-badge {
      font-size: 0.78rem;
      color: var(--text-muted);
      background: #0f1523;
      border: 1px solid var(--card-border);
      padding: 0.32rem 0.75rem;
      border-radius: 20px;
      white-space: nowrap;
    }

    /* ==================== 3. Unified Mixed Grid & Cards ==================== */
    .unified-feed-grid {
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
    .score-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
    }
    .score-badge-inline {
      font-size: 0.72rem;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
      white-space: nowrap;
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
    .card-type-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.72rem;
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
      grid-column: 1 / -1;
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
      .toolbar-left, .toolbar-right { justify-content: space-between; width: 100%; }
      .search-bar-wrap { flex-wrap: wrap; }
      .search-input { min-width: 100%; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="logo-group" id="headerLogo" title="点击返回极简主页">
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
    <!-- ==================== 1. Google-Style Hero Mode (Initial Load) ==================== -->
    <div id="heroSection" class="hero-section">
      <div class="hero-brand">
        <div class="hero-logo-icon">🧬</div>
        <h1 class="hero-title">Constancy · 后花园</h1>
        <p class="hero-tagline">数字海马体 · 多模态记忆时光全集与跨模态向量检索</p>
      </div>

      <div class="hero-search-panel">
        <form id="heroSearchForm" class="hero-search-bar" action="javascript:void(0);">
          <input type="text" id="heroSearchInput" class="hero-search-input" placeholder="跨模态检索记忆、便签或视觉图片... (按 Enter 键开始)" autofocus autocomplete="off">
          <button type="submit" id="heroSearchBtn" class="btn-hero-search">智能检索</button>
        </form>
        <div class="hero-action-bar">
          <button type="button" class="btn-hero-stream" id="btnBrowseLatest">📖 漫游时光全集 (浏览全部最新)</button>
          <span class="chip-label">快捷检索：</span>
          <button type="button" class="chip chip-query" data-query="MinIO 部署架构">MinIO 部署架构</button>
          <button type="button" class="chip chip-query" data-query="服务器机柜">服务器机柜</button>
          <button type="button" class="chip chip-query" data-query="徽章 图标">徽章 图标</button>
          <button type="button" class="chip chip-query" data-query="速查 配置">速查 配置</button>
          <button type="button" class="chip chip-query" data-query="街景 夜景">街景 夜景</button>
        </div>
      </div>

      <div class="claude-banner">
        <span>💡 <b>资产录入提示</b>：照片与资产入库请直接在 Claude 对话中发送图片，外脑将自动深度识别并录入图库与便签。</span>
        <span style="font-size: 0.78rem; opacity: 0.8;">Voyage-Multimodal-3.5 统一向量引擎</span>
      </div>
    </div>

    <!-- ==================== 2. Active View (Search Mode or Stream Mode) ==================== -->
    <div id="activeSection">
      <div class="search-panel">
        <form id="activeSearchForm" class="search-bar-wrap" action="javascript:void(0);">
          <input type="text" id="activeSearchInput" class="search-input" placeholder="输入关键词跨模态检索，或留空漫游时光全集... (按 Enter 键确认)" autocomplete="off">
          <button type="submit" id="activeSearchBtn" class="btn-search">智能检索</button>
          <button type="button" id="btnActiveStream" class="btn-stream-switch" title="切换到不搜索的全量时光全集">📖 漫游时光</button>
          <button type="button" id="btnBackHero" class="btn-back-hero" title="返回极简主页">✕ 返回主页</button>
        </form>

        <!-- Search Mode Toolbar -->
        <div id="searchToolbar" class="results-toolbar" style="display:none;">
          <div class="toolbar-left">
            <span id="searchQueryBadge" class="mode-badge">🎯 检索结果</span>
            <div class="nav-tabs" id="searchTabs">
              <button class="tab-btn active" data-search-tab="all">🔍 综合检索 (<span id="countAll">0</span>)</button>
              <button class="tab-btn" data-search-tab="images">📷 视觉图片 (<span id="countImages">0</span>)</button>
              <button class="tab-btn" data-search-tab="notes">📝 便签备忘 (<span id="countNotes">0</span>)</button>
            </div>
          </div>
          <div class="toolbar-right">
            <div class="sort-group">
              <span class="sort-label">排序：</span>
              <button class="btn-sort active" id="sortScoreBtn" title="最匹配优先">🎯 匹配度优先</button>
              <button class="btn-sort" id="sortTimeBtn" title="最新记录优先">🕒 按时间倒序</button>
            </div>
            <span id="searchCountBadge" class="results-badge"></span>
          </div>
        </div>

        <!-- Stream Mode Toolbar -->
        <div id="streamToolbar" class="results-toolbar" style="display:none;">
          <div class="toolbar-left">
            <span class="mode-badge mode-badge-stream">📖 漫游时光全集 (合库流)</span>
            <div class="nav-tabs" id="streamTabs">
              <button class="tab-btn tab-btn-purple active" data-stream-filter="all">🌐 全部时光 (<span id="streamCountTotal">0</span>)</button>
              <button class="tab-btn tab-btn-purple" data-stream-filter="images">📷 纯摄影照片 (<span id="streamCountImages">0</span>)</button>
              <button class="tab-btn tab-btn-purple" data-stream-filter="notes">📝 便签与备忘 (<span id="streamCountNotes">0</span>)</button>
            </div>
          </div>
          <div class="toolbar-right">
            <span class="stream-sort-indicator">🕒 严格按时间倒序 (最新在最前)</span>
            <span id="streamCountBadge" class="results-badge"></span>
          </div>
        </div>
      </div>

      <!-- Feed Container -->
      <div id="contentContainer">
        <div id="loadingState" class="empty-state" style="display:none;">
          <p id="loadingText">⏳ 正在加载中...</p>
        </div>
        <div id="feedGrid" class="unified-feed-grid"></div>
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
    let currentMode = "hero"; // "hero" | "search" | "stream"
    let currentSearchTab = "all"; // "all" | "images" | "notes"
    let currentSearchSort = "score"; // "score" (DEFAULT FOR SEARCH!) | "time"
    let currentStreamFilter = "all"; // "all" | "images" | "notes"

    let searchDataCache = null; // { query, notes, images, merged }
    let streamDataCache = null; // { stream, stats }

    const itemStore = {};

    // Mode Switching
    function switchToActiveLayout() {
      document.getElementById("heroSection").style.display = "none";
      const activeSec = document.getElementById("activeSection");
      activeSec.style.display = "flex";
    }

    function resetToHero() {
      currentMode = "hero";
      document.getElementById("heroSection").style.display = "flex";
      document.getElementById("activeSection").style.display = "none";
      document.getElementById("heroSearchInput").value = "";
      document.getElementById("activeSearchInput").value = "";
      document.getElementById("feedGrid").innerHTML = "";
      document.getElementById("heroSearchInput").focus();
    }

    document.getElementById("headerLogo").addEventListener("click", resetToHero);
    document.getElementById("btnBackHero").addEventListener("click", resetToHero);

    // Form Submissions & Enter Key Handlers
    function handleHeroSubmit() {
      const q = document.getElementById("heroSearchInput").value.trim();
      if (q) {
        executeSearch(q);
      } else {
        loadStream();
      }
    }

    function handleActiveSubmit() {
      const q = document.getElementById("activeSearchInput").value.trim();
      if (q) {
        executeSearch(q);
      } else {
        loadStream();
      }
    }

    // Hero Search Form + Enter listener
    const heroForm = document.getElementById("heroSearchForm");
    if (heroForm) {
      heroForm.addEventListener("submit", function(e) {
        e.preventDefault();
        handleHeroSubmit();
      });
    }
    const heroInput = document.getElementById("heroSearchInput");
    if (heroInput) {
      heroInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.keyCode === 13) {
          e.preventDefault();
          handleHeroSubmit();
        }
      });
    }

    // Active Search Form + Enter listener
    const activeForm = document.getElementById("activeSearchForm");
    if (activeForm) {
      activeForm.addEventListener("submit", function(e) {
        e.preventDefault();
        handleActiveSubmit();
      });
    }
    const activeInput = document.getElementById("activeSearchInput");
    if (activeInput) {
      activeInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.keyCode === 13) {
          e.preventDefault();
          handleActiveSubmit();
        }
      });
    }

    // Browse Stream Buttons
    document.getElementById("btnBrowseLatest").addEventListener("click", function() {
      loadStream();
    });
    document.getElementById("btnActiveStream").addEventListener("click", function() {
      loadStream();
    });

    // Quick Keyword Chips
    document.querySelectorAll(".chip-query").forEach(function(c) {
      c.addEventListener("click", function() {
        executeSearch(c.dataset.query);
      });
    });

    // Search Tabs Handler
    document.querySelectorAll("#searchTabs .tab-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll("#searchTabs .tab-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentSearchTab = btn.dataset.searchTab;
        renderSearchView();
      });
    });

    // Search Sort Switcher Handlers
    const sortScoreBtn = document.getElementById("sortScoreBtn");
    const sortTimeBtn = document.getElementById("sortTimeBtn");

    sortScoreBtn.addEventListener("click", function() {
      if (currentSearchSort === "score") return;
      currentSearchSort = "score";
      sortScoreBtn.classList.add("active");
      sortTimeBtn.classList.remove("active");
      renderSearchView();
    });

    sortTimeBtn.addEventListener("click", function() {
      if (currentSearchSort === "time") return;
      currentSearchSort = "time";
      sortTimeBtn.classList.add("active");
      sortScoreBtn.classList.remove("active");
      renderSearchView();
    });

    // Stream Sub-filter Chips Handler
    document.querySelectorAll("#streamTabs .tab-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll("#streamTabs .tab-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentStreamFilter = btn.dataset.streamFilter;
        renderStreamView();
      });
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async function() {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    });

    // ==================== Search Mode Logic (Score Prioritized by Default) ====================
    async function executeSearch(query) {
      if (!query) {
        loadStream();
        return;
      }
      currentMode = "search";
      currentSearchTab = "all";
      currentSearchSort = "score"; // SEARCH RESULTS MUST DEFAULT TO RELEVANCE / SCORE DESCENDING!

      switchToActiveLayout();
      document.getElementById("activeSearchInput").value = query;
      document.getElementById("searchToolbar").style.display = "flex";
      document.getElementById("streamToolbar").style.display = "none";

      // Reset tab & sort UI buttons
      document.querySelectorAll("#searchTabs .tab-btn").forEach(function(b) {
        b.classList.toggle("active", b.dataset.searchTab === "all");
      });
      sortScoreBtn.classList.add("active");
      sortTimeBtn.classList.remove("active");
      document.getElementById("searchQueryBadge").innerText = "🎯 检索: " + JSON.stringify(query);

      showLoading(true, "⏳ 正在跨模态意图检索...");
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query, tab: "all", limit: 60 })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "检索失败");

        searchDataCache = data;
        renderSearchView();
      } catch (err) {
        alert("检索发生错误: " + err.message);
      } finally {
        showLoading(false);
      }
    }

    function renderSearchView() {
      if (!searchDataCache) return;
      const notes = searchDataCache.notes || [];
      const images = searchDataCache.images || [];
      const merged = searchDataCache.merged || [];

      document.getElementById("countAll").innerText = merged.length;
      document.getElementById("countImages").innerText = images.length;
      document.getElementById("countNotes").innerText = notes.length;

      let items = [];
      if (currentSearchTab === "all") {
        items = merged.slice();
      } else if (currentSearchTab === "images") {
        items = images.slice();
      } else if (currentSearchTab === "notes") {
        items = notes.slice();
      }

      if (currentSearchSort === "score") {
        // Strict relevance descending
        items.sort(function(a, b) { return (b.score || 0) - (a.score || 0); });
      } else {
        // Reverse chronological
        items.sort(function(a, b) {
          const tA = new Date(a.sort_time || a.timestamp || a.captured_at || a.created_at || 0).getTime();
          const tB = new Date(b.sort_time || b.timestamp || b.captured_at || b.created_at || 0).getTime();
          return tB - tA;
        });
      }

      const sortName = currentSearchSort === "score" ? "匹配度优先" : "时间倒序";
      document.getElementById("searchCountBadge").innerText = "共 " + items.length + " 项 (" + sortName + ")";
      renderFeedCards(items, true);
    }

    // ==================== Stream Mode Logic (Strictly Reverse Chronological) ====================
    async function loadStream() {
      currentMode = "stream";
      currentStreamFilter = "all";

      switchToActiveLayout();
      document.getElementById("activeSearchInput").value = "";
      document.getElementById("searchToolbar").style.display = "none";
      document.getElementById("streamToolbar").style.display = "flex";

      // Reset stream sub-filter UI buttons
      document.querySelectorAll("#streamTabs .tab-btn").forEach(function(b) {
        b.classList.toggle("active", b.dataset.streamFilter === "all");
      });

      showLoading(true, "⏳ 正在加载时光全集 (合库漫游)...");
      try {
        const res = await fetch("/api/stream?limit=100", { method: "GET" });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "加载时光全集失败");

        streamDataCache = data;
        renderStreamView();
      } catch (err) {
        alert("加载失败: " + err.message);
      } finally {
        showLoading(false);
      }
    }

    function renderStreamView() {
      if (!streamDataCache) return;
      const stream = streamDataCache.stream || [];
      const stats = streamDataCache.stats || {};

      document.getElementById("streamCountTotal").innerText = stats.total ?? stream.length;
      document.getElementById("streamCountImages").innerText = stats.images ?? 0;
      document.getElementById("streamCountNotes").innerText = stats.notes ?? 0;

      let items = [];
      if (currentStreamFilter === "all") {
        items = stream.slice();
      } else if (currentStreamFilter === "images") {
        items = stream.filter(function(x) { return x.feed_type === "image"; });
      } else if (currentStreamFilter === "notes") {
        items = stream.filter(function(x) { return x.feed_type === "note"; });
      }

      // Stream Mode is ALWAYS strictly reverse chronological (newest first)
      items.sort(function(a, b) {
        const tA = new Date(a.sort_time || a.timestamp || a.captured_at || a.created_at || 0).getTime();
        const tB = new Date(b.sort_time || b.timestamp || b.captured_at || b.created_at || 0).getTime();
        return tB - tA;
      });

      document.getElementById("streamCountBadge").innerText = "共 " + items.length + " 项记录";
      renderFeedCards(items, false);
    }

    // ==================== Universal Feed Cards Renderer ====================
    function renderFeedCards(items, isSearchMode) {
      const container = document.getElementById("feedGrid");
      if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>暂无记录</h3><p>' + (isSearchMode ? '未找到相关内容，可尝试更换检索关键词或浏览时光全集' : '知识库中尚无内容') + '</p></div>';
        return;
      }

      container.innerHTML = items.map(function(item, idx) {
        const key = "item_" + idx + "_" + (item.id || "0");
        itemStore[key] = item;

        if (item.feed_type === "note" || item.type === "note" || item.content !== undefined) {
          // Note Card (with or without embedded image)
          const scoreBadge = (isSearchMode && item.score && item.score < 1.0)
            ? ('<span class="score-badge">🎯 匹配度 ' + (item.score * 100).toFixed(1) + '%</span>')
            : '';
          const scoreBadgeInline = (isSearchMode && item.score && item.score < 1.0)
            ? ('<span class="score-badge-inline">🎯 匹配度 ' + (item.score * 100).toFixed(1) + '%</span>')
            : '';
          const tagsHtml = (item.tags || []).map(function(t) {
            return '<span class="note-tag">#' + escapeHtml(t) + '</span>';
          }).join('');
          const dateStr = item.date || (item.timestamp ? item.timestamp.slice(0, 10) : "未知日期");

          let mediaHtml = '';
          if (item.image && item.image.url) {
            const imgKey = key + "_media";
            itemStore[imgKey] = item.image;
            mediaHtml = '<div class="note-media-wrap" data-img-key="' + imgKey + '" title="点击查看大图及 EXIF 详情">' +
              '<img class="note-media-img" src="' + escapeHtml(item.image.url) + '" loading="lazy" alt="' + escapeHtml(item.title || '') + '">' +
              '<span class="media-tag">📷 便签附图</span>' +
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
                (!mediaHtml ? scoreBadgeInline : '') +
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
          // Standalone Photography Image Card
          const scoreBadge = (isSearchMode && item.score && item.score < 1.0)
            ? ('<span class="score-badge">🎯 相似度 ' + (item.score * 100).toFixed(1) + '%</span>')
            : '<span class="card-type-badge">📷 摄影照片</span>';
          const metaDevice = (item.exif && item.exif.device) ? ('📷 ' + escapeHtml(item.exif.device)) : (item.created_at ? item.created_at.slice(0, 10) : '');
          const metaLoc = (item.location && item.location.lat) ? '<span>📍 有GPS</span>' : '';

          return '<div class="card" data-img-key="' + key + '" id="imgcard_' + (item.id || '') + '" title="点击查看大图及 EXIF 详情">' +
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
    }

    // Grid Click Event Delegation
    document.getElementById("feedGrid").addEventListener("click", function(e) {
      // 1. Delete note button
      const delNoteBtn = e.target.closest('.btn-delete-note');
      if (delNoteBtn && delNoteBtn.dataset.id) {
        e.stopPropagation();
        deleteNote(delNoteBtn.dataset.id, delNoteBtn.closest('.note-card'));
        return;
      }

      // 2. Delete image button on card
      const delImgBtn = e.target.closest('.btn-delete-img-card');
      if (delImgBtn && delImgBtn.dataset.id) {
        e.stopPropagation();
        deleteImage(delImgBtn.dataset.id, delImgBtn.closest('.card'));
        return;
      }

      // 3. Copy note content button
      const copyBtn = e.target.closest('.btn-copy');
      if (copyBtn && copyBtn.dataset.key && itemStore[copyBtn.dataset.key]) {
        e.stopPropagation();
        copyContent(copyBtn, itemStore[copyBtn.dataset.key].content || "");
        return;
      }

      // 4. Note embedded image clicked -> open modal
      const noteMedia = e.target.closest('.note-media-wrap');
      if (noteMedia && noteMedia.dataset.imgKey && itemStore[noteMedia.dataset.imgKey]) {
        e.stopPropagation();
        openImageModal(itemStore[noteMedia.dataset.imgKey]);
        return;
      }

      // 5. Standalone image card clicked -> open modal
      const imgCard = e.target.closest('.card');
      if (imgCard && imgCard.dataset.imgKey && itemStore[imgCard.dataset.imgKey]) {
        openImageModal(itemStore[imgCard.dataset.imgKey]);
        return;
      }
    });

    // Image Modal Logic
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

    // Delete Note
    async function deleteNote(id, cardEl) {
      if (!id) return;
      if (!confirm("⚠️ 确定要彻底删除该便签备忘吗？此操作将从向量知识库中物理移除，不可撤回。")) {
        return;
      }
      try {
        const res = await fetch("/api/notes/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "删除便签失败");
        }
        showToast("🗑️ 便签已成功删除");

        // Remove from memory caches
        if (streamDataCache && streamDataCache.stream) {
          streamDataCache.stream = streamDataCache.stream.filter(function(x) { return x.id !== id; });
          if (streamDataCache.stats && streamDataCache.stats.notes) streamDataCache.stats.notes--;
          if (streamDataCache.stats && streamDataCache.stats.total) streamDataCache.stats.total--;
        }
        if (searchDataCache) {
          if (searchDataCache.merged) searchDataCache.merged = searchDataCache.merged.filter(function(x) { return x.id !== id; });
          if (searchDataCache.notes) searchDataCache.notes = searchDataCache.notes.filter(function(x) { return x.id !== id; });
        }

        if (cardEl) {
          cardEl.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          cardEl.style.opacity = "0";
          cardEl.style.transform = "scale(0.9)";
          setTimeout(function() { cardEl.remove(); }, 300);
        } else {
          document.querySelectorAll("#notecard_" + id).forEach(function(el) { el.remove(); });
        }
      } catch (err) {
        alert("删除便签失败: " + err.message);
      }
    }

    // Delete Image
    async function deleteImage(id, cardEl) {
      if (!id) return;
      if (!confirm("⚠️ 确定要彻底删除该视觉图片吗？此操作将同步销毁 Cloudflare Images 云端存储与向量检索索引，不可撤回。")) {
        return;
      }
      try {
        const res = await fetch("/api/images/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "删除图片失败");
        }
        showToast("🗑️ 图片资产已成功删除");
        closeModal("imgModal");

        // Remove from memory caches
        if (streamDataCache && streamDataCache.stream) {
          streamDataCache.stream = streamDataCache.stream.filter(function(x) { return x.id !== id; });
          if (streamDataCache.stats && streamDataCache.stats.images) streamDataCache.stats.images--;
          if (streamDataCache.stats && streamDataCache.stats.total) streamDataCache.stats.total--;
        }
        if (searchDataCache) {
          if (searchDataCache.merged) searchDataCache.merged = searchDataCache.merged.filter(function(x) { return x.id !== id; });
          if (searchDataCache.images) searchDataCache.images = searchDataCache.images.filter(function(x) { return x.id !== id; });
        }

        if (cardEl) {
          cardEl.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          cardEl.style.opacity = "0";
          cardEl.style.transform = "scale(0.9)";
          setTimeout(function() { cardEl.remove(); }, 300);
        }
        document.querySelectorAll("#imgcard_" + id).forEach(function(el) {
          el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          el.style.opacity = "0";
          el.style.transform = "scale(0.9)";
          setTimeout(function() { el.remove(); }, 300);
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
      setTimeout(function() { t.classList.remove("show"); }, 2500);
    }

    function copyContent(btn, text) {
      navigator.clipboard.writeText(text).then(function() {
        const orig = btn.innerText;
        btn.innerText = "✅ 已复制";
        setTimeout(function() { btn.innerText = orig; }, 1500);
      });
    }

    function showLoading(show, msg) {
      const loader = document.getElementById("loadingState");
      if (loader) {
        loader.style.display = show ? "block" : "none";
        if (msg) document.getElementById("loadingText").innerText = msg;
      }
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
  </script>
</body>
</html>`;
}
