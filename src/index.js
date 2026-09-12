import { renderLoginHtml, renderDashboardHtml } from "./ui.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...headers
    }
  });
}

function errorResponse(message, status = 500) {
  return jsonResponse({ success: false, error: message }, status);
}

// 1. Qdrant Fetch Helper
async function qdrantFetch(url, env, options = {}) {
  const headers = {
    "api-key": env.QDRANT_API_KEY?.trim(),
    "Content-Type": "application/json",
    "User-Agent": "curl/8.14.1 (constancy-back-garden worker)",
    ...(options.headers || {})
  };
  return fetch(url, { ...options, headers });
}

// 2. Auth & JWT Utilities
async function hmacSha256(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

async function createJwt(payload, secret) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const sig = await hmacSha256(`${header}.${payloadEncoded}`, secret);
  return `${header}.${payloadEncoded}.${sig}`;
}

async function verifyJwt(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, sig] = parts;
    const expectedSig = await hmacSha256(`${header}.${payload}`, secret);
    if (sig !== expectedSig) return null;
    const data = JSON.parse(base64UrlDecode(payload));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

async function getAuthenticatedUser(request, env) {
  if (!env.JWT_SECRET || !env.ALLOWED_EMAILS) return null;

  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(/constancy_auth=([^;]+)/);
  let token = match ? match[1] : "";

  if (!token) {
    const authHeader = request.headers.get("Authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) return null;

  const payload = await verifyJwt(token, env.JWT_SECRET);
  if (!payload || !payload.sub) return null;

  const whitelist = env.ALLOWED_EMAILS.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  if (!whitelist.includes(payload.sub.toLowerCase().trim())) {
    return null;
  }

  return payload.sub;
}

function verifyPasskey(email, passkey, env) {
  if (!passkey || !email) return false;
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check USER_PASSKEYS JSON mapping if provided
  if (env.USER_PASSKEYS) {
    try {
      const map = JSON.parse(env.USER_PASSKEYS);
      if (map[normalizedEmail]) {
        return map[normalizedEmail] === passkey;
      }
    } catch {}
  }

  // 2. Fallback to ADMIN_PASSKEY
  if (env.ADMIN_PASSKEY && passkey === env.ADMIN_PASSKEY) {
    return true;
  }

  return false;
}

// 3. Voyage AI Multimodal 3.5 Embedding
async function getQueryEmbedding(query, env) {
  const apiKey = env.VOYAGE_API_KEY?.trim();
  if (!apiKey) throw new Error("VOYAGE_API_KEY not configured");

  const res = await fetch("https://api.voyageai.com/v1/multimodalembeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "voyage-multimodal-3.5",
      inputs: [{ content: [{ type: "text", text: query.slice(0, 32000) }] }],
      input_type: "query"
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Voyage AI API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const vector = data?.data?.[0]?.embedding;
  if (!Array.isArray(vector) || vector.length !== 1024) {
    throw new Error("Invalid embedding vector dimension from Voyage AI");
  }
  return vector;
}

// 4. Structured Date & Geo Filter Parsing
function parseDateFilter(dateStr, isEnd = false) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const monthMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const year = parseInt(monthMatch[1], 10);
    const month = parseInt(monthMatch[2], 10);
    if (isEnd) {
      return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString();
    } else {
      return new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)).toISOString();
    }
  }

  const dayMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dayMatch) {
    const year = parseInt(dayMatch[1], 10);
    const month = parseInt(dayMatch[2], 10);
    const day = parseInt(dayMatch[3], 10);
    if (isEnd) {
      return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)).toISOString();
    } else {
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString();
    }
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d.toISOString();
  }
  return null;
}

function parseNearFilter(nearInput) {
  if (!nearInput || typeof nearInput !== "object") return null;
  const lat = nearInput.latitude ?? nearInput.lat;
  const lon = nearInput.longitude ?? nearInput.lon;
  if (typeof lat !== "number" || typeof lon !== "number" || isNaN(lat) || isNaN(lon)) {
    return null;
  }
  const radius = Number(nearInput.radius_meters ?? nearInput.radius ?? 1000.0);
  const exclude = Boolean(nearInput.exclude);
  return {
    latitude: lat,
    longitude: lon,
    radius_meters: Math.max(10, isNaN(radius) ? 1000.0 : radius),
    exclude
  };
}

