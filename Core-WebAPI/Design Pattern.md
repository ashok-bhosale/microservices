**Creational**

Creational design patterns deal with object creation mechanisms, trying to create objects in a manner suitable to the situation. Here's a brief overview of the main creational design patterns in C#, along with short descriptions and code examples:

### 1. **Singleton Pattern**

**Purpose:** Ensures that a class has only one instance and provides a global point of access to it.

**Example:**
```csharp
public class Singleton
{
    private static Singleton _instance;
    private static readonly object _lock = new object();

    private Singleton() { }

    public static Singleton Instance
    {
        get
        {
            lock (_lock)
            {
                if (_instance == null)
                {
                    _instance = new Singleton();
                }
                return _instance;
            }
        }
    }
}
```
**Usage:** Ideal for situations where exactly one instance of a class is needed to coordinate actions, such as configuration settings or logging.

### 2. **Factory Method Pattern**

**Purpose:** Defines an interface for creating an object but lets subclasses alter the type of objects that will be created.

**Example:**
```csharp
public abstract class Product
{
    public abstract void Operation();
}

public class ConcreteProductA : Product
{
    public override void Operation() => Console.WriteLine("ConcreteProductA Operation");
}

public class ConcreteProductB : Product
{
    public override void Operation() => Console.WriteLine("ConcreteProductB Operation");
}

public abstract class Creator
{
    public abstract Product FactoryMethod();

    public void AnOperation()
    {
        var product = FactoryMethod();
        product.Operation();
    }
}

public class ConcreteCreatorA : Creator
{
    public override Product FactoryMethod() => new ConcreteProductA();
}

public class ConcreteCreatorB : Creator
{
    public override Product FactoryMethod() => new ConcreteProductB();
}
```
**Usage:** Useful when the exact type of the object is unknown until runtime or when the creation process involves a series of steps.

### 3. **Abstract Factory Pattern**

**Purpose:** Provides an interface for creating families of related or dependent objects without specifying their concrete classes.

**Example:**
```csharp
public interface IButton
{
    void Click();
}

public interface ICheckbox
{
    void Check();
}

public class WinButton : IButton
{
    public void Click() => Console.WriteLine("Windows Button Clicked");
}

public class MacButton : IButton
{
    public void Click() => Console.WriteLine("Mac Button Clicked");
}

public class WinCheckbox : ICheckbox
{
    public void Check() => Console.WriteLine("Windows Checkbox Checked");
}

public class MacCheckbox : ICheckbox
{
    public void Check() => Console.WriteLine("Mac Checkbox Checked");
}

public interface IGUIFactory
{
    IButton CreateButton();
    ICheckbox CreateCheckbox();
}

public class WinFactory : IGUIFactory
{
    public IButton CreateButton() => new WinButton();
    public ICheckbox CreateCheckbox() => new WinCheckbox();
}

public class MacFactory : IGUIFactory
{
    public IButton CreateButton() => new MacButton();
    public ICheckbox CreateCheckbox() => new MacCheckbox();
}
```
**Usage:** Suitable for systems that need to be independent of how their objects are created, composed, or represented, such as cross-platform UI toolkits.

### 4. **Builder Pattern**

**Purpose:** Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

**Example:**
```csharp
public class Product
{
    public string PartA { get; set; }
    public string PartB { get; set; }
    public string PartC { get; set; }

    public override string ToString() => $"Product [PartA={PartA}, PartB={PartB}, PartC={PartC}]";
}

public interface IBuilder
{
    void BuildPartA();
    void BuildPartB();
    void BuildPartC();
    Product GetResult();
}

public class ConcreteBuilder : IBuilder
{
    private Product _product = new Product();

    public void BuildPartA() => _product.PartA = "Part A";
    public void BuildPartB() => _product.PartB = "Part B";
    public void BuildPartC() => _product.PartC = "Part C";

    public Product GetResult() => _product;
}

public class Director
{
    public void Construct(IBuilder builder)
    {
        builder.BuildPartA();
        builder.BuildPartB();
        builder.BuildPartC();
    }
}
```
**Usage:** Often used when creating complex objects with many optional parameters or configurations, such as assembling a meal or building a car.

### 5. **Prototype Pattern**

**Purpose:** Specifies the kind of objects to create using a prototypical instance and creates new objects by copying this prototype.

