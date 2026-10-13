
namespace Cars.Domain.Entities
{
    public class Car
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;

        public int DoorsNumber { get; set; }
        public int LuggageCapacity { get; set; }
        public double EngineCapacity { get; set; }

        public string FuelType { get; set; } = string.Empty;
        public DateTime ProductionDate { get; set; }

        public double AverageFuelConsumption { get; set; }
        public string BodyType { get; set; } = string.Empty;
    }
}
