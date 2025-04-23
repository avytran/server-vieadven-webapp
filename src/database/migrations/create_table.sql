-- 1. Province
CREATE TABLE Province (
    province_id SERIAL PRIMARY KEY,
    province_name VARCHAR(100),
    description TEXT,
    coordinates TEXT,
    total_stars INT
);

-- 2. Landmark (phụ thuộc Province)
CREATE TABLE Landmark (
    landmark_id SERIAL PRIMARY KEY,
    landmark_name VARCHAR(100),
    description TEXT,
    image_url VARCHAR(255),
    province_id INT REFERENCES Province(province_id),
    total_question INT
);

-- 3. Question (phụ thuộc Landmark)
CREATE TABLE Question (
    question_id SERIAL PRIMARY KEY,
    content TEXT,
    answer TEXT,
    category VARCHAR(50),
    use_for_game BOOLEAN,
    landmark_id INT REFERENCES Landmark(landmark_id)
);

-- 4. User (gốc cho Admin, Player)
CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP
);

-- 5. Admin (phụ thuộc User)
CREATE TABLE Admin (
    user_id INT PRIMARY KEY REFERENCES "User"(user_id),
    permissions VARCHAR(50)
);

-- 6. Player (phụ thuộc User, Province)
CREATE TABLE Player (
    user_id INT PRIMARY KEY REFERENCES "User"(user_id),
    last_province_id INT REFERENCES Province(province_id)
);

-- 7. Item
CREATE TABLE Item (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    icon_url VARCHAR(255)
);

-- 8. Player_Item (phụ thuộc Player, Item)
CREATE TABLE Player_Item (
    player_id INT REFERENCES Player(user_id),
    item_id INT REFERENCES Item(item_id),
    quantity INT,
    PRIMARY KEY (player_id, item_id)
);

-- 9. Badge (phụ thuộc Province)
CREATE TABLE Badge (
    badge_id SERIAL PRIMARY KEY,
    province_id INT REFERENCES Province(province_id),
    description TEXT,
    icon_url VARCHAR(255)
);

-- 10. Player_Badge (phụ thuộc Player, Badge)
CREATE TABLE Player_Badge (
    player_id INT REFERENCES Player(user_id),
    badge_id INT REFERENCES Badge(badge_id),
    acquired_at TIMESTAMP,
    PRIMARY KEY (player_id, badge_id)
);

-- 11. Leaderboard (phụ thuộc Player)
CREATE TABLE Leaderboard (
    leaderboard_id SERIAL PRIMARY KEY,
    player_id INT REFERENCES Player(user_id),
    total_score INT,
    rank INT,
    updated_at TIMESTAMP
);

--Create function and trigger to update "updated_at"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON Leaderboard
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 12. Gameplay (phụ thuộc Player, Landmark)
CREATE TABLE Gameplay (
    gameplay_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Player(user_id),
    landmark_id INT REFERENCES Landmark(landmark_id),
    star INT,
    score INT,
    is_completed BOOLEAN
);

-- 13. Player_ProvinceProgress (phụ thuộc Player, Province)
CREATE TABLE Player_ProvinceProgress (
    player_id INT REFERENCES Player(user_id),
    province_id INT REFERENCES Province(province_id),
    stars INT,
    last_played TIMESTAMP,
    PRIMARY KEY (player_id, province_id)
);

-- 14. ENUM trước khi dùng
CREATE TYPE target_type_enum AS ENUM ('correct_answer', 'play_landmark');

-- 15. Daily_Mission (phụ thuộc Item)
CREATE TABLE Daily_Mission (
    mission_id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    item_id INT REFERENCES Item(item_id),
    item_quantity INT,
    target INT,
    target_type target_type_enum,
    is_active BOOLEAN
);

-- 16. Player_DailyMission (phụ thuộc Player, Daily_Mission)
CREATE TABLE Player_DailyMission (
    user_id INT REFERENCES Player(user_id),
    mission_id INT REFERENCES Daily_Mission(mission_id),
    progress INT,
    is_completed BOOLEAN,
    last_update TIMESTAMP,
    claimed BOOLEAN,
    PRIMARY KEY (user_id, mission_id)
);

--Create function and trigger to update "last_update"
CREATE OR REPLACE FUNCTION update_last_update_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_update := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_last_update
BEFORE UPDATE ON Player_DailyMission
FOR EACH ROW
EXECUTE FUNCTION update_last_update_column();


-- 17. Feedback (độc lập)
CREATE TABLE Feedback (
    feedback_id SERIAL PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
