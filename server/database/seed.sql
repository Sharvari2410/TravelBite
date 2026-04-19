-- TravelBite PostgreSQL seed data
-- Run with: psql < server/database/seed.sql

BEGIN;

INSERT INTO cities (name, region, country, summary, latitude, longitude, image_url)
VALUES
  ('Mumbai', 'West', 'India', 'Coastal city with iconic street food and nightlife.', 19.0760, 72.8777, 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80'),
  ('Pune', 'West', 'India', 'Blend of heritage and contemporary cafe culture.', 18.5204, 73.8567, 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80'),
  ('Jaipur', 'North', 'India', 'Royal architecture and rich Rajasthani cuisine.', 26.9124, 75.7873, 'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80'),
  ('Kochi', 'South', 'India', 'Harbour city known for seafood and spice markets.', 9.9312, 76.2673, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'),
  ('Delhi', 'North', 'India', 'Historic capital with diverse food districts.', 28.6139, 77.2090, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT DO NOTHING;

INSERT INTO places (city_id, name, place_type, category, cuisine, description, latitude, longitude, rating, price_band, is_featured, image_url)
SELECT c.id, p.name, p.place_type, p.category, p.cuisine, p.description, p.latitude, p.longitude, p.rating, p.price_band, p.is_featured, p.image_url
FROM (
  VALUES
    ('Mumbai', 'Gateway of India', 'landmark', 'Historic Site', NULL, 'Iconic waterfront monument in South Mumbai.', 18.9220, 72.8347, 4.7, '$', TRUE, 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80'),
    ('Mumbai', 'Ashok Vada Pav', 'restaurant', 'Street Food', 'Maharashtrian', 'Legendary vada pav stop loved by locals.', 19.0196, 72.8409, 4.8, '$', TRUE, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80'),
    ('Pune', 'Shaniwar Wada', 'landmark', 'Fort', NULL, 'Historic fort with strong Maratha legacy.', 18.5196, 73.8553, 4.6, '$', TRUE, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'),
    ('Pune', 'FC Road Cafe', 'cafe', 'Cafe', 'Fusion', 'Popular youth cafe zone in Pune.', 18.5204, 73.8417, 4.4, '$$', FALSE, 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80'),
    ('Jaipur', 'Hawa Mahal', 'landmark', 'Architecture', NULL, 'Iconic pink facade in old city Jaipur.', 26.9239, 75.8267, 4.7, '$', TRUE, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'),
    ('Kochi', 'Fort Kochi', 'hidden_gem', 'Heritage Walk', NULL, 'Colonial lanes, art spaces, and local bites.', 9.9640, 76.2420, 4.6, '$', TRUE, 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80'),
    ('Delhi', 'Qutub Minar', 'landmark', 'UNESCO Site', NULL, 'Historic monument complex in Delhi.', 28.5244, 77.1855, 4.7, '$', TRUE, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80')
) AS p(city_name, name, place_type, category, cuisine, description, latitude, longitude, rating, price_band, is_featured, image_url)
JOIN cities c ON LOWER(c.name) = LOWER(p.city_name)
ON CONFLICT DO NOTHING;

COMMIT;
