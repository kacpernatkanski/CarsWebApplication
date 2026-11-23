
using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class Details
{
    public class Query : IRequest<CarDto?>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, CarDto?>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<CarDto?> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var car = await _context.Cars
                .Include(x => x.Photos)
                .Include(x => x.Features)
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    x => x.Id == request.Id,
                    cancellationToken);

            return car is null ? null : CarMapper.ToDto(car);
        }
    }
}
