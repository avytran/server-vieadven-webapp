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
    player_id CHAR(5) UNIQUE REFERENCES Player(user_id),
    item_id CHAR(5) UNIQUE REFERENCES Item(item_id),
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

-- 12. Gameplay (phụ thuộc Player, Landmark)
CREATE TABLE Gameplay (
    gameplay_id CHAR(5) PRIMARY KEY,
    user_id CHAR(5) REFERENCES Player(user_id),
    landmark_id CHAR(5) REFERENCES Landmark(landmark_id),
    star INT,
    score INT,
    is_completed BOOLEAN
);

-- 13. Player_ProvinceProgress (phụ thuộc Player, Province)
CREATE TABLE Player_ProvinceProgress (
    player_id CHAR(5) REFERENCES Player(user_id),
    province_id CHAR(5) REFERENCES Province(province_id),
    stars INT,
    last_played TIMESTAMP,
    PRIMARY KEY (player_id, province_id)
);

-- 14. ENUM trước khi dùng
CREATE TYPE target_type_enum AS ENUM ('correct_answer', 'play_landmark');

-- 15. Daily_Mission (phụ thuộc Item)
CREATE TABLE Daily_Mission (
    mission_id CHAR(5) PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    item_id CHAR(5) REFERENCES Item(item_id),
    item_quantity INT,
    target INT,
    target_type target_type_enum,
    is_active BOOLEAN
);

-- 16. Player_DailyMission (phụ thuộc Player, Daily_Mission)
CREATE TABLE Player_DailyMission (
    user_id CHAR(5) REFERENCES Player(user_id),
    mission_id CHAR(5) REFERENCES Daily_Mission(mission_id),
    progress INT,
    is_completed BOOLEAN,
    last_update TIMESTAMP,
    claimed BOOLEAN,
    PRIMARY KEY (user_id, mission_id)
);

