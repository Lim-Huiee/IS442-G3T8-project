import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class TicketOfficer extends User {
    public TicketOfficer(int userID, String name, String password, String email){
        super(userID, name, password, email);
    }

    public String takeAttendance(int eventID, ArrayList<Integer> attendedTicketIDS, int userID) {
        PreparedStatement statement = null;
        try {
            DBConnection.establishConnection();
            String sqlQuery = "UPDATE Ticket SET attended='yes' WHERE event_id=? AND ticket_id=?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            
            int count = 0;
            // Loop through the list of attended ticket IDs and update each one
            for (Integer ticketID : attendedTicketIDS) {
                // verify each ticket first
                if (verifyTicket(ticketID, userID) == 0) {
                    statement.setInt(1, eventID);
                    statement.setInt(2, ticketID);
                    count += statement.executeUpdate();
                }
                else {
                    return "Ticket verification failed, either ticket does not exist, database check failed, or userID provided does not match the user in Order";
                }
            }
            return String.format("Verified and took attendance for %d tickets", count);
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
        } finally {
            try {
                if (statement != null) {
                    statement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return "Attendance taking failed";
    }
    
    public int verifyTicket (int ticketID, int userID) {
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
                    rs.getString("status")
                );
                // System.out.println(thisTicket);

                if (thisTicket.getTicketStatus() == "refunded") {
                    return -1;
                }

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

    // TODO: issue eticket
}
