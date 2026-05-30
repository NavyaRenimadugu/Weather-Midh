# Weather API Backend

Spring Boot backend for WeatherPulse Pro weather application.

## Setup

### Prerequisites
- Java 17+
- Maven 3.6+

### Installation

1. Clone/navigate to the backend folder
2. Copy `.env.example` to `.env` and add your WeatherAPI.com key:
   ```
   WEATHER_API_KEY=your_actual_key_here
   ```

3. Set the environment variable:
   ```bash
   export WEATHER_API_KEY=your_actual_key_here
   ```

4. Build the project:
   ```bash
   mvn clean install
   ```

5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The API will start on `http://localhost:8080/api`

## API Endpoints

### Get Weather Forecast
```
GET /api/weather/forecast?city=London&days=7
```
- `city` (required): City name
- `days` (optional): Number of days (1-10, default: 7)

**Response:**
```json
{
  "location": { ... },
  "current": { ... },
  "forecast": { ... }
}
```

### Get Current Weather
```
GET /api/weather/current?city=London
```

### Health Check
```
GET /api/weather/health
```

## Error Handling

The API returns proper HTTP status codes and error messages:
- `400 Bad Request`: Invalid input or city not found
- `500 Internal Server Error`: Server-side errors
- `403 Forbidden`: Invalid API key

## Security Notes

- API key is stored in environment variables, never in code
- CORS is configured for localhost (update for production)
- Input validation on all endpoints
- Proper error handling without exposing sensitive info

## Frontend Integration

Update your frontend `app.js` to use the backend:

```javascript
async function fetchWeather(city) {
  const response = await fetch(
    `http://localhost:8080/api/weather/forecast?city=${city}&days=7`
  );
  const data = await response.json();
  // Rest of your code
}
```
