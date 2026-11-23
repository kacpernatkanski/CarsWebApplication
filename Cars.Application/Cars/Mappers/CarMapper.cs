
using Cars.Application.Cars.DTOs;
using Cars.Domain.Entities;

namespace Cars.Application.Cars.Mappers;

public static class CarMapper
{
    public static CarDto ToDto(Car car)
    {
        return new CarDto(
            car.Id,
            car.Brand,
            car.Model,
            car.DoorsNumber,
            car.LuggageCapacity,
            car.EngineCapacity,
            car.FuelType,
            car.ProductionDate,
            car.AverageFuelConsumption,
            car.BodyType,
            car.Photos.Select(photo => new CarPhotoDto(
                photo.Id,
                photo.Url,
                photo.IsMain
            )).ToList(),
            car.Features.Select(feature => new FeatureDto(
                feature.Id,
                feature.Name
            )).ToList()
        );
    }
}
