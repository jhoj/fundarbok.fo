# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY Fundarbok.API/Fundarbok.API.csproj Fundarbok.API/
COPY Fundarbok.Application/Fundarbok.Application.csproj Fundarbok.Application/
COPY Fundarbok.Domain/Fundarbok.Domain.csproj Fundarbok.Domain/
COPY Fundarbok.Infrastructure/Fundarbok.Infrastructure.csproj Fundarbok.Infrastructure/

# Restore dependencies
RUN dotnet restore Fundarbok.API/Fundarbok.API.csproj

# Copy source code
COPY . .

# Build and publish
WORKDIR /src/Fundarbok.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R appuser:appuser /app

# Copy published files
COPY --from=build /app/publish .

# Set ownership
RUN chown -R appuser:appuser /app

USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Fundarbok.API.dll"]
