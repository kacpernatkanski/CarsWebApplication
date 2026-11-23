
namespace Cars.Application.Cars.DTOs;

public record CarDto(
    Guid Id,
    string Brand,
    string Model,
    int DoorsNumber,
    int LuggageCapacity,
    double EngineCapacity,
    string FuelType,
    DateTime ProductionDate,
    double AverageFuelConsumption,
    string BodyType,
    IReadOnlyCollection<CarPhotoDto> Photos,
    IReadOnlyCollection<FeatureDto> Features
);
