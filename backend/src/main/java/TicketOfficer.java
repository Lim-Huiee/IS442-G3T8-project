import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;

public class TicketOfficer extends User{
    public TicketOfficer(int userID, String name, String password, String email){
        super(userID, name, password, email);
    }
    // also has verify ticket validity, process on-site tickets and issue e ticket methods but idk what they do 

    public int verifyTicket(int ticketID, int userID) {
        PreparedStatement queryStatement = null;
        ResultSet rs = null;

        try {
            DBConnection.establishConnection();
            String query = "SELECT * FROM ticket WHERE ticket_id = ?";
            queryStatement = DBConnection.getConnection().prepareStatement(query);
            queryStatement.setInt(1, ticketID);
            rs = queryStatement.executeQuery();

            if (rs.next()) {
                // ticket exists
                Ticket thisTicket = new Ticket(
                    rs.getInt("event_id"),
                    rs.getInt("order_id"),
                    rs.getInt("ticket_id"),
                    rs.getInt("cancellation_fee"),
                    rs.getString("status")
                );
                // System.out.println(thisTicket);

                DBConnection.establishConnection();
                query = "SELECT * FROM orders WHERE order_id = ?";
                queryStatement = DBConnection.getConnection().prepareStatement(query);
                queryStatement.setInt(1, thisTicket.getOrderID());
                rs = queryStatement.executeQuery();

                if (rs.next()) {
                    int db_userID = rs.getInt("user_id");
                    if (db_userID == userID) {
                        return 0; // valid and matches user
                    }
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return -1;
    }
}
