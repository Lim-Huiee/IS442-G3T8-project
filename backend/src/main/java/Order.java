import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public class Order{
    private int userID;
    private int orderID;
    private int cancellationFee;   //for one tix
    private double totalPrice;
    private Map<Integer, Integer> eventsBooked; 

    // Map is "1:2" , 1 stands for event id, 2 stands for number of tix
    public Order(int userID, int orderID, Map<Integer, Integer> eventsBooked, double totalPrice, int cancellationFee ) {
        this.userID = userID;
        this.orderID = orderID;
        this.eventsBooked = eventsBooked;
        this.totalPrice=totalPrice;
        this.cancellationFee = cancellationFee;
    }

    public int getOrderID(){
        return orderID;
    }

    public static ArrayList<Order> getAllOrdersByUserID(int userID) {
        ArrayList<Order> orders = new ArrayList<>();
        ResultSet resultSet = null;
        PreparedStatement statement = null;

        try {
            DBConnection.establishConnection();
            String sqlQuery = "SELECT o.order_id, o.user_id, t.event_id, t.ticket_id, e.price, t.cancellation_fee " +
                              "FROM orders o " +
                              "JOIN ticket t ON o.order_id = t.order_id " +
                              "JOIN event e ON t.event_id = e.event_id " +
                              "WHERE o.user_id = ?";
            statement = DBConnection.getConnection().prepareStatement(sqlQuery);
            statement.setInt(1, userID);
            resultSet = statement.executeQuery();

            Map<Integer, Map<Integer, Integer>> eventsBookedMap = new HashMap<>(); // Map to store eventsBooked for each order
            Map<Integer, Double> totalPriceMap = new HashMap<>(); // Map to store totalPrice for each order

            while (resultSet.next()) {
                int orderID = resultSet.getInt("order_id");
                int eventID = resultSet.getInt("event_id");
                int ticketID = resultSet.getInt("ticket_id");
                double price = resultSet.getDouble("price");
                //double cancellationFee = resultSet.getDouble("cancellation_fee");

                // Populate eventsBookedMap
                if (!eventsBookedMap.containsKey(orderID)) {
                    eventsBookedMap.put(orderID, new HashMap<>());
                }
                Map<Integer, Integer> eventTicketsMap = eventsBookedMap.get(orderID);
                eventTicketsMap.put(eventID, eventTicketsMap.getOrDefault(eventID, 0) + 1);

                // Calculate totalPrice and update totalPriceMap
                totalPriceMap.put(orderID, totalPriceMap.getOrDefault(orderID, 0.0) + price);

                totalPriceMap.put(orderID, totalPriceMap.get(orderID) );
            }

            // Construct Order objects from the retrieved data
            for (Map.Entry<Integer, Map<Integer, Integer>> entry : eventsBookedMap.entrySet()) {
                int orderID = entry.getKey();
                Map<Integer, Integer> eventsBooked = entry.getValue();
                double totalPrice = totalPriceMap.get(orderID);
                int cancellationFee = totalPriceMap.get(orderID).intValue(); // Convert cancellationFee to int
                orders.add(new Order(userID, orderID, eventsBooked, totalPrice, cancellationFee));
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

        return orders;
    }

    
    public static int createOrder(int userID){       
        PreparedStatement insertStatement = null;
        ResultSet generatedKeys = null;
        try {
            // Check if the email already exists
            DBConnection.establishConnection();
            
            String insertQuery = "INSERT INTO orders (user_id, status) VALUES (?, ?)";
            insertStatement = DBConnection.getConnection().prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
            insertStatement.setInt(1, userID);
            insertStatement.setString(2, "delivered");
            insertStatement.executeUpdate();
            
            // Retrieve the generated key (order ID)
            generatedKeys = insertStatement.getGeneratedKeys();
            if (generatedKeys.next()) {
                int orderId = generatedKeys.getInt(1);
                return orderId; // Return the order ID as a string
            } else {
                // Handle if no generated key is found
                return -1;
            }
            
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            // Handle exception, maybe return an error message
            return -1;
            
        } finally {
            try {
                // Close result set, statement, and database connection
                if (generatedKeys != null) {
                    generatedKeys.close();
                }
                if (insertStatement != null) {
                    insertStatement.close();
                }
                DBConnection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
                // Handle exception, maybe log it
            }
        }
    }

    
    public static String checkOutOrder(Map<Integer, Integer[]> eventsBooked, int orderID) {
        PreparedStatement insertStatement = null;
        try {
            // Check if the email already exists
            DBConnection.establishConnection();
    
            String insertQueryTicket = "INSERT INTO ticket (event_id, order_id, cancellation_fee) VALUES (?, ?, ?)";
            String insertQueryGuest = "INSERT INTO user_accompanying_guest (user_id, event_id, num_accompanying_guest) VALUES (?, ?, ?)";
            
            insertStatement = DBConnection.getConnection().prepareStatement(insertQueryTicket);
    
            for (Map.Entry<Integer, Integer[]> entry : eventsBooked.entrySet()) {
                int eventId = entry.getKey();
                Integer[] eventData = entry.getValue();
                int numTickets = eventData[0]; // Assuming the first element represents the number of tickets
                int numGuests = eventData[1]; // Assuming the second element represents the number of accompanying guests
    
                for (int i = 0; i < numTickets; i++) {
                    insertStatement.setInt(1, eventId);
                    insertStatement.setInt(2, orderID);
                    insertStatement.setInt(3, 10); // Assuming cancellation fee is always 10           will need to change
    
                    insertStatement.executeUpdate();
                }
    
                // Insert new record into user_accompanying_guest table
                PreparedStatement insertGuestStatement = DBConnection.getConnection().prepareStatement(insertQueryGuest);
                insertGuestStatement.setInt(1, orderID);
                insertGuestStatement.setInt(2, eventId);
                insertGuestStatement.setInt(3, numGuests);
                insertGuestStatement.executeUpdate();
                insertGuestStatement.close();
            }
    
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
    
        } finally {
            try {
                if (insertStatement != null) {
                    insertStatement.close();
                }
                DBConnection.closeConnection();
                return "";
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return "success";
    }

    public static String updateCancellationFee(int updatedCancellationFee){   //shud be set cancellationfee???
        PreparedStatement insertStatement = null;
        try {
            DBConnection.establishConnection();
            
            String insertQuery = "Update ticket SET cancellation_fee= ?";
            insertStatement = DBConnection.getConnection().prepareStatement(insertQuery);
            insertStatement.setInt(1, updatedCancellationFee);
            
            insertStatement.executeUpdate();
            
        } catch (SQLException | ClassNotFoundException se) {
            se.printStackTrace();
            return "Error occurred while updating cancellation fee: " + se.getMessage();
            
        } finally {
            try {
                if (insertStatement != null) {
                    insertStatement.close();
                }
                DBConnection.closeConnection();
                return "";
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return "success";
    }


    public int getCancellationFee(){
        return cancellationFee;
    }

    /* private void setCancellationFee(int newCancellationFee){
        this.cancellationFee = newCancellationFee;
    } */

    public double getTotalPrice(){
        return totalPrice;
    }
}