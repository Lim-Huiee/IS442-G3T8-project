import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Ticket {
    private Integer ticketID;
    private Integer cancellationFee;
    private Integer eventID;
    private Integer orderID;
    private String ticketStatus;

    public Ticket(Integer eventID, Integer orderID, Integer ticketID, Integer cancellationFee, String ticketStatus) {
        this.eventID = eventID;
        this.orderID = orderID;
        this.ticketID = ticketID;
        this.cancellationFee = cancellationFee;
        this.ticketStatus = ticketStatus;
    }

    public Integer getTicketID() {
        return ticketID;
    }

    public Integer getCancellationFee() {
        return cancellationFee;
    }

    public Integer getEventID() {
        return eventID;
    }

    public Integer getOrderID() {
        return orderID;
    }

    public String getTicketStatus(){
        return ticketStatus;
    }

    public void setCancellationFee(Integer newCancellationFee) {
        this.cancellationFee = newCancellationFee;
    }

    public void cancelTicket(int ticketID) {
        PreparedStatement updateStatement = null;
        try {
            DBConnection.establishConnection();
            String updateQuery = "UPDATE ticket SET status = 'refunded' WHERE ticketID = ?";
            updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
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


    public static String updateCancellationFee(int updatedCancellationFee){   //maybe shud be in eventManager
        PreparedStatement insertStatement = null;
        try {
            DBConnection.establishConnection();
            
            String insertQuery = "Update ticket SET cancellation_fee= ?";
            insertStatement = DBConnection.getConnection().prepareStatement(insertQuery);
            insertStatement.setInt(1, updatedCancellationFee);
            
            insertStatement.executeUpdate();
            
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "Error occurred while updating cancellation fee: " + se.getMessage();
            
        } finally {
            try {
                if (insertStatement != null) {
                    insertStatement.close();
                }
                DBConnection.closeConnection();
                return "";
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return "success";
    }

}
