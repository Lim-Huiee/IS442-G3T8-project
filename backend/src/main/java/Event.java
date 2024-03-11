import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.sql.Timestamp; 

public class Event {
    private int eventID;
    private String eventType;
    private String eventName;
    private String venue;
    private LocalDateTime eventDateTime; 
    private int numTotalTickets;
    private int numTicketsAvailable;
    private String eventDetails;
    private int ticketPrice;   
    
    // with event ID 
    public Event(int eventID,String eventType, String eventName, String venue, LocalDateTime eventDateTime,int numTotalTickets, int numTicketsAvailable, String eventDetails, int ticketPrice){
        this.eventID = eventID;
        this.eventType=eventType;
        this.eventName=eventName;
        this.venue=venue;
        this.eventDateTime=eventDateTime;
        this.numTotalTickets=numTotalTickets;
        this.numTicketsAvailable=numTicketsAvailable;
        this.eventDetails =eventDetails;
        this.ticketPrice=ticketPrice;
    }
    
    public int getEventID(){
        return eventID;
    }
    public String getEventType(){
        return eventType;
    }
    public String getEventName(){
        return eventName;
    }
    public String getVenue(){
        return venue;
    }
    public LocalDateTime getEventDateTime(){
        return eventDateTime;
    }
    public int getTotalTickets(){
        return numTotalTickets;
    }
    public int getTicketsAvailable(){
        return numTicketsAvailable;
    }
    public String getEventDetails(){
        return eventDetails;
    }
    public int getTicketPrice(){
        return ticketPrice;
    }
 
    public static Event getEventByID(int searchEventID) {
        Event event = null;
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM event WHERE event_id = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, searchEventID);
            resultSet = statement.executeQuery();
    
            if (resultSet.next()) {
                int retrievedEventID = resultSet.getInt("event_id");
                String retrieveEventType = resultSet.getString("event_type");
                String retrieveEventName = resultSet.getString("event_name");
                String retrieveVenue = resultSet.getString("venue");

                
                Timestamp timestamp = resultSet.getTimestamp("datetime");
                LocalDateTime retrieveEventDateTime = timestamp.toLocalDateTime();

                int retrieveNumTotalTickets = resultSet.getInt("total_tickets");
                int retrieveNumTicketsAvailable = resultSet.getInt("num_tickets_avail");               
                String retrieveEventDetails = resultSet.getString("event_details");
                int retrieveTicketPrice = resultSet.getInt("price");

                
                event = new Event(retrievedEventID, retrieveEventType, retrieveEventName, retrieveVenue,retrieveEventDateTime,retrieveNumTotalTickets,retrieveNumTicketsAvailable,retrieveEventDetails,retrieveTicketPrice);
            }  
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        } finally {
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
                if (statement != null) {
                    statement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return event;
    }


}
