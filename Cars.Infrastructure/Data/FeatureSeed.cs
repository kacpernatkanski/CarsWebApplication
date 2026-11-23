
using Cars.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure.Data;

public static class FeatureSeed
{
    public static async Task SeedAsync(DataContext context)
    {
        if (await context.Features.AnyAsync())
            return;

        var features = new[]
        {
            "ABS",
            "ESP",
            "Klimatyzacja",
            "Nawigacja",
            "Tempomat",
            "Kamera cofania",
            "Czujniki parkowania",
            "Podgrzewane fotele"
        };

        foreach (var name in features)
        {
            context.Features.Add(new Feature
            {
                Id = Guid.NewGuid(),
                Name = name
            });
        }

        await context.SaveChangesAsync();
    }
}
