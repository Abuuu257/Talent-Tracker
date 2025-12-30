-- Create coach_notes table for storing private coach notes about athletes
CREATE TABLE IF NOT EXISTS coach_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL,
    athlete_id INT NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(user_id) ON DELETE CASCADE,
    FOREIGN KEY (athlete_id) REFERENCES athletes(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_note (coach_id, athlete_id)
);
