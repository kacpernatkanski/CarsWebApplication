
using Cars.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class UpdateCarFeatures
{
    public class Command : IRequest<bool>
    {
        public Guid CarId { get; set; }
        public List<Guid> FeatureIds { get; set; } = new();
    }

    public class Handler : IRequestHandler<Command, bool>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var car = await _context.Cars
                .Include(x => x.Features)
                .FirstOrDefaultAsync(
                    x => x.Id == request.CarId,
                    cancellationToken);

            if (car is null)
                return false;

            var features = await _context.Features
                .Where(x => request.FeatureIds.Contains(x.Id))
                .ToListAsync(cancellationToken);

            car.Features.Clear();

            foreach (var feature in features)
            {
                car.Features.Add(feature);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