-- 17. Feedback (độc lập)
CREATE TABLE Feedback (
    feedback_id CHAR(5) PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Create sequences
CREATE SEQUENCE IF NOT EXISTS user_id_seq START 1;
ALTER TABLE "User"
    ALTER COLUMN user_id SET DEFAULT 'US' || LPAD(nextval('user_id_seq')::TEXT, 3, '0');

CREATE SEQUENCE IF NOT EXISTS item_id_seq START 1;
ALTER TABLE item
    ALTER COLUMN item_id SET DEFAULT 'IM' || LPAD(nextval('item_id_seq')::TEXT, 3, '0');

CREATE SEQUENCE IF NOT EXISTS badge_id_seq START 1;
ALTER TABLE badge
    ALTER COLUMN badge_id SET DEFAULT 'BG' || LPAD(nextval('badge_id_seq')::TEXT, 3, '0');

CREATE SEQUENCE IF NOT EXISTS leaderboard_id_seq START 1;
ALTER TABLE leaderboard
    ALTER COLUMN leaderboard_id SET DEFAULT 'LB' || LPAD(nextval('leaderboard_id_seq')::TEXT, 3, '0');

CREATE SEQUENCE IF NOT EXISTS question_id_seq START 1;
ALTER TABLE question
    ALTER COLUMN question_id SET DEFAULT 'QT' || LPAD(nextval('question_id_seq')::TEXT, 3, '0');
    
CREATE SEQUENCE IF NOT EXISTS landmark_id_seq START 1;
ALTER TABLE landmark
    ALTER COLUMN landmark_id SET DEFAULT 'LM' || LPAD(nextval('landmark_id_seq')::TEXT, 3, '0');

CREATE SEQUENCE IF NOT EXISTS gameplay_id_seq START 1;
ALTER TABLE gameplay
    ALTER COLUMN gameplay_id SET DEFAULT 'GP' || LPAD(nextval('gameplay_id_seq')::TEXT, 3, '0');

CREATE SEQUENCE IF NOT EXISTS mission_id_seq START 1;
ALTER TABLE daily_mission
    ALTER COLUMN mission_id SET DEFAULT 'MS' || LPAD(nextval('mission_id_seq')::TEXT, 3, '0');

CREATE SEQUENCE IF NOT EXISTS feedback_id_seq START 1;
ALTER TABLE feedback
    ALTER COLUMN feedback_id SET DEFAULT 'FB' || LPAD(nextval('feedback_id_seq')::TEXT, 3, '0');


--Trigger function
CREATE OR REPLACE FUNCTION update_total_stars()
RETURNS TRIGGER AS $$
BEGIN
    -- Nếu là DELETE, cập nhật province cũ
    IF (TG_OP = 'DELETE') THEN
        UPDATE Province
        SET total_stars = (
            SELECT COUNT(*) * 3 FROM Landmark WHERE province_id = OLD.province_id
        )
        WHERE province_id = OLD.province_id;

    -- Nếu là INSERT, cập nhật province mới
    ELSIF (TG_OP = 'INSERT') THEN
        UPDATE Province
        SET total_stars = (
            SELECT COUNT(*) * 3 FROM Landmark WHERE province_id = NEW.province_id
        )
        WHERE province_id = NEW.province_id;

    -- Nếu là UPDATE
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Nếu province_id thay đổi, cập nhật cả hai
        IF (NEW.province_id <> OLD.province_id) THEN
            UPDATE Province
            SET total_stars = (
                SELECT COUNT(*) * 3 FROM Landmark WHERE province_id = OLD.province_id
            )
            WHERE province_id = OLD.province_id;

            UPDATE Province
            SET total_stars = (
                SELECT COUNT(*) * 3 FROM Landmark WHERE province_id = NEW.province_id
            )
            WHERE province_id = NEW.province_id;
        ELSE
            -- Nếu không đổi province_id, chỉ cần cập nhật 1 lần
            UPDATE Province
            SET total_stars = (
                SELECT COUNT(*) * 3 FROM Landmark WHERE province_id = NEW.province_id
            )
            WHERE province_id = NEW.province_id;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--Trigger
CREATE TRIGGER trg_landmark_insert
AFTER INSERT ON landmark
FOR EACH ROW
EXECUTE FUNCTION update_total_stars();

-- Trigger khi xóa
CREATE TRIGGER trg_landmark_delete
AFTER DELETE ON landmark
FOR EACH ROW
EXECUTE FUNCTION update_total_stars();

-- Trigger khi cập nhật province_id
CREATE TRIGGER trg_landmark_update
AFTER UPDATE OF province_id ON landmark
FOR EACH ROW
EXECUTE FUNCTION update_total_stars();

--Function update_total_question
CREATE OR REPLACE FUNCTION update_total_question()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE landmark
    SET total_question = (
        SELECT COUNT(*) FROM question WHERE landmark_id = NEW.landmark_id
    )
    WHERE landmark_id = NEW.landmark_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--Trigger
-- Khi thêm question mới
CREATE TRIGGER trg_question_insert
AFTER INSERT ON question
FOR EACH ROW
EXECUTE FUNCTION update_total_question();

-- Khi xóa question
CREATE TRIGGER trg_question_delete
AFTER DELETE ON question
FOR EACH ROW
EXECUTE FUNCTION update_total_question();

-- Khi cập nhật landmark_id trong question
CREATE TRIGGER trg_question_update
AFTER UPDATE OF landmark_id ON question
FOR EACH ROW
EXECUTE FUNCTION update_total_question();

CREATE OR REPLACE FUNCTION update_leaderboard_on_player_item_change()
RETURNS TRIGGER AS $$
DECLARE
    new_score INT;
BEGIN
    -- Tính toán lại điểm số của người chơi từ quantity
    new_score := NEW.quantity;  -- quantity chính là total_score

    -- Cập nhật điểm số của người chơi trong bảng Leaderboard
    UPDATE Leaderboard
    SET total_score = new_score
    WHERE player_id = NEW.player_id;

    -- Cập nhật lại rank của tất cả người chơi dựa trên total_score
    WITH ranked_leaderboard AS (
        SELECT player_id, RANK() OVER (ORDER BY total_score DESC) AS new_rank
        FROM Leaderboard
    )
    UPDATE Leaderboard
    SET rank = ranked_leaderboard.new_rank
    FROM ranked_leaderboard
    WHERE Leaderboard.player_id = ranked_leaderboard.player_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leaderboard_on_player_item_insert
AFTER INSERT ON Player_Item
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_on_player_item_change();

CREATE TRIGGER update_leaderboard_on_player_item_update
AFTER UPDATE OF quantity ON Player_Item
FOR EACH ROW
WHEN (OLD.quantity IS DISTINCT FROM NEW.quantity)  -- Kiểm tra sự thay đổi trong quantity
EXECUTE FUNCTION update_leaderboard_on_player_item_change();

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