**Example:**
```csharp
public abstract class Prototype
{
    public abstract Prototype Clone();
}

public class ConcretePrototype : Prototype
{
    public string Property { get; set; }

    public override Prototype Clone()
    {
        return (Prototype)this.MemberwiseClone();
    }
}
```
**Usage:** Useful when the cost of creating a new object is more expensive than copying an existing one, such as in object cloning or managing different states of an object.

These creational patterns provide various ways to create objects while hiding the complexities of object creation from the client code. Understanding and using these patterns can lead to more flexible and scalable code architectures.




**Structural** 

Structural design patterns in C# focus on how classes and objects are composed to form larger structures. They ensure that if one part of a system changes, the entire system doesn't need to be changed as a result. Here's an overview of common structural design patterns with short descriptions and C# code examples:

### 1. **Adapter Pattern**

**Purpose:** Converts the interface of a class into another interface that a client expects. It allows classes with incompatible interfaces to work together.

**Example:**
```csharp
// Existing interface
public class Adaptee
{
    public string GetSpecificRequest() => "Specific request";
}

// Target interface
public interface ITarget
{
    string GetRequest();
}

// Adapter class
public class Adapter : ITarget
{
    private readonly Adaptee _adaptee;

    public Adapter(Adaptee adaptee)
    {
        _adaptee = adaptee;
    }

    public string GetRequest()
    {
        return $"This is '{_adaptee.GetSpecificRequest()}'";
    }
}

// Client code
class Program
{
    static void Main()
    {
        Adaptee adaptee = new Adaptee();
        ITarget target = new Adapter(adaptee);
        Console.WriteLine(target.GetRequest());
    }
}
```
**Usage:** Useful when integrating with third-party libraries or APIs that have incompatible interfaces.

### 2. **Bridge Pattern**

**Purpose:** Decouples an abstraction from its implementation so that the two can vary independently.

**Example:**
```csharp
// Abstraction
public abstract class RemoteControl
{
    protected readonly Device _device;

    protected RemoteControl(Device device)
    {
        _device = device;
    }

    public abstract void TurnOn();
    public abstract void TurnOff();
}

// Implementor
public interface Device
{
    void On();
    void Off();
}

// Concrete Implementor
public class TV : Device
{
    public void On() => Console.WriteLine("TV is on");
    public void Off() => Console.WriteLine("TV is off");
}

// Refined Abstraction
public class AdvancedRemoteControl : RemoteControl
{
    public AdvancedRemoteControl(Device device) : base(device) { }

    public void SetChannel(int number) => Console.WriteLine($"Set channel to {number}");

    public override void TurnOn() => _device.On();
    public override void TurnOff() => _device.On();
}

// Client code
class Program
{
    static void Main()
    {
        Device tv = new TV();
        RemoteControl remote = new AdvancedRemoteControl(tv);
        remote.TurnOn();
        remote.TurnOff();
    }
}
```
**Usage:** Ideal for situations where you need to decouple an abstraction from its implementation, such as graphical interfaces with multiple renderers.

### 3. **Composite Pattern**

**Purpose:** Composes objects into tree structures to represent part-whole hierarchies. It allows clients to treat individual objects and compositions of objects uniformly.

**Example:**
```csharp
// Component
public abstract class Component
{
    public abstract void Operation();
}

// Leaf
public class Leaf : Component
{
    public override void Operation()
    {
        Console.WriteLine("Leaf Operation");
    }
}

// Composite
public class Composite : Component
{
    private readonly List<Component> _children = new List<Component>();

    public void Add(Component component)
    {
        _children.Add(component);
    }

    public void Remove(Component component)
    {
        _children.Remove(component);
    }

    public override void Operation()
    {
        Console.WriteLine("Composite Operation");
        foreach (var child in _children)
        {
            child.Operation();
        }
    }
}

// Client code
class Program
{
    static void Main()
    {
        Composite root = new Composite();
        root.Add(new Leaf());
        root.Add(new Leaf());

        Composite subComposite = new Composite();
        subComposite.Add(new Leaf());
        root.Add(subComposite);

        root.Operation();
    }
}
```
**Usage:** Useful for representing hierarchical data structures like file systems, organizational structures, or UI components.

### 4. **Decorator Pattern**

**Purpose:** Adds behavior to an individual object, dynamically, without affecting the behavior of other objects from the same class.

