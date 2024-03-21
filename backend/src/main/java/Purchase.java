
public class Purchase {
    private double price;
    private int quantity;
    private String eventName;
    private String eventDetails;

    public Purchase(double price, int quantity, String eventName, String eventDetails) {
        this.price = price;
        this.quantity = quantity;
        this.eventName = eventName;
        this.eventDetails = eventDetails;
    }

    public double getPrice() {
        return this.price;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public String getEventName() {
        return this.eventName;
    }

    public String getEventDetails() {
        return this.eventDetails;
    }
}
