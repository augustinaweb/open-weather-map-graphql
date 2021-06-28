const { gql } = require("apollo-server");

const typeDefs = gql`
  type City {
    lat: Float!
    lon: Float!
    timezone: String!
    current: Current!
    daily: [Daily!]!
  }

  type Current {
    dt: Int!
    sunrise: Int!
    sunset: Int!
    temp: Float!
    feels_like: Float!
    pressure: Int!
    humidity: Int!
    dew_point: Int!
    uvi: Float!
    clouds: Int!
    visibility: Int!
    wind_speed: Int!
    wind_deg: Int!
    weather: [Weather!]!
  }

  type Daily {
    dt: Int!
    sunrise: Int!
    sunset: Int!
    temp: Temperature!
    humidity: Int!
    wind_speed: Float!
    wind_deg: Int!
    weather: [Weather!]!
  }

  type Weather {
    id: ID!
    main: String!
    description: String!
    icon: String!
  }

  type Temperature {
    day: Float!
    night: Float!
  }

  input ConfigInput {
    units: Unit!
    lang: Language!
  }

  type Query {
    getCityByName(name: String!, country: String, config: ConfigInput): City
  }

  enum Unit {
    metric
    imperial
    kelvin
  }

  enum Language {
    af
    al
    ar
    az
    bg
    ca
    cz
    da
    de
    el
    en
    eu
    fa
    fi
    fr
    gl
    he
    hi
    hr
    hu
    id
    it
    ja
    kr
    la
    lt
    mk
    no
    nl
    pl
    pt
    pt_br
    ro
    ru
    sv
    se
    sk
    sl
    sp
    es
    sr
    th
    tr
    ua
    uk
    vi
    zh_cn
    zh_tw
    zu
  }
`;

module.exports = {
  typeDefs,
};
