public class Ticket{
    private Integer ticketID;
    private Integer cancellationFee;
    private Integer eventID;
    private Integer orderID;

    public Ticket(Integer eventID, Integer orderID, Integer ticketID) {
        this.eventID = eventID;
        this.ticketID = ticketID;
        this.orderID = orderID;
    }

    public Integer getTicketID() {
        return this.ticketID;
    }


}