**Example:**
```csharp
// Component
public abstract class Beverage
{
    public abstract string GetDescription();
    public abstract double Cost();
}

// ConcreteComponent
public class Espresso : Beverage
{
    public override string GetDescription() => "Espresso";
    public override double Cost() => 1.99;
}

// Decorator
public abstract class CondimentDecorator : Beverage
{
    protected Beverage _beverage;

    protected CondimentDecorator(Beverage beverage)
    {
        _beverage = beverage;
    }
}

// ConcreteDecorator
public class Milk : CondimentDecorator
{
    public Milk(Beverage beverage) : base(beverage) { }

    public override string GetDescription() => _beverage.GetDescription() + ", Milk";
    public override double Cost() => _beverage.Cost() + 0.50;
}

// Client code
class Program
{
    static void Main()
    {
        Beverage beverage = new Espresso();
        Console.WriteLine($"{beverage.GetDescription()} ${beverage.Cost()}");

        beverage = new Milk(beverage);
        Console.WriteLine($"{beverage.GetDescription()} ${beverage.Cost()}");
    }
}
```
**Usage:** Frequently used for adding responsibilities to objects, such as adding visual decorations (borders, scroll bars) in graphical user interfaces.

### 5. **Facade Pattern**

**Purpose:** Provides a simplified interface to a complex subsystem.

**Example:**
```csharp
// Subsystem classes
public class SubsystemA
{
    public void OperationA() => Console.WriteLine("Subsystem A Operation");
}

public class SubsystemB
{
    public void OperationB() => Console.WriteLine("Subsystem B Operation");
}

// Facade
public class Facade
{
    private readonly SubsystemA _subsystemA;
    private readonly SubsystemB _subsystemB;

    public Facade(SubsystemA subsystemA, SubsystemB subsystemB)
    {
        _subsystemA = subsystemA;
        _subsystemB = subsystemB;
    }

    public void Operation()
    {
        _subsystemA.OperationA();
        _subsystemB.OperationB();
    }
}

// Client code
class Program
{
    static void Main()
    {
        SubsystemA subsystemA = new SubsystemA();
        SubsystemB subsystemB = new SubsystemB();
        Facade facade = new Facade(subsystemA, subsystemB);
        facade.Operation();
    }
}
```
**Usage:** Useful when working with complex systems where a simplified interface can make interactions easier, like integrating a subsystem or a library.

### 6. **Flyweight Pattern**

**Purpose:** Reduces the cost of creating and manipulating a large number of similar objects by sharing common state among them.

**Example:**
```csharp
// Flyweight
public abstract class Flyweight
{
    public abstract void Operation(int extrinsicState);
}

// ConcreteFlyweight
public class ConcreteFlyweight : Flyweight
{
    public override void Operation(int extrinsicState)
    {
        Console.WriteLine($"ConcreteFlyweight: {extrinsicState}");
    }
}

// FlyweightFactory
public class FlyweightFactory
{
    private readonly Dictionary<string, Flyweight> _flyweights = new Dictionary<string, Flyweight>();

    public Flyweight GetFlyweight(string key)
    {
        if (!_flyweights.ContainsKey(key))
        {
            _flyweights[key] = new ConcreteFlyweight();
        }
        return _flyweights[key];
    }
}

// Client code
class Program
{
    static void Main()
    {
        FlyweightFactory factory = new FlyweightFactory();
        Flyweight flyweight1 = factory.GetFlyweight("A");
        Flyweight flyweight2 = factory.GetFlyweight("A");
        Flyweight flyweight3 = factory.GetFlyweight("B");

        flyweight1.Operation(1);
        flyweight2.Operation(2);
        flyweight3.Operation(3);
    }
}
```
**Usage:** Commonly used in applications like text editors, where character formatting data can be shared among many characters to save memory.

### 7. **Proxy Pattern**

**Purpose:** Provides a surrogate or placeholder for another object to control access to it.

**Example:**
```csharp
// Subject
public interface ISubject
{
    void Request();
}

// RealSubject
public class RealSubject : ISubject
{
    public void Request() => Console.WriteLine("RealSubject Request");
}

// Proxy
public class Proxy : ISubject
{
    private RealSubject _realSubject;

    public void Request()
    {
        if (_realSubject == null)
        {
            _realSubject = new RealSubject();
        }
        _realSubject.Request();
    }
}

// Client code
class Program
{
    static void Main()
    {
        ISubject subject = new Proxy();
        subject.Request();
    }
}
```
**Usage:** Suitable for scenarios such as lazy initialization, access control, logging, or caching, where you want to control access to a resource.

These structural patterns help in organizing code structure, managing dependencies, and ensuring that the system is easy to understand, extend, and maintain.





**Behavior**
