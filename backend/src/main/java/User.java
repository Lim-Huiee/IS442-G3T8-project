import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class User {
    private String name;
    private String password;
    private int userID;
    private String email;

    public User(int userID, String name, String password, String email){
        this.name = name;
        this.password = password;
        this.userID = userID;
        this.email = email;
    }

    // Getters and setters for userID, name, password, and email
    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static User getUserByID(int userId) {
        User user = null;
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM user WHERE user_id = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, userId);
            resultSet = statement.executeQuery();
    
            if (resultSet.next()) {
                int userID = resultSet.getInt("user_id");
                String name = resultSet.getString("name");
                String password = resultSet.getString("password");
                String email = resultSet.getString("email");
                user = new User(userID, name, password, email);
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
        return user;
    }
    
    public static String login(String name, String password){
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM user WHERE name = ? AND password = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setString(1, name);
            statement.setString(2, password);
            resultSet = statement.executeQuery();
    
            if (resultSet.next()) {
                // Credentials match, login successful
                return "Login Successful!!";
            } else {
                // No matching user found
                return "Invalid credentials. Please try again.";
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "An error occurred while attempting to log in.";
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
    }
    

    public String register(String name, String password){
        return "Registered!";   /// use DBConnection to check against users table for existing credentials, create new credentials
    }


    // toString method to represent User object as string
    @Override
    public String toString() {
        return "User{" +
                "userID=" + userID +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                '}';    
    }
}
