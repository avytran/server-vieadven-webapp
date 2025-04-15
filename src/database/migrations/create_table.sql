

-- Bảng cha
CREATE TABLE "Users" (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    avatar TEXT
);
-- Player kế thừa từ Users
CREATE TABLE Player (
    player_id INTEGER PRIMARY KEY REFERENCES "Users"(user_id),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_name TEXT
);

-- Admin kế thừa từ Users
CREATE TABLE Admin (
    admin_id INTEGER PRIMARY KEY REFERENCES "Users"(user_id),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Tỉnh/Thành phố
CREATE TABLE Province (
    province_id SERIAL PRIMARY KEY,
    province_name TEXT NOT NULL,
    description TEXT,
    coordinates TEXT
);

-- Địa danh
CREATE TABLE Landmark (
    landmark_id SERIAL PRIMARY KEY,
    landmark_name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    province_id INTEGER REFERENCES Province(province_id)
);

-- Câu hỏi
CREATE TABLE Question (
    question_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    use_for_game BOOLEAN DEFAULT TRUE,
    landmark_id INTEGER REFERENCES Landmark(landmark_id)
);

-- Bảng Gameplay
CREATE TABLE Gameplay (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES Player(player_id),
    landmark_id INTEGER REFERENCES Landmark(landmark_id),
    score INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE
);
-- Feedback
CREATE TABLE Feedback (
    feedback_id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES Player(player_id),
    content TEXT
);

-- Resource liên kết với Feedback
CREATE TABLE Resource (
    resource_id SERIAL PRIMARY KEY,
    feedback_id INTEGER REFERENCES Feedback(feedback_id),
    content TEXT
);

-- Knowledge dùng cho AI/chatbot
CREATE TABLE Knowledge (
    chunk_id TEXT PRIMARY KEY,
    embedding_code TEXT,
    chunk_content TEXT
);

-- Bảng Leaderboard
CREATE TABLE Leaderboard (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES Player(player_id),
    total_score INTEGER DEFAULT 0,
    rank INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);