-- 1. Province
CREATE TABLE Province (
    province_id CHAR(10) PRIMARY KEY,
    province_name VARCHAR(100),
    description TEXT,
    coordinates TEXT,
    total_stars INT,
    display_order SERIAL UNIQUE
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
    email VARCHAR(100) UNIQUE,
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
    level INT REFERENCES province(display_order)
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
    player_id CHAR(5) REFERENCES Player(user_id),
    item_id CHAR(5) REFERENCES Item(item_id),
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
    is_completed BOOLEAN,
    UNIQUE(user_id, landmark_id)
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

CREATE SEQUENCE IF NOT EXISTS answer_id_seq START 1;
ALTER TABLE answer
    ALTER COLUMN answer_id SET DEFAULT 'QT' || LPAD(nextval('answer_id_seq')::TEXT, 3, '0');

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

    -- Kiểm tra xem người chơi đã có trong leaderboard chưa
    IF NOT EXISTS (SELECT 1 FROM Leaderboard WHERE player_id = NEW.player_id) THEN
        -- Nếu chưa có, thêm người chơi vào leaderboard
        INSERT INTO Leaderboard (player_id, total_score, rank)
        VALUES (NEW.player_id, new_score, 0);
    ELSE
        -- Cập nhật điểm số nếu người chơi đã có trong leaderboard
        UPDATE Leaderboard
        SET total_score = total_score + new_score, updated_at = CURRENT_TIMESTAMP
        WHERE player_id = NEW.player_id;
    END IF;

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

CREATE OR REPLACE FUNCTION handle_player_creation_or_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Step 1: Kiểm tra và tạo Player_Item nếu chưa có
    INSERT INTO Player_Item (player_id, item_id, quantity)
    SELECT NEW.user_id, i.item_id, 0 -- Số lượng ban đầu là 0
    FROM Item i
    WHERE NOT EXISTS (
        SELECT 1 FROM Player_Item pi WHERE pi.player_id = NEW.user_id AND pi.item_id = i.item_id
    );

    -- Step 2: Kiểm tra và tạo Player_ProvinceProgress nếu chưa có
    IF NOT EXISTS (
        SELECT 1 FROM Player_ProvinceProgress 
        WHERE player_id = NEW.user_id 
        AND province_id = (SELECT province_id FROM Province WHERE display_order = NEW.level)
    ) THEN
        -- Lấy province_id từ province có display_order bằng level của player
        INSERT INTO Player_ProvinceProgress (player_id, province_id, stars, last_played)
        SELECT NEW.user_id, p.province_id, 0, CURRENT_TIMESTAMP -- Stars ban đầu là 0
        FROM Province p
        WHERE p.display_order = NEW.level;
        
        -- Step 3: Tạo Gameplay cho các Landmark trong Province tương ứng với level của player
        INSERT INTO Gameplay (user_id, landmark_id, star, score, is_completed)
        SELECT NEW.user_id, l.landmark_id, 0, 0, FALSE -- star, score ban đầu là 0, chưa hoàn thành
        FROM Landmark l
        JOIN Province p ON l.province_id = p.province_id
        WHERE p.display_order = NEW.level
        AND NOT EXISTS (
            SELECT 1 FROM Gameplay g WHERE g.user_id = NEW.user_id AND g.landmark_id = l.landmark_id
        );
    END IF;

    INSERT INTO Player_DailyMission (user_id, mission_id, progress, is_completed, last_update, claimed)
    SELECT NEW.user_id, dm.mission_id, 0, FALSE, CURRENT_TIMESTAMP, FALSE
    FROM Daily_Mission dm
    WHERE dm.is_active = TRUE
    AND NOT EXISTS (
        SELECT 1 FROM Player_DailyMission pdm WHERE pdm.user_id = NEW.user_id AND pdm.mission_id = dm.mission_id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER player_creation_or_update_trigger
AFTER INSERT OR UPDATE ON Player
FOR EACH ROW
EXECUTE FUNCTION handle_player_creation_or_update();

CREATE OR REPLACE FUNCTION handle_gameplay_completion()
RETURNS TRIGGER AS $$
DECLARE
    max_display_order INT;
    completed_landmarks INT;
    total_landmarks INT;
BEGIN
    -- Bước 1: Lấy display_order của province có level cao nhất cho player
    SELECT MAX(p.display_order)
    INTO max_display_order
    FROM Province p
    JOIN Player_ProvinceProgress pp ON pp.province_id = p.province_id
    WHERE pp.player_id = NEW.user_id;

    -- Bước 2: Kiểm tra tất cả các landmark của player trong province này
    SELECT COUNT(*) INTO completed_landmarks
    FROM Gameplay g
    JOIN Landmark l ON g.landmark_id = l.landmark_id
    WHERE g.user_id = NEW.user_id
    AND l.province_id = (SELECT province_id FROM Province WHERE display_order = max_display_order)
    AND g.is_completed = TRUE;

    -- Bước 3: Lấy tổng số landmark trong province này
    SELECT COUNT(*) INTO total_landmarks
    FROM Landmark l
    WHERE l.province_id = (SELECT province_id FROM Province WHERE display_order = max_display_order);

    -- Bước 4: Nếu tất cả các landmark trong province đã hoàn thành, tăng level của player
    IF completed_landmarks = total_landmarks THEN
        -- Cập nhật level của player
        UPDATE Player
        SET level = level + 1
        WHERE user_id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gameplay_completion
AFTER UPDATE ON Gameplay
FOR EACH ROW
WHEN (NEW.is_completed = TRUE)  -- Chỉ kích hoạt khi một landmark được hoàn thành
EXECUTE FUNCTION handle_gameplay_completion();

CREATE OR REPLACE FUNCTION update_star_based_on_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Lấy total_question từ Landmark tương ứng
    DECLARE
        total_questions INT;
    BEGIN
        SELECT total_question INTO total_questions
        FROM Landmark
        WHERE landmark_id = NEW.landmark_id;

        -- Tính toán star dựa trên tỷ lệ score / total_question
        IF NEW.score < (total_questions / 3) THEN
            NEW.star := 0;
        ELSIF NEW.score >= (total_questions / 3) AND NEW.score < (2 * total_questions / 3) THEN
            NEW.star := 1;
        ELSIF NEW.score >= (2 * total_questions / 3) AND NEW.score < total_questions THEN
            NEW.star := 2;
        ELSE
            NEW.star := 3;
        END IF;

        -- Cập nhật giá trị star trong bảng Gameplay
        UPDATE Gameplay
        SET star = NEW.star
        WHERE gameplay_id = NEW.gameplay_id;

        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_star_on_score_change
AFTER UPDATE OF score
ON Gameplay
FOR EACH ROW
WHEN (OLD.score IS DISTINCT FROM NEW.score)  -- Chỉ kích hoạt khi score thay đổi
EXECUTE FUNCTION update_star_based_on_score();
