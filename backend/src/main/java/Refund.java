import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Refund {
    public void processRefund(Ticket ticket, int userID) {
        // get event_id from ticket
        int event_id = ticket.getEventID();
        // add to tickets remaining in event in db
        Event event = Event.getEventByID(event_id);
        int prev_num_tickets_avail = event.getTicketsAvailable();
        prev_num_tickets_avail += 1;
        String result = event.setNumTicketsAvailable(prev_num_tickets_avail);

        if (result.contains("Success")) {
            // get cancellation fee from ticket db to derive refund
            // update user balance in db
            // update ticket status to refunded in db
            // check all tickets with same order_id, if all status is refunded, update
            // order_id status to refunded, else do nothing
            // return success or fail
        }

    }
}
