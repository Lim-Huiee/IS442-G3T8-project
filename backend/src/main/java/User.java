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
    try {
        DBConnection.establishConnection();
        String sqlQuery = "SELECT * FROM user WHERE user_id = ?";
        PreparedStatement statement = DBConnection.getConnection().prepareStatement(sqlQuery);
        statement.setInt(1, userId);
        ResultSet resultSet = statement.executeQuery();

        User user = null;
        if (resultSet.next()) {
            int userID = resultSet.getInt("user_id");
            String name = resultSet.getString("name");
            String password = resultSet.getString("password");
            String email = resultSet.getString("email");
            user = new User(userID, name, password, email);
        }

        resultSet.close();
        statement.close();
        DBConnection.closeConnection();

        return user;
    } catch (SQLException | ClassNotFoundException se) {
        se.printStackTrace();
        return null;
    }
}

    public String login(String name, String password){
        return "Login Successful!!"; // will probably need to direct to DBConnection.login()
    }

    public String register(String name, String password){
        return "Registered!";   /// will probably need to direct to DBConnection.register()
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
