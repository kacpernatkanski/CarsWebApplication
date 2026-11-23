
using Cars.Application.Cars.DTOs;
using Cars.Infrastructure.Data;
using Cars.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class AddCarPhoto
{
    public class Command : IRequest<CarPhotoDto?>
    {
        public Guid CarId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class Handler : IRequestHandler<Command, CarPhotoDto?>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<CarPhotoDto?> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var car = await _context.Cars
                .Include(x => x.Photos)
                .FirstOrDefaultAsync(
                    x => x.Id == request.CarId,
                    cancellationToken);

            if (car is null)
                return null;

            var photo = new CarPhoto
            {
                Id = Guid.NewGuid(),
                CarId = car.Id,
                FileName = request.FileName,
                Url = request.Url,
                IsMain = !car.Photos.Any()
            };

            _context.CarPhotos.Add(photo);

            await _context.SaveChangesAsync(cancellationToken);

            return new CarPhotoDto(
                photo.Id,
                photo.Url,
                photo.IsMain
            );
        }
    }
}
