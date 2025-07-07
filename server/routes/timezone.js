const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/timezone/:timezone - Get current time for a timezone
router.get('/:timezone', async (req, res) => {
  try {
    const timezone = req.params.timezone;
    const response = await axios.get(`${process.env.WORLDTIME_API_URL}/timezone/${timezone}`);
    
    res.json({
      timezone: response.data.timezone,
      datetime: response.data.datetime,
      utc_offset: response.data.utc_offset,
      day_of_week: response.data.day_of_week,
      day_of_year: response.data.day_of_year,
      week_number: response.data.week_number
    });
  } catch (error) {
    console.error('Timezone API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch timezone data' });
  }
});

// GET /api/timezone/bulk - Get current time for multiple timezones
router.post('/bulk', async (req, res) => {
  try {
    const { timezones } = req.body;
    
    if (!Array.isArray(timezones)) {
      return res.status(400).json({ error: 'Timezones must be an array' });
    }

    const promises = timezones.map(async (timezone) => {
      try {
        const response = await axios.get(`${process.env.WORLDTIME_API_URL}/timezone/${timezone}`);
        return {
          timezone: response.data.timezone,
          datetime: response.data.datetime,
          utc_offset: response.data.utc_offset,
          success: true
        };
      } catch (error) {
        return {
          timezone,
          error: 'Failed to fetch data',
          success: false
        };
      }
    });

    const results = await Promise.all(promises);
    res.json(results);
  } catch (error) {
    console.error('Bulk timezone API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch timezone data' });
  }
});

// GET /api/timezone/ip/:ip - Get timezone from IP address
router.get('/ip/:ip', async (req, res) => {
  try {
    const ip = req.params.ip;
    const response = await axios.get(`${process.env.GEOIP_API_URL}/${ip}/json/`);
    
    res.json({
      ip: response.data.ip,
      city: response.data.city,
      region: response.data.region,
      country: response.data.country_name,
      timezone: response.data.timezone,
      latitude: response.data.latitude,
      longitude: response.data.longitude
    });
  } catch (error) {
    console.error('GeoIP API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

module.exports = router;
