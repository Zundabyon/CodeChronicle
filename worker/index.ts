type CatalogRow = { question_id: string; payload_json: string };

function json(value: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(value, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api/catalog') {
      if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
        return json({ error: 'not_found' }, 404);
      }
      return env.ASSETS.fetch(request);
    }

    // Public learning content is read-only; publishing uses a separate workflow.
    if (request.method !== 'GET') {
      return json({ error: 'method_not_allowed' }, 405, { Allow: 'GET' });
    }
    const version = url.searchParams.get('version');
    if (version !== null && !/^[A-Za-z0-9._-]{1,64}$/.test(version)) {
      return json({ error: 'invalid_version' }, 400);
    }

    try {
      const release = await env.DB.prepare(`
        SELECT version FROM catalog_releases
        WHERE status = ? AND (? IS NULL OR version = ?)
        ORDER BY published_at DESC, version DESC LIMIT 1
      `).bind('published', version, version).first<{ version: string }>();
      if (!release) return json({ error: 'catalog_not_found' }, 404);

      const rows = await env.DB.prepare(`
        SELECT q.question_id, q.payload_json
        FROM catalog_entries e
        JOIN question_revisions q
          ON q.question_id = e.question_id
          AND q.revision = e.question_revision
        WHERE e.catalog_version = ?
        ORDER BY e.question_id
      `).bind(release.version).all<CatalogRow>();
      if (!rows.results.length) throw new Error('empty_catalog');

      const questions = rows.results.map(row => {
        const value: unknown = JSON.parse(row.payload_json);
        if (typeof value !== 'object' || value === null || Array.isArray(value)
          || !('id' in value) || value.id !== row.question_id) {
          throw new Error('invalid_question_identity');
        }
        return value;
      });
      // Answers remain public while the game uses client-side grading.
      return json({ catalogVersion: release.version, questions });
    } catch {
      console.error('catalog_load_failed');
      return json({ error: 'catalog_unavailable' }, 503);
    }
  },
} satisfies ExportedHandler<Env>;
