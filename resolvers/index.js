const axios = require("axios");
const { UserInputError } = require("apollo-server");

const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.KEY}`;
//const ONECALL_API = `https://api.openweathermap.org/data/2.5/onecall?appid=${process.env.KEY}&exclude=daily,minutely,alerts`;
const ONECALL_API = `https://api.openweathermap.org/data/2.5/onecall?appid=${process.env.KEY}`;

const resolvers = {
  Query: {
    getCityByName: async (obj, args, context, info) => {
      // name is required | country and config are optional
      const { name, country, config } = args;
      let url1 = `${WEATHER_API}&q=${name}`;
      let units, lang;

      // Add other fields if possible
      if (country) url1 = url + `,${country}`;
      if (config && config.units) units = `&units=${config.units}`;
      if (config && config.lang) lang = `&lang=${config.lang}`;
      try {
        const { data } = await axios.get(url1);

        // By default, any invalid country code is ignored by the API
        // In this case, the API returns data for any city that matches the name
        // To prevent false positives, an error is thrown if country codes don't match
        if (country && country.toUpperCase() !== data.sys.country) {
          throw new UserInputError("Country code was invalid", {
            invalidArgs: { country: country },
          });
        }

        const lat = await `&lat=${data.coord.lat}`;
        const lon = await `&lon=${data.coord.lon}`;
        const url2 = await `${ONECALL_API}${lat}${lon}`;
        if (units) {
          url2 = await `${url2}${units}`;
        }
        if (lang) {
          url2 = await `${url2}${lang}`;
        }

        const { results } = await axios.get(url2);

        const daily = results.daily.map((day) => {
          return {
            dt: day.dt,
            sunrise: day.sunrise,
            sunset: day.sunset,
            temp: {
              day: day.temp.day,
              night: day.temp.night,
            },
            humidity: day.humidity,
            wind_speed: day.wind_speed,
            wind_deg: day.wind_deg,
            weather: [
              {
                id: day.weather.id,
                main: day.weather.description,
                description: day.weather.description,
                icon: day.weather.icon,
              },
            ],
          };
        });

        return {
          lat: data.lat,
          lon: results.lon,
          timezone: results.timezone,
          current: {
            dt: results.current.dt,
            sunrise: results.current.sunrise,
            sunset: results.current.sunset,
            temp: results.current.temp,
            feels_like: results.current.feels_like,
            pressure: results.current.pressure,
            humidity: results.current.humidity,
            dew_point: results.current.dew_point,
            uvi: results.current.uvi,
            clouds: results.current.clouds,
            visibility: results.current.visibility,
            wind_speed: results.current.wind_speed,
            wind_deg: results.current.wind_deg,
            weather: [
              {
                id: results.weather.id,
                main: results.weather.main,
                description: results.weather.description,
                icon: results.weather.icon,
              },
            ],
          },
          daily: daily,
        };
      } catch (e) {
        return null;
      }
    },
  },
};

module.exports = {
  resolvers,
};
