public class Ticket{
    private Integer ticketID;
    private Integer numAccompanyingGuests;
    private Integer cancellationFee;
    private Integer eventID;
    private Integer bookingID;

    public Ticket(Integer eventID, Integer bookingID, Integer ticketID, Integer numAccompanyingGuests) {
        this.ticketID = ticketID;
        this.numAccompanyingGuests = numAccompanyingGuests;
    }

    public Integer getTicketID() {
        return this.ticketID;
    }

    public Integer getNumAccompanyingGuests() {
        return this.numAccompanyingGuests;
    }

    public int setNumAccompanyingGuests(Integer guests) {
        this.numAccompanyingGuests = guests;
        // if database is successfully updated, return 0
        // if failed, return -1
        return 0;
    }

    public void createTicket(){

    }


}