import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.time.LocalDateTime;

public class DBConnection {
    private static String MYSQL_JDBC_DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";
    private static String MYSQL_DB_URL = "jdbc:mysql://localhost:3306/ticketmistress";
    private static String MYSQL_DB_USER = "root";
    private static String MYSQL_DB_USER_PASSWORD = "";

    private static Connection connection; // Declare the connection variable at the class level

    // Establish the database connection
    public static void establishConnection() throws ClassNotFoundException, SQLException {
        Class.forName(MYSQL_JDBC_DRIVER_CLASS);
        connection = DriverManager.getConnection(MYSQL_DB_URL, MYSQL_DB_USER, MYSQL_DB_USER_PASSWORD);
    }

    // Getter method to provide access to the connection
    public static Connection getConnection() {
        return connection;
    }

    // Close the database connection
    public static void closeConnection() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /* public static User dbGetUserById(int userId) {
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
    } */

    public static void main(String[] args) {

        /// ==================== Testing of User/TicketOfficer class =======================================
        try {
            // Usage example: retrieve user with ID 1
            User user = User.getUserByID(1);
            User customer = null;

            if (user != null) {
                System.out.println(user.toString());    // prints object
                System.out.println(user.getName()); // prints User 1
                System.out.println(user.getUserID());   // prints 1
                System.out.println(user.getPassword());  // prints password1
                System.out.println(user.getEmail());    // prints user1@abc

                customer = User.login("user 2","password2");        //customer login, returns object
                System.out.println(User.login("user 1","password2"));            // login fail, returns null because login() returns object

                System.out.println(User.login("ticket man","password5"));     // ticket officer  login, returns user object
                System.out.println(User.register("Dehou","pwpwpw","Dehou@gmail.com"));  // Register successfully if u run the first time. Else, username exists
                System.out.println(User.register("Dehouhehexd","asd","haha"));           // invalid email


                if(customer instanceof Customer){
                    Customer c = (Customer) customer;
                    System.out.println(c.getAmountAvail());          // class cast, testing getAmountAvail() for customer 
            }
                
            } else {
                System.out.println("User not found.");
            }
            // Other method invocations
            // insertUser(newUser);
            // updateUser(existingUser);
            // deleteUser(userId);

        } catch (Exception e) {
            e.printStackTrace();
        }
        // ====================== END OF TESTING USER CLASS ==================================
        // ======================== start testing of event manager class ====================
        User eventManager = null;
        try {
            eventManager=User.login("event man","password4");     // event manager login, returns user object

            if (eventManager != null){
                if(eventManager instanceof EventManager){
                    EventManager em = (EventManager) eventManager;
                    String eventType = "Concert";
                    String eventName = "Taylor Swift Concert";
                    String venue = "National Stadium";
                    LocalDateTime eventDateTime = LocalDateTime.of(2024, 12, 31, 20, 0); // Example datetime
                    int numTotalTickets = 1000;
                    int numTicketsAvailable = 1000;
                    String eventDetails = "A typical  Event";
                    int ticketPrice = 90;
                    String result = em.createEvent(eventType, eventName, venue, eventDateTime, numTotalTickets, numTicketsAvailable,eventDetails,ticketPrice);          
                    System.out.println(result);            //creates new event in DB, will print "event exists" if you run it a 2nd time
                }
            }

            if (eventManager instanceof EventManager){   // FOR TESTING ONLY/ can change to check instanceof Customer, it won't print "pass". 
                System.out.println("pass");            //Verifies access control, means customer wont access eventManager etc
            }
            
        } catch (Exception e){
            e.printStackTrace();
        }

        
        // =========================== END TESTING OF EVENT MANAGER CLASS====================

    }
}