-- Create coach_favorites table for watchlist functionality
CREATE TABLE IF NOT EXISTS coach_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL,
    athlete_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(user_id) ON DELETE CASCADE,
    FOREIGN KEY (athlete_id) REFERENCES athletes(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (coach_id, athlete_id)
);
