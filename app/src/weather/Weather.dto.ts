export class WeatherResponseDTO {
    count: number;
    data: WeatherDataDTO[];
}

export class WeatherDataDTO {
    app_temp: number;
    aqi: number;
    city_name: string;
    clouds: number;
    country_code: string;
    datetime: string;
    dewpt: number;
    dhi: number;
    dni: number;
    elev_angle: number;
    ghi: number;
    gust: number;
    h_angle: number;
    lat: number;
    lon: number;
    ob_time: string;
    pod: string;
    precip: number;
    pres: number;
    rh: number;
    slp: number;
    snow: number;
    solar_rad: number;
    sources: string[];
    state_code: string;
    station: string;
    sunrise: string;
    sunset: string;
    temp: number;
    timezone: string;
    ts: number;
    uv: number;
    vis: number;
    weather: WeatherInfoDTO;
    wind_cdir: string;
    wind_cdir_full: string;
    wind_dir: number;
    wind_spd: number;
}

export class WeatherInfoDTO {
    code: number;
    icon: string;
    description: string;
}

export class WeatherSnippet {
    datetime: string;
    temperature: number;
}