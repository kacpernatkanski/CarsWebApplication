
using Cars.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class DeleteCarPhoto
{
    public class Command : IRequest<string?>
    {
        public Guid CarId { get; set; }
        public Guid PhotoId { get; set; }
    }

    public class Handler : IRequestHandler<Command, string?>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<string?> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var photo = await _context.CarPhotos
                .FirstOrDefaultAsync(
                    x => x.Id == request.PhotoId
                         && x.CarId == request.CarId,
                    cancellationToken);

            if (photo is null)
                return null;

            var fileName = photo.FileName;

            _context.CarPhotos.Remove(photo);

            await _context.SaveChangesAsync(cancellationToken);

            return fileName;
        }
    }
}
