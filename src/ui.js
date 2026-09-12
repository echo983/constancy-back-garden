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
    <p class="desc">多模态认知记忆与视觉资产中台<br>请输入授权凭据以继续访问</p>
    <div id="errorMsg" class="error-box">${errorMessage}</div>
    <form id="loginForm">
      <div class="form-group">
        <label>授权账号 (Email)</label>
        <input type="email" id="email" required placeholder="edwin.abel.3@gmail.com" autofocus>
      </div>
      <div class="form-group">
        <label>授权口令 (Passkey)</label>
        <input type="password" id="passkey" required placeholder="请输入您的专属授权口令">
      </div>
      <button type="submit" id="submitBtn" class="btn-login">登录进入后花园</button>
    </form>
    <div class="footer-hint">与 Constancy MCP 共享统一身份认证体系</div>
  </div>
  <script>
    const savedEmail = localStorage.getItem("constancy_user_email") || "edwin.abel.3@gmail.com";
    document.getElementById("email").value = savedEmail;

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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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

    /* Search Bar */
    .search-panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .search-bar-wrap {
      display: flex;
      gap: 0.75rem;
    }
    .search-input {
      flex: 1;
      background: #0b0f19;
      border: 1px solid var(--card-border);
      color: var(--text);
      font-size: 0.95rem;
      padding: 0.8rem 1.15rem;
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
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      font-size: 0.92rem;
    }
    .btn-search:hover { background: #7dd3fc; box-shadow: 0 4px 12px var(--accent-glow); }
    .quick-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }
    .chip-label { font-size: 0.78rem; color: var(--text-dim); }
    .chip {
      background: #0f1523;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 0.25rem 0.7rem;
      border-radius: 20px;
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .chip:hover { border-color: var(--accent); color: var(--text); background: #162033; }

    /* Results Layout */
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 1rem 0 0.8rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .section-badge {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: normal;
    }

    /* Images Grid */
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
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
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(0,0,0,0.4);
      border-color: #2b3852;
    }
    .card-img-wrap {
      position: relative;
      width: 100%;
      height: 190px;
      background: #0b0f19;
      overflow: hidden;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
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
    }

    /* Notes Grid */
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
    }
    .note-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      transition: all 0.2s;
    }
    .note-card:hover {
      border-color: #2b3852;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
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
    .note-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
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
      padding: 3rem 1rem;
      color: var(--text-muted);
    }
    .empty-state h3 { margin-bottom: 0.5rem; color: #f1f5f9; }

    @media (max-width: 640px) {
      .header-inner { flex-direction: column; align-items: stretch; gap: 0.75rem; }
      .nav-tabs { width: 100%; justify-content: center; }
      .claude-banner { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="logo-group">
        <div class="logo-icon">🧬</div>
        <div class="title-group">
          <h1>Constancy · 后花园 <span class="badge">Back Garden</span></h1>
        </div>
      </div>
      <div class="nav-tabs">
        <button class="tab-btn active" data-tab="all">🔍 聚合检索</button>
        <button class="tab-btn" data-tab="images">🖼️ 视觉图库</button>
        <button class="tab-btn" data-tab="notes">📝 便签备忘</button>
      </div>
      <div class="user-actions">
        <span class="user-pill">👤 ${userEmail}</span>
        <button class="btn-logout" id="logoutBtn">退出登录</button>
      </div>
    </div>
  </header>

  <main>
    <div class="claude-banner">
      <span>💡 <b>资产录入提示</b>：照片与资产入库请直接在 Claude 对话中发送图片，外脑将自动深度识别并录入图库与便签。</span>
      <span style="font-size: 0.78rem; opacity: 0.8;">Voyage-Multimodal-3.5 统一向量引擎</span>
    </div>

    <div class="search-panel">
      <div class="search-bar-wrap">
        <input type="text" id="searchInput" class="search-input" placeholder="输入关键词检索记忆、便签或视觉图片... (Enter 键开始搜索)" autofocus>
        <button id="searchBtn" class="btn-search">智能检索</button>
      </div>
      <div class="quick-chips">
        <span class="chip-label">快捷检索：</span>
        <span class="chip" data-query="MinIO 部署架构">MinIO 部署架构</span>
        <span class="chip" data-query="服务器机柜">服务器机柜</span>
        <span class="chip" data-query="徽章 图标">徽章 图标</span>
        <span class="chip" data-query="速查 配置">速查 配置</span>
        <span class="chip" data-query="街景 夜景">街景 夜景</span>
      </div>
    </div>

    <!-- Section Container -->
    <div id="contentContainer">
      <div id="loadingState" class="empty-state" style="display:none;">
        <p>正在跨模态检索中...</p>
      </div>

      <!-- ALL VIEW -->
      <div id="viewAll">
        <div class="section-title">
          <span>📝 匹配便签与备忘 <span id="allNotesCount" class="section-badge"></span></span>
        </div>
        <div id="allNotesList" class="notes-grid"></div>

        <div class="section-title" style="margin-top:2rem;">
          <span>🖼️ 匹配视觉资产 <span id="allImagesCount" class="section-badge"></span></span>
        </div>
        <div id="allImagesGrid" class="results-grid"></div>
      </div>

      <!-- IMAGES VIEW -->
      <div id="viewImages" style="display:none;">
        <div class="section-title">
          <span>🖼️ 视觉图库资产清单 <span id="imagesCount" class="section-badge"></span></span>
        </div>
        <div id="imagesGrid" class="results-grid"></div>
      </div>

      <!-- NOTES VIEW -->
      <div id="viewNotes" style="display:none;">
        <div class="section-title">
          <span>📝 便签备忘与客观存根 <span id="notesCount" class="section-badge"></span></span>
        </div>
        <div id="notesGrid" class="notes-grid"></div>
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

    // Tab switcher
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTab = btn.dataset.tab;

        document.getElementById("viewAll").style.display = currentTab === "all" ? "block" : "none";
        document.getElementById("viewImages").style.display = currentTab === "images" ? "block" : "none";
        document.getElementById("viewNotes").style.display = currentTab === "notes" ? "block" : "none";

        const query = document.getElementById("searchInput").value.trim();
        if (query) {
          executeSearch(query);
        } else {
          loadDefaultTabContent();
        }
      });
    });

    // Quick chips
    document.querySelectorAll(".chip[data-query]").forEach(c => {
      c.addEventListener("click", () => {
        document.getElementById("searchInput").value = c.dataset.query;
        executeSearch(c.dataset.query);
      });
    });

    // Search action
    document.getElementById("searchBtn").addEventListener("click", () => {
      executeSearch(document.getElementById("searchInput").value.trim());
    });
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executeSearch(document.getElementById("searchInput").value.trim());
      }
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    });

    async function executeSearch(query) {
      if (!query) {
        loadDefaultTabContent();
        return;
      }

      showLoading(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, tab: currentTab, limit: 24 })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "检索失败");

        if (currentTab === "all") {
          renderNotes(data.notes || [], "allNotesList", "allNotesCount");
          renderImages(data.images || [], "allImagesGrid", "allImagesCount");
        } else if (currentTab === "images") {
          renderImages(data.results || [], "imagesGrid", "imagesCount");
        } else if (currentTab === "notes") {
          renderNotes(data.results || [], "notesGrid", "notesCount");
        }
      } catch (err) {
        alert("检索发生错误: " + err.message);
      } finally {
        showLoading(false);
      }
    }

    async function loadDefaultTabContent() {
      showLoading(true);
      try {
        if (currentTab === "all" || currentTab === "images") {
          const imgRes = await fetch("/api/images");
          const imgData = await imgRes.json();
          if (imgData.success) {
            renderImages(imgData.results || [], currentTab === "all" ? "allImagesGrid" : "imagesGrid", currentTab === "all" ? "allImagesCount" : "imagesCount");
          }
        }
        if (currentTab === "all" || currentTab === "notes") {
          const noteRes = await fetch("/api/notes");
          const noteData = await noteRes.json();
          if (noteData.success) {
            renderNotes(noteData.results || [], currentTab === "all" ? "allNotesList" : "notesGrid", currentTab === "all" ? "allNotesCount" : "notesCount");
          }
        }
      } catch (e) {
        console.error("Failed to load initial data:", e);
      } finally {
        showLoading(false);
      }
    }

    const imageStore = {};
    const noteStore = {};

    function renderImages(images, containerId, countId) {
      const container = document.getElementById(containerId);
      const countEl = document.getElementById(countId);
      if (countEl) countEl.innerText = "(" + images.length + " 项)";

      if (!images || images.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><p>未找到匹配的视觉照片</p></div>';
        return;
      }

      container.innerHTML = images.map(function(img, idx) {
        const key = containerId + "_" + idx;
        imageStore[key] = img;
        const scoreBadge = img.score ? ('<span class="score-badge">相似度 ' + (img.score * 100).toFixed(1) + '%</span>') : '';
        const metaDevice = (img.exif && img.exif.device) ? ('📷 ' + escapeHtml(img.exif.device)) : (img.created_at ? img.created_at.slice(0, 10) : '');
        const metaLoc = (img.location && img.location.lat) ? '<span>📍 有GPS定位</span>' : '';

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
          deleteImage(delBtn.dataset.id, delBtn.closest('.card'), countId);
          return;
        }
        const card = e.target.closest('.card');
        if (card && card.dataset.key && imageStore[card.dataset.key]) {
          openImageModal(imageStore[card.dataset.key], countId);
        }
      };
    }

    function renderNotes(notes, containerId, countId) {
      const container = document.getElementById(containerId);
      const countEl = document.getElementById(countId);
      if (countEl) countEl.innerText = "(" + notes.length + " 条)";

      if (!notes || notes.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><p>未找到匹配的便签备忘</p></div>';
        return;
      }

      container.innerHTML = notes.map(function(n, idx) {
        const key = containerId + "_" + idx;
        noteStore[key] = n;
        const scoreBadge = n.score ? ('<span class="score-badge" style="position:static;">匹配度 ' + (n.score * 100).toFixed(1) + '%</span>') : '';
        const tagsHtml = (n.tags || []).map(function(t) {
          return '<span class="note-tag">#' + escapeHtml(t) + '</span>';
        }).join('');
        const dateStr = n.date || (n.timestamp ? n.timestamp.slice(0, 10) : '未知日期');

        return '<div class="note-card" id="notecard_' + (n.id || '') + '">' +
          '<div class="note-header">' +
            '<div class="note-title">' +
              '<span>📌</span>' +
              '<span>' + escapeHtml(n.title || '无标题便签') + '</span>' +
            '</div>' +
            scoreBadge +
          '</div>' +
          '<div class="note-tags">' + tagsHtml + '</div>' +
          '<div class="note-content">' + escapeHtml(n.content || '') + '</div>' +
          '<div class="note-footer">' +
            '<span>📅 ' + dateStr + '</span>' +
            '<div class="note-actions">' +
              '<button class="btn-copy" data-key="' + key + '">📋 复制</button>' +
              '<button class="btn-delete-note" data-id="' + (n.id || '') + '" title="删除此便签">🗑️ 删除</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      container.onclick = function(e) {
        const delBtn = e.target.closest('.btn-delete-note');
        if (delBtn && delBtn.dataset.id) {
          e.stopPropagation();
          deleteNote(delBtn.dataset.id, delBtn.closest('.note-card'), countId);
          return;
        }
        const btn = e.target.closest('.btn-copy');
        if (btn && btn.dataset.key && noteStore[btn.dataset.key]) {
          copyContent(btn, noteStore[btn.dataset.key].content || '');
        }
      };
    }

    let currentModalImg = null;
    let currentModalCountId = null;

    function openImageModal(img, countId) {
      currentModalImg = img;
      currentModalCountId = countId;
      document.getElementById("modalTitle").innerText = img.title || img.filename || "视觉图像详情";
      document.getElementById("modalImg").src = img.url || "";
      document.getElementById("modalDesc").innerText = img.description || "（暂无文字说明）";
      document.getElementById("modalId").innerText = "Cloudflare ID: " + (img.image_id || img.id || "未知");
      document.getElementById("modalDownload").href = img.url || "#";

      const delBtn = document.getElementById("modalDeleteBtn");
      if (delBtn) {
        delBtn.onclick = function() {
          if (currentModalImg && currentModalImg.id) {
            deleteImage(currentModalImg.id, null, currentModalCountId);
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

    async function deleteNote(id, cardEl, countId) {
      if (!id) return;
      if (!confirm("⚠️ 确定要彻底删除该便签备忘吗？\\n\\n此操作将从向量知识库中物理移除，不可撤回。")) {
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
        decrementCount(countId || "allNotesCount");
        decrementCount("notesCount");
      } catch (err) {
        alert("删除便签失败: " + err.message);
      }
    }

    async function deleteImage(id, cardEl, countId) {
      if (!id) return;
      if (!confirm("⚠️ 确定要彻底删除该视觉图片吗？\\n\\n此操作将同步销毁 Cloudflare Images 云端存储与向量检索索引，不可撤回。")) {
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
        decrementCount(countId || "allImagesCount");
        decrementCount("imagesCount");
      } catch (err) {
        alert("删除图片失败: " + err.message);
      }
    }

    function decrementCount(countId) {
      if (!countId) return;
      const el = document.getElementById(countId);
      if (el && el.innerText) {
        el.innerText = el.innerText.replace(/\d+/, n => Math.max(0, parseInt(n) - 1));
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

    // Initial load
    loadDefaultTabContent();
  </script>
</body>
</html>`;
}
