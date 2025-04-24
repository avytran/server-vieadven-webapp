-- 1. Province
CREATE TABLE Province (
    province_id CHAR(5) PRIMARY KEY,
    province_name VARCHAR(100),
    description TEXT,
    coordinates TEXT,
    total_stars INT,
    display_order INT
);

-- 2. Landmark (phụ thuộc Province)
CREATE TABLE Landmark (
    landmark_id CHAR(5) PRIMARY KEY,
    landmark_name VARCHAR(100),
    description TEXT,
    image_url VARCHAR(255),
    province_id CHAR(5) REFERENCES Province(province_id),
    total_question INT
);

-- 3. Question (phụ thuộc Landmark)
CREATE TABLE Question (
    question_id CHAR(5) PRIMARY KEY,
    content TEXT,
    category VARCHAR(50),
    use_for_game BOOLEAN,
    landmark_id CHAR(5) REFERENCES Landmark(landmark_id)
);

CREATE TABLE Answer (
    answer_id CHAR(5) PRIMARY KEY,
    question_id CHAR(5) REFERENCES Question(question_id),
    content TEXT NOT NULL,
    is_correct BOOLEAN
);

-- 4. User (gốc cho Admin, Player)
CREATE TABLE "User" (
    user_id CHAR(5) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP
);

-- 5. Admin (phụ thuộc User)
CREATE TABLE Admin (
    user_id CHAR(5) PRIMARY KEY REFERENCES "User"(user_id),
    permissions VARCHAR(50)
);

-- 6. Player (phụ thuộc User, Province)
CREATE TABLE Player (
    user_id CHAR(5) PRIMARY KEY REFERENCES "User"(user_id),
    last_province_id CHAR(5) REFERENCES Province(province_id)
);

-- 7. Item
CREATE TABLE Item (
    item_id CHAR(5) PRIMARY KEY,
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
    badge_id CHAR(5) PRIMARY KEY,
    province_id CHAR(5) REFERENCES Province(province_id),
    description TEXT,
    icon_url VARCHAR(255)
);

-- 10. Player_Badge (phụ thuộc Player, Badge)
CREATE TABLE Player_Badge (
    player_id CHAR(5) REFERENCES Player(user_id),
    badge_id CHAR(5) REFERENCES Badge(badge_id),
    acquired_at TIMESTAMP,
    PRIMARY KEY (player_id, badge_id)
);

-- 11. Leaderboard (phụ thuộc Player)
CREATE TABLE Leaderboard (
    leaderboard_id CHAR(5) PRIMARY KEY,
    player_id CHAR(5) REFERENCES Player(user_id),
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

--Trigger function
CREATE OR REPLACE FUNCTION check_is_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.star >= 1 THEN
        NEW.is_completed := TRUE;
    ELSE
        NEW.is_completed := FALSE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Trigger
CREATE TRIGGER trg_check_is_completed
BEFORE INSERT OR UPDATE ON Gameplay
FOR EACH ROW
EXECUTE FUNCTION check_is_completed();

-- Trigger function to enforce max 4 answers per question_id and only one correct answer
CREATE OR REPLACE FUNCTION enforce_answer_constraints()
RETURNS TRIGGER AS $$
DECLARE
    total_answers INT;
    correct_answers INT;
BEGIN
    -- Đếm số lượng câu trả lời hiện có cho question_id
    SELECT COUNT(*)
    INTO total_answers
    FROM Answer
    WHERE question_id = NEW.question_id;

    -- Nếu là INSERT, cộng thêm 1 bản ghi dự kiến
    IF (TG_OP = 'INSERT') THEN
        total_answers := total_answers + 1;
    END IF;

    -- Đếm số lượng câu trả lời đúng hiện có (bao gồm bản ghi mới nếu is_correct = true)
    SELECT COUNT(*)
    INTO correct_answers
    FROM Answer
    WHERE question_id = NEW.question_id AND is_correct = TRUE;

    IF NEW.is_correct = TRUE THEN
        correct_answers := correct_answers + 1;
    END IF;

    -- Kiểm tra ràng buộc
    IF total_answers > 4 THEN
        RAISE EXCEPTION 'A question can have at most 4 answers.';
    END IF;

    IF correct_answers > 1 THEN
        RAISE EXCEPTION 'Only one correct answer is allowed per question.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_answer_constraints
BEFORE INSERT OR UPDATE ON Answer
FOR EACH ROW
EXECUTE FUNCTION enforce_answer_constraints();
