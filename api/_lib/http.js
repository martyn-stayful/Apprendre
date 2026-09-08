/** Small helpers so every route answers in the same shape. */

export function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(body));
}

export const ok = (res, body = {}) => json(res, 200, body);
export const bad = (res, message, status = 400) => json(res, status, { error: message });

/** Guard a handler: wrong method -> 405, thrown error -> 500 with a logged trace. */
export function route(methods, handler) {
  const allowed = Array.isArray(methods) ? methods : [methods];
  return async (req, res) => {
    if (!allowed.includes(req.method)) {
      res.setHeader('Allow', allowed.join(', '));
      return bad(res, `Method ${req.method} not allowed`, 405);
    }
    try {
      return await handler(req, res);
    } catch (err) {
      console.error(`[${req.method} ${req.url}]`, err);
      if (res.headersSent) return;
      return bad(res, err?.message || 'Something went wrong', err?.status || 500);
    }
  };
}

/** Vercel parses JSON bodies already; this covers the raw-string case too. */
export function body(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}
