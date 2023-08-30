"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
let WeatherService = class WeatherService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    getTemperature(location) {
        const apiUrl = `${process.env.WEATHERBIT_URL}current?city=${location}&key=${process.env.WEATHERBIT_APIKEY}&include=${process.env.WEATHERBIT_INTERVAL}`;
        console.log(apiUrl);
        return this.httpService.get(apiUrl).pipe((0, rxjs_1.map)(response => {
            const temperature = response.data.data[0].temp;
            return { temperature };
        }));
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map