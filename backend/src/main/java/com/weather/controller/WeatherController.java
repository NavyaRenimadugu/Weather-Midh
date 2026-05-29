package com.weather.controller;

import com.weather.dto.WeatherResponse;
import com.weather.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/forecast")
    public Mono<ResponseEntity<WeatherResponse>> getForecast(
            @RequestParam String city,
            @RequestParam(defaultValue = "7") int days) {

        if (city == null || city.trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }

        if (days < 1 || days > 10) {
            return Mono.just(ResponseEntity.badRequest().build());
        }

        return weatherService.getWeather(city, days)
                .map(ResponseEntity::ok)
                .onErrorResume(ex -> {
                    if (ex instanceof IllegalArgumentException) {
                        return Mono.just(ResponseEntity.badRequest().build());
                    }
                    return Mono.just(ResponseEntity.status(500).build());
                });
    }

    @GetMapping("/current")
    public Mono<ResponseEntity<WeatherResponse.Current>> getCurrentWeather(
            @RequestParam String city) {

        if (city == null || city.trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }

        return weatherService.getWeather(city, 1)
                .map(response -> ResponseEntity.ok(response.current))
                .onErrorResume(ex -> Mono.just(ResponseEntity.status(500).build()));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Weather API is running");
    }
}
