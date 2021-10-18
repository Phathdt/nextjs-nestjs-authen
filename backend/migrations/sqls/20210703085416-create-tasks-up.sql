CREATE TABLE tasks(
	id SERIAL PRIMARY KEY,
	title TEXT,
	description TEXT,
	status TEXT,
	user_id INT,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
