package com.weather.service;

import com.weather.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class WeatherService {

    private final WebClient webClient;
    private final String apiKey;
    private final String baseUrl;
    private final int timeout;

    public WeatherService(WebClient webClient,
                          @Value("${weather.api.key}") String apiKey,
                          @Value("${weather.api.base-url}") String baseUrl,
                          @Value("${weather.api.timeout}") int timeout) {
        this.webClient = webClient;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }

    public Mono<WeatherResponse> getWeather(String city, int days) {
        if (apiKey.equals("your_api_key_here")) {
            return Mono.error(new IllegalStateException("API key not configured. Set WEATHER_API_KEY environment variable."));
        }

        return webClient.get()
                .uri(baseUrl + "/forecast.json?key={key}&q={city}&days={days}&aqi=no",
                        apiKey, city, days)
                .retrieve()
                .bodyToMono(WeatherResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .onErrorMap(WebClientResponseException.class, this::mapToWeatherException);
    }

    private Throwable mapToWeatherException(WebClientResponseException ex) {
        if (ex.getStatusCode().value() == 400) {
            return new IllegalArgumentException("City not found. Please check the city name.");
        }
        if (ex.getStatusCode().value() == 403) {
            return new IllegalStateException("API key is invalid.");
        }
        return new RuntimeException("Failed to fetch weather data: " + ex.getMessage());
    }
}
