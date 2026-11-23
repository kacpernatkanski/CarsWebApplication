
using Cars.Application.Cars;
using Cars.Application.Cars.DTOs;
using Cars.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers;

[Authorize]
public class CarsController : BaseApiController
{
    private readonly ISender _sender;
    private readonly IWebHostEnvironment _environment;

    public CarsController(
        ISender sender,
        IWebHostEnvironment environment)
    {
        _sender = sender;
        _environment = environment;
    }

    [HttpGet]
    public async Task<ActionResult<List<CarDto>>> GetCars()
    {
        return await _sender.Send(new GetCarsList.Query());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CarDto>> GetCar(Guid id)
    {
        var car = await _sender.Send(new Details.Query { Id = id });

        if (car is null)
        {
            return NotFound();
        }

        return car;
    }

    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(Car car)
    {
        var createdCar = await _sender.Send(
            new Create.Command { Car = car });

        return CreatedAtAction(
            nameof(GetCar),
            new { id = createdCar.Id },
            createdCar);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> EditCar(Guid id, Car car)
    {
        var result = await _sender.Send(
            new Edit.Command { Id = id, Car = car });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id:guid}/features")]
    public async Task<IActionResult> UpdateCarFeatures(
        Guid id,
        [FromBody] UpdateCarFeaturesDto dto)
    {
        var result = await _sender.Send(
            new UpdateCarFeatures.Command
            {
                CarId = id,
                FeatureIds = dto.FeatureIds
            });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id:guid}/photos")]
    [RequestSizeLimit(5_000_000)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadCarPhoto(
        Guid id,
        IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("Nie wybrano pliku.");
        }

        if (file.Length > 5_000_000)
        {
            return BadRequest("Plik jest za duży.");
        }

        var extension = Path.GetExtension(file.FileName)
            .ToLowerInvariant();

        var allowedExtensions = new[]
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest("Niedozwolony format pliku.");
        }

        var fileName = $"{Guid.NewGuid()}{extension}";

        var uploadsPath = Path.Combine(
            _environment.ContentRootPath,
            "wwwroot",
            "uploads",
            "cars"
        );

        Directory.CreateDirectory(uploadsPath);

        var filePath = Path.Combine(uploadsPath, fileName);

        await using (var stream = new FileStream(
            filePath,
            FileMode.CreateNew))
        {
            await file.CopyToAsync(stream);
        }

        var url = $"/uploads/cars/{fileName}";

        try
        {
            var result = await _sender.Send(
                new AddCarPhoto.Command
                {
                    CarId = id,
                    FileName = fileName,
                    Url = url
                });

            if (result is null)
            {
                System.IO.File.Delete(filePath);
                return NotFound();
            }

            return CreatedAtAction(
                nameof(GetCar),
                new { id },
                result);
        }
        catch
        {
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            throw;
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}/photos/{photoId:guid}")]
    public async Task<IActionResult> DeleteCarPhoto(
        Guid id,
        Guid photoId)
    {
        var fileName = await _sender.Send(
            new DeleteCarPhoto.Command
            {
                CarId = id,
                PhotoId = photoId
            });

        if (fileName is null)
        {
            return NotFound();
        }

        var filePath = Path.Combine(
            _environment.ContentRootPath,
            "wwwroot",
            "uploads",
            "cars",
            fileName
        );

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCar(Guid id)
    {
        var result = await _sender.Send(
            new Delete.Command { Id = id });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
