import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Ticket {
    private Integer ticketID;
    private Integer eventID;
    private Integer orderID;
    private String ticketStatus;

    public Ticket(Integer eventID, Integer orderID, Integer ticketID, String ticketStatus) {
        this.eventID = eventID;
        this.orderID = orderID;
        this.ticketID = ticketID;
        this.ticketStatus = ticketStatus;
    }

    public Integer getTicketID() {
        return ticketID;
    }

    public Integer getEventID() {
        return eventID;
    }

    public Integer getOrderID() {
        return orderID;
    }

    public String getTicketStatus() {
        return ticketStatus;
    }

    public void cancelTickets(Integer ticketID) {
        PreparedStatement updateStatement = null;
        try {
            DBConnection.establishConnection();
            String updateQuery = "UPDATE ticket SET status = 'refunded' WHERE ticket_id = ?";
            updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);

            // Update statement
            updateStatement.setInt(1, ticketID);
            updateStatement.executeUpdate();
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        } finally {
            try {
                if (updateStatement != null) {
                    updateStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public static void cancelTickets(List<Integer> ticketIDs) {
        PreparedStatement updateStatement = null;
        try {
            DBConnection.establishConnection();
            String updateQuery = "UPDATE ticket SET status = 'refunded' WHERE ticket_id = ?";
            updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);

            // Iterate over the list of ticket IDs
            for (Integer ticketID : ticketIDs) {
                updateStatement.setInt(1, ticketID);
                updateStatement.executeUpdate();
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        } finally {
            try {
                if (updateStatement != null) {
                    updateStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
