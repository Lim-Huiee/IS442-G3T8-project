import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EventManager extends User{
    private static String addTicketOfficerRole = "ticketing officer";
    private static int amountAvail = 0;

    public EventManager(int userID, String name, String password, String email){
        super(userID, name, password, email);
    }

    public static String createEvent(String eventType, String eventName, String venue, LocalDateTime  dateTime, int numTotalTickets, int numTicketsAvailable, String eventDetails,double ticketPrice, double cancellation_fee) {
        PreparedStatement statement = null;    
        ResultSet resultSet = null;
            
        try {
            DBConnection.establishConnection(); // Establish database connection
            // Prepare SQL statement for inserting new event

            if (numTicketsAvailable>numTotalTickets){
                return "Number of Total Tickets cannot be less than number of tickets available!";
            } else {
                String checkQuery = "SELECT COUNT(*) FROM event WHERE event_name = ? AND datetime = ?";
                statement = DBConnection.getConnection().prepareStatement(checkQuery);
                statement.setString(1, eventName);
                statement.setObject(2, dateTime);
    
                resultSet = statement.executeQuery();
                resultSet.next();
                int count = resultSet.getInt(1);
    
                if (count > 0) {
                    return "Event already exists.";
                }
    
                String sqlQuery = "INSERT INTO event (event_type, event_name, venue, datetime, total_tickets, num_tickets_avail, event_details, price, cancellation_fee) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        statement = DBConnection.getConnection().prepareStatement(sqlQuery);
    
                // Set parameters for the SQL statement
                statement.setString(1, eventType);
                statement.setString(2, eventName);
                statement.setString(3, venue);
                statement.setObject(4, dateTime); // Use setObject to set LocalDateTime
                statement.setInt(5, numTotalTickets);
                statement.setInt(6, numTicketsAvailable);
                statement.setString(7, eventDetails);
                statement.setDouble(8, ticketPrice);
                statement.setDouble(9, cancellation_fee);
    
                // Execute the SQL statement
                int rowsAffected = statement.executeUpdate();
    
                // Close the statement
                statement.close();
    
                if (rowsAffected > 0) {
                    return "Event created successfully.";
                } else {
                    return "Failed to create event.";
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return "Failed to create event.";
        } finally {
            DBConnection.closeConnection(); // Close the database connection
        }
    }

    public static String updateEvent(int eventID, String eventType,String eventName, String venue, LocalDateTime dateTime, int numTotalTickets, int numTicketsAvailable, String eventDetails, double ticketPrice, double cancellation_fee) {
        PreparedStatement statement = null;

        try {
            DBConnection.establishConnection(); // Establish database connection

            if (numTicketsAvailable>numTotalTickets){
                return "Number of Total Tickets cannot be less than number of tickets available!";
            } else {
                // Check if any changes is made to the record
                String checkQuery1 = "SELECT COUNT(*) FROM event WHERE event_id = ? AND event_type = ? AND event_name = ? AND venue = ? AND datetime = ? AND total_tickets = ? AND num_tickets_avail = ? AND event_details = ? AND price = ? AND cancellation_fee = ?";
                statement = DBConnection.getConnection().prepareStatement(checkQuery1);
                statement.setInt(1, eventID);
                statement.setString(2, eventType);
                statement.setString(3, eventName);
                statement.setString(4, venue);
                statement.setObject(5, dateTime);
                statement.setInt(6, numTotalTickets);
                statement.setInt(7, numTicketsAvailable);
                statement.setString(8, eventDetails);
                statement.setDouble(9, ticketPrice);
                statement.setDouble(10, cancellation_fee);
    
                ResultSet resultSet1 = statement.executeQuery();
                resultSet1.next();
                int count1 = resultSet1.getInt(1);
                if (count1 > 0) {
                    return "No changes were made to event";
                } else {
                    // Check if the record already exists based on eventName and dateTime
                    String checkQuery2 = "SELECT COUNT(*) FROM event WHERE event_name = ? AND datetime = ? AND event_id != ?";
                    statement = DBConnection.getConnection().prepareStatement(checkQuery2);
                    statement.setString(1, eventName);
                    statement.setObject(2, dateTime);
                    statement.setObject(3, eventID);
        
                    ResultSet resultSet2 = statement.executeQuery();
                    resultSet2.next();
                    int count2 = resultSet2.getInt(1);
                    if (count2 > 0) {
                        return "Event already exists.";
                    }
                
                    String sqlQuery = "UPDATE event SET event_type=?,event_name=?, venue=?, datetime=?, total_tickets=?, num_tickets_avail=?, event_details=?, price=?, cancellation_fee=? WHERE event_id=?";
                    statement = DBConnection.getConnection().prepareStatement(sqlQuery);
        
                    // Set parameters for the SQL statement, position of ? above corresponds with index below
                    statement.setString(1, eventType);
                    statement.setString(2, eventName);
                    statement.setString(3, venue);
                    statement.setObject(4, dateTime);
                    statement.setInt(5, numTotalTickets);
                    statement.setInt(6, numTicketsAvailable);
                    statement.setString(7, eventDetails);
                    statement.setDouble(8, ticketPrice);
                    statement.setDouble(9, cancellation_fee);
                    statement.setInt(10, eventID); 
                
                    // Asks SQL to execute statement
                    statement.executeUpdate();
                    // Close the statement
                    statement.close();
                    return "Event updated successfully!";
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return "Failed to update event.";
        } finally {
            DBConnection.closeConnection(); // Close the database connection
        }
    }
    
    public static String deleteEvent(int eventID) {  //=================== Will need to call refund() before deleting===============
        PreparedStatement statement = null;
    
        try {
            DBConnection.establishConnection();

            //retrieve all ticketID from eventID
            ArrayList<Integer> allTicketIDsList = Ticket.getAllTicketIDsForEvent(eventID);
            int successCount = 0;

            for (int ticketID : allTicketIDsList) {
                Ticket oneTicket = Ticket.getTicketbyID(ticketID);
                int orderID = oneTicket.getOrderID();
                Order oneOrder = Order.getOrderByID(orderID);
                int userID = oneOrder.getUserID();
                
                //call processRefund(int ticketID, int userID)
                System.out.println(ticketID);
                String status = Refund.processRefund(ticketID, userID);
                System.out.println(status);

                if (status == "Success") {
                    successCount += 1;
                }
            }

            if (successCount == allTicketIDsList.size()) {
                String sqlQuery = "DELETE FROM event WHERE event_id=?";
                statement = DBConnection.getConnection().prepareStatement(sqlQuery);
        
                // Set parameter for the SQL statement
                statement.setInt(1, eventID);
        
                // Execute the SQL statement
                int rowsAffected = statement.executeUpdate();
        
                // Close the statement
                statement.close();
        
                if (rowsAffected > 0) {
                    return "Event deleted successfully.";
                } else {
                    return "No event found with the given ID.";
                }
            } else {
                return "Failed to delete event due to refund problem";
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return "Failed to delete event.";
        } finally {
            DBConnection.closeConnection(); // Close the database connection
        }
    }

    public static String addTicketingOfficer(String name, String password, String email) {
        PreparedStatement checkStatement = null;
        ResultSet checkResultSet = null;
        PreparedStatement insertStatement = null;

        try {
            // Check if the username already exists
            DBConnection.establishConnection();
            String checkQuery = "SELECT * FROM user WHERE name = ?";
            checkStatement = DBConnection.getConnection().prepareStatement(checkQuery);
            checkStatement.setString(1, name);  // sets to first parameter of addTicketingOfficer(), which is name
            checkResultSet = checkStatement.executeQuery();

            if (checkResultSet.next()) {
                // Username already exists
                return "Username already exists. Please choose a different one.";
            } else {
                // Check if the email is valid
                if (!isValidEmail(email)) {
                    return "Invalid email format. Please enter a valid email address.";
                }
                // Username is available, proceed with registration
                // Insert the new user into the database
                String insertQuery = "INSERT INTO user (name, password, email, amount_avail, role) VALUES (?, ?, ?, ?, ?)";
                insertStatement = DBConnection.getConnection().prepareStatement(insertQuery);
                insertStatement.setString(1, name);
                insertStatement.setString(2, password);
                insertStatement.setString(3, email);
                insertStatement.setInt(4, 100000); // setting amount_avail to 0
                insertStatement.setString(5, addTicketOfficerRole); // setting role to 'ticketing officer'
                insertStatement.executeUpdate();

                return "Ticketing officer added successfully!";
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "An error occurred while attempting to add ticketing officer.";
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

    public static String updateTicketingOfficer(int userID, String name, String password, String email) {
        PreparedStatement checkStatement = null;
        ResultSet checkResultSet = null;

        try {
            // Check if the username already exists
            DBConnection.establishConnection();
            String checkQuery = "SELECT COUNT(*) FROM user WHERE name = ? AND email = ? AND password = ? AND role = ? AND user_id = ?";
            checkStatement = DBConnection.getConnection().prepareStatement(checkQuery);
            checkStatement.setString(1, name);  // sets to first parameter of addTicketingOfficer(), which is name
            checkStatement.setString(2, email);  // sets to first parameter of addTicketingOfficer(), which is name
            checkStatement.setString(3, password);  // sets to first parameter of addTicketingOfficer(), which is name
            checkStatement.setString(4, "ticketing officer");  // sets to first parameter of addTicketingOfficer(), which is name
            checkStatement.setInt(5, userID);  // sets to first parameter of addTicketingOfficer(), which is name
            
            checkResultSet = checkStatement.executeQuery();
            checkResultSet.next();
            int count1 = checkResultSet.getInt(1);
            if (count1 > 0) {
                return "No changes were made to ticketing officer's account";
            } else {
                // Check if the record already exists based on user's name
                String checkQuery2 = "SELECT COUNT(*) FROM user WHERE name = ? AND user_id != ? AND role = ?";
                checkStatement = DBConnection.getConnection().prepareStatement(checkQuery2);
                checkStatement.setString(1, name);
                checkStatement.setInt(2, userID);
                checkStatement.setString(3, "ticketing officer");

                checkResultSet = checkStatement.executeQuery();
                checkResultSet.next();
                int count2 = checkResultSet.getInt(1);
                if (count2 > 0) {
                    return "Username already exists.";
                }else {
                    // Check if the email is valid
                    if (!isValidEmail(email)) {
                        return "Invalid email format. Please enter a valid email address.";
                    }
                    // Username is available, proceed with registration
                    // update user into the database
                    String sqlQuery = "UPDATE user SET name=?, email=?, password=? WHERE user_id=?";
                    checkStatement = DBConnection.getConnection().prepareStatement(sqlQuery);
                    checkStatement.setString(1, name);
                    checkStatement.setString(2, email);
                    checkStatement.setString(3, password);
                    checkStatement.setInt(4, userID);

                    checkStatement.executeUpdate();

                    return "Ticketing officer updated successfully!";
                }
            }
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "An error occurred while attempting to update ticketing officer.";
        } finally {
            try {
                if (checkResultSet != null) {
                    checkResultSet.close();
                }
                if (checkStatement != null) {
                    checkStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // public static String viewSaleStatistics() {
    //     try {
    //         ArrayList<Event> events = Event.getAllEvents();
    //         StringBuilder statistics = new StringBuilder();
    //         statistics.append("Event Name\tTickets Sold\tRevenue\n");

    //         for (Event event : events) {
    //             String eventName = event.getEventName();
    //             int ticketsSold = event.numTicketsSold();
    //             int revenue = event.revenueEarned();

    //             statistics.append(eventName).append("\t").append(ticketsSold).append("\t").append(revenue).append("\n");
    //         }

    //         return statistics.toString();
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //         return "Failed to fetch sale statistics.";
    //     }
    // }
    public static List<Map<String, String>> viewSaleStatistics() {
        List<Map<String, String>> salesStats = new ArrayList<>();
        try {
            ArrayList<Event> events = Event.getAllEvents();
            for (Event event : events) {
                Map<String, String> oneEvent = new HashMap<>();
                oneEvent.put("eventID", String.valueOf(event.getEventID()));
                oneEvent.put("eventName", event.getEventName());
                oneEvent.put("numTotalTickets", String.valueOf(event.getTotalTickets()));
                oneEvent.put("numTicketsSold", String.valueOf(event.numTicketsSold()));
                oneEvent.put("numTicketsSoldByTicketingOfficer", String.valueOf(event.getNumTicketsSoldByTicketOfficer()));
                oneEvent.put("revenueEarned", String.valueOf(event.revenueEarned()));
                oneEvent.put("dateTime",String.valueOf(event.getEventDateTime()));
                oneEvent.put("venue",event.getVenue());
                oneEvent.put("numAttendees",String.valueOf(event.sumTotalAttendees()));
        
                salesStats.add(oneEvent);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return salesStats;
    }

}

