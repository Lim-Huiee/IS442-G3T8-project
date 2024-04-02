import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Customer extends User{
    // private ArrayList<Booking> bookings;  need to implement bookings class first
    private double amountAvail;
    
    public Customer(int userID, String name, String password, String email){
        super(userID, name, password, email);
        retrieveAmountAvailFromDB(userID);
    }

    public Customer(int userID, String name, String password, String email, double amountAvail){
        super(userID, name, password, email);
        this.amountAvail = amountAvail;
    }
    public double getAmountAvail(){
        return amountAvail;
    }

    public void setAmountAvail(double amountAvail){
        this.amountAvail = amountAvail;
        this.updateAmountAvailInDB(this.getUserID(), amountAvail);
    }

    public static boolean updateAmountAvailInDB(int userId, double newAmountAvail) {
        boolean success = false;
        try {
            DBConnection.establishConnection();
            String updateQuery = "UPDATE user SET amount_avail = ? WHERE user_id = ?";
            PreparedStatement updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
            updateStatement.setDouble(1, newAmountAvail);
            updateStatement.setInt(2, userId);
            int rowsAffected = updateStatement.executeUpdate();
            updateStatement.close();
            DBConnection.closeConnection();

            if (rowsAffected > 0) {
                success = true;
            } else {
                System.out.println("No user found with ID " + userId);
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        }
        return success;
    }

    public static double retrieveAmountAvailFromDB(int userId) {
        double amountAvail = 0.0;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT amount_avail FROM user WHERE user_id = ?";
            PreparedStatement statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, userId);
            ResultSet resultSet = statement.executeQuery();
            
            if(resultSet.next()) {
                amountAvail = resultSet.getDouble("amount_avail");
            }
            
            resultSet.close();
            statement.close();
            DBConnection.closeConnection();
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        }
        return amountAvail;
    }


    /* public ArrayList<Booking> getBookingList(){        ========== do only after bookings class is implemented========
        return 
    } */

    /* public void setAmountAvail(){            ====== will  do next time, prolly take in some args========
        this.amountAvail = amountAvail;
    } */
}
