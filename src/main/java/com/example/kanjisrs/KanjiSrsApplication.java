package com.example.kanjisrs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.ComponentScan;

/**
 * Main application class for the Kanji SRS backend.
 * The @SpringBootApplication annotation enables auto-configuration and component scanning.
 * It will scan this package and all sub-packages for components like Controllers.
 */
@SpringBootApplication
public class KanjiSrsApplication {

	public static void main(String[] args) {
		SpringApplication.run(KanjiSrsApplication.class, args);
		System.out.println("\nKanji SRS Backend is running!");
		System.out.println("Access H2 Console at: http://localhost:8080/h2-console");
		System.out.println("API root is at: http://localhost:8080/api/kanji\n");
	}

}
