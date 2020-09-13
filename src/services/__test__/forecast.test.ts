import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponse from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import {
  Beach,
  BeachPosition,
  Forecast,
  ForecastProcessingInternalError,
} from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponse
    );

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];

    const expectedResponse = [
      {
        time: '2020-09-10T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 143.56,
            swellHeight: 1.18,
            swellPeriod: 8.61,
            time: '2020-09-10T00:00:00+00:00',
            waveDirection: 168.26,
            waveHeight: 1.73,
            windDirection: 89.75,
            windSpeed: 0.98,
          },
        ],
      },
      {
        time: '2020-09-10T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 142.3,
            swellHeight: 1.12,
            swellPeriod: 8.59,
            time: '2020-09-10T01:00:00+00:00',
            waveDirection: 167.15,
            waveHeight: 1.77,
            windDirection: 60.84,
            windSpeed: 0.94,
          },
        ],
      },
      {
        time: '2020-09-10T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 141.03,
            swellHeight: 1.07,
            swellPeriod: 8.56,
            time: '2020-09-10T02:00:00+00:00',
            waveDirection: 166.05,
            waveHeight: 1.81,
            windDirection: 31.92,
            windSpeed: 0.9,
          },
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);
    expect(response).toEqual([]);
  });

  it('should throw internal processing error when something goes wrong during the rqating process', async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];
    mockedStormGlassService.fetchPoints.mockRejectedValue(
      'Error fetching data'
    );

    const forecast = new Forecast(mockedStormGlassService);

    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });
});
