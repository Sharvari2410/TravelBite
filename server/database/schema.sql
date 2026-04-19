-- TravelBite PostgreSQL schema
-- Run with: psql < server/database/schema.sql

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS cities (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  region VARCHAR(60) NOT NULL,
  country VARCHAR(80) NOT NULL DEFAULT 'India',
  summary TEXT,
  image_url TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS cities_name_country_unique_idx ON cities (LOWER(name), LOWER(country));

CREATE TABLE IF NOT EXISTS places (
  id BIGSERIAL PRIMARY KEY,
  city_id BIGINT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  place_type VARCHAR(40) NOT NULL CHECK (place_type IN ('landmark', 'restaurant', 'cafe', 'hotel', 'market', 'museum', 'hidden_gem', 'activity')),
  category VARCHAR(80),
  cuisine VARCHAR(80),
  address TEXT,
  description TEXT,
  image_url TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  rating NUMERIC(2, 1) CHECK (rating BETWEEN 0 AND 5),
  price_band VARCHAR(4) CHECK (price_band IN ('$', '$$', '$$$', '$$$$')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS places_city_id_idx ON places(city_id);
CREATE INDEX IF NOT EXISTS places_type_idx ON places(place_type);
CREATE INDEX IF NOT EXISTS places_featured_idx ON places(is_featured);

CREATE TABLE IF NOT EXISTS itineraries (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  city_id BIGINT REFERENCES cities(id) ON DELETE SET NULL,
  trip_days INTEGER NOT NULL CHECK (trip_days BETWEEN 1 AND 30),
  budget_mode VARCHAR(20) NOT NULL DEFAULT 'balanced' CHECK (budget_mode IN ('budget', 'balanced', 'luxury', 'insider')),
  travel_style VARCHAR(80),
  notes TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS itineraries_user_id_idx ON itineraries(user_id);

CREATE TABLE IF NOT EXISTS itinerary_stops (
  id BIGSERIAL PRIMARY KEY,
  itinerary_id BIGINT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1),
  sequence_no INTEGER NOT NULL CHECK (sequence_no >= 1),
  place_id BIGINT REFERENCES places(id) ON DELETE SET NULL,
  stop_name VARCHAR(160) NOT NULL,
  start_time TIME,
  end_time TIME,
  notes TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  UNIQUE (itinerary_id, day_number, sequence_no)
);

CREATE INDEX IF NOT EXISTS itinerary_stops_itinerary_id_idx ON itinerary_stops(itinerary_id);

CREATE TABLE IF NOT EXISTS journal_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city_id BIGINT REFERENCES cities(id) ON DELETE SET NULL,
  place_id BIGINT REFERENCES places(id) ON DELETE SET NULL,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  rating NUMERIC(2, 1) CHECK (rating BETWEEN 0 AND 5),
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_favorite_idx ON journal_entries(is_favorite);

CREATE TABLE IF NOT EXISTS saved_items (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id BIGINT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  source VARCHAR(30) NOT NULL DEFAULT 'discovery' CHECK (source IN ('discovery', 'map', 'itinerary', 'gems', 'hotel')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, place_id)
);

CREATE INDEX IF NOT EXISTS saved_items_user_id_idx ON saved_items(user_id);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id BIGINT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, place_id)
);

CREATE INDEX IF NOT EXISTS reviews_place_id_idx ON reviews(place_id);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  preferred_budget VARCHAR(20) DEFAULT 'balanced' CHECK (preferred_budget IN ('budget', 'balanced', 'luxury', 'insider')),
  preferred_cuisines TEXT[] NOT NULL DEFAULT '{}',
  dietary_preferences TEXT[] NOT NULL DEFAULT '{}',
  home_city VARCHAR(100),
  notification_opt_in BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
