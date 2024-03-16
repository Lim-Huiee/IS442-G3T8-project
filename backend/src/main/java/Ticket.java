public class Ticket {
    private Integer ticketID;
    private Integer cancellationFee;
    private Integer eventID;
    private Integer orderID;

    public Ticket(Integer eventID, Integer orderID, Integer ticketID) {
        this.eventID = eventID;
        this.orderID = orderID;
        this.ticketID = ticketID;
    }

    public Integer getTicketID() {
        return ticketID;
    }

    public Integer getCancellationFee() {
        return cancellationFee;
    }

    public Integer getEventID() {
        return eventID;
    }

    public Integer getOrderID() {
        return orderID;
    }

    public void setCancellationFee(Integer cancellationFee) {
        this.cancellationFee = cancellationFee;
    }
}
