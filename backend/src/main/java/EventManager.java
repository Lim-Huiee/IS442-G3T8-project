import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

public class EventManager extends User{
    public EventManager(int userID, String name, String password, String email){
        super(userID, name, password, email);
    }

    public String createEvent(String eventType, String eventName, String venue, LocalDateTime  dateTime, int numTotalTickets, int numTicketsAvailable, String eventDetails,int ticketPrice) {
        PreparedStatement statement = null;    
        ResultSet resultSet = null;
            
        try {
            DBConnection.establishConnection(); // Establish database connection
            // Prepare SQL statement for inserting new event

            if (numTotalTickets>numTicketsAvailable){
                return "Number of Total Tickets cannot be less than number of tickets available!";
            }
            String checkQuery = "SELECT COUNT(*) FROM event WHERE event_name = ? AND datetime = ?";
            statement = DBConnection.getConnection().prepareStatement(checkQuery);
            statement.setString(1, eventName);
            statement.setObject(2, dateTime);

            resultSet = statement.executeQuery();
            resultSet.next();
            int count = resultSet.getInt(1);

            if (count > 0) {
                return "Event already exists.";
            }

            String sqlQuery = "INSERT INTO event (event_type, event_name, venue, datetime, total_tickets, num_tickets_avail,event_details,price) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    statement = DBConnection.getConnection().prepareStatement(sqlQuery);

            // Set parameters for the SQL statement
            statement.setString(1, eventType);
            statement.setString(2, eventName);
            statement.setString(3, venue);
            statement.setObject(4, dateTime); // Use setObject to set LocalDateTime
            statement.setInt(5, numTotalTickets);
            statement.setInt(6, numTicketsAvailable);
            statement.setString(7, eventDetails);
            statement.setInt(8, ticketPrice);


            // Execute the SQL statement
            int rowsAffected = statement.executeUpdate();

            // Close the statement
            statement.close();

            if (rowsAffected > 0) {
                return "Event created successfully.";
            } else {
                return "Failed to create event.";
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return "Failed to create event.";
        } finally {
            DBConnection.closeConnection(); // Close the database connection
        }
    }
    public String updateEvent(int eventID, String eventType,String eventName, String venue, LocalDateTime dateTime, int numTotalTickets, int numTicketsAvailable, String eventDetails, int ticketPrice) {
        PreparedStatement statement = null;

        try {
            DBConnection.establishConnection(); // Establish database connection

            String sqlQuery = "UPDATE event SET event_type=?,event_name=?, venue=?, datetime=?, total_tickets=?, num_tickets_avail=?, event_details=?, price=? WHERE event_id=?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);

            // Set parameters for the SQL statement, position of ? above corresponds with index below
            statement.setString(1, eventType);
            statement.setString(2, eventName);
            statement.setString(3, venue);
            statement.setObject(4, dateTime);
            statement.setInt(5, numTotalTickets);
            statement.setInt(6, numTicketsAvailable);
            statement.setString(7, eventDetails);
            statement.setInt(8, ticketPrice);
            statement.setInt(9, eventID); 
        
            // Asks SQL to execute statement
            statement.executeUpdate();
            // Close the statement
            statement.close();
            return "Event updated successfully!";
            
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return "Failed to update event.";
        } finally {
            DBConnection.closeConnection(); // Close the database connection
        }
    }
    
    public String deleteEvent(int eventID) {
        PreparedStatement statement = null;
    
        try {
            DBConnection.establishConnection(); // Establish database connection
    
            String sqlQuery = "DELETE FROM event WHERE event_id=?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
    
            // Set parameter for the SQL statement
            statement.setInt(1, eventID);
    
            // Execute the SQL statement
            int rowsAffected = statement.executeUpdate();
    
            // Close the statement
            statement.close();
    
            if (rowsAffected > 0) {
                return "Event deleted successfully.";
            } else {
                return "No event found with the given ID.";
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return "Failed to delete event.";
        } finally {
            DBConnection.closeConnection(); // Close the database connection
        }
    }

    public String viewSaleStatistics(){
        return "";
    }
    public String addTicketingOfficer(){
        return "";
    }
}
