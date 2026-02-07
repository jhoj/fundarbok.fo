using Microsoft.AspNetCore.Mvc;

namespace Fundarbok.API.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("healthy");
}
