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
            // get cancellation fee from event to derive refund
            double cancellation_fee = event.getCancellationFee();
            double ticket_price = event.getTicketPrice();
            double refund_amount = ticket_price - cancellation_fee;
            // update user balance in db
            try {
                String updateQuery = "UPDATE user SET amount_avail = amount_avail + ? WHERE user_id = ?";
                PreparedStatement updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
                updateStatement.setDouble(1, refund_amount);
                updateStatement.setInt(2, userID);
                updateStatement.executeUpdate();
                updateStatement.close();
            } catch (SQLException se) {
                se.printStackTrace();
            }
            // update ticket status to refunded in db
            ticket.cancelTickets(ticket.getTicketID());
            // check all tickets with same order_id, if all status is refunded, update
            // order_id status to refunded, else do nothing
            // return success or fail
        }

    }
}
