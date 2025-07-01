package com.example.kanjisrs.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Kanji {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String character;
    private String meaning;
    private String onyomi;
    private String kunyomi;

    // SRS Fields
    private int repetitions = 0;
    private double easinessFactor = 2.5;

    @Column(name = "review_interval")
    private int interval = 0;

    private LocalDate dueDate;

    public Kanji(String character, String meaning, String onyomi, String kunyomi) {
        this.character = character;
        this.meaning = meaning;
        this.onyomi = onyomi;
        this.kunyomi = kunyomi;
        this.dueDate = LocalDate.now();
    }
}
