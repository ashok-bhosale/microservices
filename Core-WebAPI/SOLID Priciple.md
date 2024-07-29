The SOLID principles are a set of design principles in object-oriented programming that help create more understandable, flexible, and maintainable software. Here's a brief overview of each principle with a C# code example:

### 1. **Single Responsibility Principle (SRP)**

**Principle:** A class should have only one reason to change, meaning it should have only one job or responsibility.

**Example:**
```csharp
public class Invoice
{
    public void CalculateTotal() { /* ... */ }
}

public class InvoicePrinter
{
    public void Print(Invoice invoice) { /* ... */ }
}
```
**Explanation:** The `Invoice` class is responsible only for calculating the total, and the `InvoicePrinter` class is responsible for printing the invoice, thus adhering to SRP.

### 2. **Open/Closed Principle (OCP)**

**Principle:** Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.

**Example:**
```csharp
public abstract class Shape
{
    public abstract double Area();
}

public class Circle : Shape
{
    public double Radius { get; set; }

    public override double Area() => Math.PI * Radius * Radius;
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double Area() => Width * Height;
}
```
**Explanation:** The `Shape` class can be extended with new shapes (e.g., `Circle`, `Rectangle`) without modifying existing code, adhering to OCP.

### 3. **Liskov Substitution Principle (LSP)**

**Principle:** Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.

**Example:**
```csharp
public class Bird
{
    public virtual void Fly() { /* ... */ }
}

public class Eagle : Bird
{
    public override void Fly() { /* ... */ }
}

public class Ostrich : Bird
{
    public override void Fly()
    {
        throw new InvalidOperationException("Ostrich cannot fly");
    }
}
```
**Explanation:** In this example, `Ostrich` violates LSP because it cannot fly, which goes against the expectations set by the `Bird` class. A better design would be to have a different hierarchy or interface for flying and non-flying birds.

### 4. **Interface Segregation Principle (ISP)**

**Principle:** A client should not be forced to implement interfaces it does not use. Instead of one large interface, create smaller, more specific ones.

**Example:**
```csharp
public interface IPrinter
{
    void Print();
}

public interface IScanner
{
    void Scan();
}

public class AllInOnePrinter : IPrinter, IScanner
{
    public void Print() { /* ... */ }
    public void Scan() { /* ... */ }
}

public class SimplePrinter : IPrinter
{
    public void Print() { /* ... */ }
}
```
**Explanation:** The `IPrinter` and `IScanner` interfaces segregate the functionalities, so a class implementing `IPrinter` does not need to implement scanning capabilities, adhering to ISP.

### 5. **Dependency Inversion Principle (DIP)**

**Principle:** High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

**Example:**
```csharp
public interface ILogger
{
    void Log(string message);
}

public class FileLogger : ILogger
{
    public void Log(string message) { /* Log to file */ }
}

public class ConsoleLogger : ILogger
{
    public void Log(string message) { /* Log to console */ }
}

public class Application
{
    private readonly ILogger _logger;

    public Application(ILogger logger)
    {
        _logger = logger;
    }

    public void Run()
    {
        _logger.Log("Application started");
    }
}
```
**Explanation:** The `Application` class depends on the `ILogger` interface rather than a specific implementation. This allows for different logging implementations (e.g., `FileLogger`, `ConsoleLogger`) to be used interchangeably, adhering to DIP.

These principles help in creating robust and maintainable software. By adhering to SOLID principles, developers can design systems that are easier to understand, extend, and maintain.