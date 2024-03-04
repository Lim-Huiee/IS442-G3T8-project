import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DBConnection {
    private static String MYSQL_JDBC_DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";
    private static String MYSQL_DB_URL = "jdbc:mysql://localhost:3306/ticketmistress";
    private static String MYSQL_DB_USER = "root";
    private static String MYSQL_DB_USER_PASSWORD = "";

    private static Connection connection; // Declare the connection variable at the class level

    // Establish the database connection
    private static void establishConnection() throws ClassNotFoundException, SQLException {
        Class.forName(MYSQL_JDBC_DRIVER_CLASS);
        connection = DriverManager.getConnection(MYSQL_DB_URL, MYSQL_DB_USER, MYSQL_DB_USER_PASSWORD);
    }

    // Close the database connection
    private static void closeConnection() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static User dbGetUserById(int userId) {
        User user = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            establishConnection();

            String sqlQuery = "SELECT * FROM user WHERE user_id = ?";
            statement = connection.prepareStatement(sqlQuery);
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
                if (resultSet != null) resultSet.close();
                if (statement != null) statement.close();
                closeConnection();
            } catch (SQLException se) {
                se.printStackTrace();
            }
        }

        return user;
    }

    public static void main(String[] args) {
        try {
            establishConnection(); // Establish the connection

            // Usage example: retrieve user with ID 1
            User user = User.getUserByID(1);
            if (user != null) {
                System.out.println(user.toString());
            } else {
                System.out.println("User not found.");
}

            // Other method invocations
            // insertUser(newUser);
            // updateUser(existingUser);
            // deleteUser(userId);

            closeConnection(); // Close the connection
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        }
    }
}