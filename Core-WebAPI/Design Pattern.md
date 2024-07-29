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
Behavioral design patterns are concerned with algorithms and the assignment of responsibilities between objects. They help in coordinating complex interactions between objects, making the design more flexible and reusable. Below are the common behavioral design patterns along with C# examples:

### 1. **Chain of Responsibility Pattern**
Passes a request along a chain of handlers. Each handler either processes the request or passes it to the next handler.

**Example:**
```csharp
// Handler
public abstract class Handler
{
    protected Handler _nextHandler;

    public void SetNext(Handler handler)
    {
        _nextHandler = handler;
    }

    public abstract void HandleRequest(int request);
}

// Concrete Handlers
public class ConcreteHandler1 : Handler
{
    public override void HandleRequest(int request)
    {
        if (request >= 0 && request < 10)
        {
            Console.WriteLine($"{nameof(ConcreteHandler1)} handled request {request}");
        }
        else
        {
            _nextHandler?.HandleRequest(request);
        }
    }
}

public class ConcreteHandler2 : Handler
{
    public override void HandleRequest(int request)
    {
        if (request >= 10 && request < 20)
        {
            Console.WriteLine($"{nameof(ConcreteHandler2)} handled request {request}");
        }
        else
        {
            _nextHandler?.HandleRequest(request);
        }
    }
}

// Client code
class Program
{
    static void Main()
    {
        Handler handler1 = new ConcreteHandler1();
        Handler handler2 = new ConcreteHandler2();

        handler1.SetNext(handler2);

        int[] requests = { 5, 14, 22, 8 };

        foreach (var request in requests)
        {
            handler1.HandleRequest(request);
        }
    }
}
```

### 2. **Command Pattern**
Encapsulates a request as an object, thereby allowing for parameterization of clients with queues, requests, and operations.

**Example:**
```csharp
// Command
public interface ICommand
{
    void Execute();
}

// Concrete Command
public class LightOnCommand : ICommand
{
    private readonly Light _light;

    public LightOnCommand(Light light)
    {
        _light = light;
    }

    public void Execute()
    {
        _light.On();
    }
}

// Receiver
public class Light
{
    public void On() => Console.WriteLine("The light is on");
}

// Invoker
public class RemoteControl
{
    private ICommand _command;

    public void SetCommand(ICommand command)
    {
        _command = command;
    }

    public void PressButton()
    {
        _command.Execute();
    }
}

// Client code
class Program
{
    static void Main()
    {
        Light light = new Light();
        ICommand lightOn = new LightOnCommand(light);

        RemoteControl remote = new RemoteControl();
        remote.SetCommand(lightOn);
        remote.PressButton();
    }
}
```

### 3. **Interpreter Pattern**
Defines a representation for a grammar and provides an interpreter to deal with this grammar.

**Example:**
```csharp
// Context
public class Context
{
    public string Input { get; set; }
    public int Output { get; set; }
}

// Abstract Expression
public abstract class Expression
{
    public abstract void Interpret(Context context);
}

// Terminal Expression
public class NumberExpression : Expression
{
    private readonly int _number;

    public NumberExpression(int number)
    {
        _number = number;
    }

    public override void Interpret(Context context)
    {
        context.Output = _number;
    }
}

// Non-terminal Expression
public class AddExpression : Expression
{
    private readonly Expression _left;
    private readonly Expression _right;

    public AddExpression(Expression left, Expression right)
    {
        _left = left;
        _right = right;
    }

    public override void Interpret(Context context)
    {
        _left.Interpret(context);
        int leftResult = context.Output;

        _right.Interpret(context);
        int rightResult = context.Output;

        context.Output = leftResult + rightResult;
    }
}

// Client code
class Program
{
    static void Main()
    {
        Context context = new Context();
        Expression expression = new AddExpression(new NumberExpression(5), new NumberExpression(10));

        expression.Interpret(context);
        Console.WriteLine(context.Output); // Output: 15
    }
}
```

### 4. **Iterator Pattern**
Provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

**Example:**
```csharp
// Aggregate
public interface IIterableCollection
{
    IIterator CreateIterator();
}

// Concrete Aggregate
public class ConcreteCollection : IIterableCollection
{
    private readonly List<string> _items = new List<string>();

    public void AddItem(string item) => _items.Add(item);

    public IIterator CreateIterator() => new ConcreteIterator(this);

    public int Count => _items.Count;

    public string this[int index] => _items[index];
}

// Iterator
public interface IIterator
{
    bool HasNext();
    string Next();
}

// Concrete Iterator
public class ConcreteIterator : IIterator
{
    private readonly ConcreteCollection _collection;
    private int _index;

    public ConcreteIterator(ConcreteCollection collection)
    {
        _collection = collection;
    }

    public bool HasNext() => _index < _collection.Count;

    public string Next() => HasNext() ? _collection[_index++] : null;
}

// Client code
class Program
{
    static void Main()
    {
        ConcreteCollection collection = new ConcreteCollection();
        collection.AddItem("Item 1");
        collection.AddItem("Item 2");
        collection.AddItem("Item 3");

        IIterator iterator = collection.CreateIterator();
        while (iterator.HasNext())
        {
            Console.WriteLine(iterator.Next());
        }
    }
}
```

