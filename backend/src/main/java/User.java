import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    public static ArrayList<User> getUsersByRole(String roleName) {
        ArrayList<User> userList = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM user WHERE role = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setString(1, roleName);
            resultSet = statement.executeQuery();
    
            while (resultSet.next()) {
                int userID = resultSet.getInt("user_id");
                String name = resultSet.getString("name");
                String password = resultSet.getString("password");
                String email = resultSet.getString("email");
                User user = new User(userID, name, password, email);
                userList.add(user);
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
        return userList;
    }
    
    public static User login(String passedEmail, String password) {
        ResultSet resultSet = null;
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT * FROM user WHERE email = ? AND password = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setString(1, passedEmail);
            statement.setString(2, password);
            resultSet = statement.executeQuery();
    
            if (resultSet.next()) {
                int userID = resultSet.getInt("user_id");
                String userName = resultSet.getString("name");
                String userEmail = resultSet.getString("email");
                String userPassword = resultSet.getString("password");
                String role = resultSet.getString("role");
                Double amount_avail = resultSet.getDouble("amount_avail");
    
                if ("ticketing officer".equals(role)) {
                    // If the role is "ticketing officer", return a TicketOfficer object
                    // Additional attributes specific to TicketOfficer may need to be retrieved
                    return new TicketOfficer(userID, userName, userPassword, userEmail);
                } else if ("event manager".equals(role)) {
                    return new EventManager(userID, userName, userPassword, userEmail);
                } else {
                    // Otherwise, return a Customer object
                    return new Customer(userID, userName, userPassword, userEmail, amount_avail);
                }
            } else {
                // No matching user found
                return null;
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return null;
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
    
    public static String register(String name, String password, String email) {
        PreparedStatement checkStatement = null;
        ResultSet checkResultSet = null;
        PreparedStatement insertStatement = null;

        try {
            // Check if the email already exists
            DBConnection.establishConnection();
            String checkQuery = "SELECT * FROM user WHERE email = ?";
            checkStatement = DBConnection.getConnection().prepareStatement(checkQuery);
            checkStatement.setString(1, email);  // sets to first parameter of register(), which is name
            checkResultSet = checkStatement.executeQuery();

            if (checkResultSet.next()) {
                // Username already exists
                return "Email already exists. Please choose a different one.";
            } else {
                // Check if the email is valid
                if (!isValidEmail(email)) {
                    return "Invalid email format. Please enter a valid email address.";
                }
                // Username is available, proceed with registration
                // Insert the new user into the database, init.sql already specified default amount to be 1000, role to be default customer
                String insertQuery = "INSERT INTO user (name, password, email) VALUES (?, ?, ?)";
                insertStatement = DBConnection.getConnection().prepareStatement(insertQuery);
                insertStatement.setString(1, name);
                insertStatement.setString(2, password);
                insertStatement.setString(3, email);
                insertStatement.executeUpdate();

                return "Registered successfully!";
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "An error occurred while attempting to register.";
        } finally {
            try {
                if (checkResultSet != null) {
                    checkResultSet.close();
                }
                if (checkStatement != null) {
                    checkStatement.close();
                }
                if (insertStatement != null) {
                    insertStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public static boolean updateUserDetails(int userId, String newName, String newPassword, String newEmail) {
        try {
            DBConnection.establishConnection();
            String updateQuery = "UPDATE user SET name = ?, password = ?, email = ? WHERE user_id = ?";
            PreparedStatement updateStatement = DBConnection.getConnection().prepareStatement(updateQuery);
            updateStatement.setString(1, newName);
            updateStatement.setString(2, newPassword);
            updateStatement.setString(3, newEmail);
            updateStatement.setInt(4, userId);
            int rowsAffected = updateStatement.executeUpdate();
            updateStatement.close();
            DBConnection.closeConnection();

            return rowsAffected > 0;
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return false;
        }
    }

    public static boolean isValidEmail(String email) {
        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
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
