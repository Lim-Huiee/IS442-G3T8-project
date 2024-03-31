import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Customer extends User{
    // private ArrayList<Booking> bookings;  need to implement bookings class first
    private double amountAvail;
    
    public Customer(int userID, String name, String password, String email){
        super(userID, name, password, email);
        retrieveAmountAvailFromDB();
    }

    public Customer(int userID, String name, String password, String email, double amountAvail){
        super(userID, name, password, email);
        this.amountAvail = amountAvail;
    }
    public double getAmountAvail(){
        retrieveAmountAvailFromDB();
        return amountAvail;
    }

    public void setAmountAvail(double amountAvail){
        this.amountAvail = amountAvail;
        this.updateAmountAvailInDB(amountAvail);
    }

    public void updateAmountAvailInDB(double newAmountAvail) {
        try {
            DBConnection.establishConnection();
            String updateQuery = "UPDATE user SET amount_avail = ? WHERE user_id = ?";
            PreparedStatement updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
            updateStatement.setDouble(1, newAmountAvail);
            updateStatement.setInt(2, this.getUserID());
            int rowsAffected = updateStatement.executeUpdate();
            updateStatement.close();
            DBConnection.closeConnection();

            if (rowsAffected == 0) {
                System.out.println("No user found with ID " + this.getUserID());
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        }
    }

    public void retrieveAmountAvailFromDB() {
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT amount_avail FROM user WHERE user_id = ?";
            PreparedStatement statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, this.getUserID()); // Assuming user_id is the primary key
            ResultSet resultSet = statement.executeQuery();
            
            if(resultSet.next()) {
                this.setAmountAvail(resultSet.getDouble("amount_avail"));
            }
            
            resultSet.close();
            statement.close();
            DBConnection.closeConnection();
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        }
    }


    /* public ArrayList<Booking> getBookingList(){        ========== do only after bookings class is implemented========
        return 
    } */

    /* public void setAmountAvail(){            ====== will  do next time, prolly take in some args========
        this.amountAvail = amountAvail;
    } */
}
