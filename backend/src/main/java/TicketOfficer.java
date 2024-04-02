import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;
public class TicketOfficer extends User{
    public TicketOfficer(int userID, String name, String password, String email){
        super(userID, name, password, email);
    }
    // also has verify ticket validity, process on-site tickets and issue e ticket methods but idk what they do 
    public void takeAttendance(int eventID, ArrayList<Integer> attendedTicketIDS) {
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "UPDATE Ticket SET attended='yes' WHERE event_id=? AND ticket_id=?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            
            // Loop through the list of attended ticket IDs and update each one
            for (Integer ticketID : attendedTicketIDS) {
                statement.setInt(1, eventID);
                statement.setInt(2, ticketID);
                statement.executeUpdate();
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        } finally {
            try {
                if (statement != null) {
                    statement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
}
