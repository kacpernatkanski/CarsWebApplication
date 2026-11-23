
using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class GetCarsList
{
    public class Query : IRequest<List<CarDto>>
    {
    }

    public class Handler : IRequestHandler<Query, List<CarDto>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<CarDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var cars = await _context.Cars
                .Include(car => car.Photos)
                .Include(car => car.Features)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return cars.Select(CarMapper.ToDto).ToList();
        }
    }
}
