import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class Refund {
    public static String processRefund(int ticketID, int userID) {
        try {
            DBConnection.establishConnection();
            // get ticket from ticket_id
            Ticket ticket = Ticket.getTicketbyID(ticketID);
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
                String updateQuery = "UPDATE user SET amount_avail = amount_avail + ? WHERE user_id = ?";
                DBConnection.establishConnection();
                PreparedStatement updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
                updateStatement.setDouble(1, refund_amount);
                updateStatement.setInt(2, userID);
                updateStatement.executeUpdate();
                updateStatement.close();
                // update ticket status to refunded in db
                ticket.cancelTickets(ticket.getTicketID());
                // check all tickets with same order_id, if all status is refunded, update
                int order_id = ticket.getOrderID();
                Order order = Order.getOrderByID(order_id);
                List<Ticket> tickets_in_order = order.getOrderTickets();
                boolean refund_flag = true;
                for (Ticket tick : tickets_in_order) {
                    if (!(tick.getTicketStatus().contains("refunded"))) {
                        refund_flag = false;
                    }
                }
                // order_id status to refunded, else do nothing
                if (refund_flag) {
                    updateStatement = null;
                    updateQuery = "UPDATE orders SET status = 'refunded' WHERE order_id = ?";
                    DBConnection.establishConnection();
                    updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
                    updateStatement.setInt(1, order_id);
                    updateStatement.executeUpdate();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
        return "Success";
    }

    public static String processRefundInOrder(int orderID, int userID) {
        try {
            Order refund_order = Order.getOrderByID(orderID);
            List<Ticket> tickets_in_order = refund_order.getOrderTickets();
            for (Ticket tick : tickets_in_order) {
                int ticketID = tick.getTicketID();
                String result = Refund.processRefund(ticketID, userID);
                System.out.println(String.valueOf(ticketID) + ": " + result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
        return "Success";
    }

    public static void main(String[] args) {
        // int userID = Integer.parseInt(req.params(":userID"));
        int userID = 1;
        // int ticketID = Integer.parseInt(req.params(":ticketID"));
        int ticketID = 1;
        String result = Refund.processRefund(1, 1);
        System.out.println(result);
    }

}
