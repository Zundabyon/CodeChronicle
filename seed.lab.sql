-- Lab data only. Apply once to the local or staging database, not production.
-- This separate ID does not replace any existing game question.
INSERT INTO catalog_releases (version, status)
VALUES ('lab-v1', 'draft');

INSERT INTO question_revisions (question_id, revision, payload_json)
VALUES (
  'cc-lab-1', 1,
  '{
    "id": "cc-lab-1",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "choice",
    "prompt": "Reactで画面の一部分を再利用する単位は？",
    "options": ["コンポーネント", "マイグレーション", "ルート", "ミドルウェア"],
    "answer": 0,
    "reveal": "コンポーネント",
    "explanation": "UIはコンポーネントを組み合わせて作ります。"
  }'
);

INSERT INTO catalog_entries
  (catalog_version, question_id, question_revision)
VALUES ('lab-v1', 'cc-lab-1', 1);

-- Publish only after the question and its catalog entry have been inserted.
UPDATE catalog_releases
SET status = 'published',
    published_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE version = 'lab-v1';
