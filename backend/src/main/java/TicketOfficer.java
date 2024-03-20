import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class TicketOfficer extends User{
    public TicketOfficer(int userID, String name, String password, String email){
        super(userID, name, password, email);
    }
    // also has verify ticket validity, process on-site tickets and issue e ticket methods but idk what they do 

    public int verifyTicket(int ticketID, int userID) {
        PreparedStatement queryStatement = null;
        ResultSet rs = null;

        try {
            DBConnection.establishConnection();
            String query = "SELECT * FROM ticket WHERE ticket_id = ?";
            queryStatement = DBConnection.getConnection().prepareStatement(query);
            queryStatement.setInt(1, ticketID);
            rs = queryStatement.executeQuery();

            if (rs.next()) {
                // ticket exists
                Ticket thisTicket = new Ticket(
                    rs.getInt("event_id"),
                    rs.getInt("order_id"),
                    rs.getInt("ticket_id"),
                    rs.getInt("cancellation_fee"),
                    rs.getString("status")
                );
                // System.out.println(thisTicket);

                Order thisOrder = Order.getOrderByID(thisTicket.getOrderID());
                
                int db_userID = thisOrder.getUserID();
                if (db_userID == userID) {
                    return 0; // valid and matches user
                }
            }

            queryStatement.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            DBConnection.closeConnection();
        }
        return -1;
    }

    public int processOnSiteTicketSale(int eventID, int numTickets) {
        Event thisEvent = Event.getEventByID(eventID);
        if (thisEvent.getTicketsAvailable() < numTickets) {
            return -1; // no tickets available
        }

        PreparedStatement statement = null;    
        int order_id;
            
        try {
            DBConnection.establishConnection(); // Establish database connection

            // hardcode ticket officer userid and status
            String sqlQuery = "INSERT INTO orders (user_id) " +
                    "VALUES (?)";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);

            statement.setInt(1, 5);

            // Execute the SQL statement
            int rowsAffected = statement.executeUpdate();

            // Close the statement
            statement.close();

            if (rowsAffected > 0) {
                System.out.println("Order created successfully.");

                // get order id from latest order
                PreparedStatement queryStatement = null;
                ResultSet rs = null;

                try {
                    DBConnection.establishConnection();
                    String query = "SELECT * FROM orders ORDER BY order_id DESC LIMIT 1;";
                    queryStatement = DBConnection.getConnection().prepareStatement(query);
                    rs = queryStatement.executeQuery();

                    if (rs.next()) {
                        order_id = rs.getInt("order_id");

                        for (int i=0;i<numTickets;i++) {
                            try {
                                DBConnection.establishConnection(); // Establish database connection
                    
                                // hardcode ticket officer userid and status
                                sqlQuery = "INSERT INTO ticket (event_id, order_id, status) " +
                                        "VALUES (?, ? , ?)";
                                        statement = DBConnection.getConnection().prepareStatement(sqlQuery);

                                statement.setInt(1, eventID);
                                statement.setInt(2, order_id);
                                statement.setString(3, "delivered");
                    
                                // Execute the SQL statement
                                rowsAffected = statement.executeUpdate();
                    
                                // Close the statement
                                statement.close();
                    
                                if (rowsAffected > 0) {
                                    System.out.println("Ticket created successfully.");
                                }
                            }
                            catch (SQLException | ClassNotFoundException e) {
                                e.printStackTrace();
                            }
                            finally {
                                DBConnection.closeConnection();
                            }
                        }

                    }
                }
                catch (SQLException | ClassNotFoundException e) {
                    e.printStackTrace();
                }
                finally {
                    DBConnection.closeConnection();
                }


            } else {
                System.out.println("Failed to create event.");
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            DBConnection.closeConnection(); // Close the database connection
        }

        return -1;
    }
}