function extractImageIdFromPayload(payload) {
  if (!payload) return null;
  if (payload.image_id && typeof payload.image_id === "string") {
    return payload.image_id.trim();
  }
  if (typeof payload.content === "string") {
    const m = payload.content.match(/\[(?:Cloudflare Images ID|图片 ID):\s*([a-zA-Z0-9_-]+)\]/i);
    if (m) return m[1].trim();
  }
  return null;
}

async function getSignedImageUrl(imageId, env, expiresIn = 7200) {
  if (!imageId || !env.IMAGES || !env.IMAGES.hosted) return "";
  try {
    return await env.IMAGES.hosted.image(imageId).signedUrl({
      variant: "public",
      expiresIn
    });
  } catch (e) {
    return "";
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle OPTIONS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Favicon handler
    if (url.pathname === "/favicon.ico") {
      return new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧬</text></svg>', {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" }
      });
    }

    // Health check
    if (url.pathname === "/api/health") {
      return jsonResponse({
        status: "healthy",
        service: "constancy-back-garden",
        version: "1.3.0",
        domain: env.DOMAIN || "search.kufof.uk",
        qdrant_url: env.QDRANT_URL
      });
    }

    // Auth Route: POST /api/auth/login
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const email = (body.email || "").trim().toLowerCase();
      const passkey = (body.passkey || "").trim();

      if (!email || !passkey) {
        return errorResponse("请输入邮箱与口令", 400);
      }

      const whitelist = (env.ALLOWED_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      if (!whitelist.includes(email)) {
        return errorResponse("该账号未获授权访问后花园", 403);
      }

      const isValid = verifyPasskey(email, passkey, env);
      if (!isValid) {
        return errorResponse("授权口令错误，拒绝接入", 401);
      }

      // Generate 1-year signed JWT
      const token = await createJwt({
        sub: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 31536000
      }, env.JWT_SECRET);

      return jsonResponse({ success: true, user: email }, 200, {
        "Set-Cookie": `constancy_auth=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000; Path=/`
      });
    }

    // Auth Route: POST /api/auth/logout
    if (url.pathname === "/api/auth/logout" && request.method === "POST") {
      return jsonResponse({ success: true }, 200, {
        "Set-Cookie": `constancy_auth=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`
      });
    }

    // Auth Route: GET /api/auth/me
    if (url.pathname === "/api/auth/me") {
      const user = await getAuthenticatedUser(request, env);
      if (!user) return errorResponse("Unauthorized", 401);
      return jsonResponse({ success: true, user });
    }

    // Web Dashboard or Login Screen
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const user = await getAuthenticatedUser(request, env);
      if (!user) {
        return new Response(renderLoginHtml(), {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
      return new Response(renderDashboardHtml(user), {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // All subsequent /api/* endpoints require authentication
    const user = await getAuthenticatedUser(request, env);
    if (!user) {
      return errorResponse("请先登录进入后花园", 401);
    }

    // User-specific tenant filter for Qdrant
    const userFilter = {
      must: [
        { key: "user_id", match: { value: user } }
      ]
    };

    // 1. Search (All / Images / Notes)
    if (url.pathname === "/api/search" && request.method === "POST") {
      try {
        const body = await request.json().catch(() => ({}));
        const query = (body.query || "").toString().trim();
        const tab = (body.tab || "all").toString();
        const limit = Math.min(Math.max(parseInt(body.limit) || 24, 1), 50);

        const dateFrom = parseDateFilter(body.date_from, false);
        const dateTo = parseDateFilter(body.date_to, true);
        const near = parseNearFilter(body.near);

        // Vectorize if text query exists; otherwise scroll by time
        const queryVector = query ? await getQueryEmbedding(query, env) : null;
        const searchImages = tab === "all" || tab === "images";
        const searchNotes = tab === "all" || tab === "notes";

        // Build image filters
        const imageMust = [{ key: "user_id", match: { value: user } }];
        const imageMustNot = [];
        if (dateFrom || dateTo) {
          const range = {};
          if (dateFrom) range.gte = dateFrom;
          if (dateTo) range.lte = dateTo;
          imageMust.push({
            should: [
              { key: "captured_at", range },
              { key: "exif.dateTime", range }
            ]
          });
        }
        if (near) {
          const geoRadius = {
            key: "location",
            geo_radius: {
              center: { lat: near.latitude, lon: near.longitude },
              radius: near.radius_meters
            }
          };
          if (near.exclude) {
            imageMustNot.push({ is_empty: { key: "location" } });
            imageMustNot.push(geoRadius);
          } else {
            imageMust.push(geoRadius);
          }
        }
        const imageFilter = { must: imageMust };
        if (imageMustNot.length > 0) imageFilter.must_not = imageMustNot;

        // Build note filters
        const noteMust = [{ key: "user_id", match: { value: user } }];
        const noteMustNot = [];
        if (dateFrom || dateTo) {
          const range = {};
          if (dateFrom) range.gte = dateFrom;
          if (dateTo) range.lte = dateTo;
          noteMust.push({
            should: [
              { key: "timestamp", range },
              { key: "captured_at", range }
            ]
          });
        }
        if (near) {
          const geoRadius = {
            key: "location",
            geo_radius: {
              center: { lat: near.latitude, lon: near.longitude },
              radius: near.radius_meters
            }
          };
          if (near.exclude) {
            noteMustNot.push({ is_empty: { key: "location" } });
            noteMustNot.push(geoRadius);
          } else {
            noteMust.push(geoRadius);
          }
        }
        const noteFilter = { must: noteMust };
        if (noteMustNot.length > 0) noteFilter.must_not = noteMustNot;

        // Parallel search against Qdrant
        const tasks = [];

        if (searchImages) {
          const url = queryVector
            ? `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/images/points/search`
            : `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/images/points/scroll`;

          const reqBody = queryVector
            ? { vector: queryVector, limit, filter: imageFilter, with_payload: true }
            : { limit, filter: imageFilter, with_payload: true, with_vector: false };

          tasks.push(
            qdrantFetch(url, env, {
              method: "POST",
              body: JSON.stringify(reqBody)
            }).then(async res => {
              if (!res.ok) return [];
              const data = await res.json();
              const points = (queryVector ? data.result : data.result?.points) || [];
              if (!queryVector) {
                points.sort((a, b) => {
                  const tA = new Date(a.payload?.captured_at || a.payload?.created_at || 0).getTime();
                  const tB = new Date(b.payload?.captured_at || b.payload?.created_at || 0).getTime();
                  return tB - tA;
                });
              }
              return Promise.all(
                points.map(async pt => {
                  const imageId = pt.payload?.image_id;
                  let displayUrl = "";
                  if (imageId && env.IMAGES) {
                    try {
                      displayUrl = await env.IMAGES.hosted.image(imageId).signedUrl({
                        variant: "public",
                        expiresIn: 7200
                      });
                    } catch (e) {}
                  }
                  return {
                    id: pt.id,
                    score: pt.score ?? 1.0,
                    image_id: imageId,
                    filename: pt.payload?.filename || "untitled",
                    title: pt.payload?.title || pt.payload?.filename,
                    description: pt.payload?.description || "",
                    tags: pt.payload?.tags || [],
                    exif: pt.payload?.exif || null,
                    location: pt.payload?.location || null,
                    captured_at: pt.payload?.captured_at || pt.payload?.created_at,
                    created_at: pt.payload?.created_at,
                    url: displayUrl
                  };
                })
              );
            })
          );
        } else {
          tasks.push(Promise.resolve([]));
        }

        if (searchNotes) {
          const url = queryVector
            ? `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/constancy_memories/points/search`
            : `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/constancy_memories/points/scroll`;

          const reqBody = queryVector
            ? { vector: queryVector, limit, filter: noteFilter, with_payload: true }
            : { limit, filter: noteFilter, with_payload: true, with_vector: false };

          tasks.push(
            qdrantFetch(url, env, {
              method: "POST",
              body: JSON.stringify(reqBody)
            }).then(async res => {
              if (!res.ok) return [];
              const data = await res.json();
              const points = (queryVector ? data.result : data.result?.points) || [];
              if (!queryVector) {
                points.sort((a, b) => {
                  const tA = new Date(a.payload?.timestamp || 0).getTime();
                  const tB = new Date(b.payload?.timestamp || 0).getTime();
                  return tB - tA;
                });
              }
              return Promise.all(
                points.map(async pt => {
                  const assocImageId = extractImageIdFromPayload(pt.payload);
                  const imageUrl = assocImageId ? await getSignedImageUrl(assocImageId, env) : "";
                  return {
                    id: pt.id,
                    score: pt.score ?? 1.0,
                    type: pt.payload?.type,
                    title: pt.payload?.title || pt.payload?.entities?.[0] || "无标题便签",
                    content: pt.payload?.content || "",
                    tags: pt.payload?.tags || [],
                    date: pt.payload?.date || (pt.payload?.timestamp ? pt.payload.timestamp.slice(0, 10) : ""),
                    timestamp: pt.payload?.timestamp,
                    image_id: assocImageId || undefined,
                    image_url: imageUrl || undefined,
                    image: assocImageId && imageUrl ? {
                      id: assocImageId,
                      image_id: assocImageId,
                      url: imageUrl,
                      title: pt.payload?.title || "便签附图"
                    } : null,
                    has_base64: Boolean(pt.payload?.base64),
                    mime_type: pt.payload?.mime_type,
                    c_h: pt.payload?.ch_prior,
                    sha256: pt.payload?.sha256
                  };
                })
              );
            })
          );
        } else {
          tasks.push(Promise.resolve([]));
        }

        const [resolvedImages, resolvedNotes] = await Promise.all(tasks);

        // Enrich notes with full image object if available from resolvedImages
        const imgMap = new Map();
        for (const img of resolvedImages) {
          if (img.image_id) imgMap.set(img.image_id, img);
        }

        for (const note of resolvedNotes) {
          if (note.image_id && imgMap.has(note.image_id)) {
            note.image = imgMap.get(note.image_id);
            if (!note.image_url && note.image.url) {
              note.image_url = note.image.url;
            }
          }
        }

        if (tab === "images") {
          return jsonResponse({ success: true, tab, results: resolvedImages });
        }
        if (tab === "notes") {
          return jsonResponse({ success: true, tab, results: resolvedNotes });
        }

        // Deduplicate in "all" tab:
        // Keep ALL notes! If a note has an associated photo, remove that photo from standalone images to prevent duplicate cards.
        const referencedImageIds = new Set(resolvedNotes.map(n => n.image_id).filter(Boolean));
        const standaloneImages = resolvedImages.filter(img => !referencedImageIds.has(img.image_id));

        // Build merged unified feed list
        const merged = [
          ...resolvedNotes.map(n => ({
            ...n,
            feed_type: "note",
            sort_time: n.timestamp || (n.date ? n.date + "T00:00:00Z" : "")
          })),
          ...standaloneImages.map(img => ({
            ...img,
            feed_type: "image",
            sort_time: img.captured_at || img.created_at || ""
          }))
        ];

        // Default sort: reverse chronological (newest first)
        merged.sort((a, b) => {
          const tA = new Date(a.sort_time || 0).getTime();
          const tB = new Date(b.sort_time || 0).getTime();
          return tB - tA;
        });

        return jsonResponse({
          success: true,
          tab: "all",
          query: query || "",
          notes: resolvedNotes,
          images: standaloneImages,
          merged
        });
      } catch (err) {
        return errorResponse("Search failed: " + err.message, 500);
      }
    }

    // 2. List Images
    if (url.pathname === "/api/images" && request.method === "GET") {
      try {
        const qdrantUrl = `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/images/points/scroll`;
        const qdrantRes = await qdrantFetch(qdrantUrl, env, {
          method: "POST",
          body: JSON.stringify({
            limit: 50,
            filter: userFilter,
            with_payload: true,
            with_vector: false
          })
        });

        if (!qdrantRes.ok) {
          const errBody = await qdrantRes.text();
          return errorResponse(`Qdrant scroll error (${qdrantRes.status}): ${errBody}`, 502);
        }

        const qdrantData = await qdrantRes.json();
        const points = qdrantData.result?.points || [];

        // Sort reverse chronological by captured_at || created_at
        points.sort((a, b) => {
          const tA = new Date(a.payload?.captured_at || a.payload?.created_at || 0).getTime();
          const tB = new Date(b.payload?.captured_at || b.payload?.created_at || 0).getTime();
          return tB - tA;
        });

        const results = await Promise.all(
          points.map(async pt => {
            const imageId = pt.payload?.image_id;
            let displayUrl = "";
            if (imageId && env.IMAGES) {
              try {
                displayUrl = await env.IMAGES.hosted.image(imageId).signedUrl({
                  variant: "public",
                  expiresIn: 7200
                });
              } catch (e) {}
            }
            return {
              id: pt.id,
              image_id: imageId,
              filename: pt.payload?.filename || "untitled",
              title: pt.payload?.title || pt.payload?.filename,
              description: pt.payload?.description || "",
              tags: pt.payload?.tags || [],
              exif: pt.payload?.exif || null,
              location: pt.payload?.location || null,
              captured_at: pt.payload?.captured_at || pt.payload?.created_at,
              created_at: pt.payload?.created_at,
              url: displayUrl
            };
          })
        );

        return jsonResponse({
          success: true,
          results
        });
      } catch (err) {
        return errorResponse("Failed to list images: " + err.message, 500);
      }
    }

    // 3. List Notes
    if (url.pathname === "/api/notes" && request.method === "GET") {
      try {
        const qdrantUrl = `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/constancy_memories/points/scroll`;
        const qdrantRes = await qdrantFetch(qdrantUrl, env, {
          method: "POST",
          body: JSON.stringify({
            limit: 50,
            filter: {
              must: [
                { key: "user_id", match: { value: user } },
                { key: "type", match: { value: "note" } }
              ]
            },
            with_payload: true,
            with_vector: false
          })
        });

        if (!qdrantRes.ok) {
          const errBody = await qdrantRes.text();
          return errorResponse(`Qdrant scroll error (${qdrantRes.status}): ${errBody}`, 502);
        }

        const qdrantData = await qdrantRes.json();
        const points = qdrantData.result?.points || [];

        // Sort reverse chronological by timestamp
        points.sort((a, b) => {
          const tA = new Date(a.payload?.timestamp || 0).getTime();
          const tB = new Date(b.payload?.timestamp || 0).getTime();
          return tB - tA;
        });

        const results = await Promise.all(
          points.map(async pt => {
            const assocImageId = extractImageIdFromPayload(pt.payload);
            const imageUrl = assocImageId ? await getSignedImageUrl(assocImageId, env) : "";
            return {
              id: pt.id,
              type: pt.payload?.type,
              title: pt.payload?.title || pt.payload?.entities?.[0] || "无标题便签",
              content: pt.payload?.content || "",
              tags: pt.payload?.tags || [],
              date: pt.payload?.date || (pt.payload?.timestamp ? pt.payload.timestamp.slice(0, 10) : ""),
              timestamp: pt.payload?.timestamp,
              image_id: assocImageId || undefined,
              image_url: imageUrl || undefined,
              image: assocImageId && imageUrl ? {
                id: assocImageId,
                image_id: assocImageId,
                url: imageUrl,
                title: pt.payload?.title || "便签附图"
              } : null,
              has_base64: Boolean(pt.payload?.base64),
              mime_type: pt.payload?.mime_type,
              c_h: pt.payload?.ch_prior,
              sha256: pt.payload?.sha256
            };
          })
        );

        return jsonResponse({
          success: true,
          results
        });
      } catch (err) {
        return errorResponse("Failed to list notes: " + err.message, 500);
      }
    }

    // 4. Delete Note
    if ((url.pathname.startsWith("/api/notes/") && request.method === "DELETE") ||
        (url.pathname === "/api/notes/delete" && (request.method === "POST" || request.method === "DELETE"))) {
      try {
        let noteId = "";
        if (url.pathname.startsWith("/api/notes/") && url.pathname !== "/api/notes/delete") {
          noteId = decodeURIComponent(url.pathname.slice("/api/notes/".length)).trim();
        } else {
          const body = await request.json().catch(() => ({}));
          noteId = (body.id || url.searchParams.get("id") || "").trim();
        }

        if (!noteId) {
          return errorResponse("请指定要删除的便签 ID", 400);
        }

        // Verify ownership in Qdrant
        const getUrl = `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/constancy_memories/points/${noteId}`;
        const getRes = await qdrantFetch(getUrl, env);
        if (!getRes.ok) {
          return errorResponse("便签不存在或已被删除", 404);
        }
        const getData = await getRes.json();
        const pt = getData.result;
        if (!pt || pt.payload?.user_id !== user) {
          return errorResponse("无权删除该便签条目", 403);
        }

        // Delete point from Qdrant constancy_memories collection
        const delUrl = `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/constancy_memories/points/delete?wait=true`;
        const delRes = await qdrantFetch(delUrl, env, {
          method: "POST",
          body: JSON.stringify({ points: [noteId] })
        });
        if (!delRes.ok) {
          const errText = await delRes.text();
          return errorResponse(`Qdrant 删除便签失败 (${delRes.status}): ${errText}`, 502);
        }

        return jsonResponse({
          success: true,
          id: noteId,
          message: "便签已成功删除"
        });
      } catch (err) {
        return errorResponse("删除便签失败: " + err.message, 500);
      }
    }

    // 5. Delete Image
    if ((url.pathname.startsWith("/api/images/") && request.method === "DELETE") ||
        (url.pathname === "/api/images/delete" && (request.method === "POST" || request.method === "DELETE"))) {
      try {
        let imagePointId = "";
        if (url.pathname.startsWith("/api/images/") && url.pathname !== "/api/images/delete") {
          imagePointId = decodeURIComponent(url.pathname.slice("/api/images/".length)).trim();
        } else {
          const body = await request.json().catch(() => ({}));
          imagePointId = (body.id || url.searchParams.get("id") || "").trim();
        }

        if (!imagePointId) {
          return errorResponse("请指定要删除的图片 ID", 400);
        }

        // Verify ownership in Qdrant images collection
        const getUrl = `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/images/points/${imagePointId}`;
        const getRes = await qdrantFetch(getUrl, env);
        if (!getRes.ok) {
          return errorResponse("图片记录不存在或已被删除", 404);
        }
        const getData = await getRes.json();
        const pt = getData.result;
        if (!pt || pt.payload?.user_id !== user) {
          return errorResponse("无权删除该图片资产", 403);
        }

        const cloudflareImageId = pt.payload?.image_id;

        // Delete from Cloudflare Images hosted storage if present
        if (cloudflareImageId && env.IMAGES && env.IMAGES.hosted) {
          try {
            await env.IMAGES.hosted.image(cloudflareImageId).delete();
          } catch (cfErr) {
            console.error("Cloudflare Images deletion error:", cfErr);
          }
        }

        // Delete point from Qdrant images collection
        const delUrl = `${env.QDRANT_URL.replace(/\/+$/, "")}/collections/images/points/delete?wait=true`;
        const delRes = await qdrantFetch(delUrl, env, {
          method: "POST",
          body: JSON.stringify({ points: [imagePointId] })
        });
        if (!delRes.ok) {
          const errText = await delRes.text();
          return errorResponse(`Qdrant 删除图片向量记录失败 (${delRes.status}): ${errText}`, 502);
        }

        return jsonResponse({
          success: true,
          id: imagePointId,
          image_id: cloudflareImageId,
          message: "图片及云端存储已成功删除"
        });
      } catch (err) {
        return errorResponse("删除图片失败: " + err.message, 500);
      }
    }

    return errorResponse("Not Found", 404);
  }
};
