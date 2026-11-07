-- Migration number: 0001 	 2026-11-03T07:41:50.847Z

-- A catalog is a versioned set of questions prepared before publication.
CREATE TABLE catalog_releases (
  version TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  published_at TEXT
);

-- Keep existing question IDs; corrections create a new revision.
CREATE TABLE question_revisions (
  question_id TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
  PRIMARY KEY (question_id, revision)
);

-- A catalog chooses one revision of each question.
CREATE TABLE catalog_entries (
  catalog_version TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_revision INTEGER NOT NULL,
  PRIMARY KEY (catalog_version, question_id),
  FOREIGN KEY (catalog_version)
    REFERENCES catalog_releases(version),
  FOREIGN KEY (question_id, question_revision)
    REFERENCES question_revisions(question_id, revision)
);
