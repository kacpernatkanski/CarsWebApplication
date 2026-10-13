
using Cars.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure.Data
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (await context.Cars.AnyAsync())
                return;

            var cars = new List<Car>
            {
                new Car
                {
                    Brand = "Toyota",
                    Model = "Corolla",
                    DoorsNumber = 4,
                    LuggageCapacity = 452,
                    EngineCapacity = 1.8,
                    FuelType = "Petrol",
                    ProductionDate = new DateTime(2020, 5, 15),
                    AverageFuelConsumption = 6.2,
                    BodyType = "Sedan"
                },
                new Car
                {
                    Brand = "BMW",
                    Model = "320i",
                    DoorsNumber = 4,
                    LuggageCapacity = 480,
                    EngineCapacity = 2.0,
                    FuelType = "Petrol",
                    ProductionDate = new DateTime(2022, 3, 10),
                    AverageFuelConsumption = 7.1,
                    BodyType = "Sedan"
                },
                new Car
                {
                    Brand = "Audi",
                    Model = "A4",
                    DoorsNumber = 4,
                    LuggageCapacity = 460,
                    EngineCapacity = 2.0,
                    FuelType = "Diesel",
                    ProductionDate = new DateTime(2021, 7, 20),
                    AverageFuelConsumption = 5.3,
                    BodyType = "Sedan"
                },
                new Car
                {
                    Brand = "Volkswagen",
                    Model = "Golf",
                    DoorsNumber = 5,
                    LuggageCapacity = 380,
                    EngineCapacity = 1.5,
                    FuelType = "Petrol",
                    ProductionDate = new DateTime(2019, 9, 5),
                    AverageFuelConsumption = 5.8,
                    BodyType = "Hatchback"
                }
            };

            await context.Cars.AddRangeAsync(cars);
            await context.SaveChangesAsync();
        }
    }
}
