package com.example.kanjisrs.web;

import com.example.kanjisrs.model.Kanji;
import com.example.kanjisrs.repository.KanjiRepository;
import com.example.kanjisrs.service.SrsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller to handle all API requests related to Kanji.
 * The @CrossOrigin annotation is essential for allowing the frontend
 * (running in a browser) to communicate with this backend.
 */
@RestController
@RequestMapping("/api/kanji")
@CrossOrigin(origins = "*") // Allows requests from any origin
public class KanjiController {

    @Autowired
    private SrsService srsService;

    @Autowired
    private KanjiRepository kanjiRepository;

    /**
     * Endpoint to get the list of all Kanji currently due for review.
     * Accessible via GET http://localhost:8080/api/kanji/review
     * @return A list of Kanji objects.
     */
    @GetMapping("/review")
    public List<Kanji> getReviewQueue() {
        return srsService.getReviewQueue();
    }

    /**
     * Endpoint to add a new Kanji to the database.
     * Accessible via POST http://localhost:8080/api/kanji
     * @param kanji The Kanji object from the request body.
     * @return The saved Kanji object with its new ID.
     */
    @PostMapping
    public Kanji addKanji(@RequestBody Kanji kanji) {
        // Set the due date for today so it can be reviewed immediately.
        kanji.setDueDate(java.time.LocalDate.now());
        return kanjiRepository.save(kanji);
    }

    /**
     * Endpoint to process a user's review of a Kanji card.
     * Accessible via POST http://localhost:8080/api/kanji/{id}/review
     * @param id The ID of the Kanji being reviewed.
     * @param payload A map containing the review quality (e.g., {"quality": 5}).
     * @return The updated Kanji object or an error response.
     */
    @PostMapping("/{id}/review")
    public ResponseEntity<Kanji> submitReview(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        Integer quality = payload.get("quality");
        if (quality == null || quality < 0 || quality > 5) {
            return ResponseEntity.badRequest().build(); // Invalid input
        }

        return kanjiRepository.findById(id)
                .map(kanji -> {
                    srsService.processReview(kanji, quality);
                    return ResponseEntity.ok(kanji);
                })
                .orElse(ResponseEntity.notFound().build()); // Kanji not found
    }
}