### 5. **Mediator Pattern**
Defines an object that encapsulates how a set of objects interact, promoting loose coupling by preventing objects from referring to each other explicitly.

**Example:**
```csharp
// Mediator
public interface IMediator
{
    void Notify(object sender, string ev);
}

// Concrete Mediator
public class ConcreteMediator : IMediator
{
    private Component1 _component1;
    private Component2 _component2;

    public ConcreteMediator(Component1 component1, Component2 component2)
    {
        _component1 = component1;
        _component1.SetMediator(this);
        _component2 = component2;
        _component2.SetMediator(this);
    }

    public void Notify(object sender, string ev)
    {
        if (ev == "A")
        {
            Console.WriteLine("Mediator reacts on A and triggers following operations:");
            _component2.DoC();
        }
        if (ev == "D")
        {
            Console.WriteLine("Mediator reacts on D and triggers following operations:");
            _component1.DoB();
        }
    }
}

// Base Component
public class BaseComponent
{
    protected IMediator _mediator;

    public void SetMediator(IMediator mediator)
    {
        _mediator = mediator;
    }
}

// Component1
public class Component1 : BaseComponent
{
    public void DoA()
    {
        Console.WriteLine("Component 1 does A.");
        _mediator.Notify(this, "A");
    }

    public void DoB()
    {
        Console.WriteLine("Component 1 does B.");
        _mediator.Notify(this, "B");
    }
}

// Component2
public class Component2 : BaseComponent
{
    public void DoC()
    {
        Console.WriteLine("Component 2 does C.");
        _mediator.Notify(this, "C");
    }

    public void DoD()
    {
        Console.WriteLine("Component 2 does D.");
        _mediator.Notify(this, "D");
    }
}

// Client code
class Program
{
    static void Main()
    {
        Component1 component1 = new Component1();
        Component2 component2 = new Component2();
        new ConcreteMediator(component1, component2);

        Console.WriteLine("Client triggers operation A.");
        component1.DoA();

        Console.WriteLine();

        Console.WriteLine("Client triggers operation D.");
        component2.DoD();
    }
}
```

### 6. **Memento Pattern**
Captures and externalizes an object's internal state, allowing it to be restored to this state later.

**Example:**
```csharp
// Memento
public class Memento
{
    public string State { get; }

    public Memento(string state)
    {
        State = state;
    }
}

// Originator
public class Originator
{
    public string State { get; set; }

    public Memento SaveState()
    {
        return new Memento(State);
    }

    public void RestoreState(Memento memento)
    {
        State = memento.State;
    }
}

// Caretaker
public class Caretaker
{
    private readonly List<Memento> _mementos = new List<Memento>();
    private readonly Originator _originator;

    public Caretaker(Originator originator)
    {
        _originator = originator;
    }

    public void Backup()
    {
        _mementos.Add(_originator.SaveState());
    }

    public void Undo()
    {
        if (_mementos.Count == 0) return;

        Memento memento = _mementos[^1];
        _mementos.RemoveAt(_mementos.Count - 1);
        _originator.RestoreState(memento);
    }
}

// Client code
class Program
{
    static void Main()
    {
        Originator originator = new Originator();
        Caretaker caretaker = new Caretaker(originator);

        originator.State = "State1";
        caretaker.Backup();

        originator.State = "State

2";
        caretaker.Backup();

        originator.State = "State3";
        caretaker.Backup();

        Console.WriteLine("Current State: " + originator.State);

        caretaker.Undo();
        Console.WriteLine("Restored State: " + originator.State);

        caretaker.Undo();
        Console.WriteLine("Restored State: " + originator.State);
    }
}
```

### 7. **Observer Pattern**
Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

**Example:**
```csharp
// Subject
public class Subject
{
    private readonly List<IObserver> _observers = new List<IObserver>();

    private int _state;
    public int State
    {
        get => _state;
        set
        {
            _state = value;
            Notify();
        }
    }

    public void Attach(IObserver observer)
    {
        _observers.Add(observer);
    }

    public void Detach(IObserver observer)
    {
        _observers.Remove(observer);
    }

    private void Notify()
    {
        foreach (var observer in _observers)
        {
            observer.Update();
        }
    }
}

// Observer
public interface IObserver
{
    void Update();
}

// Concrete Observer
public class ConcreteObserver : IObserver
{
    private readonly string _name;
    private readonly Subject _subject;

    public ConcreteObserver(string name, Subject subject)
    {
        _name = name;
        _subject = subject;
        _subject.Attach(this);
    }

    public void Update()
    {
        Console.WriteLine($"{_name} notified. New state: {_subject.State}");
    }
}

// Client code
class Program
{
    static void Main()
    {
        Subject subject = new Subject();

        var observer1 = new ConcreteObserver("Observer 1", subject);
        var observer2 = new ConcreteObserver("Observer 2", subject);

        subject.State = 1;
        subject.State = 2;
    }
}
```

