
using Cars.Domain;
using Cars.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure.Data;

public class DataContext
    : IdentityDbContext<AppUser, IdentityRole, string>
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public DbSet<Car> Cars => Set<Car>();
}
