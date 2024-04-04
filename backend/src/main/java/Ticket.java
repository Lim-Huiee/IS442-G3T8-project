import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
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

    public Ticket getTicketbyID(Integer ticketID) {
        Ticket ticket = null;
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM ticket WHERE ticket_id = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, ticketID);
            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                int retrievedTicketID = resultSet.getInt("ticket_id");
                int retrievedOrderID = resultSet.getInt("order_id");
                int retrievedEventID = resultSet.getInt("event_id");
                String retrieveTicketStatus = resultSet.getString("status");

                ticket = new Ticket(retrievedTicketID, retrievedOrderID, retrievedEventID, retrieveTicketStatus);
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
        return ticket;
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

    public static ArrayList<Integer> getAllTicketIDsForEvent(int eventID) {
        ArrayList<Integer> ticketIDs = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT ticket_id FROM Ticket WHERE event_id=?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, eventID);
            resultSet = statement.executeQuery();

            // Loop through the result set and add ticket IDs to the list
            while (resultSet.next()) {
                ticketIDs.add(resultSet.getInt("ticket_id"));
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
        return ticketIDs;
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