### 8. **State Pattern**
Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.

**Example:**
```csharp
// State Interface
public interface IState
{
    void Handle(Context context);
}

// Concrete States
public class ConcreteStateA : IState
{
    public void Handle(Context context)
    {
        Console.WriteLine("Handling in State A");
        context.State = new ConcreteStateB();
    }
}

public class ConcreteStateB : IState
{
    public void Handle(Context context)
    {
        Console.WriteLine("Handling in State B");
        context.State = new ConcreteStateA();
    }
}

// Context
public class Context
{
    private IState _state;

    public Context(IState state)
    {
        State = state;
    }

    public IState State
    {
        get => _state;
        set
        {
            _state = value;
            Console.WriteLine($"State changed to {value.GetType().Name}");
        }
    }

    public void Request()
    {
        _state.Handle(this);
    }
}

// Client code
class Program
{
    static void Main()
    {
        Context context = new Context(new ConcreteStateA());

        context.Request();
        context.Request();
    }
}
```

### 9. **Strategy Pattern**
Defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it.

**Example:**
```csharp
// Strategy Interface
public interface IStrategy
{
    void Execute();
}

// Concrete Strategies
public class ConcreteStrategyA : IStrategy
{
    public void Execute()
    {
        Console.WriteLine("Strategy A Execution");
    }
}

public class ConcreteStrategyB : IStrategy
{
    public void Execute()
    {
        Console.WriteLine("Strategy B Execution");
    }
}

// Context
public class Context
{
    private IStrategy _strategy;

    public Context(IStrategy strategy)
    {
        _strategy = strategy;
    }

    public void SetStrategy(IStrategy strategy)
    {
        _strategy = strategy;
    }

    public void ExecuteStrategy()
    {
        _strategy.Execute();
    }
}

// Client code
class Program
{
    static void Main()
    {
        Context context = new Context(new ConcreteStrategyA());
        context.ExecuteStrategy();

        context.SetStrategy(new ConcreteStrategyB());
        context.ExecuteStrategy();
    }
}
```

### 10. **Template Method Pattern**
Defines the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.

**Example:**
```csharp
// Abstract Class
public abstract class AbstractClass
{
    public void TemplateMethod()
    {
        BaseOperation1();
        RequiredOperation1();
        BaseOperation2();
        RequiredOperation2();
    }

    protected void BaseOperation1()
    {
        Console.WriteLine("Base operation 1");
    }

    protected void BaseOperation2()
    {
        Console.WriteLine("Base operation 2");
    }

    protected abstract void RequiredOperation1();
    protected abstract void RequiredOperation2();
}

// Concrete Class
public class ConcreteClass : AbstractClass
{
    protected override void RequiredOperation1()
    {
        Console.WriteLine("Concrete operation 1");
    }

    protected override void RequiredOperation2()
    {
        Console.WriteLine("Concrete operation 2");
    }
}

// Client code
class Program
{
    static void Main()
    {
        AbstractClass abstractClass = new ConcreteClass();
        abstractClass.TemplateMethod();
    }
}
```

### 11. **Visitor Pattern**
Represents an operation to be performed on the elements of an object structure. It lets you define a new operation without changing the classes of the elements on which it operates.

**Example:**
```csharp
// Visitor Interface
public interface IVisitor
{
    void VisitElementA(ElementA elementA);
    void VisitElementB(ElementB elementB);
}

// Concrete Visitor
public class ConcreteVisitor : IVisitor
{
    public void VisitElementA(ElementA elementA)
    {
        Console.WriteLine("Visited Element A");
    }

    public void VisitElementB(ElementB elementB)
    {
        Console.WriteLine("Visited Element B");
    }
}

// Element Interface
public interface IElement
{
    void Accept(IVisitor visitor);
}

// Concrete Elements
public class ElementA : IElement
{
    public void Accept(IVisitor visitor)
    {
        visitor.VisitElementA(this);
    }
}

public class ElementB : IElement
{
    public void Accept(IVisitor visitor)
    {
        visitor.VisitElementB(this);
    }
}

// Client code
class Program
{
    static void Main()
    {
        List<IElement> elements = new List<IElement>
        {
            new ElementA(),
            new ElementB()
        };

        IVisitor visitor = new ConcreteVisitor();
        foreach (var element in elements)
        {
            element.Accept(visitor);
        }
    }
}
```

These examples provide a basic overview and implementation of each behavioral design pattern in C#. For each pattern, the code demonstrates the pattern's intent and how it can be applied in a C# application.