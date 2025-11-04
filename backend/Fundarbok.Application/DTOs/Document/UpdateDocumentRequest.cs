namespace Fundarbok.Application.DTOs.Document;

public class UpdateDocumentRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Number { get; set; }
    public bool IsPublic { get; set; }
    public bool IsLocked { get; set; }
}
