package com.example.kanjisrs.repository;

import com.example.kanjisrs.model.Kanji;
import org.springframework.data.jpa.repository.JpaRepository; // allows for query creation from method names
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface KanjiRepository extends JpaRepository<Kanji, Long> {

    /**
     * Finds all Kanji that are due for review on or before today.
     * @param date The current date.
     * @return A list of due Kanji.
     */
    List<Kanji> findByDueDateLessThanEqual(LocalDate date); // uses query creation from jpa
}