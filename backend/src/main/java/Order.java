import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.sql.Statement;

public class Order{
    private int userID;
    private int orderID;
    private int cancellationFee;   //for one tix
    private double totalPrice;
    private Map<Integer, Integer> eventsBooked; 

    // Map is "1:2" , 1 stands for event id, 2 stands for number of tix
    public Order(int userID, int orderID, Map<Integer, Integer> eventsBooked, double totalPrice, int cancellationFee ) {
        this.userID = userID;
        this.orderID = orderID;
        this.eventsBooked = eventsBooked;
        this.totalPrice=totalPrice;
        this.cancellationFee = cancellationFee;
    }

    
    public static int createOrder(Map<Integer, Integer> eventsBooked, int userID){       
        PreparedStatement insertStatement = null;
        ResultSet generatedKeys = null;
        try {
            // Check if the email already exists
            DBConnection.establishConnection();
            
            String insertQuery = "INSERT INTO orders (user_id, status) VALUES (?, ?)";
            insertStatement = DBConnection.getConnection().prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
            insertStatement.setInt(1, userID);
            insertStatement.setString(2, "delivered");
            insertStatement.executeUpdate();
            
            // Retrieve the generated key (order ID)
            generatedKeys = insertStatement.getGeneratedKeys();
            if (generatedKeys.next()) {
                int orderId = generatedKeys.getInt(1);
                return orderId; // Return the order ID as a string
            } else {
                // Handle if no generated key is found
                return -1;
            }
            
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            // Handle exception, maybe return an error message
            return -1;
            
        } finally {
            try {
                // Close result set, statement, and database connection
                if (generatedKeys != null) {
                    generatedKeys.close();
                }
                if (insertStatement != null) {
                    insertStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
                // Handle exception, maybe log it
            }
        }
    }

    
    public static String checkOutOrder(Map<Integer, Integer> eventsBooked, int orderID){  // 1,1  and 1,2   event id and num tix
        PreparedStatement insertStatement = null;
        try {
            // Check if the email already exists
            DBConnection.establishConnection();
            
            String insertQuery = "INSERT INTO ticket (ticket_id,event_id,order_id,cancellation_fee) VALUES (?,?)";
            insertStatement = DBConnection.getConnection().prepareStatement(insertQuery);
            insertStatement.setInt(1, orderID);
            insertStatement.setString(2, "delivered");
            insertStatement.executeUpdate();
            
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            
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



    public static String updateCancellationFee(int updatedCancellationFee){   //shud be set cancellationfee???
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


    public int getCancellationFee(){
        return cancellationFee;
    }

    /* private void setCancellationFee(int newCancellationFee){
        this.cancellationFee = newCancellationFee;
    } */

    public int getUserIDOfOrder(){
        return 0;
    }
}