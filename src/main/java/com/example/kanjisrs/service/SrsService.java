package com.example.kanjisrs.service;

import com.example.kanjisrs.model.Kanji;
import com.example.kanjisrs.repository.KanjiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SrsService {

    @Autowired
    private KanjiRepository kanjiRepository;

    /**
     * Gets a list of all Kanji due for review today.
     */
    public List<Kanji> getReviewQueue() {
        return kanjiRepository.findByDueDateLessThanEqual(LocalDate.now());
    }

    /**
     * Updates a Kanji's SRS data based on user performance.
     * @param kanji The Kanji being reviewed.
     * @param quality The user's self-assessed quality of recall (0-5 scale).
     * - 5: Perfect recall
     * - 4: Correct recall after some hesitation
     * - 3: Correct recall with difficulty
     * - <3: Incorrect recall
     */
    public void processReview(Kanji kanji, int quality) {
        if (quality < 3) {
            // Failed recall: reset repetitions and review again today.
            kanji.setRepetitions(0);
            // By setting the interval to 0, the due date becomes today.
            kanji.setInterval(0); 
        } else {
            // Successful recall
            // 1. Update Easiness Factor (EF)
            double oldEF = kanji.getEasinessFactor();
            double newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
            if (newEF < 1.3) {
                newEF = 1.3; // EF should not go below 1.3
            }
            kanji.setEasinessFactor(newEF);

            // 2. Update Repetitions
            kanji.setRepetitions(kanji.getRepetitions() + 1);

            // 3. Update Interval
            if (kanji.getRepetitions() == 1) {
                kanji.setInterval(1);
            } else if (kanji.getRepetitions() == 2) {
                kanji.setInterval(6);
            } else {
                int newInterval = (int) Math.round(kanji.getInterval() * newEF);
                kanji.setInterval(newInterval);
            }
        }

        // 4. Set the new due date
        kanji.setDueDate(LocalDate.now().plusDays(kanji.getInterval()));

        // 5. Save the updated Kanji to the database
        kanjiRepository.save(kanji);
    }
}
